import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-vazir",
});

export const metadata: Metadata = {
  title: "پنج‌رخ",
  description: "نیمرخ توصیفی پنج عامل شخصیت برای خودشناسی بزرگسالان. نسخه اعتبارسنجی‌نشده.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body>{children}</body>
    </html>
  );
}
