import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CarbonLand - 탄소중립 토지이용 시뮬레이터",
  description: "이 땅을 개발하면, 탄소는 얼마나 변할까? 경기도 토지이용 변경에 따른 탄소 영향을 시뮬레이션합니다.",
  keywords: ["탄소중립", "토지이용", "시뮬레이션", "경기도", "기후변화", "탄소흡수"],
  authors: [{ name: "경기 기후 바이브코딩 해커톤 2025" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
