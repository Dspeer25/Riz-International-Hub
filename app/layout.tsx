import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import AuthGate from '@/components/AuthGate';

export const metadata: Metadata = {
  title: 'Riz International — Content Dashboard',
  description: 'Instagram content management dashboard for @rizinternational',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full" style={{ fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        <AuthGate>
          <div className="flex h-full">
            <Sidebar />
            <main className="ml-[260px] flex-1 min-h-screen bg-white">
              <div className="p-8">
                {children}
              </div>
            </main>
          </div>
        </AuthGate>
      </body>
    </html>
  );
}
