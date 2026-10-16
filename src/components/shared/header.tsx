"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft, Moon, Sun, Zap, Map, BookOpen, Menu, User, ClipboardCheck, LogOut,
  ShoppingBag, Library, ShieldCheck, ChevronDown, LogIn, UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/shared/theme-provider";
import { useProgress } from "@/components/shared/progress-provider";
import { signOut } from "@/lib/auth/helpers";
import { UpdatesBadge } from "@/components/shared/updates-badge";

export function Header() {
  const { theme, toggle } = useTheme();
  const { progress, mounted, user, isAnonymous, isAdmin } = useProgress();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const signedIn = mounted && !!user && !isAnonymous;

  async function handleSignOut() {
    setOpen(false);
    await signOut();
    router.push("/");
    router.refresh();
  }

  const isRoadmap = pathname === "/roadmap";
  const isWeekPage = pathname.startsWith("/roadmap/") && pathname !== "/roadmap";
  const isQuizHub = pathname === "/quiz";
  const isQuizPage = pathname.startsWith("/quiz/") && pathname !== "/quiz";
  const isBadges = pathname === "/badges";
  const isProfile = pathname === "/profile";
  const isCheckIns = pathname === "/check-ins";
  const isShop = pathname.startsWith("/products");
  const isLibrary = pathname.startsWith("/library");
  const isAdminPage = pathname.startsWith("/admin");

  const backHref = isWeekPage ? "/roadmap" : isRoadmap ? "/" : isQuizPage ? "/quiz" : isQuizHub ? "/" : isBadges ? "/" : isProfile ? "/" : isCheckIns ? "/" : null;
  const backLabel = isWeekPage ? "Roadmap" : isRoadmap ? "Home" : isQuizPage ? "Quizzes" : isQuizHub ? "Home" : isBadges ? "Home" : isProfile ? "Home" : isCheckIns ? "Home" : null;

  const link = {
    roadmap: { href: "/roadmap", label: "Roadmap", icon: <Map className="h-4 w-4" />, active: isRoadmap || isWeekPage },
    quizzes: { href: "/quiz", label: "Quizzes", icon: <BookOpen className="h-4 w-4" />, active: isQuizHub || isQuizPage },
    checkIns: { href: "/check-ins", label: "Check-Ins", icon: <ClipboardCheck className="h-4 w-4" />, active: isCheckIns },
    shop: { href: "/products", label: "Shop", icon: <ShoppingBag className="h-4 w-4" />, active: isShop },
    library: { href: "/library", label: "My Library", icon: <Library className="h-4 w-4" />, active: isLibrary },
    profile: { href: "/profile", label: "Profile", icon: <User className="h-4 w-4" />, active: isProfile },
    admin: { href: "/admin", label: "Admin", icon: <ShieldCheck className="h-4 w-4" />, active: isAdminPage },
  };

  // Visible in the bar on desktop. Everything else lives in a dropdown.
  const studyLinks = [link.roadmap, link.quizzes, link.checkIns];

  // Same links, grouped, for the mobile sheet.
  const mobileGroups = [
    { label: "Study", links: studyLinks },
    { label: "Shop", links: [link.shop, link.library] },
    ...(signedIn ? [{ label: "Account", links: [link.profile, ...(isAdmin ? [link.admin] : [])] }] : []),
  ];

  const initial = user?.email?.[0]?.toUpperCase() ?? "?";
  const ThemeIcon = theme === "dark" ? Sun : Moon;
  const themeLabel = theme === "dark" ? "Light mode" : "Dark mode";

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
          {/* Updates badge — desktop */}
          <UpdatesBadge className="hidden sm:inline-flex" />

          {/* XP pill — desktop */}
          {mounted && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono text-violet-400 mx-1">
              <Zap className="h-3 w-3" />
              {progress.xp} XP
            </div>
          )}

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {studyLinks.map((l) => (
              <Link key={l.href} href={l.href}>
                <Button variant={l.active ? "secondary" : "ghost"} size="sm" className="gap-1.5 text-xs">
                  {l.icon}
                  <span>{l.label}</span>
                </Button>
              </Link>
            ))}

            {/* Shop dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant={isShop || isLibrary ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-1.5 text-xs"
                  />
                }
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Shop</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLinkItem render={<Link href={link.shop.href} />}>
                  {link.shop.icon}
                  Browse the shop
                </DropdownMenuLinkItem>
                <DropdownMenuLinkItem render={<Link href={link.library.href} />}>
                  {link.library.icon}
                  {link.library.label}
                </DropdownMenuLinkItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Account dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Account menu"
                render={
                  <Button
                    variant={isProfile || isAdminPage ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-1.5 text-xs pl-1.5"
                  />
                }
              >
                <span className="h-5 w-5 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {signedIn ? initial : <User className="h-3 w-3" />}
                </span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {signedIn ? (
                  <>
                    <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                    <DropdownMenuLinkItem render={<Link href={link.profile.href} />}>
                      {link.profile.icon}
                      Profile
                    </DropdownMenuLinkItem>
                    {isAdmin && (
                      <DropdownMenuLinkItem render={<Link href={link.admin.href} />}>
                        {link.admin.icon}
                        Admin
                      </DropdownMenuLinkItem>
                    )}
                  </>
                ) : (
                  <>
                    <DropdownMenuLinkItem render={<Link href="/login" />}>
                      <LogIn />
                      Log in
                    </DropdownMenuLinkItem>
                    <DropdownMenuLinkItem render={<Link href="/signup" />}>
                      <UserPlus />
                      Sign up
                    </DropdownMenuLinkItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggle}>
                  <ThemeIcon />
                  {themeLabel}
                </DropdownMenuItem>
                {signedIn && (
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut />
                    Sign out
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

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
                {/* Theme toggle + XP pill — mobile top */}
                <div className="flex items-center justify-between pl-4 pr-12 pt-4 pb-3 border-b border-border/40">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggle} aria-label={themeLabel}>
                      <ThemeIcon className="h-4 w-4" />
                    </Button>
                    <UpdatesBadge />
                  </div>
                  {mounted && (
                    <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-sm font-mono text-violet-400">
                      <Zap className="h-3.5 w-3.5" />
                      {progress.xp} XP
                    </div>
                  )}
                </div>

                {/* Grouped nav links */}
                <nav className="flex flex-col gap-3 px-3 py-3 overflow-y-auto">
                  {mobileGroups.map((group) => (
                    <div key={group.label} className="flex flex-col gap-1">
                      <p className="px-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {group.label}
                      </p>
                      {group.links.map((l) => (
                        <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                          <Button
                            variant={l.active ? "secondary" : "ghost"}
                            className="w-full justify-start gap-3 text-sm h-10"
                          >
                            {l.icon}
                            {l.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  ))}
                </nav>

                {/* Account footer — mobile */}
                <div className="mt-auto px-3 pb-4 border-t border-border/40 pt-3">
                  {signedIn ? (
                    <>
                      <div className="px-2 pb-2 text-xs text-muted-foreground truncate">{user?.email}</div>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-sm h-10 text-muted-foreground hover:text-foreground"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <Link href="/login" onClick={() => setOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-3 text-sm h-10">
                          <LogIn className="h-4 w-4" />
                          Log in
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-3 text-sm h-10">
                          <UserPlus className="h-4 w-4" />
                          Sign up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
