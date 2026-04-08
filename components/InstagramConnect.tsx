export default function InstagramConnect() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="bg-[#f8f9fb] rounded-2xl border border-gray-100 p-10 max-w-lg w-full text-center">
        {/* Instagram icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-[#111111] mb-2">Connect Your Instagram</h2>
        <p className="text-sm text-[#666666] mb-6 leading-relaxed">
          Link your Instagram Business or Creator account to automatically pull in your posts,
          reels, and carousels. Analytics and engagement data will sync once connected.
        </p>

        <div className="bg-white rounded-xl border border-gray-200 p-5 text-left mb-6">
          <h3 className="text-sm font-semibold text-[#111111] mb-3">Setup Steps</h3>
          <ol className="space-y-3 text-sm text-[#666666]">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1a2744] text-white text-xs flex items-center justify-center font-medium">1</span>
              <span>Create a <strong className="text-[#111111]">Meta Developer App</strong> at developers.facebook.com</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1a2744] text-white text-xs flex items-center justify-center font-medium">2</span>
              <span>Add the <strong className="text-[#111111]">Instagram Graph API</strong> product to your app</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1a2744] text-white text-xs flex items-center justify-center font-medium">3</span>
              <span>Generate a <strong className="text-[#111111]">long-lived access token</strong> with instagram_basic and pages_read_engagement permissions</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1a2744] text-white text-xs flex items-center justify-center font-medium">4</span>
              <span>Add your token and user ID to the environment variables below</span>
            </li>
          </ol>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 text-left">
          <h3 className="text-sm font-semibold text-[#111111] mb-3">Environment Variables Needed</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <code className="text-xs bg-[#f8f9fb] px-2 py-1 rounded font-mono text-[#3d5a80]">INSTAGRAM_ACCESS_TOKEN</code>
              <span className="text-xs text-[#999999]">— Your long-lived token</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-[#f8f9fb] px-2 py-1 rounded font-mono text-[#3d5a80]">INSTAGRAM_USER_ID</code>
              <span className="text-xs text-[#999999]">— Your Instagram Business account ID</span>
            </div>
          </div>
          <p className="text-xs text-[#999999] mt-3">
            Add these to your <code className="font-mono">.env.local</code> file and restart the server.
          </p>
        </div>
      </div>
    </div>
  );
}
