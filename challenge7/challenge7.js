require("chromedriver")
var webdriver = require("selenium-webdriver")
var By = webdriver.By
var until = webdriver.until
var assert = require("chai").assert;
let driverSetup = require("../shared/driverSetup")
let navValidation = require("../shared/validateNavigation")

let navData = [
    ['https://www.copart.com/popular/model/forester', 'forester'],
    ['https://www.copart.com/popular/model/camry', 'camry'],
    ['https://www.copart.com/popular/model/impreza', 'impreza'],
    ['https://www.copart.com/popular/model/sonata', 'sonata'],
    ['https://www.copart.com/popular/model/legacy', 'legacy'],
    ['https://www.copart.com/popular/model/corolla', 'corolla'],
    ['https://www.copart.com/popular/model/prius', 'prius'],
    ['https://www.copart.com/popular/model/trailer', 'trailer'],
    ['https://www.copart.com/popular/model/elantra', 'elantra'],
    ['https://www.copart.com/popular/model/sentra', 'sentra'],
    ['https://www.copart.com/popular/model/toyota', 'toyota'],
    ['https://www.copart.com/popular/model/ford', 'ford'],
    ['https://www.copart.com/popular/model/chevrolet', 'chevrolet'],
    ['https://www.copart.com/popular/model/honda', 'honda'],
    ['https://www.copart.com/popular/model/subaru', 'subaru'],
    ['https://www.copart.com/popular/model/dodge', 'dodge'],
    ['https://www.copart.com/popular/model/nissan', 'nissan'],
    ['https://www.copart.com/popular/model/hyundai', 'hyundai'],
    ['https://www.copart.com/popular/model/jeep', 'jeep'],
    ['https://www.copart.com/popular/model/gmc', 'gmc'],
]

describe("challenge 7 suite", function () {
    this.timeout(2000000)
    
    it("Has the right text at all the given URLs.", async function(){
        await navData.reduce(async function(chain, task){
            return await chain.then(async function(){
                return new Promise(async function(resolve, reject){
                    console.log(chain, task)
                    await assert.isTrue(await navValidation(task[0], task[1]), `Looking for "${task[1]}" at "${task[0]}"`)
                    resolve()
                })
            })
        }, Promise.resolve());
    })
})