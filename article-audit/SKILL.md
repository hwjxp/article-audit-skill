---
name: article-audit
description: Extract and audit public-facing articles from WeChat, Xiaohongshu, Weibo, blogs, landing pages, screenshots, or image-heavy posts. Use when the user wants article extraction, OCR on visuals, text-image consistency review, logic review, rules/price/time checks, or person-role-text matching.
---

# Article Audit

## Overview

Use this skill when a user wants to review a public article or promo post for copy errors, logic issues, factual inconsistencies, or image-text mismatches.

It is especially useful for WeChat public articles and other image-heavy pages where the text lives inside posters rather than HTML.

## Quick Start

1. Extract the page.
   - Start with a direct fetch if the page is stable and readable.
   - If the page is blocked, lazy-loaded, or mostly images, switch to browser automation or use `scripts/capture_article.js`.
2. Save the audit artifacts.
   - Keep the page text, image manifest, downloaded images, and a full-page screenshot.
3. OCR the visuals.
   - On macOS, prefer `scripts/ocr_apple_vision.swift`.
   - Build a visual overview with `scripts/build_contact_sheet.py`.
4. Review in layers.
   - First find hard errors: wrong year, title mismatch, price conflict, wrong units, broken dates, typo.
   - Then review deeper logic: whether claims, rules, and visuals are internally consistent.
   - Finally review cross-modal consistency: whether people, roles, product variants, and image labels actually match.

## Workflow

### 1. Decide the extraction path

- Plain HTML article or blog: start with a direct fetch.
- WeChat public article, gated page, or image-heavy promo: use browser automation or `scripts/capture_article.js`.
- Screenshot or exported image set: skip page fetch and go directly to OCR plus visual review.

For WeChat public articles:

- If the raw URL returns a verification page or incomplete HTML, open the real page in a local browser context.
- Extract title, publish time, visible body text, and image URLs.
- Prefer `data-src` over placeholder `src` for lazy-loaded images.
- Download the images and review them directly, because many WeChat promo posts encode the real content as posters.

See `references/platform-extraction.md` for platform-specific tactics.

### 2. Capture reusable artifacts

When the article is important or image-heavy, keep these artifacts:

- `metadata.json` or equivalent structured page dump
- `text.txt` with body text
- full-page screenshot
- downloaded images
- contact sheet for quick scanning
- OCR output for text-dense visuals

Recommended commands:

```bash
node article-audit/scripts/capture_article.js "<url>" "./output/article-audit/run-001"
python3 article-audit/scripts/build_contact_sheet.py "./output/article-audit/run-001/images"
swift article-audit/scripts/ocr_apple_vision.swift "./output/article-audit/run-001/images"
```

### 3. Run OCR only where it adds value

Do not OCR every image blindly. Prioritize:

- price/spec tables
- giveaway rules
- QR poster instructions
- actor/character match boards
- comparison charts
- claim-heavy banners

If the OCR output is noisy, zoom into the suspect image and verify manually before calling it an error.

### 4. Review order

Review in this order so the highest-signal issues surface first:

1. Title, product, and variant alignment
2. Dates, prices, quantities, odds, and units
3. Rules, eligibility, and action instructions
4. Internal logic and contradiction checks
5. Image-text consistency
6. Person, role, and label matching

## Review Checklist

### A. Text correctness

Look for:

- typos
- malformed punctuation
- mixed terms that should be consistent
- accidental template carry-over from another campaign

### B. Structured data consistency

Check whether the same field agrees everywhere:

- year
- product name
- edition or variant
- release time
- giveaway time
- price
- pack, box, carton counts
- limited quantity
- material, size, and dimensions

### C. Content logic and reasonableness

Look for:

- instructions the user cannot actually follow
- objects that are referenced incorrectly, such as asking the user to “keep the article for 3 days” when they can only keep a Moments post
- table rows that conflict with odds or volume
- giveaway or sales rules that reference the wrong platform
- claims whose scope does not match the article title

### D. Text-image consistency

Compare:

- article title vs hero poster
- body claims vs price/spec chart
- product variant vs pictured packaging
- CTA wording vs the platform shown in the image
- promo images vs item names in purchase posters

### E. Person, role, and label matching

When a visual claims that a person is a specific role or actor, verify:

- the actor name matches the character name
- the photo appears to match the named person
- the card label matches the portrait shown
- repeated names or roles are not swapped across adjacent cards

If the match is uncertain, report it as a suspected mismatch rather than a confirmed error.

See `references/review-rules.md` for a deeper rubric.

## Output Requirements

Findings come first. For each finding, include:

- severity: `confirmed` or `suspected`
- location: title, body, image filename, or chart section
- issue: what is wrong
- evidence: the conflicting text or visual cue
- suggested fix: the most likely corrected wording

If no clear issue is found, say that explicitly and mention any residual risk, such as low-resolution text, unverifiable role-photo matches, or inaccessible source context.

## Resources

- `scripts/capture_article.js`: browser-based article capture and image download
- `scripts/build_contact_sheet.py`: image overview for fast visual scanning
- `scripts/ocr_apple_vision.swift`: OCR on macOS using Apple Vision
- `references/platform-extraction.md`: WeChat and other platform extraction methods
- `references/review-rules.md`: deeper review rubric and mismatch heuristics
