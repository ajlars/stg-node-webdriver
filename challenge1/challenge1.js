require("chromedriver")
var webdriver = require("selenium-webdriver")
var assert = require("chai").assert;

describe("challenge 1 suite", function () {
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

    it("Opens google", function() {
        return driver.get("http://www.google.com")
    })

    it("Checks that the title for google is 'Google'", function() {
        return driver.getTitle().then(function(title) {
            assert.equal(title, "Google")
        })
    })
})