"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap, BookOpen, Trophy, Target, Brain, Flame,
  CheckCircle, ArrowRight, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const features = [
  {
    icon: <Target className="h-5 w-5 text-violet-400" />,
    title: "26-Week Roadmap",
    desc: "Structured path from AI foundations to Claude Certified Architect exam-ready.",
    color: "violet",
  },
  {
    icon: <Brain className="h-5 w-5 text-blue-400" />,
    title: "5 Domain Quizzes",
    desc: "Practice all Claude Certified Architect domains with real exam-style questions.",
    color: "blue",
  },
  {
    icon: <BookOpen className="h-5 w-5 text-emerald-400" />,
    title: "Practice Exam",
    desc: "30-question timed mock exam — weighted by domain, randomised every attempt.",
    color: "emerald",
  },
  {
    icon: <Zap className="h-5 w-5 text-amber-400" />,
    title: "XP & Levels",
    desc: "Earn XP for every resource, quiz, and check-in. Level up from Beginner to AI Master.",
    color: "amber",
  },
  {
    icon: <Trophy className="h-5 w-5 text-rose-400" />,
    title: "19 Badges",
    desc: "Unlock streak badges, knowledge badges, build badges, and milestone badges.",
    color: "rose",
  },
  {
    icon: <Flame className="h-5 w-5 text-orange-400" />,
    title: "Streak Tracking",
    desc: "Daily study streaks with XP multipliers — 1.5× at 7 days, 2× at 30 days.",
    color: "orange",
  },
];

const includes = [
  "200+ curated resources across 26 weeks",
  "Weekly check-ins with reflection prompts",
  "5 domain quizzes + full practice exam",
  "19 collectible badges + level system",
  "Architect's Playbook PDF (27 pages)",
  "Progress synced across devices",
  "Lifetime access — no subscription",
];

export function LandingPage() {
  return (
    <div className="min-h-screen notebook-bg flex flex-col">
      {/* Simple top bar */}
      <header className="border-b-2 border-dashed border-border/60 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-violet-600 flex items-center justify-center sketch-border-sm rotate-[-2deg]">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight font-sketch">Ultimate Study</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white text-sm gap-1.5">
                Get Started
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <motion.div variants={item}>
              <span className="sticker inline-flex items-center gap-1.5 text-xs mb-4">
                <Zap className="h-3 w-3" /> Claude Certified Architect Prep
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-4xl sm:text-6xl font-bold font-sketch leading-tight"
            >
              Master AI Engineering
              <br />
              <span className="text-violet-400">in 26 Weeks</span>
            </motion.h1>

            <motion.p variants={item} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A gamified study roadmap built around the Claude Certified Architect exam.
              Track progress, earn XP, take quizzes — and actually pass the certification.
            </motion.p>

            {/* Pricing */}
            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
            >
              <div className="sketch-card bg-card/60 px-6 py-3 rounded-2xl flex items-center gap-3">
                <span className="text-2xl font-bold font-mono text-emerald-400">₦20,000</span>
                <span className="text-muted-foreground text-sm">Nigerian</span>
                <span className="text-xs text-muted-foreground border-l border-border/40 pl-3">one-time</span>
              </div>
              <span className="text-muted-foreground text-sm hidden sm:block">or</span>
              <div className="sketch-card bg-card/60 px-6 py-3 rounded-2xl flex items-center gap-3">
                <Globe className="h-4 w-4 text-blue-400" />
                <span className="text-2xl font-bold font-mono text-blue-400">$15</span>
                <span className="text-muted-foreground text-sm">International</span>
                <span className="text-xs text-muted-foreground border-l border-border/40 pl-3">one-time</span>
              </div>
            </motion.div>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/signup">
                <Button className="bg-violet-600 hover:bg-violet-500 text-white gap-2 h-11 px-8 text-base">
                  <Zap className="h-4 w-4" />
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="h-11 px-8 text-base">
                  Already have an account? Sign In
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Stats strip */}
        <section className="border-y border-dashed border-border/40 bg-card/30 py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { label: "Weeks", value: "26" },
                { label: "Resources", value: "200+" },
                { label: "Badges", value: "19" },
                { label: "Exam Domains", value: "5" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold font-sketch text-violet-400">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold font-sketch text-center mb-10">
            Everything you need to pass the exam
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="sketch-card bg-card p-5 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{f.icon}</div>
                  <div>
                    <div className="font-semibold text-sm mb-1">{f.title}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{f.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What's included */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <div className="sketch-card bg-card p-8 rounded-2xl max-w-xl mx-auto">
            <h2 className="text-xl font-bold font-sketch text-center mb-6">What&apos;s included</h2>
            <ul className="space-y-3">
              {includes.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 space-y-3">
              <Link href="/signup">
                <Button className="w-full bg-violet-600 hover:bg-violet-500 text-white gap-2 h-11">
                  <Zap className="h-4 w-4" />
                  Get Lifetime Access
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground text-center">
                Pay once. No subscription. No renewal.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-dashed border-border/40 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Ultimate Study — Built for Claude Certified Architect prep
      </footer>
    </div>
  );
}
