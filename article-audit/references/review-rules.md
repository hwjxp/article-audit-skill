# Review Rules

## Review Layers

## 1. Mechanical correctness

Check for:

- typos
- repeated words
- punctuation anomalies
- inconsistent capitalization
- malformed units, dates, and ratios

## 2. Consistency across surfaces

Verify the same field across title, body, charts, and posters:

- product name
- variant name
- year
- release window
- price
- quantity
- odds
- edition count
- size and material

Template reuse errors often show up here, especially in pricing tables and product cards.

## 3. Actionability and logic

Ask:

- Can the user actually do what the article asks?
- Does each instruction refer to the correct platform or object?
- Are prerequisites stated in the right order?
- Do dates and deadlines make sense together?
- Does a “special edition” article accidentally advertise a broader scope than the title?

## 4. Compliance-style clarity

Flag wording that is technically understandable but operationally risky:

- vague eligibility
- unclear prize confirmation steps
- missing timing assumptions
- instructions that are easy to misinterpret

## 5. Image-text matching

When reviewing a visual asset:

- Does the headline match the image content?
- Does the pictured product match the named variant?
- Does the CTA match the actual purchase method shown?
- Do table labels match the row values beneath them?

## 6. Person-role-text matching

Use this when the article names actors, characters, speakers, or illustrated personas.

Check:

- actor name -> character name
- portrait -> named actor
- portrait -> named character
- card title -> visible face
- repeated series labels -> correct examples

Common mismatch patterns:

- adjacent cards swapped
- English name correct but Chinese role wrong
- role correct but actor photo wrong
- one card in a grid mislabeled while the rest are correct

## Severity Guidance

Use `confirmed` when:

- the source text is readable
- two surfaces directly contradict each other
- the error is explicit, such as the wrong product family in a title

Use `suspected` when:

- the image is low resolution
- OCR is noisy
- the role-photo mismatch depends on uncertain face recognition
- the issue may be a deliberate business rule that needs source-of-truth confirmation

## Suggested Fix Style

Prefer exact replacement text when possible.

Examples:

- `活动页` -> `活页`
- `微信小程序搜索公众号` -> `微信搜索公众号` or `微信小程序搜索`
- `保留公众号文章3天` -> `保留该朋友圈内容3天`

## Recommended Deliverable

Use this format in reviews:

```text
1. Confirmed | image 15.jpg | Wrong product family in pricing chart
Evidence: Title says “2025 ... DC系列 ...” while the subheading and article title are for 2026 Harry Potter BLASTER.
Suggested fix: Replace the top title with “2026 KAKAWOW AURA 哈利波特25周年官方收藏卡-BLASTER”.
```
