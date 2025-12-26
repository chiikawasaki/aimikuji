import type { Metadata } from "next";
import { Shippori_Mincho } from "next/font/google";
import "./globals.css";

const ShipporiMincho = Shippori_Mincho({
  variable: "--font-shippori-mincho",
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
        className={`${ShipporiMincho.variable} antialiased bg-gradient-to-br from-pink-100 via-purple-50 to-teal-100 text-[#4b2e2c]`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
