require("chromedriver")
var webdriver = require("selenium-webdriver")
var By = webdriver.By
var until = webdriver.until
var assert = require("chai").assert;
let fibonacci = require('./fibonacci')

describe("challenge 4 suite", function () {
    this.timeout(20000)
    var driver

    // before(function () {
    // driver = new webdriver.Builder()
    // .withCapabilities(webdriver.Capabilities.chrome())
    // .build()
    // })

    // after(function () {
    // return driver.quit()
    // })


    it("Prints correctly.", async function () {
        console.log(fibonacci(1))
        console.log(fibonacci(5))
        console.log(fibonacci(8))
        console.log(fibonacci(13))
        console.log(fibonacci(18))
        console.log(fibonacci(21))
        console.log(fibonacci(25))
        console.log(fibonacci(26))
        console.log(fibonacci(30))
        console.log(fibonacci(64))
    })
})
