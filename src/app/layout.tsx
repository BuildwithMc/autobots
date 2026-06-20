import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { AppContextProvider } from "@/context/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoBots - deAIOS Agent Workflows",
  description: "Decentralized workflow automation orchestrator powered by 0G Labs Modular Stack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex bg-obsidian text-foreground overflow-hidden">
        <AppContextProvider>
          <Sidebar />
          <main className="flex-1 h-screen overflow-y-auto relative flex flex-col bg-[#050505] border-l border-neon-purple/10">
            {children}
          </main>
        </AppContextProvider>
      </body>
    </html>
  );
}

