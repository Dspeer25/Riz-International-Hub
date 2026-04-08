'use client';

import { InstagramPost } from '@/lib/instagram';

interface PostModalProps {
  post: InstagramPost;
  onClose: () => void;
}

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

export default function PostModal({ post, onClose }: PostModalProps) {
  const badge = getMediaTypeBadge(post.media_type);
  const date = new Date(post.timestamp);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="w-full aspect-square bg-[#f8f9fb] flex items-center justify-center rounded-t-xl">
            <div className="text-[#999999] text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-[#111111] hover:bg-white transition-colors shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`${badge.color} text-white text-xs px-2.5 py-0.5 rounded-full font-medium`}>
              {badge.label}
            </span>
            <span className="text-[#999999] text-sm">
              {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              {' at '}
              {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </span>
          </div>
          <p className="text-[#111111] text-sm leading-relaxed whitespace-pre-wrap">
            {post.caption}
          </p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3d5a80] text-sm font-medium hover:underline"
            >
              View on Instagram →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
