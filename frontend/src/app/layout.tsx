import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Troubled Waters: Sailing with AI in Supply Chain | Accelalpha × Oracle",
  description:
    "Join Accelalpha & Oracle on 13th November 2024 at Marriott Resort, The Palm, Dubai for an exclusive executive summit on AI-powered supply chain transformation in the Gulf region.",
  keywords:
    "Oracle SCM, Accelalpha, supply chain AI, Gulf logistics, digital transformation, Dubai event",
  openGraph: {
    title: "Troubled Waters: Sailing with AI in Supply Chain",
    description:
      "Exclusive executive summit hosted by Accelalpha & Oracle — 13th November 2024, Marriott Resort, The Palm, Dubai.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
