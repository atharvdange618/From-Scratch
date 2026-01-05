import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BackToTop } from "@/components/back-to-top";
import { SkipToContent } from "@/components/skip-to-content";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: {
    default: "From Scratch | Atharv Dange",
    template: "%s | From Scratch",
  },
  description:
    "Building frameworks, apps, and ideas from the ground up. Follow my journey as I create tools, ship projects, and share everything learned along the way.",
  keywords: [
    "web development",
    "full stack",
    "typescript",
    "react",
    "next.js",
    "mongodb",
    "build in public",
    "software engineering",
    "Atharv Dange",
  ],
  authors: [{ name: "Atharv Dange", url: "https://atharvdange.vercel.app" }],
  creator: "Atharv Dange",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "From Scratch | Atharv Dange",
    description:
      "Building frameworks, apps, and ideas from the ground up. Follow my journey as I create tools, ship projects, and share everything learned along the way.",
    siteName: "From Scratch",
    images: [
      {
        url: "/api/og?title=From%20Scratch&description=Building%20tools%20and%20apps,%20one%20commit%20at%20a%20time&type=page",
        width: 1200,
        height: 630,
        alt: "From Scratch - Building in Public",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "From Scratch | Atharv Dange",
    description:
      "Building frameworks, apps, and ideas from the ground up. Follow my journey as I create tools, ship projects, and share everything learned along the way.",
    creator: "@atharvdangedev",
    images: [
      "/api/og?title=From%20Scratch&description=Building%20tools%20and%20apps,%20one%20commit%20at%20a%20time&type=page",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <SkipToContent />
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
          <BackToTop />
          <Analytics />
          <SpeedInsights />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
