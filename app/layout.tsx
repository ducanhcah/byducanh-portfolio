import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://byducanh.id.vn"),
  title: {
    default: "Nguyễn Đức Anh — Software Engineering Intern",
    template: "%s — byducanh."
  },
  description:
    "Nguyễn Đức Anh, sinh viên năm cuối ngành Kỹ thuật Phần mềm tại Đại học Duy Tân, đang tìm cơ hội Software Engineering Intern / IT Intern tại Đà Nẵng.",
  applicationName: "byducanh.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/favicon.svg" },
  alternates: {
    canonical: "https://byducanh.id.vn"
  },
  openGraph: {
    title: "Nguyễn Đức Anh — Software Engineering Intern",
    description: "Software Engineering Intern / IT Intern · Đà Nẵng, Việt Nam",
    url: "https://byducanh.id.vn",
    siteName: "byducanh.",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D0D0D"
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
