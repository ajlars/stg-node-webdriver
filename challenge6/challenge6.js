require("chromedriver")
var webdriver = require("selenium-webdriver")
var By = webdriver.By
var until = webdriver.until
var assert = require("chai").assert;
let driverSetup = require("../shared/uiUtilities/driverSetup")
let screenshot = require('../shared/uiUtilities/screenCap')

describe("challenge 6 suite", function () {
    this.timeout(20000)
    var driver


    before(async function () {
        driver = await driverSetup("https://www.copart.com")
    })

    after(function () {
        return driver.quit()
    })

    it("Searches for Nissan.", async function () {
        await driver.findElement(By.id("input-search")).sendKeys("Nissan")
        await driver.findElement(By.xpath('(//button[contains(text(), "Search")])[1]')).click()
        await driver.wait(until.elementLocated(By.xpath('//span[contains(text(), "NISSAN")]')), 5000)
        var table = await driver.findElement(By.css("#serverSideDataTable")).getText()
        return assert.include(table, "NISSAN", "Nissan found in results.")
    })

    it("Filters by Skyline, screenshotting if it doesn't find it.", async function() {
        //filter
        await driver.findElement(By.xpath('(//input[@placeholder="Search by Lot#,VIN#"])[1]')).sendKeys('Skyline')
        try {
            //look for skyline
            await driver.wait(until.elementLocated(By.xpath('(//tr/td[6]/span)[contains(text(), "SKYLINE")]')), 5000)
            return assert.isTrue(true, "Found a Skyline for sale.")
        } catch (error) {
            screenshot(driver, "SkylineNotFound")
            return assert.fail("", "", "There was no Skyline.")
        } 
    })
})