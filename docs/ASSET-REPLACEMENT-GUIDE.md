# Asset Replacement Guide for Design Team

> This document lists every illustration, image, and logo used on the Upscalix landing page, along with the required specs for final production assets.

---

## General Requirements

| Property | Requirement |
|---|---|
| **File format** | PNG with transparent background (preferred) or WebP |
| **Color profile** | sRGB |
| **Resolution** | 2x (retina) — dimensions listed below are the **actual file sizes** at 2x. The site renders them at roughly half these dimensions. |
| **Naming** | Keep exact filenames listed below. Drop replacements into `public/illustrations/` (or `public/` for the logo). |
| **Optimization** | Run through TinyPNG / Squoosh before committing. Target < 200 KB per file where possible. |

---

## 1. Company Logo

| | |
|---|---|
| **File** | `public/logo.webp` |
| **Current size** | 237 × 60 px |
| **Required size** | **474 × 120 px** (2x retina) — or provide an SVG for perfect scaling |
| **Format** | WebP or SVG (SVG preferred for logos) |
| **Background** | Transparent |
| **Used in** | Top-left of page (rendered at ~130 × 34 px) |

---

## 2. Hero Section — Developer Characters

Two character illustrations flanking the hero text. They need **transparent backgrounds** and should be cropped tightly to the character.

| Asset | File | Current Size | Required Size | Display Size | Notes |
|---|---|---|---|---|---|
| Left character | `public/illustrations/team-male.png` | 1181 × 1023 px | **1200 × 1200 px** (square canvas) | 300–480 px wide | Full-body developer character, facing right |
| Right character | `public/illustrations/team-male-2.png` | 1326 × 1021 px | **1200 × 1200 px** (square canvas) | 300–480 px wide | Full-body developer character, facing left |

---

## 3. Pain Points Section — 4 Icons

Square illustrations for the "pain point" cards. Tall portrait orientation.

| Asset | File | Current Size | Required Size | Notes |
|---|---|---|---|---|
| Time/clock | `public/illustrations/pain-time.png` | 1024 × 1536 px | **1024 × 1536 px** (keep ratio) | Represents wasted time / slow hiring |
| Money | `public/illustrations/pain-money.png` | 1024 × 1536 px | **1024 × 1536 px** | Represents high cost |
| Puzzle | `public/illustrations/pain-puzzle.png` | 1024 × 1536 px | **1024 × 1536 px** | Represents complexity / poor integration |
| Team | `public/illustrations/pain-team.png` | 1024 × 1536 px | **1024 × 1536 px** | Represents team scaling issues |

**Style note**: All four should share a consistent illustration style. Transparent background. Portrait 2:3 ratio.

---

## 4. Indonesia Map Section

| | |
|---|---|
| **File** | `public/illustrations/indonesia-map.png` |
| **Current size** | 1536 × 1024 px |
| **Required size** | **1536 × 1024 px** (landscape 3:2) |
| **Background** | Transparent |
| **Notes** | Stylized map of Indonesia. Rendered at ~80% of container width. |

---

## 5. Case Studies Section

### Monitor Mockup (shared across all 3 cards)

| | |
|---|---|
| **File** | `public/illustrations/case-study-monitor.png` |
| **Current size** | 1536 × 1024 px |
| **Required size** | **1600 × 1200 px** (landscape) |
| **Background** | Transparent |
| **Notes** | Desktop/monitor mockup showing an app dashboard. Displayed at max 400 px wide. Ideally provide 3 different screenshots — one per case study. |

### Company Logos (NEW — need to be created)

Three client company logos, one per case study card.

| Asset | File | Required Size | Format | Notes |
|---|---|---|---|---|
| Fintech client logo | `public/illustrations/case-study-logo-fintech.png` | **288 × 80 px** (2x) | PNG or SVG | Displayed at 144 × 40 px. Transparent bg. |
| Edtech client logo | `public/illustrations/case-study-logo-edtech.png` | **288 × 80 px** (2x) | PNG or SVG | Displayed at 144 × 40 px. Transparent bg. |
| Marketplace client logo | `public/illustrations/case-study-logo-marketplace.png` | **288 × 80 px** (2x) | PNG or SVG | Displayed at 144 × 40 px. Transparent bg. |

---

## 6. Testimonials / Partner Section — Avatar

| | |
|---|---|
| **File** | `public/illustrations/hero-avatar.png` |
| **Current size** | 800 × 800 px |
| **Required size** | **800 × 800 px** (square) |
| **Background** | Transparent |
| **Notes** | Used in partner recommendations and featured testimonial sections. Character/avatar illustration. Rendered at 220–320 px. |

---

## 7. Team Scales Section — Team Illustration

| | |
|---|---|
| **File** | `public/illustrations/hero-team.png` |
| **Current size** | 1536 × 1024 px |
| **Required size** | **1200 × 1200 px** (square canvas) |
| **Background** | Transparent |
| **Notes** | Group illustration of dev team. Rendered at 320–500 px wide. |

---

## 8. CTA Section — Lightning Illustration

| | |
|---|---|
| **File** | `public/illustrations/cta-lightning.png` |
| **Current size** | 1024 × 1536 px |
| **Required size** | **1024 × 1536 px** (portrait 2:3) |
| **Background** | Transparent |
| **Notes** | Used on both left and right sides of the CTA (right side is mirrored via CSS). Rendered at 240–400 px height. |

---

## Summary Checklist

| # | Asset | Status | Priority |
|---|---|---|---|
| 1 | `logo.webp` (or SVG) | Replace with final logo | High |
| 2 | `team-male.png` | Replace with branded character | High |
| 3 | `team-male-2.png` | Replace with branded character | High |
| 4 | `pain-time.png` | Replace with branded illustration | Medium |
| 5 | `pain-money.png` | Replace with branded illustration | Medium |
| 6 | `pain-puzzle.png` | Replace with branded illustration | Medium |
| 7 | `pain-team.png` | Replace with branded illustration | Medium |
| 8 | `indonesia-map.png` | Replace with branded map | Medium |
| 9 | `case-study-monitor.png` | Replace (ideally 3 variants) | Medium |
| 10 | `case-study-logo-fintech.png` | **NEW — Create** | High |
| 11 | `case-study-logo-edtech.png` | **NEW — Create** | High |
| 12 | `case-study-logo-marketplace.png` | **NEW — Create** | High |
| 13 | `hero-avatar.png` | Replace with real portrait/avatar | Medium |
| 14 | `hero-team.png` | Replace with branded team illustration | Low |
| 15 | `cta-lightning.png` | Replace with branded illustration | Low |

---

*Last updated: 2026-03-03*
