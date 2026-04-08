import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password } = await request.json();
  const dashboardPassword = process.env.DASHBOARD_PASSWORD || 'Rizintl';

  if (password === dashboardPassword) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}
