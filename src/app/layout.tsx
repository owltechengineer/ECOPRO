import type { Metadata } from 'next';
import './globals.css';
import { EcoProProvider } from '@/store/EcoProContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'ECOPRO — Project Management & Business Intelligence',
  description: 'Piattaforma professionale di PM, BI e Market Intelligence per startup, brand e attività imprenditoriali.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className="antialiased">
        <EcoProProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <AppShell>
              <Header />
              <main className="flex-1 p-6 overflow-auto">
                {children}
              </main>
            </AppShell>
          </div>
        </EcoProProvider>
      </body>
    </html>
  );
}
