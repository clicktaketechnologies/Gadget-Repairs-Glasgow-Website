import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const SITE_URL = "https://www.gadgetrepairsglasgow.co.uk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Gadget Repairs Glasgow | Phone, MacBook & Gadget Repair in Glasgow",
    template: "%s | Gadget Repairs Glasgow",
  },
  description:
    "Professional repair shop in Glasgow for mobile phones, MacBooks, laptops, tablets, game consoles, computers, smart watches & GHD straighteners. 172 Trongate, Glasgow G1 5EL. Call +44 7777 200149.",
  keywords: [
    "phone repair Glasgow",
    "MacBook repair Glasgow",
    "laptop repair Glasgow",
    "tablet repair Glasgow",
    "GHD repair Glasgow",
    "game console repair Glasgow",
    "computer repair Glasgow",
    "smart watch repair Glasgow",
    "screen replacement Glasgow",
    "battery replacement Glasgow",
    "172 Trongate Glasgow",
    "Gadget Repairs Glasgow",
  ],
  authors: [{ name: "Gadget Repairs Glasgow" }],
  creator: "Gadget Repairs Glasgow",
  publisher: "Gadget Repairs Glasgow",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: "Gadget Repairs Glasgow",
    title: "Gadget Repairs Glasgow | Phone, MacBook & Gadget Repair in Glasgow",
    description:
      "Professional repair shop in Glasgow for mobile phones, MacBooks, laptops, tablets, game consoles, computers, smart watches & GHD straighteners. 172 Trongate, Glasgow G1 5EL.",
    images: [{ url: "/logo.jpg", width: 512, height: 512, alt: "Gadget Repairs Glasgow" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gadget Repairs Glasgow | Phone, MacBook & Gadget Repair in Glasgow",
    description:
      "Professional repair shop in Glasgow for mobile phones, MacBooks, laptops, tablets, game consoles, computers, smart watches & GHD straighteners.",
    images: ["/logo.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" suppressHydrationWarning className="overflow-x-hidden">
      <body
        className={`${geistSans.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        {children}
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
