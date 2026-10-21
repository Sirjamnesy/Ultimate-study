import Link from "next/link";
import { WekaroLogo } from "@/components/brand/wekaro-logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen notebook-bg flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 hover:opacity-80 transition-opacity">
        <WekaroLogo className="text-3xl" />
      </Link>
      {children}
    </div>
  );
}
