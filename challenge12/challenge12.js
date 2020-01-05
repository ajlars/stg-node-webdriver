const crawler = require("../shared/generalUtils/crawlController")
const assert = require('chai').assert

describe('Checking Yoodlize:', function () {
    this.timeout(120000)
    it('Checking domain URLs.', async (done) => {
        console.log('Crawler starting...')
        crawler({ url: "https://alpha.yoodlize.com", domain: "https://alpha.yoodlize.com", errorIndicator: '//span[contains(text(), "Error code: 404")]', exclusions: ["/details/", "keyword=", "php"], elementToWaitFor: "#svg-overlay" }, (results) => {
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