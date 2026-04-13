'use client';

import { useState } from 'react';

interface Props {
  hasAppId: boolean;
  connected?: boolean;
  igUserId?: string;
  tokenPreview?: string;
  fullToken?: string;
  error?: string;
}

const errorMessages: Record<string, string> = {
  auth_denied: 'Instagram authorization was denied. Please try again.',
  missing_config: 'Facebook App is not fully configured. Contact Dylan.',
  token_exchange_failed: 'Failed to exchange authorization code. Try again.',
  no_pages: 'No Facebook Pages found. Make sure the Instagram account is linked to a Facebook Page.',
  no_instagram: 'No Instagram Business account found on that Facebook Page.',
  unknown: 'Something went wrong. Please try again.',
};

export default function InstagramConnect({ hasAppId, connected, igUserId, tokenPreview, fullToken, error }: Props) {
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  // Success state — show credentials to add to Vercel
  if (connected && igUserId && fullToken) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-[#f8f9fb] rounded-2xl border border-gray-100 p-10 max-w-lg w-full text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-[#111111] mb-2">Instagram Connected!</h2>
          <p className="text-sm text-[#666666] mb-6">
            One last step — add these to your Vercel environment variables, then redeploy.
          </p>

          <div className="space-y-3 text-left">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-[#666666] uppercase">INSTAGRAM_USER_ID</span>
                <button
                  onClick={() => copyToClipboard(igUserId, 'id')}
                  className="text-xs text-[#3d5a80] hover:underline font-medium"
                >
                  {copied === 'id' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <code className="text-sm font-mono text-[#111111] break-all">{igUserId}</code>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-[#666666] uppercase">INSTAGRAM_ACCESS_TOKEN</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowToken(!showToken)}
                    className="text-xs text-[#3d5a80] hover:underline font-medium"
                  >
                    {showToken ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => copyToClipboard(fullToken, 'token')}
                    className="text-xs text-[#3d5a80] hover:underline font-medium"
                  >
                    {copied === 'token' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <code className="text-sm font-mono text-[#111111] break-all">
                {showToken ? fullToken : tokenPreview}
              </code>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 text-left">
            <h3 className="text-sm font-semibold text-[#111111] mb-2">How to finish setup:</h3>
            <ol className="text-sm text-[#666666] space-y-1.5">
              <li>1. Copy both values above</li>
              <li>2. Go to <strong className="text-[#111111]">Vercel → Settings → Environment Variables</strong></li>
              <li>3. Add each variable and click Save</li>
              <li>4. Click <strong className="text-[#111111]">Redeploy</strong> from the Deployments tab</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="bg-[#f8f9fb] rounded-2xl border border-gray-100 p-10 max-w-lg w-full text-center">
        {/* Instagram icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-[#111111] mb-2">Connect Instagram</h2>
        <p className="text-sm text-[#666666] mb-6 leading-relaxed">
          Link the @rizinternational Instagram account to pull in posts,
          reels, and analytics automatically.
        </p>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-left">
            <p className="text-sm text-red-700">{errorMessages[error] || errorMessages.unknown}</p>
          </div>
        )}

        {/* Connect button */}
        <div>
          <a
            href="/api/instagram/auth"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            Connect Instagram Account
          </a>
          <p className="text-xs text-[#999999] mt-3">
            You&apos;ll be redirected to Facebook to authorize access.
          </p>
        </div>
      </div>
    </div>
  );
}
