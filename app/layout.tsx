import type { Metadata } from "next";
import { Hachi_Maru_Pop } from "next/font/google";
import "./globals.css";

const hachiMaruPop = Hachi_Maru_Pop({
  variable: "--font-hachi-maru-pop",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Mikuji",
  description: "AIがあなたの運勢を占います",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${hachiMaruPop.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
