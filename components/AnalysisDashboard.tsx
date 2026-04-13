'use client';

import { useState, useRef, useEffect } from 'react';
import {
  loadSubcategories, saveSubcategory,
  loadRepoFolders, loadAllRepoFiles,
  loadCalendarEvents,
  type Subcategory, type RepoFolder, type RepoFile, type CalendarEvent,
} from '@/lib/storage';

type Category = 'current' | 'experimental' | 'testing';
type TimeRange = '1d' | '7d' | '14d' | '30d' | '90d' | 'YTD';
type SortKey = 'timestamp' | 'reachRate' | 'engagementRate' | 'saves' | 'shares' | 'totalEngagement';

const timeRangeOptions: TimeRange[] = ['1d', '7d', '14d', '30d', '90d', 'YTD'];

const categoryColors: Record<Category, { border: string; pill: string }> = {
  current: { border: 'border-t-[#1a2744]', pill: 'bg-[#1a2744] text-white' },
  experimental: { border: 'border-t-[#f59e0b]', pill: 'bg-[#f59e0b] text-white' },
  testing: { border: 'border-t-[#14b8a6]', pill: 'bg-[#14b8a6] text-white' },
};

const categoryLabels: Record<Category, string> = {
  current: 'Current',
  experimental: 'Experimental',
  testing: 'Testing',
};

function SubcategoryCombobox({
  subcategories,
  selected,
  onSelect,
  onCreate,
}: {
  subcategories: string[];
  selected: string | null;
  onSelect: (val: string | null) => void;
  onCreate: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = subcategories.filter(s => s.toLowerCase().includes(input.toLowerCase()));
  const showCreate = input.trim() && !subcategories.some(s => s.toLowerCase() === input.trim().toLowerCase());

  return (
    <div ref={ref} className="relative mt-2">
      <label className="text-[10px] text-[#999999] uppercase tracking-wider font-medium">Subcategory</label>
      <div
        className="mt-1 flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1.5 cursor-pointer bg-white"
        onClick={() => setOpen(!open)}
      >
        <input
          type="text"
          value={open ? input : (selected || '')}
          onChange={(e) => { setInput(e.target.value); if (!open) setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="All posts"
          className="flex-1 text-xs text-[#111111] outline-none bg-transparent placeholder:text-[#999999] min-w-0"
        />
        {selected && (
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(null); setInput(''); }}
            className="text-[#999999] hover:text-[#666666] text-xs"
          >
            ×
          </button>
        )}
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
          <button
            className={`w-full text-left px-3 py-2 text-xs hover:bg-[#f8f9fb] transition-colors ${!selected ? 'font-medium text-[#111111]' : 'text-[#666666]'}`}
            onClick={() => { onSelect(null); setInput(''); setOpen(false); }}
          >
            All posts
          </button>
          {filtered.map((sub) => (
            <button
              key={sub}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-[#f8f9fb] transition-colors ${selected === sub ? 'font-medium text-[#111111]' : 'text-[#666666]'}`}
              onClick={() => { onSelect(sub); setInput(''); setOpen(false); }}
            >
              {sub}
            </button>
          ))}
          {showCreate && (
            <button
              className="w-full text-left px-3 py-2 text-xs text-[#3d5a80] hover:bg-[#f8f9fb] transition-colors font-medium"
              onClick={() => { onCreate(input.trim()); onSelect(input.trim()); setInput(''); setOpen(false); }}
            >
              + Create &quot;{input.trim()}&quot;
            </button>
          )}
          {!showCreate && filtered.length === 0 && (
            <div className="px-3 py-2 text-xs text-[#999999]">No subcategories yet</div>
          )}
        </div>
      )}
    </div>
  );
}

type PerfTab = 'table' | 'posts';

type FileWithPreview = RepoFile & { url?: string; dataUrl?: string };

