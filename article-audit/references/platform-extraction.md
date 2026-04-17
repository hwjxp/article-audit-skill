# Platform Extraction

## Goal

Extract enough evidence to review the article, not just enough text to summarize it.

For promo posts, the most important facts often live in posters, spec tables, and CTA cards rather than HTML paragraphs.

## General Strategy

1. Try a static fetch.
2. If the page is blocked, incomplete, or image-heavy, switch to browser automation.
3. Save text, screenshots, image URLs, and downloaded media.
4. OCR only the images that carry claims or instructions.

## WeChat Public Articles

Common failure modes:

- verification or anti-bot page instead of the article
- preview links that expire
- lazy-loaded images with placeholder `src`
- very little HTML text because the real content is embedded inside posters

Recommended workflow:

1. Open the article in a local browser context.
2. Capture:
   - `document.title`
   - visible body text
   - publish time
   - `img[src]`
   - `img[data-src]`
3. Prefer `data-src` when present.
4. Download the images locally.
5. Build a contact sheet and inspect the high-density images individually.

High-value WeChat targets:

- hero banner
- pricing/spec chart
- probability or odds table
- giveaway rules
- sales channel list
- purchase or QR posters

## Xiaohongshu / RedNote

Common failure modes:

- content lives in screenshots rather than HTML
- comments or captions are accessible but the key claims are in image cards
- share pages may show a subset of the post

Recommended workflow:

1. Capture visible caption text.
2. Download all post images.
3. OCR image cards with lists, pricing, or step-by-step instructions.
4. Compare caption claims with the cards.

## Weibo

Common failure modes:

- shortened or partial text in the first fetch
- key promo facts embedded in long poster images

Recommended workflow:

1. Capture full post text if available.
2. Download attached images and long images.
3. Check whether hashtags, CTA, and poster content agree.

## Generic Landing Pages and Campaign Posts

Look for these signs that browser capture is required:

- skeleton loaders
- placeholder images
- data rendered after scroll
- chart text inside canvases or images
- modal-gated content

## Extraction Do and Don't

Do:

- keep raw manifests and screenshots
- preserve exact numbers and wording before normalizing
- download source images when possible

Don't:

- rely on OCR alone when the original text is visible elsewhere
- call a mismatch confirmed unless the source is readable enough
- treat placeholder `src` values as final media URLs when `data-src` exists
