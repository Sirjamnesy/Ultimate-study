import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen notebook-bg flex items-center justify-center px-4">
      <div className="sketch-card bg-card p-8 sm:p-12 max-w-md w-full text-center relative">
        <div className="tape" />
        <div className="pt-4 space-y-4">
          <span className="text-6xl">📝</span>
          <h1 className="font-sketch text-4xl sm:text-5xl font-bold">
            404
          </h1>
          <p className="text-lg text-muted-foreground">
            This page seems to have wandered off the notebook...
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/">
              <Button className="gap-2 sketch-border-sm w-full sm:w-auto">
                <Home className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/roadmap">
              <Button variant="outline" className="gap-2 sketch-border-sm w-full sm:w-auto">
                <Search className="h-4 w-4" />
                View Roadmap
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
