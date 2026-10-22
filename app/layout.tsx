import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://byducanh.id.vn"),
  title: {
    default: "Đức Anh — Software Engineer",
    template: "%s — byducanh."
  },
  description:
    "Đức Anh is a software engineer focused on AI engineering, infrastructure, and frontend experiences.",
  applicationName: "byducanh.",
  alternates: {
    canonical: "https://byducanh.id.vn"
  },
  openGraph: {
    title: "Đức Anh — Software Engineer",
    description: "AI Engineering · Infrastructure · Frontend",
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
  themeColor: "#0c0c0c"
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
