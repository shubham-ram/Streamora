"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection, CategoriesSection } from "@/components/home";
import { StreamCard } from "@/components/stream-card";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Palette,
  Copy,
  Check,
} from "lucide-react";

/* ─── Variable definitions grouped by category ────────────────────────── */
interface ThemeVar {
  cssVar: string;
  label: string;
}

interface ThemeGroup {
  name: string;
  vars: ThemeVar[];
}

const THEME_GROUPS: ThemeGroup[] = [
  {
    name: "Page",
    vars: [{ cssVar: "--page-bg", label: "Background" }],
  },
  {
    name: "Brand",
    vars: [
      { cssVar: "--brand-primary", label: "Primary" },
      { cssVar: "--brand-primary-light", label: "Primary Light" },
      { cssVar: "--brand-primary-dark", label: "Primary Dark" },
      { cssVar: "--brand-secondary", label: "Secondary" },
      { cssVar: "--brand-secondary-light", label: "Secondary Light" },
      { cssVar: "--brand-accent", label: "Accent" },
    ],
  },
  {
    name: "Surfaces",
    vars: [
      { cssVar: "--surface-primary", label: "Primary" },
      { cssVar: "--surface-secondary", label: "Secondary" },
      { cssVar: "--surface-tertiary", label: "Tertiary" },
    ],
  },
  {
    name: "Text",
    vars: [
      { cssVar: "--fg-primary", label: "Primary" },
      { cssVar: "--fg-secondary", label: "Secondary" },
      { cssVar: "--fg-muted", label: "Muted" },
      { cssVar: "--fg-subtle", label: "Subtle" },
    ],
  },
  {
    name: "Borders",
    vars: [
      { cssVar: "--border-main", label: "Main" },
      { cssVar: "--border-subtle", label: "Subtle" },
    ],
  },
  {
    name: "Status",
    vars: [
      { cssVar: "--status-live", label: "Live" },
      { cssVar: "--status-success", label: "Success" },
      { cssVar: "--status-warning", label: "Warning" },
    ],
  },
];

/* ─── oklch ↔ hex helpers ─────────────────────────────────────────────── */
function oklchToHex(oklch: string): string {
  // Parse oklch(L C H) or oklch(L C H / A) format
  const match = oklch.match(
    /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.%]+))?\s*\)/,
  );
  if (!match) return "#7c3aed"; // fallback purple

  const L = parseFloat(match[1]);
  const C = parseFloat(match[2]);
  const H = parseFloat(match[3]);

  // oklch → oklab
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);

  // oklab → linear sRGB
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  let r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  // gamma
  const gamma = (x: number) =>
    x >= 0.0031308 ? 1.055 * Math.pow(x, 1.0 / 2.4) - 0.055 : 12.92 * x;
  r = Math.round(Math.max(0, Math.min(1, gamma(r))) * 255);
  g = Math.round(Math.max(0, Math.min(1, gamma(g))) * 255);
  bl = Math.round(Math.max(0, Math.min(1, gamma(bl))) * 255);

  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`;
}

function hexToOklch(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  // sRGB → linear
  const linearize = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const rl = linearize(r);
  const gl = linearize(g);
  const bl = linearize(b);

  // linear sRGB → LMS
  const l = Math.cbrt(
    0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl,
  );
  const m = Math.cbrt(
    0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl,
  );
  const s = Math.cbrt(
    0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl,
  );

  // LMS → oklab
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bk = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  // oklab → oklch
  const C = Math.sqrt(a * a + bk * bk);
  let H = (Math.atan2(bk, a) * 180) / Math.PI;
  if (H < 0) H += 360;

  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(3)})`;
}

/* ─── Fake stream data for preview ────────────────────────────────────── */
const FAKE_STREAMS = [
  {
    id: "1",
    title: "🎮 Late Night Gaming Marathon — Come Hang Out!",
    username: "ProGamer99",
    viewerCount: 1423,
    category: "Gaming",
    streamKey: "demo-1",
  },
  {
    id: "2",
    title: "Live Coding: Building a Streaming Platform",
    username: "CodeWithSara",
    viewerCount: 892,
    category: "Science & Tech",
    streamKey: "demo-2",
  },
  {
    id: "3",
    title: "Chill Beats & Art Stream 🎨",
    username: "ArtistJay",
    viewerCount: 317,
    category: "Art",
    streamKey: "demo-3",
  },
  {
    id: "4",
    title: "Just Chatting — AMA About Web Dev",
    username: "DevDan",
    viewerCount: 2105,
    category: "Just Chatting",
    streamKey: "demo-4",
  },
];

