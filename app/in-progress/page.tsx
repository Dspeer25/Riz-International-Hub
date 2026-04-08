import KanbanBoard from '@/components/KanbanBoard';

export default function InProgressPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111111]">In Progress</h1>
        <p className="text-sm text-[#666666] mt-1">Track content tasks from idea to completion</p>
      </div>
      <KanbanBoard />
    </div>
  );
}
