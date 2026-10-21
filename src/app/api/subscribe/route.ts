import { NextRequest, NextResponse } from "next/server";
import { getCourse } from "@/lib/data/courses";
import { addEmailSignup } from "@/lib/supabase/signups";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** newsletter, free-chapter, or notify:<course slug> for a course that exists. */
function isKnownList(list: string): boolean {
  if (list === "newsletter" || list === "free-chapter") return true;
  return list.startsWith("notify:") && !!getCourse(list.slice("notify:".length));
}

export async function POST(request: NextRequest) {
  try {
    const { email, list } = await request.json();
    const clean = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!clean || clean.length > 254 || !EMAIL.test(clean)) {
      return NextResponse.json({ success: false, error: "Enter a valid email address." }, { status: 400 });
    }
    if (typeof list !== "string" || !isKnownList(list)) {
      return NextResponse.json({ success: false, error: "Unknown list." }, { status: 400 });
    }

    const ok = await addEmailSignup(clean, list);
    if (!ok) {
      return NextResponse.json({ success: false, error: "Server error." }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[subscribe]", err);
    return NextResponse.json({ success: false, error: "Server error." }, { status: 500 });
  }
}
