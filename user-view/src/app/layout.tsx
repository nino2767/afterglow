import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "AFTERGLOW — 전시 여운 아카이빙 플랫폼",
  description: "전시 공간에서의 고유한 여운을 AI 큐레이터와 기록하고, 팝업 공간으로 연결되는 특별한 경험을 제공합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${playfair.variable} h-full`}>
      <body style={{
        margin: 0,
        padding: 0,
        backgroundColor: "#E8E6E1", // 데스크톱 사이드 배경
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh"
      }}>
        {/* 모바일 뷰포트 센터 컬럼 셸 */}
        <div style={{
          width: "100%",
          maxWidth: "430px",
          backgroundColor: "var(--bg)",
          minHeight: "100vh",
          position: "relative",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 8px 40px rgba(10,10,10,0.10)",
          display: "flex",
          flexDirection: "column"
        }}>
          {children}
        </div>
      </body>
    </html>
  );
}
