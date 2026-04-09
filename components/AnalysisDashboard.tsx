'use client';

import { useState } from 'react';

type Category = 'current' | 'experimental' | 'testing';
type SortKey = 'timestamp' | 'reachRate' | 'engagementRate' | 'saves' | 'shares' | 'totalEngagement';

interface AnalysisPost {
  id: string;
  caption: string;
  timestamp: string;
  category: Category;
  followers: number;
  reach: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
}

const categoryColors: Record<Category, { border: string; bg: string; text: string; pill: string }> = {
  current: { border: 'border-t-[#1a2744]', bg: 'bg-[#1a2744]', text: 'text-[#1a2744]', pill: 'bg-[#1a2744] text-white' },
  experimental: { border: 'border-t-[#f59e0b]', bg: 'bg-[#f59e0b]', text: 'text-[#f59e0b]', pill: 'bg-[#f59e0b] text-white' },
  testing: { border: 'border-t-[#14b8a6]', bg: 'bg-[#14b8a6]', text: 'text-[#14b8a6]', pill: 'bg-[#14b8a6] text-white' },
};

const categoryLabels: Record<Category, string> = {
  current: 'Current',
  experimental: 'Experimental',
  testing: 'Testing',
};

function generateMockPosts(): AnalysisPost[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const followers = 104000;

  const currentPosts: AnalysisPost[] = [
    { id: 'c1', caption: 'The market doesn\'t reward emotions — it rewards discipline. Here\'s how I manage risk on every trade.', timestamp: new Date(now - 1 * day).toISOString(), category: 'current', followers, reach: 3640, likes: 142, comments: 18, saves: 52, shares: 14 },
    { id: 'c2', caption: 'Stop chasing trades. Start building systems. The difference between a gambler and a trader is a plan.', timestamp: new Date(now - 3 * day).toISOString(), category: 'current', followers, reach: 3120, likes: 118, comments: 12, saves: 44, shares: 9 },
    { id: 'c3', caption: 'Monday motivation: Your portfolio is a reflection of your patience. Not your predictions.', timestamp: new Date(now - 6 * day).toISOString(), category: 'current', followers, reach: 4160, likes: 165, comments: 22, saves: 68, shares: 18 },
    { id: 'c4', caption: 'The sensible approach to growing your account: compound gains, manage drawdowns, stay consistent.', timestamp: new Date(now - 9 * day).toISOString(), category: 'current', followers, reach: 2912, likes: 98, comments: 8, saves: 38, shares: 7 },
    { id: 'c5', caption: 'Ethics in trading is underrated. Here\'s why I believe transparency builds better communities.', timestamp: new Date(now - 12 * day).toISOString(), category: 'current', followers, reach: 3328, likes: 124, comments: 14, saves: 56, shares: 12 },
    { id: 'c6', caption: 'Your edge isn\'t a strategy. It\'s your ability to execute consistently, even when it\'s boring.', timestamp: new Date(now - 16 * day).toISOString(), category: 'current', followers, reach: 3744, likes: 138, comments: 16, saves: 48, shares: 11 },
    { id: 'c7', caption: 'Live Q&A this Friday at 7pm EST. Drop your questions below and I\'ll answer them on stream.', timestamp: new Date(now - 20 * day).toISOString(), category: 'current', followers, reach: 4368, likes: 186, comments: 42, saves: 32, shares: 22 },
    { id: 'c8', caption: 'Trading psychology 101: How to recover from a losing streak without revenge trading.', timestamp: new Date(now - 24 * day).toISOString(), category: 'current', followers, reach: 3536, likes: 132, comments: 20, saves: 62, shares: 15 },
  ];

  const experimentalPosts: AnalysisPost[] = [
    { id: 'e1', caption: '2024 vs 2025: S&P 500 returns by sector. The data tells a story most traders are ignoring. Swipe →', timestamp: new Date(now - 2 * day).toISOString(), category: 'experimental', followers, reach: 6240, likes: 312, comments: 48, saves: 186, shares: 54 },
    { id: 'e2', caption: 'I tracked 500 trades over 6 months. Here\'s the win rate by setup type — with real numbers.', timestamp: new Date(now - 5 * day).toISOString(), category: 'experimental', followers, reach: 7280, likes: 386, comments: 62, saves: 224, shares: 68 },
    { id: 'e3', caption: 'Average drawdown by account size: $10K, $25K, $50K, $100K. These numbers will surprise you.', timestamp: new Date(now - 8 * day).toISOString(), category: 'experimental', followers, reach: 5824, likes: 278, comments: 38, saves: 156, shares: 42 },
    { id: 'e4', caption: 'Fed rate decisions vs EUR/USD moves: 24 months of data visualized. Save this for your next trade.', timestamp: new Date(now - 14 * day).toISOString(), category: 'experimental', followers, reach: 6656, likes: 342, comments: 52, saves: 198, shares: 58 },
    { id: 'e5', caption: 'Cost of revenge trading: I calculated the actual dollar impact across 200 accounts. Thread with charts 📊', timestamp: new Date(now - 18 * day).toISOString(), category: 'experimental', followers, reach: 5408, likes: 256, comments: 34, saves: 142, shares: 38 },
  ];

  const testingPosts: AnalysisPost[] = [
    { id: 't1', caption: 'POV: You just bought the top again 😭📉 (tag someone who does this)', timestamp: new Date(now - 4 * day).toISOString(), category: 'testing', followers, reach: 8320, likes: 524, comments: 86, saves: 42, shares: 124 },
    { id: 't2', caption: 'I almost quit trading in 2019. Here\'s the story of the worst month of my life and what saved me.', timestamp: new Date(now - 7 * day).toISOString(), category: 'testing', followers, reach: 5616, likes: 298, comments: 56, saves: 112, shares: 34 },
    { id: 't3', caption: '"The stock market is a device for transferring money from the impatient to the patient." — Buffett', timestamp: new Date(now - 11 * day).toISOString(), category: 'testing', followers, reach: 2496, likes: 186, comments: 8, saves: 88, shares: 16 },
    { id: 't4', caption: 'Full 12-minute breakdown of my morning analysis routine. Link in bio for the complete video.', timestamp: new Date(now - 15 * day).toISOString(), category: 'testing', followers, reach: 3952, likes: 164, comments: 28, saves: 76, shares: 20 },
  ];

  return [...currentPosts, ...experimentalPosts, ...testingPosts];
}

