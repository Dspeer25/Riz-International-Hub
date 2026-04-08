'use client';

import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  created_at: string;
  updated_at: string;
}

const columns: { key: Task['status']; label: string; color: string }[] = [
  { key: 'todo', label: 'To Do', color: 'border-t-[#999999]' },
  { key: 'in-progress', label: 'In Progress', color: 'border-t-[#3d5a80]' },
  { key: 'done', label: 'Done', color: 'border-t-green-500' },
];

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Write copy for EUR/USD breakdown',
    description: 'Full technical analysis with key levels, entry zones and targets for this week\'s setup.',
    status: 'todo',
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-04-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Design conscious capitalism carousel',
    description: 'Create 8-slide carousel covering the 5 principles. Keep brand colors consistent.',
    status: 'todo',
    created_at: '2026-04-02T09:00:00Z',
    updated_at: '2026-04-02T09:00:00Z',
  },
  {
    id: '3',
    title: 'Film 3 beginner mistakes reel',
    description: 'Script ready, need to film and edit. Keep under 60 seconds. Add captions.',
    status: 'in-progress',
    created_at: '2026-04-01T08:00:00Z',
    updated_at: '2026-04-04T14:00:00Z',
  },
  {
    id: '4',
    title: 'Create Q&A promo graphic',
    description: 'Design promo image for Friday live Q&A. Include date, time, and topic hints.',
    status: 'in-progress',
    created_at: '2026-04-03T11:00:00Z',
    updated_at: '2026-04-05T09:00:00Z',
  },
  {
    id: '5',
    title: 'Risk management carousel',
    description: 'Posted — 12 slides covering position sizing, stop losses, and R:R ratios.',
    status: 'done',
    created_at: '2026-03-28T10:00:00Z',
    updated_at: '2026-04-01T16:00:00Z',
  },
  {
    id: '6',
    title: 'Monday motivation quote graphic',
    description: 'Clean minimal design with the portfolio/patience quote. Brand fonts and colors.',
    status: 'done',
    created_at: '2026-03-30T09:00:00Z',
    updated_at: '2026-04-03T08:00:00Z',
  },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [addingTo, setAddingTo] = useState<Task['status'] | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

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
      created_at: now,
      updated_at: now,
    };
    setTasks([...tasks, task]);
    setNewTitle('');
    setNewDesc('');
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

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  }}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-[#666666] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" x2="12" y1="5" y2="19" />
                    <line x1="5" x2="19" y1="12" y2="12" />
                  </svg>
                </button>
              </div>

              <div className="px-4 pb-4 space-y-3">
                {/* Add new card form */}
                {addingTo === col.key && (
                  <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full text-sm font-medium text-[#111111] border-none outline-none placeholder:text-[#999999] mb-2"
                      placeholder="Task title"
                      autoFocus
                    />
                    <textarea
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full text-sm text-[#666666] border-none outline-none placeholder:text-[#999999] resize-none"
                      placeholder="Description (optional)"
                      rows={2}
                    />
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
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#999999]">
                        {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex gap-1">
                        {col.key !== 'todo' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const prev = col.key === 'done' ? 'in-progress' : 'todo';
                              moveTask(task.id, prev as Task['status']);
                            }}
                            className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-[#666666] hover:bg-gray-200 transition-colors"
                          >
                            ← Move
                          </button>
                        )}
                        {col.key !== 'done' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const next = col.key === 'todo' ? 'in-progress' : 'done';
                              moveTask(task.id, next as Task['status']);
                            }}
                            className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-[#666666] hover:bg-gray-200 transition-colors"
                          >
                            Move →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
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
