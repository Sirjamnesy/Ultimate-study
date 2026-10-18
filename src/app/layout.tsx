import type { Metadata } from "next";
import { Epilogue, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { ProgressProvider } from "@/components/shared/progress-provider";
import { LevelUpOverlay } from "@/components/shared/level-up-overlay";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://ultimate-study-nu.vercel.app"),
  title: "Wekaro | AI Engineering, one week at a time",
  description:
    "A 26-week roadmap to AI Engineering and the Claude Certified Architect exam, with quizzes, XP, badges and practice exams. Independent, not affiliated with Anthropic.",
  keywords: [
    "AI Engineering",
    "Claude Certified Architect",
    "study roadmap",
    "certification prep",
    "AI learning",
    "Claude",
    "Anthropic",
  ],
  openGraph: {
    title: "Wekaro | AI Engineering, one week at a time",
    description:
      "26-week gamified roadmap to master AI Engineering and pass the Claude Certified Architect exam",
    type: "website",
    siteName: "Wekaro",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wekaro | AI Engineering, one week at a time",
    description:
      "26-week gamified roadmap to master AI Engineering and pass the Claude Certified Architect exam",
  },
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
