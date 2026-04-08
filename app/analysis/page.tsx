export default function AnalysisPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111111]">Analysis</h1>
        <p className="text-sm text-[#666666] mt-1">Post performance metrics for @rizinternational</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#f8f9fb] rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-[#666666]">Total Posts</p>
          <p className="text-2xl font-bold text-[#111111] mt-1">0</p>
        </div>
        <div className="bg-[#f8f9fb] rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-[#666666]">Avg Engagement / Post</p>
          <p className="text-2xl font-bold text-[#111111] mt-1">—</p>
        </div>
        <div className="bg-[#f8f9fb] rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-[#666666]">Total Reach</p>
          <p className="text-2xl font-bold text-[#111111] mt-1">0</p>
        </div>
        <div className="bg-[#f8f9fb] rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-[#666666]">Total Impressions</p>
          <p className="text-2xl font-bold text-[#111111] mt-1">0</p>
        </div>
      </div>

      {/* Empty state */}
      <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
        <div className="text-[#999999] mb-3 flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
        </div>
        <p className="text-sm font-medium text-[#111111]">No analytics data yet</p>
        <p className="text-sm text-[#999999] mt-1">
          Connect your Instagram account on the Media tab to start tracking post performance.
        </p>
      </div>
    </div>
  );
}
