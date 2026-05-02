import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
});

import NavBar from "./components/NavBar";
import ThemeWrapper from "./components/ThemeWrapper";
import { GlobalProvider } from "../context/GlobalContext";

export const metadata: Metadata = {
  title: "Harshit Edu | Student Performance Prediction",
  description: "AI-driven Student Risk Analytics & Intervention Platform",
  manifest: "/manifest.json",
  themeColor: "#020617",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Harshit Edu",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased text-slate-100 min-h-screen flex flex-col`}>
        <GlobalProvider>
          <ThemeWrapper>
            <NavBar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </ThemeWrapper>
        </GlobalProvider>
      </body>
    </html>
  );
}
