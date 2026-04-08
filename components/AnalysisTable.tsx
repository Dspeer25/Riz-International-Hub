'use client';

import { useState } from 'react';
import { InstagramPost, PostInsights } from '@/lib/instagram';

type PostWithInsights = InstagramPost & PostInsights;
type SortKey = 'timestamp' | 'impressions' | 'reach' | 'engagement' | 'saved' | 'shares' | 'likes' | 'comments';

function formatNumber(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

export default function AnalysisTable({ data }: { data: PostWithInsights[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('timestamp');
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = [...data].sort((a, b) => {
    let aVal: number, bVal: number;
    if (sortKey === 'timestamp') {
      aVal = new Date(a.timestamp).getTime();
      bVal = new Date(b.timestamp).getTime();
    } else {
      aVal = a[sortKey];
      bVal = b[sortKey];
    }
    return sortAsc ? aVal - bVal : bVal - aVal;
  });

  const totalPosts = data.length;
  const totalReach = data.reduce((sum, p) => sum + p.reach, 0);
  const totalImpressions = data.reduce((sum, p) => sum + p.impressions, 0);
  const avgEngagement = data.length > 0
    ? (data.reduce((sum, p) => sum + p.engagement, 0) / data.length).toFixed(0)
    : '0';

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => (
    <span className="ml-1 inline-block">
      {sortKey === column ? (sortAsc ? '↑' : '↓') : ''}
    </span>
  );

  const headerClass = 'text-left text-xs font-semibold text-[#666666] uppercase tracking-wider py-3 px-3 cursor-pointer hover:text-[#111111] select-none';

  return (
    <div>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#f8f9fb] rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-[#666666]">Total Posts</p>
          <p className="text-2xl font-bold text-[#111111] mt-1">{totalPosts}</p>
        </div>
        <div className="bg-[#f8f9fb] rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-[#666666]">Avg Engagement</p>
          <p className="text-2xl font-bold text-[#111111] mt-1">{formatNumber(Number(avgEngagement))}</p>
        </div>
        <div className="bg-[#f8f9fb] rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-[#666666]">Total Reach</p>
          <p className="text-2xl font-bold text-[#111111] mt-1">{formatNumber(totalReach)}</p>
        </div>
        <div className="bg-[#f8f9fb] rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-[#666666]">Total Impressions</p>
          <p className="text-2xl font-bold text-[#111111] mt-1">{formatNumber(totalImpressions)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8f9fb] border-b border-gray-100">
              <tr>
                <th className={headerClass} style={{ width: 50 }}></th>
                <th className={headerClass} style={{ minWidth: 200 }}>Caption</th>
                <th className={headerClass} onClick={() => handleSort('timestamp')}>
                  Date<SortIcon column="timestamp" />
                </th>
                <th className={headerClass} onClick={() => handleSort('impressions')}>
                  Impr.<SortIcon column="impressions" />
                </th>
                <th className={headerClass} onClick={() => handleSort('reach')}>
                  Reach<SortIcon column="reach" />
                </th>
                <th className={headerClass} onClick={() => handleSort('engagement')}>
                  Eng.<SortIcon column="engagement" />
                </th>
                <th className={headerClass} onClick={() => handleSort('saved')}>
                  Saves<SortIcon column="saved" />
                </th>
                <th className={headerClass} onClick={() => handleSort('shares')}>
                  Shares<SortIcon column="shares" />
                </th>
                <th className={headerClass} onClick={() => handleSort('likes')}>
                  Likes<SortIcon column="likes" />
                </th>
                <th className={headerClass} onClick={() => handleSort('comments')}>
                  Cmnts<SortIcon column="comments" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((post) => {
                const date = new Date(post.timestamp);
                const isExpanded = expandedId === post.id;
                return (
                  <tr
                    key={post.id}
                    className="border-b border-gray-50 hover:bg-[#f8f9fb]/50 cursor-pointer transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : post.id)}
                  >
                    <td className="py-3 px-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <p className={`text-sm text-[#111111] ${isExpanded ? '' : 'line-clamp-1'}`}>
                        {post.caption}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-sm text-[#666666] whitespace-nowrap">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3 px-3 text-sm text-[#111111] font-medium">{formatNumber(post.impressions)}</td>
                    <td className="py-3 px-3 text-sm text-[#111111] font-medium">{formatNumber(post.reach)}</td>
                    <td className="py-3 px-3 text-sm text-[#111111] font-medium">{formatNumber(post.engagement)}</td>
                    <td className="py-3 px-3 text-sm text-[#111111] font-medium">{formatNumber(post.saved)}</td>
                    <td className="py-3 px-3 text-sm text-[#111111] font-medium">{formatNumber(post.shares)}</td>
                    <td className="py-3 px-3 text-sm text-[#111111] font-medium">{formatNumber(post.likes)}</td>
                    <td className="py-3 px-3 text-sm text-[#111111] font-medium">{formatNumber(post.comments)}</td>
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
