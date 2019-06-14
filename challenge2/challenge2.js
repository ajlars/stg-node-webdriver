require("chromedriver")
var webdriver = require("selenium-webdriver")
var By = webdriver.By
var until = webdriver.until
var assert = require("chai").assert;

describe("challenge 2 suite", function () {
    this.timeout(20000)
    var driver

    var searchBar
    var searchButton
    var resultsList
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
        searchBar = await driver.findElement(By.id("input-search"))
        searchButton = await driver.findElement(By.xpath('(//button[contains(text(), "Search")])[1]'))
        var title = await driver.getTitle()
        return assert.include(title, "Copart", `'Copart' is in the title '${title}'`)
    })

    it("Finds 'FERRARI'(s) by searching for 'exotics'", async function () {
        await searchBar.sendKeys("exotics")
        await searchButton.click()
        await driver.wait(until.elementLocated(By.xpath('//table[@id="serverSideDataTable"]//td')), 2000)
        var ferraris = await driver.findElements(By.xpath('//table[@id="serverSideDataTable"]//span[text()= "FERRARI"]'))
        return assert.isOk(ferraris.length > 0, "'FERRARI' was present in the results.")
    })
})