# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Upscalix landing page built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

## Commands

- `pnpm dev` - Start development server (http://localhost:3000)
- `pnpm build` - Production build
- `pnpm lint` - Run ESLint (flat config with core-web-vitals + typescript rules)

## Tech Stack

- **Package manager**: pnpm (lockfile and workspace config present)
- **Framework**: Next.js 16.1.6 with App Router
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss` plugin (uses `@import "tailwindcss"` and `@theme inline` syntax, not the v3 `@tailwind` directives)
- **Fonts**: Geist Sans and Geist Mono loaded via `next/font/google`, exposed as CSS variables `--font-geist-sans` and `--font-geist-mono`
- **Path alias**: `@/*` maps to project root

## Architecture

- `app/layout.tsx` - Root layout with font setup and metadata
- `app/page.tsx` - Homepage (currently default Next.js starter)
- `app/globals.css` - Global styles with Tailwind v4 theme config, CSS custom properties for `--background`/`--foreground` with dark mode support
- `public/` - Static assets (SVGs)

## Notes

- This is a fresh `create-next-app` scaffold — page content still needs to be replaced with actual Upscalix landing page design
- No test framework is configured yet
- ESLint uses the flat config format (`eslint.config.mjs`)
