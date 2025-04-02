import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { VideoProvider } from "./context/VideoContext";
import { TargetProvider } from "./context/TargetContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Person Re-Identification System",
  description: "A system for person re-identification using videos and images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <VideoProvider>
          <TargetProvider>
            <nav className="bg-gray-800 text-white p-4">
              <div className="container mx-auto flex space-x-4">
                <Link href="/gallery" className="hover:text-gray-300">Gallery</Link>
                <Link href="/targets" className="hover:text-gray-300">Targets</Link>
                <Link href="/cropper" className="hover:text-gray-300">Cropper</Link>
                <Link href="/prompt" className="hover:text-gray-300">Prompt Builder</Link>
                <Link href="/results" className="hover:text-gray-300">Results</Link>
              </div>
            </nav>
            <main className="container mx-auto p-4">
              {children}
            </main>
          </TargetProvider>
        </VideoProvider>
      </body>
    </html>
  );
}
