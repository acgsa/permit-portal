This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Pages Preview

**Open the live demo:** https://acgsa.github.io/permit-portal/

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Demo Mode For GitHub Pages

This repo supports two runtime modes from the same source code:

- Live mode: Next.js frontend + Python backend API
- Demo mode: static export with mock auth and mock API data

### Local demo build

```bash
DEMO_STATIC_EXPORT=true \
NEXT_PUBLIC_APP_MODE=demo \
NEXT_PUBLIC_API_URL=https://demo.invalid \
npm run build
```

Static output is generated in `out/`.

### GitHub Pages deployment

Use the workflow at `.github/workflows/pages-demo.yml` from repo root. It builds the `permit-portal` app in demo mode and deploys `permit-portal/out` to GitHub Pages.

### Environment variables

- `NEXT_PUBLIC_APP_MODE=demo` enables mock login/data adapters.
- `DEMO_STATIC_EXPORT=true` switches Next output to static export.
- `NEXT_PUBLIC_BASE_PATH` is set by CI for project Pages paths.

## Icon policy

- Use USDS icons first when an equivalent icon exists in our USDS icon collection.
- If an icon is not available in USDS, use Lucide via `lucide-react`.
- Prefer the shared `LucideIcon` wrapper in `src/components/LucideIcon.tsx` to keep sizing and stroke styles consistent.
