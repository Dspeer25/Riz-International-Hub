import IdeasBoard from '@/components/IdeasBoard';

export default function IdeasPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111111]">Ideas</h1>
        <p className="text-sm text-[#666666] mt-1">Content idea bank for @rizinternational</p>
      </div>
      <IdeasBoard />
    </div>
  );
}
