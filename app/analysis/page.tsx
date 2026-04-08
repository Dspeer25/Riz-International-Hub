import { getMockPostInsights } from '@/lib/instagram';
import AnalysisTable from '@/components/AnalysisTable';

export default function AnalysisPage() {
  const data = getMockPostInsights();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111111]">Analysis</h1>
        <p className="text-sm text-[#666666] mt-1">Post performance metrics for @rizinternational</p>
      </div>
      <AnalysisTable data={data} />
    </div>
  );
}
