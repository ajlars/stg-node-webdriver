const puppeteer = require('puppeteer');

async function linkScraper(url, resolver, errorIndicator, retry) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    var results = { url: url }
    var finalLinks = []

    page.on('domcontentloaded', async () => {

        if (errorIndicator) {
            let missingPage = await page.$x(errorIndicator).catch((err) => [])
            if (missingPage.length > 0) {
                results.err = "Link led to 'missing' page."
            }
        }

        const links = await page.evaluate(() => Array.from(
            document.querySelectorAll('a[href]'),
            a => a.getAttribute('href')
        )).catch((err) => {
            results.err = results.err ? results.err += "Page did not load correctly" : "Page did not load correctly"
        })
        if (!results.err) {
            results.links = links
        }
    })

    page.on('error', async () => {
        results.err = "Page is broken"
    })
    page.setViewport({width: 1980, height: 1020, isMobile: false, isLandscape: true})
    await page.goto(url, {
        timeout: 25000,
        waitUntil: 'networkidle0',
    }).catch(err=>{results.err = "Page is not loading"})

    if (results.err && !results.err.includes("URL") && !results.err.includes("missing") && !retry)
        linkScraper(url, resolver, errorIndicator, true)

    await browser.close()
    await resolver(results)
}

module.exports = linkScraper