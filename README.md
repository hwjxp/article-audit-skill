# article-audit-skill

An open-source Codex skill for extracting public articles, running OCR on visual assets, and auditing text, logic, and text-image consistency.

## What it covers

- WeChat public articles and other image-heavy campaign posts
- OCR for posters, pricing tables, giveaway rules, and CTA cards
- Review rules for copy, numbers, logic, and internal consistency
- Cross-modal checks such as person-role-text matching and variant-image mismatches

## Repo layout

```text
article-audit/
  SKILL.md
  agents/openai.yaml
  scripts/
  references/
```

## Helper scripts

- `article-audit/scripts/capture_article.js`
- `article-audit/scripts/build_contact_sheet.py`
- `article-audit/scripts/ocr_apple_vision.swift`

## Install

1. Copy the `article-audit/` folder into your Codex skills directory.
2. Install the helper dependencies if you want the bundled extraction script:

```bash
npm install
python3 -m pip install pillow
```

## Example

```bash
node article-audit/scripts/capture_article.js "https://mp.weixin.qq.com/..."
python3 article-audit/scripts/build_contact_sheet.py "./output/article-audit/run/images"
swift article-audit/scripts/ocr_apple_vision.swift "./output/article-audit/run/images"
```
