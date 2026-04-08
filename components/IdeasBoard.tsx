'use client';

import { useState } from 'react';

interface Idea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  used: boolean;
  created_at: string;
}

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

const initialIdeas: Idea[] = [
  {
    id: '1',
    title: 'The Psychology Behind Revenge Trading',
    description: 'Deep dive into why traders revenge trade after losses and the 3-step framework to break the cycle. Include real scenarios and journal prompts.',
    tags: ['trading psychology', 'mindset'],
    used: false,
    created_at: '2026-04-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Ethical Investing in 2026',
    description: 'Carousel post exploring ESG investing, impact funds, and how conscious capitalism aligns with long-term returns.',
    tags: ['ethics', 'conscious capitalism'],
    used: false,
    created_at: '2026-04-02T09:00:00Z',
  },
  {
    id: '3',
    title: 'Fed Rate Decision Breakdown',
    description: 'Quick reel explaining what the latest Fed decision means for forex, stocks, and crypto. Keep it under 45 seconds.',
    tags: ['market news'],
    used: false,
    created_at: '2026-04-03T11:00:00Z',
  },
  {
    id: '4',
    title: 'The 2% Rule Explained Simply',
    description: 'Visual carousel showing position sizing with the 2% rule. Use real dollar examples for a $10K, $25K, and $100K account.',
    tags: ['sensible approach', 'mindset'],
    used: false,
    created_at: '2026-04-04T08:00:00Z',
  },
  {
    id: '5',
    title: 'Morning Routine of Successful Traders',
    description: 'Video showing a realistic trading morning routine. Pre-market analysis, journaling, and key level marking.',
    tags: ['mindset', 'trading psychology'],
    used: true,
    created_at: '2026-03-20T10:00:00Z',
  },
  {
    id: '6',
    title: 'Why Most Traders Fail in Year 1',
    description: 'Honest post about common pitfalls: overleveraging, no plan, emotional trading. End with an actionable checklist.',
    tags: ['trading psychology', 'sensible approach'],
    used: true,
    created_at: '2026-03-15T09:00:00Z',
  },
];

export default function IdeasBoard() {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formTags, setFormTags] = useState<string[]>([]);

  const activeIdeas = ideas.filter((i) => !i.used);
  const usedIdeas = ideas.filter((i) => i.used);

  const toggleTag = (tag: string) => {
    setFormTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    const idea: Idea = {
      id: Date.now().toString(),
      title: formTitle,
      description: formDesc,
      tags: formTags,
      used: false,
      created_at: new Date().toISOString(),
    };
    setIdeas([idea, ...ideas]);
    setFormTitle('');
    setFormDesc('');
    setFormTags([]);
    setShowForm(false);
  };

  const toggleUsed = (id: string) => {
    setIdeas(ideas.map((i) =>
      i.id === id ? { ...i, used: !i.used } : i
    ));
  };

  const IdeaCard = ({ idea }: { idea: Idea }) => (
    <div className={`bg-white rounded-xl border border-gray-100 p-4 ${idea.used ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[#111111]">{idea.title}</h3>
          {idea.description && (
            <p className="text-sm text-[#666666] mt-1.5 leading-relaxed">{idea.description}</p>
          )}
          {idea.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {idea.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tagColors[tag] || 'bg-gray-100 text-gray-600'}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <p className="text-[10px] text-[#999999] mt-2">
            {new Date(idea.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => toggleUsed(idea.id)}
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            idea.used
              ? 'bg-green-100 text-green-600 hover:bg-green-200'
              : 'bg-gray-100 text-[#999999] hover:bg-gray-200'
          }`}
          title={idea.used ? 'Mark as unused' : 'Mark as used'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {/* Add idea button */}
      <button
        onClick={() => setShowForm(true)}
        className="mb-6 px-4 py-2 bg-[#1a2744] text-white rounded-lg text-sm font-medium hover:bg-[#243356] transition-colors inline-flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" x2="12" y1="5" y2="19" />
          <line x1="5" x2="19" y1="12" y2="12" />
        </svg>
        New Idea
      </button>

      {/* Active ideas */}
      <div className="space-y-3">
        {activeIdeas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>

      {/* Used ideas */}
      {usedIdeas.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-[#999999] uppercase tracking-wider mb-3">
            Used ({usedIdeas.length})
          </h3>
          <div className="space-y-3">
            {usedIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        </div>
      )}

      {/* Add idea modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[#111111] mb-4">New Content Idea</h3>
            <form onSubmit={addIdea} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-1">Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-transparent"
                  placeholder="Idea title"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-1">Description</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Describe the idea..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-1">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                        formTags.includes(tag)
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
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-[#666666] hover:bg-[#f8f9fb] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#1a2744] text-white rounded-lg text-sm font-medium hover:bg-[#243356] transition-colors"
                >
                  Add Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
