'use client';

import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'ideas' | 'todo' | 'in-progress' | 'done';
  tags?: string[];
  created_at: string;
  updated_at: string;
}

const columns: { key: Task['status']; label: string; color: string }[] = [
  { key: 'ideas', label: 'Ideas', color: 'border-t-purple-500' },
  { key: 'todo', label: 'To Do', color: 'border-t-[#999999]' },
  { key: 'in-progress', label: 'In Progress', color: 'border-t-[#3d5a80]' },
  { key: 'done', label: 'Done', color: 'border-t-green-500' },
];

const AVAILABLE_TAGS = [
  'market news',
  'mindset',
  'ethics',
  'trading psychology',
  'conscious capitalism',
  'sensible approach',
];

const tagColors: Record<string, string> = {
  'market news': 'bg-blue-100 text-blue-700',
  'mindset': 'bg-purple-100 text-purple-700',
  'ethics': 'bg-emerald-100 text-emerald-700',
  'trading psychology': 'bg-orange-100 text-orange-700',
  'conscious capitalism': 'bg-rose-100 text-rose-700',
  'sensible approach': 'bg-teal-100 text-teal-700',
};

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [addingTo, setAddingTo] = useState<Task['status'] | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTags, setNewTags] = useState<string[]>([]);

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map((t) =>
      t.id === taskId
        ? { ...t, status: newStatus, updated_at: new Date().toISOString() }
        : t
    ));
  };

  const addTask = (status: Task['status']) => {
    if (!newTitle.trim()) return;
    const now = new Date().toISOString();
    const task: Task = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc,
      status,
      tags: newTags.length > 0 ? newTags : undefined,
      created_at: now,
      updated_at: now,
    };
    setTasks([...tasks, task]);
    setNewTitle('');
    setNewDesc('');
    setNewTags([]);
    setAddingTo(null);
  };

  const updateTask = () => {
    if (!editingTask) return;
    setTasks(tasks.map((t) =>
      t.id === editingTask.id
        ? { ...editingTask, updated_at: new Date().toISOString() }
        : t
    ));
    setEditingTask(null);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    setEditingTask(null);
  };

  const toggleNewTag = (tag: string) => {
    setNewTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleEditTag = (tag: string) => {
    if (!editingTask) return;
    const current = editingTask.tags || [];
    const updated = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    setEditingTask({ ...editingTask, tags: updated });
  };

  const getNextStatus = (status: Task['status']): Task['status'] | null => {
    const order: Task['status'][] = ['ideas', 'todo', 'in-progress', 'done'];
    const idx = order.indexOf(status);
    return idx < order.length - 1 ? order[idx + 1] : null;
  };

  const getPrevStatus = (status: Task['status']): Task['status'] | null => {
    const order: Task['status'][] = ['ideas', 'todo', 'in-progress', 'done'];
    const idx = order.indexOf(status);
    return idx > 0 ? order[idx - 1] : null;
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className={`bg-[#f8f9fb] rounded-xl border-t-4 ${col.color}`}>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[#111111] text-sm">{col.label}</h3>
                  <span className="bg-gray-200 text-[#666666] text-xs px-2 py-0.5 rounded-full font-medium">
                    {colTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setAddingTo(col.key);
                    setNewTitle('');
                    setNewDesc('');
                    setNewTags([]);
                  }}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-[#666666] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" x2="12" y1="5" y2="19" />
                    <line x1="5" x2="19" y1="12" y2="12" />
                  </svg>
                </button>
              </div>

              <div className="px-3 pb-4 space-y-3">
                {/* Add new card form */}
                {addingTo === col.key && (
                  <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full text-sm font-medium text-[#111111] border-none outline-none placeholder:text-[#999999] mb-2"
                      placeholder="Title"
                      autoFocus
                    />
                    <textarea
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full text-sm text-[#666666] border-none outline-none placeholder:text-[#999999] resize-none"
                      placeholder="Description (optional)"
                      rows={2}
                    />
                    {/* Tags for Ideas column */}
                    {col.key === 'ideas' && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {AVAILABLE_TAGS.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleNewTag(tag)}
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                              newTags.includes(tag)
                                ? tagColors[tag]
                                : 'bg-gray-100 text-[#666666] hover:bg-gray-200'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => addTask(col.key)}
                        className="px-3 py-1.5 bg-[#1a2744] text-white text-xs font-medium rounded-lg hover:bg-[#243356] transition-colors"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setAddingTo(null)}
                        className="px-3 py-1.5 text-[#666666] text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Task cards */}
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setEditingTask({ ...task })}
                  >
                    <h4 className="text-sm font-medium text-[#111111] mb-1">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-[#666666] line-clamp-2 mb-2">{task.description}</p>
                    )}
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${tagColors[tag] || 'bg-gray-100 text-gray-600'}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#999999]">
                        {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex gap-1">
                        {getPrevStatus(task.status) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveTask(task.id, getPrevStatus(task.status)!);
                            }}
                            className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-[#666666] hover:bg-gray-200 transition-colors"
                          >
                            ←
                          </button>
                        )}
                        {getNextStatus(task.status) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveTask(task.id, getNextStatus(task.status)!);
                            }}
                            className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-[#666666] hover:bg-gray-200 transition-colors"
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Empty state per column */}
                {colTasks.length === 0 && addingTo !== col.key && (
                  <div className="py-6 text-center">
                    <p className="text-xs text-[#999999]">No items</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit task modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={() => setEditingTask(null)}>
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[#111111] mb-4">Edit Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-1">Title</label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-1">Description</label>
                <textarea
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-1">Status</label>
                <select
                  value={editingTask.status}
                  onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as Task['status'] })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-transparent bg-white"
                >
                  <option value="ideas">Ideas</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-1">Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleEditTag(tag)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                        (editingTask.tags || []).includes(tag)
                          ? tagColors[tag]
                          : 'bg-gray-100 text-[#666666] hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => deleteTask(editingTask.id)}
                  className="py-2 px-4 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => setEditingTask(null)}
                  className="py-2 px-4 border border-gray-200 rounded-lg text-sm font-medium text-[#666666] hover:bg-[#f8f9fb] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateTask}
                  className="py-2 px-4 bg-[#1a2744] text-white rounded-lg text-sm font-medium hover:bg-[#243356] transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
