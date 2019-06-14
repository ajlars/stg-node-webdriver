require("chromedriver")
var webdriver = require("selenium-webdriver")
var By = webdriver.By
var until = webdriver.until
var assert = require("chai").assert;

describe("challenge 3 suite", function () {
    this.timeout(20000)
    var driver

    before(function () {
        driver = new webdriver.Builder()
            .withCapabilities(webdriver.Capabilities.chrome())
            .build()
    })

    after(function () {
        return driver.quit()
    })

    it("Opens copart", async function () {
        await driver.get("https://www.copart.com/")
        var title = await driver.getTitle()
        return assert.include(title, "Copart", `'Copart' is in the title '${title}'`)
    })

    it("Pulls popular items", async function () {
        var popularItems = await driver.findElements(By.xpath('//div[@ng-if="popularSearches"]/div[2]//li'))
        await popularItems.forEach(async item => {
            let name = await item.getText()
            console.log(`${name} - https://www.copart.com/popular/make/${name.toLowerCase()}`)
        })
    })
})