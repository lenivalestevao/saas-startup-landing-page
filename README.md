# Flowly — SaaS Startup Landing Page

A free, responsive SaaS/startup landing page template built with plain HTML5, CSS3 and JavaScript — no framework required. Ready to download, customize and use for your own product.

![Preview](preview.png)

**[Live Demo](https://lenivalestevao.github.io/saas-startup-landing-page/)**

## Features

- Sticky header with mobile off-canvas navigation
- Hero section with animated mock-app preview
- Trusted-by logo strip
- Features grid (6 cards)
- Animated stats strip
- Pricing section with 3 plans and a working monthly/annual billing toggle
- Testimonials grid with star ratings
- FAQ accordion
- Final call-to-action section
- 4-column footer with social links
- Fully responsive: desktop, tablet and mobile breakpoints
- Zero dependencies — pure HTML, CSS and vanilla JavaScript

## Getting Started

1. Download or clone this repository
2. Open `index.html` in your browser — that's it, no build step required

## Customization

**Colors and theme** — all colors live as CSS custom properties at the top of `style.css`:

```css
:root {
  --primary: #6d5efc;
  --accent: #00c9a7;
  --ink: #0f1222;
  ...
}
```

**Content** — features, pricing plans, testimonials and FAQ items are plain JavaScript arrays at the top of `script.js`. Edit the arrays to change copy, prices or add/remove cards — the page re-renders automatically from the data.

## Project Structure

```
saas-startup-landing-page/
├── index.html   # Page structure
├── style.css    # Design system and responsive layout
├── script.js    # Data-driven rendering and interactivity
└── README.md
```

## License

MIT — free to use for personal or commercial projects.
