require("chromedriver")
var webdriver = require("selenium-webdriver")
var By = webdriver.By
var until = webdriver.until
var assert = require("chai").assert;
let driverSetup = require("../shared/uiUtilities/driverSetup")

describe("challenge 5 suite", function () {
    this.timeout(20000)
    var driver
    var models = {}
    var trackedDamage = {
        "REAR END": 0,
        "FRONT END": 0,
        "UNDERCARRIAGE": 0,
        "MINOR DENT/SCRATCHES": 0,
        "OTHER": 0
    }

    before(async function () {
        driver = await driverSetup("https://www.copart.com")
    })

    after(function () {
        return driver.quit()
    })

    it("Searches for porsches and gets the results screen.", async function () {
        await driver.findElement(By.id("input-search")).sendKeys("porsche")
        await driver.findElement(By.xpath('(//button[contains(text(), "Search")])[1]')).click()
        await driver.wait(until.elementLocated(By.xpath('//span[contains(text(), "PORSCHE")]')), 5000)
        var table = await driver.findElement(By.css("#serverSideDataTable")).getText()
        return assert.include(table, "PORSCHE", "Porsche found in results.")
    })

    it("Sets the search output to 100, gets more than 20 results.", async function () {
        await driver.wait(until.elementLocated(By.xpath('//div[@class="top"]//select[@name="serverSideDataTable_length"]//option[@value="100"]')), 2000)
        await driver.findElement(By.xpath('//div[@class="top"]//select[@name="serverSideDataTable_length"]//option[@value="100"]')).click()
        await driver.wait(until.elementLocated(By.xpath('(//tr/td[6])[21]')), 5000)
    })

    it("Gets vehicle models and counts them.", async function () {
        var modelElements = await driver.findElements(By.xpath('//tr/td[6]'))
        await Promise.all(modelElements.map(async function (element) {
            var model = await element.getText()
            if (models[model])
                models[model]++
            else
                models[model] = 1
        }))
    })

    it("Gets damage types for the same vehicles.", async function () {
        var damageTypes = await driver.findElements(By.xpath('//tr/td[12]'))
        await Promise.all(damageTypes.map(async function (element) {
            var damage = (await element.getText()).trim()
            switch (damage) {
                case "REAR END":
                    trackedDamage["REAR END"]++
                    break;
                case "FRONT END":
                    trackedDamage["FRONT END"]++
                    break;
                case "UNDERCARRIAGE":
                    trackedDamage["UNDERCARRIAGE"]++
                    break;
                case "MINOR DENT/SCRATCHES":
                    trackedDamage["MINOR DENT/SCRATCHES"]++
                    break;
                default:
                    trackedDamage["OTHER"]++
                    break;
            }
        }))
    })

    it("Prints results.", function () {
        console.log("***************")
        console.log("* MODELS FOUND:")
        console.log("***************")
        modelKeys = (Object.keys(models)).sort()
        modelKeys.forEach(model => {
            console.log(`Model: ${model}, Count: ${models[model]}`)
        })
        console.log("")
        console.log("***************")
        console.log("* DAMAGE FOUND:")
        console.log("***************")
        damageKeys = Object.keys(trackedDamage)
        damageKeys.forEach(type => {
            console.log(`Damage Type: ${type}, Count: ${trackedDamage[type]}`)
        })
    })
})