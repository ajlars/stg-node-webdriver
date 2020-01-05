const fs = require('fs')
const copartSearch = require('../shared/webService/copartSearcher')
var assert = require("chai").assert;
const copartLotProps = require("../shared/webService/lotPropsModel")

const searches = [
    "toyota camry",
    "nissan skyline",
    "porsche cayenne",
    "chevy avalanche",
    "honda element",
    "aowieu029u24ltj;ldoidug03984tpidjf;lksdjrt0y9380469epgjdlsfkgjlsjrt039486kj",
    "blue beetle",
    "semi cab",
    "red muscle car",
    "smart car"
]


describe("Searching via API", () => {
    it("Responds with the right formats", async () => {
        // start results log
        fs.appendFile('results.log', `*****************************************\n`
            + `Starting search tests from searches ${new Date().toUTCString()}:\n`, err => {
                if (err)
                    console.log(`search ${search}: `, err)
            })
        await Promise.all(searches.map(async (search) => {
            const results = await copartSearch.getLots(search);
            //verify search was successful            
            assert.equal(results.statusCode, 200, `Response code on the search should be 200 for '${search}'`)
            assert.equal(results.returnCode, "Success", `Copart response should be 'Success' for '${search}'`)
            //
            if (results.lots.length > 0) {
                //pulls one of the search's resulting lots at random
                const randomLot = results.lots[Math.floor(Math.random() * results.lots.length)]

                //gets the properties of the selected lot item
                var lotKeys = Object.keys(randomLot)
                var propsNotChecked = [] //stores properties that are not tested

                lotKeys.forEach(key => {
                    let valid = false
                    if (copartLotProps[key] === undefined) { //if property is not in model for testing, stores for logging
                        propsNotChecked.push(key)
                    }
                    else {
                        copartLotProps[key].type.forEach(type => {
                            if (!valid) {
                                if (type == "Array")
                                    valid = Array.isArray(randomLot[key])
                                else
                                    valid = typeof randomLot[key] == type
                            }
                        })
                        assert.isTrue(valid, `${key} should be of type(s) ${copartLotProps[key]}, has value ${randomLot[key]}`)
                    }
                })

                // providing a way to "require" that all lots have certain properties. Can only really guess at this point, set lotNumberStr as the only one for now.
                var modelProperties = Object.keys(copartLotProps)
                var requiredProps = [] // stores required props
                var propsNotIncluded = [] // stores props that are in the model but not in the lot

                modelProperties.forEach(prop => {
                    if (copartLotProps[prop].required) {
                        requiredProps.push(prop)
                    } else if (!randomLot[prop]) {
                        propsNotIncluded.push([prop])
                    }
                })

                assert.containsAllKeys(randomLot, requiredProps, "All 'required' properties are present.")

                var logString = `\nSearch: '${search}'\n Random result had all required properties, all types matched.\n`
                if (propsNotIncluded.length > 0) {
                    logString += '  > Was also missing listed type(s): \n'
                    propsNotIncluded.forEach(prop => logString += `    '${prop}',\n`)
                }
                if (propsNotChecked.length > 0) {
                    logString += '  > Model did not include discovered key(s): \n'
                    propsNotChecked.forEach(prop => logString += `    '${prop}' with value "${randomLot[prop]}", and type "${typeof randomLot[prop]}",\n`)
                }

                fs.appendFile('results.log', logString, err => {
                    if (err)
                        console.log(`search ${search}: `, err)
                })
            } else {
                fs.appendFile('results.log', `\nNo results for search: '${search}'\n`, err => { if (err) console.log(`search ${search}: `, err) })
            }

        }))
    })
})
