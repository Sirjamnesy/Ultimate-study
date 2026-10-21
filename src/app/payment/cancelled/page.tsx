"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen notebook-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="sketch-card bg-card p-8 rounded-2xl text-center">
          <div className="h-14 w-14 rounded-full bg-wk-orange/20 flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-wk-accent" />
          </div>
          <h1 className="text-xl font-bold font-sketch mb-2">No worries!</h1>
          <p className="text-sm text-muted-foreground mb-6">
            You cancelled the payment — that&apos;s totally fine. Your progress is safe and you can complete your purchase anytime.
          </p>
          <div className="space-y-3">
            <Link href="/checkout">
              <Button className="w-full bg-wk-orange hover:bg-wk-orange/90 text-black">
                Try Again
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full">
                Go Back
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