export default function AnalysisDashboard() {
  const [followerRange, setFollowerRange] = useState<TimeRange>('30d');
  const [experimentalSubs, setExperimentalSubs] = useState<string[]>([]);
  const [testingSubs, setTestingSubs] = useState<string[]>([]);
  const [selectedExpSub, setSelectedExpSub] = useState<string | null>(null);
  const [selectedTestSub, setSelectedTestSub] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('timestamp');
  const [sortAsc, setSortAsc] = useState(false);
  const [perfTab, setPerfTab] = useState<PerfTab>('table');
  const [folders, setFolders] = useState<RepoFolder[]>([]);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<RepoFolder | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    loadSubcategories().then((subs: Subcategory[]) => {
      setExperimentalSubs(subs.filter(s => s.category === 'experimental').map(s => s.name));
      setTestingSubs(subs.filter(s => s.category === 'testing').map(s => s.name));
    });
    loadRepoFolders().then(setFolders);
    loadAllRepoFiles().then(setFiles);
    loadCalendarEvents().then(setEvents);
  }, []);

  // Build posts from repository folders — each folder is a post
  const posts = folders.map(folder => {
    const folderFiles = files
      .filter(f => f.folder_id === folder.id)
      .sort((a, b) => (a.created_at || '').localeCompare(b.created_at || ''));
    const imageFiles = folderFiles.filter(f => f.file_type && f.file_type.startsWith('image/'));
    return {
      folder,
      thumbnail: imageFiles[0],
      images: imageFiles,
      fileCount: folderFiles.length,
    };
  }).sort((a, b) => (b.folder.created_at || '').localeCompare(a.folder.created_at || ''));

  // Build week view for calendar mini-view
  const today = new Date();
  const weekDays: { date: Date; label: string; day: string; events: CalendarEvent[] }[] = [];
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    weekDays.push({
      date: d,
      label: dayLabels[i],
      day: String(d.getDate()),
      events: events.filter(e => e.date === dateStr),
    });
  }

  const createExpSub = async (name: string) => {
    setExperimentalSubs([...experimentalSubs, name]);
    await saveSubcategory({ id: crypto.randomUUID(), category: 'experimental', name });
  };

  const createTestSub = async (name: string) => {
    setTestingSubs([...testingSubs, name]);
    await saveSubcategory({ id: crypto.randomUUID(), category: 'testing', name });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const SortHeader = ({ label, sortKeyName, className }: { label: string; sortKeyName: SortKey; className?: string }) => (
    <th
      className={`text-left text-xs font-semibold text-[#666666] uppercase tracking-wider py-3 px-3 cursor-pointer hover:text-[#111111] select-none ${className || ''}`}
      onClick={() => handleSort(sortKeyName)}
    >
      {label}
      <span className="ml-1">{sortKey === sortKeyName ? (sortAsc ? '↑' : '↓') : ''}</span>
    </th>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111111]">Analysis</h1>
        <p className="text-sm text-[#666666] mt-1">Post performance metrics for @rizinternational</p>
      </div>

      {/* Health Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#666666] uppercase tracking-wider font-medium">
              Follower Trend ({followerRange})
            </p>
          </div>
          <div className="flex gap-1 mt-2 flex-wrap">
            {timeRangeOptions.map((range) => (
              <button
                key={range}
                onClick={() => setFollowerRange(range)}
                className={`text-[10px] px-1.5 py-0.5 rounded font-medium transition-colors ${
                  followerRange === range
                    ? 'bg-[#1a2744] text-white'
                    : 'bg-[#f8f9fb] text-[#666666] hover:bg-gray-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <p className="text-2xl font-bold text-[#999999] mt-2">—</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-[#666666] uppercase tracking-wider font-medium">Avg Reach Rate</p>
          <p className="text-2xl font-bold text-[#999999] mt-2">—</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-[#666666] uppercase tracking-wider font-medium">Avg Engagement Rate</p>
          <p className="text-2xl font-bold text-[#999999] mt-2">—</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-[#666666] uppercase tracking-wider font-medium">Avg Saves + Shares / Post</p>
          <p className="text-2xl font-bold text-[#999999] mt-2">—</p>
        </div>
      </div>

      {/* Category Performance Cards */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#111111] mb-4">Performance by Content Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current */}
          <div className={`bg-white rounded-xl border border-gray-100 border-t-4 ${categoryColors.current.border} p-5`}>
            <h3 className="text-lg font-bold text-[#111111] mb-4">Current</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-sm text-[#666666]">Posts</span><span className="text-sm font-semibold text-[#999999]">—</span></div>
              <div className="flex justify-between"><span className="text-sm text-[#666666]">Avg Reach Rate</span><span className="text-sm font-semibold text-[#999999]">—</span></div>
              <div className="flex justify-between"><span className="text-sm text-[#666666]">Avg Engagement Rate</span><span className="text-sm font-semibold text-[#999999]">—</span></div>
              <div className="flex justify-between"><span className="text-sm text-[#666666]">Avg Saves + Shares</span><span className="text-sm font-semibold text-[#999999]">—</span></div>
              <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs text-[#999999]">2-week trend</span>
                <span className="text-xs text-[#999999]">—</span>
              </div>
            </div>
          </div>

          {/* Experimental */}
          <div className={`bg-white rounded-xl border border-gray-100 border-t-4 ${categoryColors.experimental.border} p-5`}>
            <h3 className="text-lg font-bold text-[#111111]">Experimental</h3>
            <SubcategoryCombobox
              subcategories={experimentalSubs}
              selected={selectedExpSub}
              onSelect={setSelectedExpSub}
              onCreate={createExpSub}
            />
            <div className="space-y-3 mt-4">
              <div className="flex justify-between"><span className="text-sm text-[#666666]">Posts</span><span className="text-sm font-semibold text-[#999999]">—</span></div>
              <div className="flex justify-between"><span className="text-sm text-[#666666]">Avg Reach Rate</span><span className="text-sm font-semibold text-[#999999]">—</span></div>
              <div className="flex justify-between"><span className="text-sm text-[#666666]">Avg Engagement Rate</span><span className="text-sm font-semibold text-[#999999]">—</span></div>
              <div className="flex justify-between"><span className="text-sm text-[#666666]">Avg Saves + Shares</span><span className="text-sm font-semibold text-[#999999]">—</span></div>
              <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs text-[#999999]">2-week trend</span>
                <span className="text-xs text-[#999999]">—</span>
              </div>
            </div>
          </div>

          {/* Testing */}
          <div className={`bg-white rounded-xl border border-gray-100 border-t-4 ${categoryColors.testing.border} p-5`}>
            <h3 className="text-lg font-bold text-[#111111]">Testing</h3>
            <SubcategoryCombobox
              subcategories={testingSubs}
              selected={selectedTestSub}
              onSelect={setSelectedTestSub}
              onCreate={createTestSub}
            />
            <div className="space-y-3 mt-4">
              <div className="flex justify-between"><span className="text-sm text-[#666666]">Posts</span><span className="text-sm font-semibold text-[#999999]">—</span></div>
              <div className="flex justify-between"><span className="text-sm text-[#666666]">Avg Reach Rate</span><span className="text-sm font-semibold text-[#999999]">—</span></div>
              <div className="flex justify-between"><span className="text-sm text-[#666666]">Avg Engagement Rate</span><span className="text-sm font-semibold text-[#999999]">—</span></div>
              <div className="flex justify-between"><span className="text-sm text-[#666666]">Avg Saves + Shares</span><span className="text-sm font-semibold text-[#999999]">—</span></div>
              <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs text-[#999999]">2-week trend</span>
                <span className="text-xs text-[#999999]">—</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Performance - Tabbed */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#111111]">Post Performance</h2>
        <div className="flex gap-1 bg-[#f8f9fb] p-1 rounded-lg">
          <button
            onClick={() => setPerfTab('table')}
            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
              perfTab === 'table' ? 'bg-white text-[#111111] shadow-sm' : 'text-[#666666] hover:text-[#111111]'
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setPerfTab('posts')}
            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
              perfTab === 'posts' ? 'bg-white text-[#111111] shadow-sm' : 'text-[#666666] hover:text-[#111111]'
            }`}
          >
            Posts
          </button>
        </div>
      </div>

      {/* Table Tab */}
      {perfTab === 'table' && (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f8f9fb] border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-[#666666] uppercase tracking-wider py-3 px-3" style={{ width: 44 }}></th>
                  <th className="text-left text-xs font-semibold text-[#666666] uppercase tracking-wider py-3 px-3" style={{ minWidth: 180 }}>Caption</th>
                  <SortHeader label="Date" sortKeyName="timestamp" />
                  <th className="text-left text-xs font-semibold text-[#666666] uppercase tracking-wider py-3 px-3">Category</th>
                  <SortHeader label="Reach %" sortKeyName="reachRate" />
                  <SortHeader label="Eng %" sortKeyName="engagementRate" />
                  <SortHeader label="Saves" sortKeyName="saves" />
                  <SortHeader label="Shares" sortKeyName="shares" />
                  <SortHeader label="Total Eng" sortKeyName="totalEngagement" />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <div className="text-[#999999]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2">
                        <path d="M3 3v18h18" />
                        <path d="m19 9-5 5-4-4-3 3" />
                      </svg>
                      <p className="text-sm font-medium text-[#666666]">No data yet</p>
                      <p className="text-xs text-[#999999] mt-1">Connect Instagram on the Media tab to start tracking post performance.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Posts Tab */}
      {perfTab === 'posts' && (
        <div className="mb-8">
          {posts.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
              <div className="text-[#999999] mb-3 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#666666]">No posts uploaded yet.</p>
              <p className="text-xs text-[#999999] mt-1">Upload post images in the Repository tab to see them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {posts.map((post) => (
                <button
                  key={post.folder.id}
                  onClick={() => setSelectedFolder(post.folder)}
                  className="bg-[#f8f9fb] rounded-xl overflow-hidden text-left hover:shadow-md transition-shadow border border-gray-100 group"
                >
                  <div className="relative aspect-square bg-gray-200 flex items-center justify-center overflow-hidden">
                    {post.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.thumbnail.url || post.thumbnail.dataUrl || ''}
                        alt={post.folder.name}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                      />
                    ) : (
                      <div className="text-[#999999]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                      </div>
                    )}
                    {post.images.length > 1 && (
                      <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                        {post.images.length} imgs
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-[#111111] line-clamp-2 leading-snug">
                      {post.folder.name}
                    </p>
                    <p className="text-xs text-[#999999] mt-1.5">
                      {post.folder.created_at ? new Date(post.folder.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </p>
                    <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100 text-[10px] text-[#999999]">
                      <span>Reach —</span>
                      <span>Eng —</span>
                      <span>Saves —</span>
                      <span>Shares —</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content Calendar Mini-View */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#111111] mb-4">Content Calendar (This Week)</h2>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((wd, i) => {
            const isToday = wd.date.toDateString() === today.toDateString();
            const hasPosted = wd.events.some(e => e.status === 'posted');
            const hasPlanned = wd.events.some(e => e.status === 'planned' || e.status === 'in-progress');
            return (
              <div key={i} className="flex flex-col items-center">
                <p className="text-[10px] text-[#999999] uppercase tracking-wider font-medium">{wd.label}</p>
                <div className={`mt-1.5 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  isToday ? 'bg-[#1a2744] text-white' : 'text-[#666666]'
                }`}>
                  {wd.day}
                </div>
                <div className="flex gap-1 mt-2 h-1.5">
                  {hasPosted && <span className="w-1.5 h-1.5 rounded-full bg-[#1a2744]" title="Posted" />}
                  {hasPlanned && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" title="Planned" />}
                  {!hasPosted && !hasPlanned && <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />}
                </div>
                <p className="text-[10px] text-[#999999] mt-1">
                  {wd.events.length > 0 ? `${wd.events.length} post${wd.events.length !== 1 ? 's' : ''}` : '—'}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-4 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-[10px] text-[#666666]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a2744]" /> Posted
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#666666]">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" /> Planned / In Progress
          </div>
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedFolder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={() => setSelectedFolder(null)}>
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#111111]">{selectedFolder.name}</h3>
              <button
                onClick={() => setSelectedFolder(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#666666] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" x2="6" y1="6" y2="18" />
                  <line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {files.filter(f => f.folder_id === selectedFolder.id && f.file_type && f.file_type.startsWith('image/')).map((img) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={img.id}
                    src={img.url || img.dataUrl || ''}
                    alt={img.file_name}
                    className="w-full aspect-square object-cover rounded-lg border border-gray-100"
                  />
                ))}
              </div>
              <div className="grid grid-cols-4 gap-3 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider font-medium">Reach</p>
                  <p className="text-lg font-bold text-[#999999] mt-1">—</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider font-medium">Engagement</p>
                  <p className="text-lg font-bold text-[#999999] mt-1">—</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider font-medium">Saves</p>
                  <p className="text-lg font-bold text-[#999999] mt-1">—</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider font-medium">Shares</p>
                  <p className="text-lg font-bold text-[#999999] mt-1">—</p>
                </div>
              </div>
              <p className="text-xs text-[#999999] mt-4">
                Uploaded {selectedFolder.created_at ? new Date(selectedFolder.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
