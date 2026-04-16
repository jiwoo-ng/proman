import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import NewProjectModal from "@/components/NewProjectModal";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PMP Project Manager - Professional Project Management",
  description: "Enterprise-grade project management application following PMP certification standards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ margin: 0, display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <div style={{ flex: 1, marginLeft: '260px', transition: 'margin-left 0.3s ease' }}>
          <Header />
          <main style={{ padding: '24px 32px', background: '#f9fafb', minHeight: 'calc(100vh - 64px)' }}>
            {children}
          </main>
        </div>
        <NewProjectModal />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  );
}
