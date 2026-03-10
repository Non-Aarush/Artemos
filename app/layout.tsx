import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

const f = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Artemos",
  description: "Sat Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${f.variable} antialiased h-screen overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
