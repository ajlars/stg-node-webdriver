const fs = require('fs')
const copartSearch = require('../shared/webService/copartSearcher')
const assert = require("chai").assert;
const copartLotProps = require("../shared/webService/lotPropsModel")
const csvProcessor = require('../shared/generalUtils/csvProcessor')
const path = require('path')


describe("API test via CSV stored test", () => {
    it("Reads and runs", async () => {
        var csvTests = await csvProcessor.readCSV(path.resolve('searchTests.csv'))

        fs.appendFile('results.log', `*****************************************\nStarting search tests from searches ${new Date().toUTCString()}:\n`, err => {
            if (err)
                console.log(`search ${search}: `, err)
        })
        await Promise.all(csvTests.map(async (test) => {
            var searchTerm = test['﻿search']
            const results = await copartSearch.getLots(searchTerm);
            //verify search was successful            
            assert.equal(results.statusCode, 200, `Response code on the search should be 200 for '${searchTerm}'`)
            assert.equal(results.returnCode, "Success", `Copart response should be 'Success' for '${searchTerm}'`)

            if (results.lots.length > 0) {
                let lot = results.lots[0]
                var found = { all: false, make: false, model: false, year: false, damageType: false }
                var i = 0
                while(!found.all&&i<results.lots.length){
                    let lot = results.lots[i]
                    if(lot.mkn.includes(test.make))
                        found.make = true
                    if(lot.lm.includes(test.model))
                        found.model = true
                    if(lot.lcy == test.year)
                        found.year = true
                    if(lot.dd.includes(test.damageType))
                        found.damageType = true

                    i++;
                    if(found.make && found.model && found.year && found.damageType)
                        found.all = true
                }
                assert.isTrue(found.all, `Searches were all successful for ${searchTerm}... Though 100% success might be the wrong metric.`)
            }

            //         //pulls one of the search's resulting lots at random
            //         const randomLot = results.lots[Math.floor(Math.random() * results.lots.length)]

            //         //gets the properties of the selected lot item
            //         var lotKeys = Object.keys(randomLot)
            //         var propsNotChecked = [] //stores properties that are not tested

            //         lotKeys.forEach(key => {
            //             let valid = false
            //             if (copartLotProps[key] === undefined) { //if property is not in model for testing, stores for logging
            //                 propsNotChecked.push(key)
            //             }
            //             else {
            //                 copartLotProps[key].type.forEach(type => {
            //                     if (!valid) {
            //                         if (type == "Array")
            //                             valid = Array.isArray(randomLot[key])
            //                         else
            //                             valid = typeof randomLot[key] == type
            //                     }
            //                 })
            //                 assert.isTrue(valid, `${key} should be of type(s) ${copartLotProps[key]}, has value ${randomLot[key]}`)
            //             }
            //         })

            //         // providing a way to "require" that all lots have certain properties. Can only really guess at this point, set lotNumberStr as the only one for now.
            //         var modelProperties = Object.keys(copartLotProps)
            //         var requiredProps = [] // stores required props
            //         var propsNotIncluded = [] // stores props that are in the model but not in the lot

            //         modelProperties.forEach(prop => {
            //             if (copartLotProps[prop].required) {
            //                 requiredProps.push(prop)
            //             } else if (!randomLot[prop]) {
            //                 propsNotIncluded.push([prop])
            //             }
            //         })

            //         assert.containsAllKeys(randomLot, requiredProps, "All 'required' properties are present.")

            //         var logString = `\nSearch: '${searchTerm}'\n Random result had all required properties, all types matched.\n`
            //         if (propsNotIncluded.length > 0) {
            //             logString += '  > Was also missing listed type(s): \n'
            //             propsNotIncluded.forEach(prop => logString += `    '${prop}',\n`)
            //         }
            //         if (propsNotChecked.length > 0) {
            //             logString += '  > Model did not include discovered key(s): \n'
            //             propsNotChecked.forEach(prop => logString += `    '${prop}' with value "${randomLot[prop]}", and type "${typeof randomLot[prop]}",\n`)
            //         }

            //         fs.appendFile('results.log', logString, err => {
            //             if (err)
            //                 console.log(`search ${search}: `, err)
            //         })
            //     }

        }))
    })

    // it("Responds with the right formats", async () => {
    //     
    // })
})
