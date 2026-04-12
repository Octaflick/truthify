import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Truthify",
  description: "Verify any claim. Instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
