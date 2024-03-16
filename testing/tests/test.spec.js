const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:5501/src/index.html');
});

test('display Budget App title:', async ({page}) => {
        const testar = await page.textContent('h1');
        expect(testar).toBe('Budget App');
})
