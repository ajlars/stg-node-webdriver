const crawler = require("../shared/generalUtils/crawlController")

const url = "https://www.w3.org"
const domain = "https://www.w3.org"
const exclusions
const errorIndicator


describe("I can crawl the web", function () {
    this.timeout(0)
    it('Checking domain URLs.', async (done) => {
        console.log('Crawler starting...')
        args = {url: url, domain: domain}
        if(exclusions)
            args.exclusions = exclusions
        if(errorIndicator)
            args.errorIndicator = errorIndicator
        crawler({ url: url, domain: domain }, (results) => {
            if (results.timeout) {
                console.log("Scan timed out.")
            }
            console.log("Results: ", results.message)
            assert.isTrue(!results.timeout, "Crawler did not timeout.")
            assert.isTrue(results.errorCount === 0, "There were no errors in the scan.")
            assert.isTrue(results.missedLinks === 0, "The crawler did not skip any links.")
            done()
        })
    })
})
