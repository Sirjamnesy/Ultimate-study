import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { ProgressProvider } from "@/components/shared/progress-provider";
import { LevelUpOverlay } from "@/components/shared/level-up-overlay";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ultimate Study | AI Engineering Learning Hub",
  description:
    "A 26-week interactive roadmap to master AI Engineering and pass the Claude Certified Architect exam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
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
