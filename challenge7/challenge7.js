require("chromedriver")
var webdriver = require("selenium-webdriver")
var By = webdriver.By
var until = webdriver.until
var assert = require("chai").assert;
let driverSetup = require("../shared/uiUtilities/driverSetup")
let navValidation = require("../shared/uiUtilities/validateNavigation")

// let navData = [
//     ['https://www.copart.com/popular/model/forester', 'forester'],
//     ['https://www.copart.com/popular/model/camry', 'camry'],
//     ['https://www.copart.com/popular/model/impreza', 'impreza'],
//     ['https://www.copart.com/popular/model/sonata', 'sonata'],
//     ['https://www.copart.com/popular/model/legacy', 'legacy'],
//     ['https://www.copart.com/popular/model/corolla', 'corolla'],
//     ['https://www.copart.com/popular/model/prius', 'prius'],
//     ['https://www.copart.com/popular/model/trailer', 'trailer'],
//     ['https://www.copart.com/popular/model/elantra', 'elantra'],
//     ['https://www.copart.com/popular/model/sentra', 'sentra'],
//     ['https://www.copart.com/popular/model/toyota', 'toyota'],
//     ['https://www.copart.com/popular/model/ford', 'ford'],
//     ['https://www.copart.com/popular/model/chevrolet', 'chevrolet'],
//     ['https://www.copart.com/popular/model/honda', 'honda'],
//     ['https://www.copart.com/popular/model/subaru', 'subaru'],
//     ['https://www.copart.com/popular/model/dodge', 'dodge'],
//     ['https://www.copart.com/popular/model/nissan', 'nissan'],
//     ['https://www.copart.com/popular/model/hyundai', 'hyundai'],
//     ['https://www.copart.com/popular/model/jeep', 'jeep'],
//     ['https://www.copart.com/popular/model/gmc', 'gmc'],
// ]

// describe("challenge 7 suite", function () {
//     this.timeout(2000000)

//     it("Has the right text at all the given URLs.", async function(){
//         await navData.reduce(async function(chain, task){
//             return await chain.then(async function(){
//                 return new Promise(async function(resolve, reject){
//                     console.log(chain, task)
//                     await assert.isTrue(await navValidation(task[0], task[1]), `Looking for "${task[1]}" at "${task[0]}"`)
//                     resolve()
//                 })
//             })
//         }, Promise.resolve());
//     })
// })

describe("challenge 7 suite", function () {
    this.timeout(1000000)
    var driver
    var popularMakes = []

    before(async function () {
        driver = await driverSetup("http://www.copart.com")
    })

    after(function () {
        return driver.quit()
    })

    //https://stackoverflow.com/questions/35098156/get-an-array-of-elements-from-findelementby-classname
    it("Pull the popular makes/models link urls and text", async function () {
        driver.wait(until.elementLocated(By.xpath("//div[@ng-if='popularSearches']//a")))
        var popularElements = await driver.findElements(By.xpath("//div[@ng-if='popularSearches']//a"))

        await Promise.all(popularElements.map(async function(element){ //Promise.all doesn't return until ALL promises of each iteration (the map) are resolved (all elements are found and text/urls loaded)
            var make = await element.getText()
            var url = await element.getAttribute("href")
            popularMakes.push([make, url])
        }))
        
        assert.isTrue(popularMakes.length==20, "There are 20 items in the popular makes section.")
        
        console.log("Got all the popular stuff!", popularMakes)
    })

    it("Load and check each URL and Text", async function (){
        // for(make of popularMakes){ //for some reason Array.forEach(()=>{}) loops don't work with async. For item of array does.
        popularMakes.forEach(async function(make){
            var makeUrl = make[1]
            driver.get(makeUrl)

            var searchTerm = make[0]
            console.log(`Looking for ${searchTerm}`)
            searchTerm = searchTerm.toLowerCase()
            console.log(`Looking for ${searchTerm} - made lower case, since that's how it shows up in results.`)
            searchTerm = searchTerm.split(' ').join('-')
            console.log(`Looking for ${searchTerm} - replaced spaces with dashes, since that's also how the searches work for some reason`)

        
            driver.wait(until.titleContains(searchTerm)) //test will fail now if the search term never shows in the title

            driver.wait(until.elementLocated(By.css("[ng-if='searchText']")))
            var searchResultsElement = await driver.findElement(By.css("[ng-if='searchText']"))
            var searchResultsText = await searchResultsElement.getText()
            if(searchResultsText.length > 0){ // the searchText element always exists, but only has text if the search result exists
                console.log("Found matches!")
                assert.isTrue(searchResultsText.includes(searchTerm), `The correct make was searched. (Search text '${searchResultsText}' & Expected text '${searchTerm}'`)
            }
            else{ //since it's popular searches, not popular results that fill this list of links, not all searches have results
                console.log("No results found.")
                var resultsNotFoundElement = await driver.findElement(By.css("[ng-if='!searchUnavailable']")) //this is the "sorry we couldn't find your search" element
                var resultsNotFoundText = await resultsNotFoundElement.getText()
                assert.isTrue(resultsNotFoundText.includes(searchTerm), "No results search handled.")
            }
        })
    })
})