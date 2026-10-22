# byducanh. — Portfolio

Minimal dark portfolio for Đức Anh, focused on AI Engineering, DevOps / Infrastructure, and Frontend Engineering.

## Requirements

- Node.js 20.9+
- npm

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Before publishing

1. Replace the sample projects in `app/page.tsx` with real projects, repository URLs, screenshots, outcomes, and metrics.
2. Update the GitHub and LinkedIn profile links in the footer.
3. Replace `hello@byducanh.id.vn` if you want to use a different contact address. Create that mailbox or configure forwarding separately.
4. Verify the domain and DNS records at your domain provider. Configure HTTPS through your hosting provider.
5. Run `npm run build` and fix any warnings before deployment.

## Deploy

Recommended simple route: push this repository to GitHub, import it into Vercel, then add `byducanh.id.vn` in the project's domain settings. Follow the DNS records Vercel gives you; do not guess A/CNAME records. Wait for domain verification and TLS provisioning.

## Notes

- Built with Next.js App Router, React, TypeScript, and custom CSS.
- Project content is clearly marked as placeholder content. Do not present sample projects as real work.
- Fonts are loaded from Google Fonts; a system-font fallback is configured.


## Interaction features

- Sticky blurred header with larger navigation targets.
- Inter and Plus Jakarta Sans typography; no DM Mono/monospace font.
- Scroll-triggered reveal animations with reduced-motion support.
- Optional subtle UI sound effects (off by default).
- Optional YouTube background music toggle for “Color Your Night”.

### Audio behavior

Browsers generally block autoplay with sound before a user gesture. Music therefore starts only after the visitor presses **PLAY MUSIC**; this is intentional for accessibility and browser-policy compliance. Interface sound effects are independently opt-in with **SFX ON/OFF**.

### About earshot

`Leonxlnx/earshot` is a Python toolkit for analysing and generating sound for coding agents, not a React/Next.js UI package. Do not add it as a browser dependency. If desired, use it locally during development to evaluate exported SFX assets; this starter uses tiny Web Audio tones for optional UI feedback and does not ship earshot or its ML models to visitors.
