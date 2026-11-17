import { copyFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseUrl = "http://localhost:3000";
const outputDir = path.resolve("qa-screenshots");
const recordingsDir = path.join(outputDir, "services-modal-recordings");
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];
const expectedImages = [
  "service-concept-creative-direction.png",
  "service-event-management.png",
  "service-technical-production.png",
  "service-stage-audiovisual.png",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

let browser;

try {
  await mkdir(outputDir, { recursive: true });
  await mkdir(recordingsDir, { recursive: true });
  browser = await chromium.launch({ headless: true });

  for (const locale of ["en", "id"]) {
    for (const viewport of viewports) {
      const page = await browser.newPage({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
        recordVideo: { dir: recordingsDir, size: { width: viewport.width, height: viewport.height } },
      });
      const recording = page.video();
      const response = await page.goto(`${baseUrl}/${locale}`, { waitUntil: "networkidle", timeout: 30_000 });
      assert(response?.ok(), `GET ${baseUrl}/${locale} failed (${response?.status() ?? "no response"})`);
      await page.evaluate(() => document.fonts.ready);
      await page.locator(".services__card-trigger").first().scrollIntoViewIfNeeded();

      for (let index = 0; index < 4; index += 1) {
        const trigger = page.locator(".services__card-trigger").nth(index);
        const expectedTitle = await trigger.locator("xpath=..").locator(".services__card-title").textContent();
        const expectedDescription = await trigger.locator("xpath=..").locator(".services__description--desktop").textContent();
        const sourceImage = trigger.locator("xpath=..").locator(".services__image img");
        if (viewport.width >= 1200) await sourceImage.evaluate((element) => element.decode());
        const sourceBox = viewport.width >= 1200 ? await trigger.locator("xpath=..").locator(".services__image").boundingBox() : null;
        await trigger.click();

        const dialog = page.locator(".services-detail[open]");
        const title = dialog.locator("#services-detail-title");
        await title.waitFor({ state: "visible" });
        const image = dialog.locator(".services-detail__image img");
        await image.waitFor({ state: "visible" });
        if (viewport.width >= 1200) {
          await page.waitForTimeout(90);
          const movingBox = await dialog.locator(".services-detail__image").boundingBox();
          const finalBox = await dialog.locator(".services-detail__media").boundingBox();
          assert(sourceBox && movingBox && finalBox && movingBox.width > sourceBox.width + 20 && movingBox.width < finalBox.width - 5,
            `${locale}/${viewport.name}: shared image did not expand continuously from the thumbnail`);
        }
        await page.waitForTimeout(500);
        assert((await title.textContent())?.trim() === expectedTitle?.trim(), `${locale}/${viewport.name}: wrong title for service ${index + 1}`);
        assert((await dialog.locator(".services-detail__number").textContent())?.trim() === `0${index + 1}`, `${locale}/${viewport.name}: wrong service number`);
        assert((await dialog.locator(".services-detail__label").textContent())?.trim() === (locale === "en" ? "OUR SERVICES" : "LAYANAN KAMI"), `${locale}/${viewport.name}: wrong localized label`);
        assert((await dialog.locator(".services-detail__description").textContent())?.trim() === expectedDescription?.trim(), `${locale}/${viewport.name}: wrong service description`);
        assert(await dialog.getAttribute("aria-modal") === "true", `${locale}/${viewport.name}: modal semantics missing`);
        assert(await dialog.locator(".services-detail__capabilities li").count() >= 3, `${locale}/${viewport.name}: capabilities missing`);
        const imageLoaded = await image.evaluate((element) => element.complete && element.naturalWidth > 0 && getComputedStyle(element).objectFit === "cover");
        assert(imageLoaded, `${locale}/${viewport.name}: service image not loaded/cropped`);
        assert(decodeURIComponent(await image.getAttribute("src") ?? "").includes(expectedImages[index]), `${locale}/${viewport.name}: wrong service image for card ${index + 1}`);
        if (viewport.width >= 1200) {
          const [sourceUrl, modalUrl] = await Promise.all([
            sourceImage.evaluate((element) => element.currentSrc),
            image.evaluate((element) => element.currentSrc),
          ]);
          assert(sourceUrl === modalUrl, `${locale}/${viewport.name}: shared image source changed during transition`);
        }
        assert((await dialog.locator(".services-detail__close").textContent())?.trim() === (locale === "en" ? "CLOSE" : "TUTUP"), `${locale}/${viewport.name}: close label not localized`);

        const panelBox = await dialog.locator(".services-detail__panel").boundingBox();
        assert(panelBox && panelBox.x >= 0 && panelBox.y >= 0 && panelBox.x + panelBox.width <= viewport.width + 1 && panelBox.y + panelBox.height <= viewport.height + 1, `${locale}/${viewport.name}: modal panel exceeds viewport`);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${locale}/${viewport.name}: modal causes horizontal overflow`);
        assert(await page.evaluate(() => document.activeElement?.classList.contains("services-detail__close")), `${locale}/${viewport.name}: focus did not enter modal`);

        if (index === 0) {
          const screenshotPath = path.join(outputDir, `services-modal-${locale}-${viewport.name}-${viewport.width}x${viewport.height}.png`);
          await page.screenshot({ path: screenshotPath, animations: "disabled" });
          console.log(`Saved ${screenshotPath}`);
          await dialog.locator(".services-detail__info h2").click();
          assert(await dialog.isVisible(), `${locale}/${viewport.name}: clicking modal content closed it`);

          const scrollBefore = await page.evaluate(() => window.scrollY);
          await page.mouse.move(4, 4);
          await page.mouse.wheel(0, 600);
          await page.waitForTimeout(80);
          assert(await page.evaluate(() => window.scrollY) === scrollBefore, `${locale}/${viewport.name}: background page scrolled under modal`);
        }

        if (index === 1) {
          await page.keyboard.press("Escape");
        } else if (index === 2) {
          await dialog.locator(".services-detail__backdrop").click({ position: { x: 2, y: 2 } });
        } else {
          await dialog.locator(".services-detail__close").click();
        }

        await page.waitForTimeout(500);
        assert(await page.locator(".services-detail[open]").count() === 0, `${locale}/${viewport.name}: close interaction failed for service ${index + 1}`);
        assert(await trigger.evaluate((element) => document.activeElement === element), `${locale}/${viewport.name}: focus did not return to service ${index + 1}`);
      }

      await page.close();
      if (recording) {
        const recordingPath = await recording.path();
        const outputPath = path.join(recordingsDir, `services-modal-${locale}-${viewport.name}.webm`);
        await copyFile(recordingPath, outputPath);
        await unlink(recordingPath);
        console.log(`Recorded ${outputPath}`);
      }
      console.log(`Passed ${locale}/${viewport.name} (${viewport.width}x${viewport.height})`);
    }
  }

  const reducedPage = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  await reducedPage.goto(`${baseUrl}/en`, { waitUntil: "networkidle" });
  await reducedPage.locator(".services__card-trigger").first().scrollIntoViewIfNeeded();
  await reducedPage.locator(".services__card-trigger").first().click();
  await reducedPage.locator(".services-detail__panel").waitFor({ state: "visible" });
  assert(await reducedPage.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches), "Reduced motion preference was not applied");
  const activeAnimationDurations = await reducedPage.locator(".services-detail__panel").evaluate((element) =>
    element.getAnimations().map((animation) => animation.effect?.getComputedTiming().duration ?? 0),
  );
  assert(activeAnimationDurations.every((duration) => duration <= 1), `Reduced motion still animates: ${activeAnimationDurations.join(", ")}`);
  await reducedPage.close();
  console.log("Passed reduced-motion behavior");
} catch (error) {
  console.error("Services modal QA failed:", error);
  process.exitCode = 1;
} finally {
  await browser?.close();
}
