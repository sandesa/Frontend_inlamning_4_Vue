const { expect } = require('@playwright/test');
const { beforeEach, afterEach } = require('node:test');
const { chromium } = require('playwright');
describe('Vue.js App', () => {
    let browser;
    let page;

    beforAll(async () => {
        browser = await chromium.launch();
    });

    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto('http://localhost:3000');
    });

    afterEach(async () => {
        await page.close();
    });

    afterAll(async () => {
        await browser.close();
    });

    it('display Budget App title:', async () {
        const testar = await page.textContent('h1');
        expect(testar).toBe('Budget App');
    })
})