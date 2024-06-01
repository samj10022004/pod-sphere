import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "./providers/ConvexClerkProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pod Sphere",
  description: "your ultimate AI-powered text-to-audio podcast application. PodSphere transforms written content into immersive audio experiences, allowing you to convert articles, blogs, and documents into high-quality podcasts effortlessly. Harness the power of advanced AI to produce professional-grade audio content, expand your reach, and engage your audience in new and innovative ways. Whether you're a content creator, blogger, or just someone looking to multitask while staying informed, PodSphere is your go-to platform for seamless text-to-sound transformation.",
  icons:{
    icon:'/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClerkProvider>
          {children}
        </ConvexClerkProvider>
      </body>
    </html>
  );
}
