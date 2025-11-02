import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "DATN - Decentralized AI Training Network",
  description: "Connect AI model creators, node operators, and validators in a decentralized environment",
  keywords: ["AI", "blockchain", "decentralized", "machine learning", "Web3"],
  authors: [{ name: "Harsh Patel", url: "https://github.com/harshpatelzzz" }],
  creator: "Harsh Patel",
  openGraph: {
    title: "DATN - Decentralized AI Training Network",
    description: "Decentralized platform for AI model training",
    type: "website",
    url: "https://github.com/harshpatelzzz/decentralized-ai-training-network",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  const storageKey = 'datn-theme';
  const stored = localStorage.getItem(storageKey);
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = stored || 'system';
  
  if (theme === 'dark' || (theme === 'system' && systemTheme === 'dark')) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})()
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          <ThemeProvider defaultTheme="system" storageKey="datn-theme">
            <div className="min-h-screen bg-background">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
              <Toaster />
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
