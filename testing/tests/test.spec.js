const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.goto("http://127.0.0.1:5501/index.html");
});

test("Make sure the testing works:", async ({ page }) => {
  const testar = await page.textContent("h1");
  expect(testar).toBe("Budget App");
});

test("Add an expense:", async ({ page }) => {
  await page.fill("#priceInput", "100");
  await page.fill("#dateInput", "2024-03-30");
  await page.selectOption("#categoryInput", "Bostad");
  await page.fill("#descriptionInput", "Test");
  await page.click(".add-button");

  await page.selectOption("#selectCategory", "All");

  const lastExpenseRow = page.locator(".info:nth-last-child(2)");
  const lastExpenseDate = await lastExpenseRow.evaluate(
    (row) => row.querySelector("td:nth-child(1)").textContent
  );
  const lastExpensePrice = await lastExpenseRow.evaluate(
    (row) => row.querySelector("td:nth-child(2)").textContent
  );
  const lastExpenseCategory = await lastExpenseRow.evaluate(
    (row) => row.querySelector("td:nth-child(3)").textContent
  );

  expect(lastExpenseDate).toBe("2024-03-30");
  expect(lastExpensePrice).toContain("100,00");
  expect(lastExpenseCategory).toBe("Bostad");

  await page.click(".info:nth-last-child(2) td:first-child");
  const description = await page.textContent("#test-desc");

  expect(description).toBe("Test");
});

test("First add then remove expense:", async ({ page }) => {
  await page.selectOption("#selectCategory", "All");

  const firstCount = await page.evaluate(() => {
    return document.querySelectorAll(".info").length;
  });
  console.log(firstCount);

  await page.fill("#priceInput", "1000");
  await page.fill("#dateInput", "2024-03-20");
  await page.selectOption("#categoryInput", "Hushåll");
  await page.fill("#descriptionInput", "Test");
  await page.click(".add-button");

  const afterAddedExpense = await page.evaluate(() => {
    return document.querySelectorAll(".info").length;
  });
  console.log(afterAddedExpense);

  expect(afterAddedExpense).toBe(firstCount + 1);

  await page.click(".info:nth-last-child(2) .remove-cell button");

  const finalCount = await page.evaluate(() => {
    return document.querySelectorAll(".info").length;
  });

  console.log(finalCount);
  expect(finalCount).toBe(afterAddedExpense - 1);
});

test("Filtering:", async ({ page }) => {
  await page.selectOption("#selectCategory", "All");
  let count = await page.evaluate(() => {
    return document.querySelectorAll(".info").length;
  });
  expect(count).toBe(8);
  await page.selectOption("#selectCategory", "Bostad");
  count = await page.evaluate(() => {
    return document.querySelectorAll(".info").length;
  });
  expect(count).toBe(3);
  await page.selectOption("#selectMonth", "Jan");
  count = await page.evaluate(() => {
    return document.querySelectorAll(".info").length;
  });
  expect(count).toBe(1);
  await page.selectOption("#selectCategory", "All");
  count = await page.evaluate(() => {
    return document.querySelectorAll(".info").length;
  });
  expect(count).toBe(2);
});
