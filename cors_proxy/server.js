const express = require("express");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const app = express();
const port = 8080;

app.get("/proxy", async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).send("No URL provided");
    }

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2" });

        const content = await page.content();
        await browser.close();

        res.send(content);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred while fetching the URL");
    }
});

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});
