module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/series/1",
        "http://localhost:3000/profiles/malcolm",
        "http://localhost:3000/caption/s01e01-00-03.120",
      ],
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
        throttling: {
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      assertions: {
        // Performance budgets
        "first-contentful-paint": ["error", { maxNumericValue: 1800 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "first-meaningful-paint": ["error", { maxNumericValue: 2000 }],
        "speed-index": ["error", { maxNumericValue: 3000 }],
        "total-blocking-time": ["error", { maxNumericValue: 300 }],
        interactive: ["error", { maxNumericValue: 3800 }],

        // Bundle size budgets
        "total-byte-weight": ["error", { maxNumericValue: 500000 }],
        "uses-text-compression": "error",
        "uses-responsive-images": "error",
        "offscreen-images": "warn",
        "uses-optimized-images": "error",
        "uses-webp-images": "warn",
        "modern-image-formats": "warn",

        // Accessibility requirements
        accessibility: ["error", { minScore: 0.9 }],
        bypass: "error",
        "color-contrast": "error",
        "document-title": "error",
        "html-has-lang": "error",
        "html-lang-valid": "error",
        "image-alt": "error",
        label: "error",
        "link-name": "error",
        list: "error",
        listitem: "error",
        "meta-viewport": "error",

        // Best practices
        "errors-in-console": "warn",
        "no-vulnerable-libraries": "error",
        "js-libraries": "warn",
        "notification-on-start": "error",
        "geolocation-on-start": "error",
        "no-document-write": "error",

        // SEO requirements
        "meta-description": "error",
        "font-size": "error",
        "crawlable-anchors": "error",
        "is-crawlable": "error",
        "robots-txt": "error",
        canonical: "warn",
        "structured-data": "warn",

        // PWA features
        "service-worker": "warn",
        "installable-manifest": "warn",
        "apple-touch-icon": "warn",
        "splash-screen": "warn",
        "themed-omnibox": "warn",
        "content-width": "error",
        viewport: "error",
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
