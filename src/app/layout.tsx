import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fitness Hub",
  description: "Your all-in-one fitness platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#111714] text-white min-h-screen flex flex-col`}>
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
