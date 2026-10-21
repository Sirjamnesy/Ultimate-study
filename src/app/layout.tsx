import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Epilogue, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { ProgressProvider } from "@/components/shared/progress-provider";
import { LevelUpOverlay } from "@/components/shared/level-up-overlay";
import { ogImage, siteUrl } from "@/lib/site-url";
import "./globals.css";

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Wekaro: learn AI, week by week";
const description =
  "Weekly AI news, courses in a sensible order, and a plan you can follow, including the Claude Certified Architect exam. Free to start. Independent, not affiliated with Anthropic.";
const shareDescription =
  "Weekly AI news, courses in a sensible order, and a plan you can follow. Free to start.";

export const metadata: Metadata = {
  // Built from NEXT_PUBLIC_APP_URL (see src/lib/site-url.ts); omitted when unset.
  metadataBase: siteUrl(),
  title,
  description,
  keywords: [
    "AI Engineering",
    "Claude Certified Architect",
    "study roadmap",
    "certification prep",
    "AI learning",
    "AI news",
    "Claude",
  ],
  openGraph: {
    title,
    description: shareDescription,
    type: "website",
    siteName: "Wekaro",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: shareDescription,
    images: [ogImage.url],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${epilogue.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Marks the page as scripted before paint, so the public site's entrance
            animations start hidden instead of flashing (styles in hub.css). */}
        <Script id="js-flag" strategy="beforeInteractive">
          {`document.documentElement.classList.add("js")`}
        </Script>
        <ThemeProvider>
          <ProgressProvider>
            <TooltipProvider>
              {children}
              <LevelUpOverlay />
            </TooltipProvider>
          </ProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
