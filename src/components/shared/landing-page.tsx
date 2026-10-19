"use client";

import { HubHome } from "@/components/hub/hub-home";

// Shown on "/" to visitors who have not paid (see src/app/page.tsx).
// The public site has its own header, phone menu and footer, so the app's
// shared <Header /> is not rendered here.
export function LandingPage() {
  return <HubHome />;
}
