var driverSetup = require('./driverSetup')
var until = require('selenium-webdriver').until
var By = require('selenium-webdriver').By

module.exports = navigationValidator

async function navigationValidator (url, text){
    var driver = await driverSetup(url)
    var found = false
    await driver.wait(until.elementLocated(By.tagName("body")), 5000)
    try{
        await driver.wait(until.elementLocated(By.xpath(`//*[contains(text(), "${text}")]`)), 5000)
        found = true
    } catch (err){
        console.log(err)
    } finally {
        driver.quit()
        return found
    }
}