import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'API Key Management',
  description: 'Manage your API keys securely.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster 
          position="top-center"
          toastOptions={{
            success: {
              style: {
                background: '#22c55e',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#22c55e',
              },
              duration: 3000,
            }
          }}
        />
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 ml-64">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
