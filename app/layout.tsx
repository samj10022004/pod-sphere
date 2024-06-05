import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "../providers/ConvexClerkProvider";
import { Toaster } from "@/components/ui/toaster"
import AudioProvider from "@/providers/AudioProvider";

const manrope = Manrope({ subsets: ["latin"] });

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
      <ConvexClerkProvider>
        <html lang="en">
          <AudioProvider>
            <body className={manrope.className}>
                <Toaster />
                {children}
            </body>
          </AudioProvider>
        </html>
      </ConvexClerkProvider>
  );
}
