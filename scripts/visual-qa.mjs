import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseUrl = "http://localhost:3000";
const outputDir = path.resolve("qa-screenshots");
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

async function waitForMotionFrame(page) {
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function readImageScale(page, scrollTop) {
  await page.evaluate((top) => {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, top);
  }, scrollTop);
  await waitForMotionFrame(page);
  return page.locator(".introduction__image-frame").evaluate((element) => {
    const frame = element.getBoundingClientRect();
    const clippingFrame = element.parentElement.getBoundingClientRect();
    return frame.width / clippingFrame.width;
  });
}

let browser;

try {
  await mkdir(outputDir, { recursive: true });
  browser = await chromium.launch({ headless: true });

  for (const locale of ["en", "id"]) {
    for (const viewport of viewports) {
      const page = await browser.newPage({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
      });

      try {
        const response = await page.goto(`${baseUrl}/${locale}`, {
          waitUntil: "networkidle",
          timeout: 30_000,
        });

        if (!response?.ok()) {
          throw new Error(`GET ${baseUrl}/${locale} returned HTTP ${response?.status() ?? "no response"}`);
        }

        await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });

        await page.evaluate(async () => {
          await document.fonts.ready;
          const images = [...document.images];
          images.forEach((image) => { image.loading = "eager"; });
          await Promise.all(images.map(async (image) => {
            if (!image.complete) {
              await new Promise((resolve, reject) => {
                image.addEventListener("load", resolve, { once: true });
                image.addEventListener("error", () => reject(new Error(`Image failed: ${image.currentSrc || image.src}`)), { once: true });
              });
            }
            if (!image.naturalWidth) {
              throw new Error(`Image failed: ${image.currentSrc || image.src}`);
            }
            await image.decode();
          }));
        });

        await page.locator(".services__heading").scrollIntoViewIfNeeded();
        await page.waitForTimeout(80);
        const serviceRevealScheduled = await page.locator(".services__word").first().evaluate((word) => word.getAnimations().length > 0);
        if (!serviceRevealScheduled) {
          throw new Error(`Services heading reveal was not scheduled at ${locale}/${viewport.name}`);
        }
        await page.waitForTimeout(3_400);
        const serviceRevealComplete = await page.locator(".services__word").evaluateAll((words) =>
          words.every((word) => Number(getComputedStyle(word).opacity) > 0.99),
        );
        if (!serviceRevealComplete) {
          throw new Error(`Services heading reveal did not finish at ${locale}/${viewport.name}`);
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await waitForMotionFrame(page);

        const geometry = await page.evaluate(() => {
          const box = (selector) => {
            const element = document.querySelector(selector);
            if (!element) return null;
            const { x, y, width, height } = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return {
              x: Math.round(x),
              y: Math.round(y),
              width: Math.round(width),
              height: Math.round(height),
              fontSize: style.fontSize,
              lineHeight: style.lineHeight,
            };
          };

          const layout = () => ({
            innerWidth: window.innerWidth,
            documentWidth: document.documentElement.clientWidth,
            documentScrollWidth: document.documentElement.scrollWidth,
            body: box("body"),
            main: box("main"),
            stage: box(".navigation-stage"),
            hero: box(".hero"),
            introduction: box("#introduction"),
            services: box("#services"),
          });
          const current = layout();
          const originalGutter = document.documentElement.style.scrollbarGutter;
          document.documentElement.style.scrollbarGutter = "auto";
          const withoutStableGutter = layout();
          document.documentElement.style.scrollbarGutter = originalGutter;

          return {
            current,
            withoutStableGutter,
            overflowElements: [...document.querySelectorAll("body *")]
              .map((element) => ({
                selector: element.tagName.toLowerCase() + (element.className && typeof element.className === "string" ? `.${element.className.trim().replace(/\s+/g, ".")}` : ""),
                rect: element.getBoundingClientRect(),
              }))
              .filter(({ rect }) => rect.right > window.innerWidth + 1)
              .slice(0, 8)
              .map(({ selector, rect }) => ({ selector, left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) })),
            heading: box(".introduction__heading"),
            body: box(
              matchMedia("(max-width: 480px)").matches
                ? ".introduction__body--mobile"
                : matchMedia("(max-width: 900px)").matches
                  ? ".introduction__body--tablet"
                  : ".introduction__body--desktop",
            ),
            image: box(".introduction__image"),
            serviceHeading: box(".services__heading"),
            serviceCards: [...document.querySelectorAll(".services__card")].map((element) => {
              const { x, y, width, height } = element.getBoundingClientRect();
              const image = element.querySelector("img");
              const imageBox = image.getBoundingClientRect();
              return {
                x: Math.round(x), y: Math.round(y),
                width: Math.round(width), height: Math.round(height),
                imageWidth: Math.round(imageBox.width), imageHeight: Math.round(imageBox.height),
              };
            }),
            annotation: box(".introduction__annotation"),
            cta: box(".introduction__cta"),
          };
        });

        if (geometry.current.documentScrollWidth > viewport.width) {
          throw new Error(`Horizontal overflow at ${locale}/${viewport.name}: ${geometry.current.documentScrollWidth}px (${JSON.stringify(geometry.overflowElements)})`);
        }
        if (geometry.serviceCards.length !== 4 || geometry.current.introduction.y + geometry.current.introduction.height > geometry.current.services.y) {
          throw new Error(`Services count/section order check failed at ${locale}/${viewport.name}`);
        }
        if (viewport.width >= 1200 && geometry.serviceCards.some((card) => card.width !== 600 || card.height !== 220 || card.imageWidth !== 226 || card.imageHeight !== 172)) {
          throw new Error(`Desktop Services card geometry mismatch at ${locale}: ${JSON.stringify(geometry.serviceCards)}`);
        }
        if (viewport.width > 480 && viewport.width <= 1100 && geometry.serviceCards.some((card) => card.width !== 344 || card.height !== 140 || card.imageWidth !== 0)) {
          throw new Error(`Tablet Services card geometry mismatch at ${locale}: ${JSON.stringify(geometry.serviceCards)}`);
        }
        if (viewport.width <= 480 && geometry.serviceCards.some((card) => card.width !== 350 || card.imageWidth !== 0)) {
          throw new Error(`Mobile Services card geometry mismatch at ${locale}: ${JSON.stringify(geometry.serviceCards)}`);
        }

        const screenshotPath = path.join(
          outputDir,
          `${locale}-${viewport.name}-${viewport.width}x${viewport.height}.png`,
        );

        await page.screenshot({ path: screenshotPath, fullPage: true, animations: "disabled" });
        console.log(`Saved ${screenshotPath}: cards=${geometry.serviceCards.map(({ width, height, imageWidth, imageHeight }) => `${width}x${height}/${imageWidth}x${imageHeight}`).join(",")}; horizontalOverflow=${geometry.current.documentScrollWidth > viewport.width}`);

        const imagePosition = await page.locator(".introduction__image").evaluate((element) => {
          const rect = element.getBoundingClientRect();
          return { top: rect.top + window.scrollY, height: rect.height };
        });
        const viewportHeight = viewport.height;
        const startScroll = Math.max(0, imagePosition.top - viewportHeight);
        const middleScroll = startScroll + (viewportHeight + imagePosition.height) / 2;
        const endScroll = imagePosition.top + imagePosition.height;
        const initialScale = await readImageScale(page, 0);
        const middleScale = await readImageScale(page, middleScroll);
        const endScale = await readImageScale(page, endScroll);
        const reverseScale = await readImageScale(page, middleScroll);
        const clipped = await page.locator(".introduction__image").evaluate((element) => {
          const { overflowX, overflowY } = getComputedStyle(element);
          return overflowX === "hidden" && overflowY === "hidden";
        });

        if (initialScale > 1.005 || endScale < 1.095 || Math.abs(middleScale - reverseScale) > 0.01 || !clipped) {
          throw new Error(`Scroll zoom check failed at ${locale}/${viewport.name}: ${JSON.stringify({ initialScale, middleScale, endScale, reverseScale, clipped })}`);
        }

        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.reload({ waitUntil: "networkidle", timeout: 30_000 });
        await page.locator(".services__heading").scrollIntoViewIfNeeded();
        await page.waitForTimeout(100);
        const reducedHeadingVisible = await page.locator(".services__word").evaluateAll((words) =>
          words.every((word) => Number(getComputedStyle(word).opacity) > 0.99),
        );
        if (!reducedHeadingVisible) {
          throw new Error(`Reduced-motion Services heading is hidden at ${locale}/${viewport.name}`);
        }
        const reducedImagePosition = await page.locator(".introduction__image").evaluate((element) => {
          const rect = element.getBoundingClientRect();
          return { top: rect.top + window.scrollY, height: rect.height };
        });
        const reducedMiddleScroll = Math.max(0, reducedImagePosition.top - viewportHeight)
          + (viewportHeight + reducedImagePosition.height) / 2;
        const reducedScale = await readImageScale(page, reducedMiddleScroll);

        if (Math.abs(reducedScale - 1) > 0.005) {
          throw new Error(`Reduced-motion check failed at ${locale}/${viewport.name}: scale=${reducedScale}`);
        }

        console.log(`Scroll QA ${locale}/${viewport.name}: ${JSON.stringify({ initialScale, middleScale, endScale, reverseScale, reducedScale, clipped })}`);
      } finally {
        await page.close();
      }
    }
  }
} catch (error) {
  console.error("Visual QA failed:");
  console.error(error?.stack ?? error);
  process.exitCode = 1;
} finally {
  await browser?.close();
}
