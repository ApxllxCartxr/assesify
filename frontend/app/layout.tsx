import type { Metadata } from "next";
import { Geist, Nunito } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Assesify",
  description: "Gamified Learning Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geist.variable} ${nunito.variable} antialiased font-nunito bg-surface-light text-surface-dark dark:bg-surface-dark dark:text-surface-light`}
      >
        {children}
      </body>
    </html>
  );
}
