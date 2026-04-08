'use client';

import { useState } from 'react';
import { InstagramPost } from '@/lib/instagram';
import PostModal from './PostModal';

function getMediaTypeBadge(type: string) {
  switch (type) {
    case 'CAROUSEL_ALBUM':
      return { label: 'Carousel', color: 'bg-[#3d5a80]' };
    case 'VIDEO':
      return { label: 'Video', color: 'bg-purple-600' };
    default:
      return { label: 'Image', color: 'bg-emerald-600' };
  }
}

function isRecent(timestamp: string) {
  const postTime = new Date(timestamp).getTime();
  const now = Date.now();
  return now - postTime < 24 * 60 * 60 * 1000;
}

export default function MediaGrid({ posts }: { posts: InstagramPost[] }) {
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {posts.map((post) => {
          const badge = getMediaTypeBadge(post.media_type);
          const date = new Date(post.timestamp);
          const recent = isRecent(post.timestamp);

          return (
            <button
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-[#f8f9fb] rounded-xl overflow-hidden text-left hover:shadow-md transition-shadow border border-gray-100 group"
            >
              <div className="relative aspect-square bg-gray-200 flex items-center justify-center">
                <div className="text-[#999999]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
                {recent && (
                  <span className="absolute top-2 left-2 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                )}
                <span className={`absolute top-2 right-2 ${badge.color} text-white text-[10px] px-2 py-0.5 rounded-full font-medium`}>
                  {badge.label}
                </span>
              </div>
              <div className="p-3">
                <p className="text-sm text-[#111111] line-clamp-2 leading-snug">
                  {post.caption}
                </p>
                <p className="text-xs text-[#999999] mt-2">
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {' · '}
                  {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {selectedPost && (
        <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </>
  );
}
