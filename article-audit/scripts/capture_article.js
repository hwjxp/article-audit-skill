#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function safeName(input) {
  return input.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function extFromUrl(url, fallback = ".jpg") {
  try {
    const clean = url.split("#")[0].split("?")[0];
    const ext = path.extname(new URL(clean).pathname);
    if (ext && ext.length <= 6) return ext;
  } catch {}
  return fallback;
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const step = 800;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        total += step;
        const max = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight
        );
        if (window.scrollY + window.innerHeight >= max || total > 20000) {
          clearInterval(timer);
          resolve();
        }
      }, 250);
    });
    window.scrollTo(0, 0);
  });
}

async function launchBrowser() {
  try {
    return await chromium.launch({ headless: true, channel: "chrome" });
  } catch {
    return await chromium.launch({ headless: true });
  }
}

async function main() {
  const [, , url, outDirArg] = process.argv;
  if (!url) {
    console.error("Usage: node capture_article.js <url> [output-dir]");
    process.exit(1);
  }

  const outDir = path.resolve(outDirArg || "./output/article-audit/run");
  const imagesDir = path.join(outDir, "images");
  ensureDir(imagesDir);

  const browser = await launchBrowser();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
  });

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2500);
  await autoScroll(page);
  await page.waitForTimeout(1500);

  const payload = await page.evaluate(() => {
    const text = document.body ? document.body.innerText : "";
    const images = Array.from(document.images).map((img, i) => ({
      index: i,
      src: img.getAttribute("src"),
      dataSrc: img.getAttribute("data-src"),
      dataType: img.getAttribute("data-type"),
      currentSrc: img.currentSrc,
      alt: img.alt || "",
      width: img.naturalWidth,
      height: img.naturalHeight,
      className: img.className || "",
    }));

    return {
      title: document.title,
      url: location.href,
      text,
      images,
    };
  });

  fs.writeFileSync(
    path.join(outDir, "metadata.json"),
    JSON.stringify(payload, null, 2)
  );
  fs.writeFileSync(path.join(outDir, "text.txt"), `${payload.text}\n`);
  await page.screenshot({
    path: path.join(outDir, "full-page.png"),
    fullPage: true,
  });

  const manifest = [];
  const seen = new Set();

  for (const image of payload.images) {
    const rawUrl = image.dataSrc || image.currentSrc || image.src;
    if (!rawUrl || rawUrl.startsWith("data:")) continue;

    const normalized = rawUrl.startsWith("//") ? `https:${rawUrl}` : rawUrl;
    if (seen.has(normalized)) continue;
    seen.add(normalized);

    const ext = extFromUrl(normalized, image.dataType ? `.${image.dataType}` : ".jpg");
    const filename = `${String(image.index).padStart(2, "0")}${ext}`;
    const filePath = path.join(imagesDir, safeName(filename));

    try {
      const response = await fetch(normalized);
      if (!response.ok) {
        manifest.push({ ...image, downloadUrl: normalized, savedAs: null, status: response.status });
        continue;
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      manifest.push({ ...image, downloadUrl: normalized, savedAs: path.basename(filePath), status: response.status });
    } catch (error) {
      manifest.push({
        ...image,
        downloadUrl: normalized,
        savedAs: null,
        error: String(error),
      });
    }
  }

  fs.writeFileSync(
    path.join(outDir, "image-manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  await browser.close();

  console.log(
    JSON.stringify(
      {
        title: payload.title,
        url: payload.url,
        imageCount: payload.images.length,
        downloadedCount: manifest.filter((item) => item.savedAs).length,
        outDir,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
