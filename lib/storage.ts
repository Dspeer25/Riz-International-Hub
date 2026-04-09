import { supabase } from './supabase';

// localStorage helper
function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(`riz-${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function lsSet(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(`riz-${key}`, JSON.stringify(value)); } catch {}
}

// ---- CALENDAR EVENTS ----

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  status: 'planned' | 'in-progress' | 'posted';
  notes: string;
  instagram_post_id?: string;
  created_at?: string;
}

export async function loadCalendarEvents(): Promise<CalendarEvent[]> {
  if (supabase) {
    const { data } = await supabase.from('calendar_events').select('*').order('date');
    if (data) return data;
  }
  return lsGet<CalendarEvent[]>('calendar_events', []);
}

export async function saveCalendarEvent(event: CalendarEvent): Promise<CalendarEvent> {
  if (supabase) {
    const { data } = await supabase.from('calendar_events').upsert(event).select().single();
    if (data) return data;
  }
  const events = lsGet<CalendarEvent[]>('calendar_events', []);
  const idx = events.findIndex(e => e.id === event.id);
  if (idx >= 0) events[idx] = event; else events.push(event);
  lsSet('calendar_events', events);
  return event;
}

export async function deleteCalendarEvent(id: string) {
  if (supabase) {
    await supabase.from('calendar_events').delete().eq('id', id);
  }
  const events = lsGet<CalendarEvent[]>('calendar_events', []);
  lsSet('calendar_events', events.filter(e => e.id !== id));
}

// ---- TASKS (Kanban) ----

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'ideas' | 'todo' | 'in-progress' | 'done';
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export async function loadTasks(): Promise<Task[]> {
  if (supabase) {
    const { data } = await supabase.from('tasks').select('*').order('created_at');
    if (data) return data;
  }
  return lsGet<Task[]>('tasks', []);
}

export async function saveTask(task: Task): Promise<Task> {
  if (supabase) {
    const { data } = await supabase.from('tasks').upsert(task).select().single();
    if (data) return data;
  }
  const tasks = lsGet<Task[]>('tasks', []);
  const idx = tasks.findIndex(t => t.id === task.id);
  if (idx >= 0) tasks[idx] = task; else tasks.push(task);
  lsSet('tasks', tasks);
  return task;
}

export async function deleteTask(id: string) {
  if (supabase) {
    await supabase.from('tasks').delete().eq('id', id);
  }
  const tasks = lsGet<Task[]>('tasks', []);
  lsSet('tasks', tasks.filter(t => t.id !== id));
}

// ---- REPOSITORY ----

export interface RepoFolder {
  id: string;
  name: string;
  month: number;
  year: number;
  created_at?: string;
}

export interface RepoFile {
  id: string;
  folder_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at?: string;
}

export async function loadRepoFolders(): Promise<RepoFolder[]> {
  if (supabase) {
    const { data } = await supabase.from('repository_folders').select('*').order('created_at');
    if (data) return data;
  }
  return lsGet<RepoFolder[]>('repo_folders', []);
}

export async function saveRepoFolder(folder: RepoFolder): Promise<RepoFolder> {
  if (supabase) {
    const { data } = await supabase.from('repository_folders').upsert(folder).select().single();
    if (data) return data;
  }
  const folders = lsGet<RepoFolder[]>('repo_folders', []);
  const idx = folders.findIndex(f => f.id === folder.id);
  if (idx >= 0) folders[idx] = folder; else folders.push(folder);
  lsSet('repo_folders', folders);
  return folder;
}

export async function deleteRepoFolder(id: string) {
  if (supabase) {
    await supabase.from('repository_folders').delete().eq('id', id);
    // Files cascade-delete in Supabase. Also clean up storage.
    const { data: files } = await supabase.from('repository_files').select('file_path').eq('folder_id', id);
    if (files && files.length > 0) {
      await supabase.storage.from('riz-files').remove(files.map(f => f.file_path));
    }
  }
  const folders = lsGet<RepoFolder[]>('repo_folders', []);
  lsSet('repo_folders', folders.filter(f => f.id !== id));
  const allFiles = lsGet<(RepoFile & { dataUrl?: string })[]>('repo_files', []);
  lsSet('repo_files', allFiles.filter(f => f.folder_id !== id));
}

export async function loadRepoFiles(folderId: string): Promise<(RepoFile & { url?: string; dataUrl?: string })[]> {
  if (supabase) {
    const { data } = await supabase.from('repository_files').select('*').eq('folder_id', folderId).order('created_at');
    if (data) {
      return data.map(f => {
        const { data: urlData } = supabase!.storage.from('riz-files').getPublicUrl(f.file_path);
        return { ...f, url: urlData.publicUrl };
      });
    }
  }
  const allFiles = lsGet<(RepoFile & { dataUrl?: string })[]>('repo_files', []);
  return allFiles.filter(f => f.folder_id === folderId);
}

export async function loadAllRepoFiles(): Promise<(RepoFile & { url?: string; dataUrl?: string })[]> {
  if (supabase) {
    const { data } = await supabase.from('repository_files').select('*').order('created_at');
    if (data) {
      return data.map(f => {
        const { data: urlData } = supabase!.storage.from('riz-files').getPublicUrl(f.file_path);
        return { ...f, url: urlData.publicUrl };
      });
    }
  }
  return lsGet<(RepoFile & { dataUrl?: string })[]>('repo_files', []);
}

export async function uploadRepoFile(
  folderId: string,
  file: File
): Promise<RepoFile & { url?: string; dataUrl?: string }> {
  const fileId = crypto.randomUUID();
  const filePath = `${folderId}/${fileId}-${file.name}`;

  if (supabase) {
    await supabase.storage.from('riz-files').upload(filePath, file);
    const record: RepoFile = {
      id: fileId,
      folder_id: folderId,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      file_type: file.type,
    };
    const { data } = await supabase.from('repository_files').insert(record).select().single();
    const { data: urlData } = supabase.storage.from('riz-files').getPublicUrl(filePath);
    return { ...(data || record), url: urlData.publicUrl };
  }

  // localStorage fallback: store as base64
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const record: RepoFile & { dataUrl: string } = {
        id: fileId,
        folder_id: folderId,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        dataUrl: e.target?.result as string,
      };
      const allFiles = lsGet<(RepoFile & { dataUrl?: string })[]>('repo_files', []);
      allFiles.push(record);
      lsSet('repo_files', allFiles);
      resolve(record);
    };
    reader.readAsDataURL(file);
  });
}

export async function deleteRepoFile(fileId: string, filePath: string) {
  if (supabase) {
    await supabase.storage.from('riz-files').remove([filePath]);
    await supabase.from('repository_files').delete().eq('id', fileId);
  }
  const allFiles = lsGet<(RepoFile & { dataUrl?: string })[]>('repo_files', []);
  lsSet('repo_files', allFiles.filter(f => f.id !== fileId));
}

// ---- SUBCATEGORIES ----

export interface Subcategory {
  id: string;
  category: 'experimental' | 'testing';
  name: string;
  created_at?: string;
}

export async function loadSubcategories(): Promise<Subcategory[]> {
  if (supabase) {
    const { data } = await supabase.from('subcategories').select('*').order('created_at');
    if (data) return data;
  }
  return lsGet<Subcategory[]>('subcategories', []);
}

export async function saveSubcategory(sub: Subcategory): Promise<Subcategory> {
  if (supabase) {
    const { data } = await supabase.from('subcategories').upsert(sub).select().single();
    if (data) return data;
  }
  const subs = lsGet<Subcategory[]>('subcategories', []);
  subs.push(sub);
  lsSet('subcategories', subs);
  return sub;
}
