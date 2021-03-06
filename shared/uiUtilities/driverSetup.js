var webdriver = require("selenium-webdriver")
var TIMEOUT = 60000
module.exports = setup

/**
 * Sets up a chrome driver, maximising the browser and returning the driver after navigating to a provided url (if present)
 * @param {string} url optional url to navigate the browser to
 */
function setup (url) {
    driver = new webdriver.Builder()
        .withCapabilities(webdriver.Capabilities.chrome())
        .build()
    driver.manage().window().maximize()
    driver.manage().setTimeouts( { implicit: TIMEOUT, pageLoad: 
            TIMEOUT, script: TIMEOUT } )
    if(url)
        driver.get(url)
    return driver
}