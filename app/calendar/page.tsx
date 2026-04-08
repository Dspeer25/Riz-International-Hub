import CalendarView from '@/components/CalendarView';

export default function CalendarPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111111]">Calendar</h1>
        <p className="text-sm text-[#666666] mt-1">Plan and track your content schedule</p>
      </div>
      <CalendarView />
    </div>
  );
}
