import Link from "next/link";
import { Zap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen notebook-bg flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2.5 mb-8 hover:opacity-80 transition-opacity">
        <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center sketch-border-sm rotate-[-2deg]">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight font-sketch">Ultimate Study</span>
      </Link>
      {children}
    </div>
  );
}
