import { expect, test } from "@playwright/test";

const errors: string[] = [];
// React #418 is a recoverable hydration error that Next 15 occasionally reports under heavy CPU load.
// React re-renders on the client, so nothing visible breaks. Every other error fails the test.
const KNOWN = /Minified React error #418/;
test.beforeEach(({ page }) => {
  errors.length = 0;
  page.on("pageerror", (e) => { if (!KNOWN.test(e.message)) errors.push(e.message); });
  page.on("console", (m) => { if (m.type() === "error" && !/favicon/.test(m.text())) errors.push(m.text()); });
});
test.afterEach(() => expect(errors, errors.join("\n")).toEqual([]));

const PRAISE = /Sharp sharp|Lekker|Spot on|Eish, you're good|Yebo|Too clean|Examiner-approved|Darwin would be proud/;

test.describe("LifeMzansi smoke tests", () => {
  test("home page renders hero, knowledge areas and life shelf", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Life Sciences");
    await expect(page.getByRole("heading", { name: /The whole CAPS Life Sciences syllabus/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Use it at home today/ })).toBeVisible();
  });

  test("lesson: typed answers are checked with biology-aware feedback", async ({ page }) => {
    await page.goto("/learn/monohybrid-crosses", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /2\. Setting out a cross/ }).first().click();
    const input = page.getByRole("textbox", { name: /Your answer/ }).first();
    await input.fill("1:2");
    await page.getByRole("button", { name: "Check", exact: true }).first().click();
    await expect(page.getByText("Not yet.").first()).toBeVisible();
    await input.fill("2 : 2");
    await page.getByRole("button", { name: "Check", exact: true }).first().click();
    await expect(page.getByText(PRAISE).first()).toBeVisible();
  });

  test("DNA base keypad builds an mRNA answer", async ({ page }) => {
    await page.goto("/learn/protein-synthesis", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /3\. Translation/ }).first().click();
    const practice = page.locator("text=Transcribe the DNA template strand").first();
    await practice.scrollIntoViewIfNeeded();
    const card = practice.locator("xpath=ancestor::div[contains(@class,'rounded-2xl')][1]");
    for (const b of ["cytosine", "guanine", "adenine", "uracil (RNA only)", "adenine", "uracil (RNA only)"]) await card.getByRole("button", { name: b, exact: true }).click();
    await card.getByRole("button", { name: "Check", exact: true }).click();
    await expect(card.getByText(/Not yet/)).toBeVisible();
    await expect(card.getByRole("textbox", { name: /Your answer/ })).toHaveValue("CGA UAU");
  });

  test("diagram explorer: explore and find a part", async ({ page }) => {
    await page.goto("/learn/eye-and-ear", { waitUntil: "networkidle" });
    const frame = page.locator("section[aria-label='The human eye (horizontal section)']").first();
    await frame.getByRole("button", { name: "Lens", exact: true }).first().click();
    await expect(frame.getByText(/changes shape to focus light/).first()).toBeVisible();
    await frame.getByRole("button", { name: "Find it" }).click();
    await expect(frame.getByText(/Tap the/)).toBeVisible();
  });

  test("Punnett lab reveals a 3 : 1 ratio", async ({ page }) => {
    await page.goto("/toolkit", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /^Punnett square lab/ }).click();
    await page.getByRole("button", { name: /Reveal the offspring/ }).click();
    await expect(page.getByText(/Phenotypic ratio:/)).toContainText("3 : 1");
  });

  test("every lab in the toolkit renders", async ({ page }) => {
    test.slow();
    await page.goto("/toolkit", { waitUntil: "networkidle" });
    const titles = await page.locator("ul li button span.text-sm").allInnerTexts();
    expect(titles.length).toBeGreaterThanOrEqual(40);
    for (const t of titles) {
      await page.getByRole("button", { name: new RegExp(`^${t.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`) }).first().click();
      await expect(page.locator("main section[aria-label]").first()).toBeVisible();
    }
  });

  test("games: speed bio and who am I", async ({ page }) => {
    await page.goto("/games", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Start/ }).first().click();
    await expect(page.getByRole("textbox", { name: /Your answer/ })).toBeVisible();
    await page.getByRole("button", { name: /Who Am I/ }).click();
    await expect(page.getByText(/Who am I\?/)).toBeVisible();
  });

  test("exam room self-marking", async ({ page }) => {
    await page.goto("/exam");
    await page.getByRole("button", { name: /Mark–recapture/ }).first().click();
    await page.getByRole("button", { name: /Show the memo/ }).first().click();
    await page.locator("li button[aria-pressed]").first().click();
    await page.getByRole("button", { name: "Save my mark" }).first().click();
    await expect(page.getByText("Saved ✓")).toBeVisible();
  });

  test("quiz arena round starts", async ({ page }) => {
    await page.goto("/quiz");
    await page.getByRole("button", { name: "Start round" }).click();
    await expect(page.getByText(/Question 1 \/ 10/)).toBeVisible();
  });

  test("mock lobby lists four papers", async ({ page }) => {
    await page.goto("/exam/mock");
    await expect(page.getByRole("link", { name: /Full mock ·/ })).toHaveCount(4);
  });

  test("careers page: APS calculator updates", async ({ page }) => {
    await page.goto("/careers", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /APS calculator/ }).last().click();
    await page.getByRole("spinbutton", { name: "Life Sciences percentage" }).fill("85");
    await expect(page.getByText(/Your APS/)).toBeVisible();
  });

  test("everyday page: first-aid trainer step", async ({ page }) => {
    await page.goto("/everyday", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /First-aid trainer/ }).last().click();
    await page.getByRole("button", { name: /Check for Danger/ }).click();
    await expect(page.getByText(/D for Danger/)).toBeVisible();
  });

  test("curriculum API returns JSON", async ({ request }) => {
    const body = await (await request.get("/api/curriculum")).json();
    expect(body.lessons.length).toBeGreaterThanOrEqual(45);
    expect(body.topics.length).toBe(34);
  });

  for (const path of ["/", "/learn", "/learn/meiosis", "/learn/eye-and-ear", "/learn/menstrual-cycle-pregnancy", "/everyday", "/careers", "/flashcards", "/quiz", "/exam", "/exam/mock", "/exam/mock/g12-p2", "/toolkit", "/games", "/progress", "/teachers/worksheets"]) {
    test(`no sideways scrolling on ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
});
