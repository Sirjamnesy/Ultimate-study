"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Moon, Sun, Zap, Map, BookOpen, Trophy, Menu, User, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useTheme } from "@/components/shared/theme-provider";
import { useProgress } from "@/components/shared/progress-provider";

export function Header() {
  const { theme, toggle } = useTheme();
  const { progress, mounted } = useProgress();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isHome = pathname === "/";
  const isRoadmap = pathname === "/roadmap";
  const isWeekPage = pathname.startsWith("/roadmap/") && pathname !== "/roadmap";
  const isQuizHub = pathname === "/quiz";
  const isQuizPage = pathname.startsWith("/quiz/") && pathname !== "/quiz";
  const isBadges = pathname === "/badges";
  const isProfile = pathname === "/profile";
  const isCheckIns = pathname === "/check-ins";

  const backHref = isWeekPage ? "/roadmap" : isRoadmap ? "/" : isQuizPage ? "/quiz" : isQuizHub ? "/" : isBadges ? "/" : isProfile ? "/" : isCheckIns ? "/" : null;
  const backLabel = isWeekPage ? "Roadmap" : isRoadmap ? "Home" : isQuizPage ? "Quizzes" : isQuizHub ? "Home" : isBadges ? "Home" : isProfile ? "Home" : isCheckIns ? "Home" : null;

  const navLinks = [
    { href: "/roadmap", label: "Roadmap", icon: <Map className="h-4 w-4" />, active: isRoadmap || isWeekPage },
    { href: "/quiz", label: "Quizzes", icon: <BookOpen className="h-4 w-4" />, active: isQuizHub || isQuizPage },
    { href: "/badges", label: "Badges", icon: <Trophy className="h-4 w-4" />, active: isBadges },
    { href: "/profile", label: "Profile", icon: <User className="h-4 w-4" />, active: isProfile },
    { href: "/check-ins", label: "Check-Ins", icon: <ClipboardCheck className="h-4 w-4" />, active: isCheckIns },
  ];

  return (
    <header className="border-b-2 border-dashed border-border/60 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {backHref && backLabel ? (
            <Link
              href={backHref}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{backLabel}</span>
            </Link>
          ) : null}
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="h-9 w-9 rounded-xl bg-violet-600 flex items-center justify-center sketch-border-sm rotate-[-2deg]">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight font-sketch">
              Ultimate Study
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          {/* XP pill — desktop */}
          {mounted && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono text-violet-400 mr-2">
              <Zap className="h-3 w-3" />
              {progress.xp} XP
            </div>
          )}

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={link.active ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-1.5 text-xs"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Button>
              </Link>
            ))}
          </nav>

          {/* Theme toggle — desktop */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex h-8 w-8 ml-1"
            onClick={toggle}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="sm:hidden h-9 w-9" />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex flex-col h-full">
                {/* XP pill — mobile */}
                {mounted && (
                  <div className="flex items-center gap-2 px-5 pt-5 pb-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-sm font-mono text-violet-400">
                      <Zap className="h-3.5 w-3.5" />
                      {progress.xp} XP
                    </div>
                  </div>
                )}

                {/* Nav links */}
                <nav className="flex flex-col gap-1 px-3 py-2">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                      <Button
                        variant={link.active ? "secondary" : "ghost"}
                        className="w-full justify-start gap-3 text-sm h-10"
                      >
                        {link.icon}
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                </nav>

                {/* Theme toggle — mobile */}
                <div className="mt-auto border-t border-border/40 p-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-sm h-10"
                    onClick={toggle}
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-4 w-4" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4" />
                        Dark Mode
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