function getReachRate(post: AnalysisPost) {
  return (post.reach / post.followers) * 100;
}

function getEngagementRate(post: AnalysisPost) {
  const totalEng = post.likes + post.comments + post.saves + post.shares;
  return post.reach > 0 ? (totalEng / post.reach) * 100 : 0;
}

function getTotalEngagement(post: AnalysisPost) {
  return post.likes + post.comments + post.saves + post.shares;
}

export default function AnalysisDashboard() {
  const [posts, setPosts] = useState<AnalysisPost[]>(generateMockPosts);
  const [sortKey, setSortKey] = useState<SortKey>('timestamp');
  const [sortAsc, setSortAsc] = useState(false);
  const [experimentalLabel, setExperimentalLabel] = useState('Data-forward carousels with verified figures');
  const [editingLabel, setEditingLabel] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const changeCategory = (postId: string, newCat: Category) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, category: newCat } : p));
  };

  const getSortValue = (post: AnalysisPost, key: SortKey): number => {
    switch (key) {
      case 'timestamp': return new Date(post.timestamp).getTime();
      case 'reachRate': return getReachRate(post);
      case 'engagementRate': return getEngagementRate(post);
      case 'saves': return post.saves;
      case 'shares': return post.shares;
      case 'totalEngagement': return getTotalEngagement(post);
    }
  };

  const sorted = [...posts].sort((a, b) => {
    const av = getSortValue(a, sortKey);
    const bv = getSortValue(b, sortKey);
    return sortAsc ? av - bv : bv - av;
  });

  // Health metrics
  const totalFollowers = 104000;
  const avgReachRate = posts.length > 0
    ? posts.reduce((sum, p) => sum + getReachRate(p), 0) / posts.length : 0;
  const avgEngRate = posts.length > 0
    ? posts.reduce((sum, p) => sum + getEngagementRate(p), 0) / posts.length : 0;
  const avgSavesShares = posts.length > 0
    ? posts.reduce((sum, p) => sum + p.saves + p.shares, 0) / posts.length : 0;

  // Category stats
  const getCategoryStats = (cat: Category) => {
    const catPosts = posts.filter(p => p.category === cat);
    const count = catPosts.length;
    if (count === 0) return { count: 0, reachRate: 0, engRate: 0, avgSavesShares: 0, trending: 'flat' as const };

    const reachRate = catPosts.reduce((s, p) => s + getReachRate(p), 0) / count;
    const engRate = catPosts.reduce((s, p) => s + getEngagementRate(p), 0) / count;
    const savesShares = catPosts.reduce((s, p) => s + p.saves + p.shares, 0) / count;

    // Trend: compare last 14 days vs prior 14 days
    const now = Date.now();
    const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;
    const fourWeeksAgo = now - 28 * 24 * 60 * 60 * 1000;
    const recent = catPosts.filter(p => new Date(p.timestamp).getTime() > twoWeeksAgo);
    const prior = catPosts.filter(p => {
      const t = new Date(p.timestamp).getTime();
      return t > fourWeeksAgo && t <= twoWeeksAgo;
    });
    const recentEng = recent.length > 0 ? recent.reduce((s, p) => s + getEngagementRate(p), 0) / recent.length : 0;
    const priorEng = prior.length > 0 ? prior.reduce((s, p) => s + getEngagementRate(p), 0) / prior.length : 0;
    const trending = prior.length === 0 ? 'flat' as const : recentEng > priorEng ? 'up' as const : recentEng < priorEng ? 'down' as const : 'flat' as const;

    return { count, reachRate, engRate, avgSavesShares: savesShares, trending };
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

  const TrendArrow = ({ direction }: { direction: 'up' | 'down' | 'flat' }) => {
    if (direction === 'up') return <span className="text-green-600 text-sm font-medium ml-1">↑</span>;
    if (direction === 'down') return <span className="text-red-500 text-sm font-medium ml-1">↓</span>;
    return <span className="text-[#999999] text-sm ml-1">→</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111111]">Analysis</h1>
        <p className="text-sm text-[#666666] mt-1">Post performance metrics for @rizinternational</p>
      </div>

      {/* Health Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-[#666666] uppercase tracking-wider font-medium">Follower Trend (30d)</p>
          <div className="flex items-baseline gap-1 mt-2">
            <p className="text-2xl font-bold text-green-600">+342</p>
            <span className="text-green-600 text-sm">↑</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-[#666666] uppercase tracking-wider font-medium">Avg Reach Rate</p>
          <p className="text-2xl font-bold text-[#111111] mt-2">{avgReachRate.toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-[#666666] uppercase tracking-wider font-medium">Avg Engagement Rate</p>
          <p className="text-2xl font-bold text-[#111111] mt-2">{avgEngRate.toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-[#666666] uppercase tracking-wider font-medium">Avg Saves + Shares / Post</p>
          <p className="text-2xl font-bold text-[#111111] mt-2">{Math.round(avgSavesShares)}</p>
        </div>
      </div>

      {/* Category Performance Cards */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#111111] mb-4">Performance by Content Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['current', 'experimental', 'testing'] as Category[]).map((cat) => {
            const stats = getCategoryStats(cat);
            const colors = categoryColors[cat];
            return (
              <div key={cat} className={`bg-white rounded-xl border border-gray-100 border-t-4 ${colors.border} p-5`}>
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-[#111111]">{categoryLabels[cat]}</h3>
                  {cat === 'experimental' && (
                    editingLabel ? (
                      <input
                        type="text"
                        value={experimentalLabel}
                        onChange={(e) => setExperimentalLabel(e.target.value)}
                        onBlur={() => setEditingLabel(false)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingLabel(false)}
                        className="text-sm text-[#666666] mt-1 w-full border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                        autoFocus
                      />
                    ) : (
                      <p
                        className="text-sm text-[#666666] mt-1 cursor-pointer hover:text-[#111111] transition-colors"
                        onClick={() => setEditingLabel(true)}
                        title="Click to edit hypothesis"
                      >
                        {experimentalLabel} <span className="text-[#999999] text-xs">✎</span>
                      </p>
                    )
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#666666]">Posts</span>
                    <span className="text-sm font-semibold text-[#111111]">{stats.count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#666666]">Avg Reach Rate</span>
                    <span className="text-sm font-semibold text-[#111111]">{stats.reachRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#666666]">Avg Engagement Rate</span>
                    <span className="text-sm font-semibold text-[#111111]">{stats.engRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#666666]">Avg Saves + Shares</span>
                    <span className="text-sm font-semibold text-[#111111]">{Math.round(stats.avgSavesShares)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs text-[#999999]">2-week trend</span>
                    <div className="flex items-center">
                      <span className="text-xs text-[#666666]">Engagement</span>
                      <TrendArrow direction={stats.trending} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Post Performance Table */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#111111] mb-4">Post Performance</h2>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8f9fb] border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-semibold text-[#666666] uppercase tracking-wider py-3 px-3" style={{ width: 44 }}></th>
                <th className="text-left text-xs font-semibold text-[#666666] uppercase tracking-wider py-3 px-3" style={{ minWidth: 180 }}>Caption</th>
                <SortHeader label="Date" sortKeyName="timestamp" />
                <th className="text-left text-xs font-semibold text-[#666666] uppercase tracking-wider py-3 px-3" style={{ minWidth: 100 }}>Category</th>
                <SortHeader label="Reach %" sortKeyName="reachRate" />
                <SortHeader label="Eng %" sortKeyName="engagementRate" />
                <SortHeader label="Saves" sortKeyName="saves" />
                <SortHeader label="Shares" sortKeyName="shares" />
                <SortHeader label="Total Eng" sortKeyName="totalEngagement" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((post) => {
                const date = new Date(post.timestamp);
                const reachRate = getReachRate(post);
                const engRate = getEngagementRate(post);
                const totalEng = getTotalEngagement(post);
                const colors = categoryColors[post.category];

                return (
                  <tr key={post.id} className="border-b border-gray-50 hover:bg-[#f8f9fb]/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="w-9 h-9 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <p className="text-sm text-[#111111] truncate max-w-[240px]">{post.caption}</p>
                    </td>
                    <td className="py-3 px-3 text-sm text-[#666666] whitespace-nowrap">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={post.category}
                        onChange={(e) => changeCategory(post.id, e.target.value as Category)}
                        className={`text-[11px] font-medium px-2 py-1 rounded-full border-none cursor-pointer appearance-none ${colors.pill}`}
                        style={{ WebkitAppearance: 'none', paddingRight: '8px' }}
                      >
                        <option value="current">Current</option>
                        <option value="experimental">Experimental</option>
                        <option value="testing">Testing</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-sm font-medium text-[#111111]">{reachRate.toFixed(1)}%</td>
                    <td className="py-3 px-3 text-sm font-medium text-[#111111]">{engRate.toFixed(1)}%</td>
                    <td className="py-3 px-3 text-sm font-medium text-[#111111]">{post.saves}</td>
                    <td className="py-3 px-3 text-sm font-medium text-[#111111]">{post.shares}</td>
                    <td className="py-3 px-3 text-sm font-bold text-[#111111]">{totalEng}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
