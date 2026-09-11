"use client";

import { useEffect, useState } from "react";
import { Loader2, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

async function fetchPdfUrl(slug: string): Promise<{ url?: string; error?: string }> {
  try {
    const res = await fetch(`/api/library/${slug}/pdf`);
    const json = await res.json();
    if (!res.ok || !json.url) {
      return { error: json.error ?? "Could not load the PDF." };
    }
    return { url: json.url };
  } catch {
    return { error: "Network error loading the PDF." };
  }
}

export function PdfViewer({ slug }: { slug: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchPdfUrl(slug).then((result) => {
      if (cancelled) return;
      setUrl(result.url ?? null);
      setError(result.error ?? null);
    });
    return () => { cancelled = true; };
  }, [slug, retryKey]);

  if (error) {
    return (
      <div className="sketch-card bg-card p-8 rounded-2xl text-center">
        <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button size="sm" variant="outline" onClick={() => setRetryKey((k) => k + 1)}>
          Try again
        </Button>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="sketch-card bg-card p-16 rounded-2xl flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <a href={url} download>
          <Button size="sm" variant="outline" className="gap-1.5">
            <Download className="h-3.5 w-3.5" /> Download
          </Button>
        </a>
      </div>
      <div className="sketch-card bg-card rounded-2xl overflow-hidden">
        {/* Signed URL expires in 10 min — the Try again path (triggered on
            error) fetches a fresh one via retryKey. */}
        <iframe src={url} title="PDF" className="w-full h-[75vh]" />
      </div>
    </div>
  );
}
