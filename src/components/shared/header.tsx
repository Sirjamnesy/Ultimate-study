"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Moon, Sun, Zap, Map, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/shared/theme-provider";
import { useProgress } from "@/components/shared/progress-provider";

export function Header() {
  const { theme, toggle } = useTheme();
  const { progress, mounted } = useProgress();
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isRoadmap = pathname === "/roadmap";
  const isWeekPage = pathname.startsWith("/roadmap/") && pathname !== "/roadmap";

  const backHref = isWeekPage ? "/roadmap" : isRoadmap ? "/" : null;
  const backLabel = isWeekPage ? "Roadmap" : isRoadmap ? "Home" : null;

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
          {/* XP pill */}
          {mounted && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono text-violet-400 mr-2">
              <Zap className="h-3 w-3" />
              {progress.xp} XP
            </div>
          )}

          <nav className="flex items-center gap-1">
            <Link href="/roadmap">
              <Button
                variant={isRoadmap || isWeekPage ? "secondary" : "ghost"}
                size="sm"
                className="gap-1.5 text-xs"
              >
                <Map className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Roadmap</span>
              </Button>
            </Link>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 ml-1"
            onClick={toggle}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
