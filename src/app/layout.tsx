import type { Metadata } from "next";
import { Noto_Sans_Thai, Outfit, Nunito_Sans } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "หวานละมุน | ขนมไทยสไตล์โมเดิร์น",
  description:
    "ขนมไทยสไตล์โมเดิร์น ที่ใส่ใจทุกรายละเอียด หวานละมุน ทุกคำคือความสุข",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${notoSansThai.variable} ${outfit.variable} ${nunitoSans.variable} antialiased`}
        style={{ fontFamily: "var(--font-noto-sans-thai), var(--font-nunito-sans), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
