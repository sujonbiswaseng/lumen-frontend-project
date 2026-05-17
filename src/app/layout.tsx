import type { Metadata } from "next";
import {  Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import FloatingChatbot from "@/components/chatbot/FloatingChatbot";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Lumen - Professional Event Management Platform",
  description:
    "Lumen is a platform for discovering, creating, and managing professional events.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      lang="en"
      className={`font-${inter} font-${mono} font-sans h-full antialiased `}
    >
      <body className="w-full overflow-x-hidden min-h-screen font-sans antialiased bg-background">
        <ToastContainer autoClose={1000} theme="dark" />
        {children}
        <FloatingChatbot/>
      </body>
    </html>
  );
}
