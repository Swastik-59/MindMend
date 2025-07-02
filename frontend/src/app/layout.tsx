// "use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "../hooks/useThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MindMend",
  description: "Your AI Mental Wellness Companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300`}
      >
        <ThemeProvider>
          <div className="min-h-screen w-full">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