/* ─── Main Page ───────────────────────────────────────────────────────── */
export default function TestingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  // Read current CSS variable values on mount
  useEffect(() => {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    const initial: Record<string, string> = {};
    for (const group of THEME_GROUPS) {
      for (const v of group.vars) {
        const raw = style.getPropertyValue(v.cssVar).trim();
        initial[v.cssVar] = oklchToHex(raw);
      }
    }
    setValues(initial);
  }, []);

  // Apply a value change
  const handleChange = useCallback((cssVar: string, hex: string) => {
    setValues((prev) => ({ ...prev, [cssVar]: hex }));
    document.documentElement.style.setProperty(cssVar, hexToOklch(hex));
  }, []);

  // Reset all overrides
  const handleReset = useCallback(() => {
    const root = document.documentElement;
    for (const group of THEME_GROUPS) {
      for (const v of group.vars) {
        root.style.removeProperty(v.cssVar);
      }
    }
    // Re-read defaults
    const style = getComputedStyle(root);
    const fresh: Record<string, string> = {};
    for (const group of THEME_GROUPS) {
      for (const v of group.vars) {
        fresh[v.cssVar] = oklchToHex(style.getPropertyValue(v.cssVar).trim());
      }
    }
    setValues(fresh);
  }, []);

  // Copy current theme as CSS
  const handleCopy = useCallback(() => {
    const lines = THEME_GROUPS.flatMap((g) =>
      g.vars.map(
        (v) => `  ${v.cssVar}: ${hexToOklch(values[v.cssVar] || "#000000")};`,
      ),
    );
    const css = `:root {\n${lines.join("\n")}\n}`;
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [values]);

  return (
    <div className="min-h-screen bg-page-bg flex">
      {/* ── Collapsible Sidebar ────────────────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-surface-primary border-r border-border-main transition-all duration-300 flex flex-col ${sidebarOpen ? "w-72" : "w-0 overflow-hidden"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-main shrink-0">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-brand-primary" />
            <span className="text-fg-primary font-semibold text-sm">
              Theme Tester
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md hover:bg-surface-secondary text-fg-muted hover:text-fg-primary transition-colors"
              title="Copy theme as CSS"
            >
              {copied ? (
                <Check className="w-4 h-4 text-status-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-md hover:bg-surface-secondary text-fg-muted hover:text-fg-primary transition-colors"
              title="Reset to defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Variable Controls */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin">
          {THEME_GROUPS.map((group) => (
            <div key={group.name}>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted mb-2">
                {group.name}
              </h3>
              <div className="space-y-1.5">
                {group.vars.map((v) => (
                  <label
                    key={v.cssVar}
                    className="flex items-center gap-2 group cursor-pointer"
                  >
                    <input
                      type="color"
                      value={values[v.cssVar] || "#000000"}
                      onChange={(e) => handleChange(v.cssVar, e.target.value)}
                      className="w-7 h-7 rounded-md border border-border-subtle cursor-pointer bg-transparent appearance-none [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-none"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-fg-secondary group-hover:text-fg-primary transition-colors truncate block">
                        {v.label}
                      </span>
                    </div>
                    <code className="text-[10px] text-fg-subtle font-mono">
                      {values[v.cssVar] || ""}
                    </code>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Toggle button ──────────────────────────────────────────── */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed z-50 top-1/2 -translate-y-1/2 transition-all duration-300 ${sidebarOpen ? "left-72" : "left-0"} w-6 h-12 bg-surface-secondary border border-border-main rounded-r-lg flex items-center justify-center hover:bg-surface-tertiary text-fg-muted`}
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {/* ── Main Content ───────────────────────────────────────────── */}
      <main
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-0"}`}
      >
        <Navbar />
        <HeroSection />

        {/* Live streams preview with fake data */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-fg-primary flex items-center gap-2">
                <span className="w-3 h-3 bg-status-live rounded-full animate-pulse" />
                Live Now (Preview)
              </h2>
              <p className="text-fg-secondary mt-1">
                {FAKE_STREAMS.length} streams live
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {FAKE_STREAMS.map((stream) => (
              <StreamCard
                key={stream.id}
                id={stream.id}
                title={stream.title}
                username={stream.username}
                viewerCount={stream.viewerCount}
                category={stream.category}
                streamKey={stream.streamKey}
              />
            ))}
          </div>
        </section>

        <CategoriesSection />
        <Footer />
      </main>
    </div>
  );
}
