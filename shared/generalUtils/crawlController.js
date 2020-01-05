const linkScraper = require('./linkScraper')
const fs = require('fs')
var Limiter = require('async-limiter')
var linkList = []
var baseUrl
var parentDomain
var errorIndicator
var exclusions
var startTime
var linksPassed = 0
var errorsReturned = 0

const queue = new Limiter({ concurrency: 9 })

/**
 * Crawls a given site and logs results.
 * @param {object} args An object of settings... {url: required starting url, domain: optional domain -- only urls in this domain crawled,
 *              errorIndicator: an xpath indicating a 404 page or similar, exclusions: [patterns that if in a url will exclude the url]}
 */
module.exports = async function (args, callback) {
    startTime = new Date().getTime()
    baseUrl = args.url
    if (args.domain)
        parentDomain = args.domain
    if (args.errorIndicator)
        errorIndicator = args.errorIndicator
    if (args.exclusions)
        exclusions = args.exclusions

    fs.appendFile('crawler.log', `\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\nLog started: ${new Date(startTime).toString()}\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n`, err => {
        if (err)
            console.log(err)
    })


    linkList.push({ url: baseUrl, sources: [], results: null })
    queue.push(async (cb) => {
        await linkScraper(baseUrl, resolver, errorIndicator)
        cb()
    })
    queue.push((cb) => setTimeout(() => {
        cb()
    }, 20000))

    queue.onDone(() => {
        console.log('Completing the queue.')
        var logString = `\n==============================================\nCrawl complete ${new Date(new Date().getTime() - startTime).getMinutes().toString()} minute(s) later.\n==============================================\n`;
        linkList.forEach(link => {
            if (link.results !== "Success") {
                logString += `Failed URL: ${link.url}\nFailure message: ${link.results}\n`
                link.sources.forEach(source => {
                    logString += `  >  Linked from URL: ${source}\n`
                })
            }
        })
        fs.appendFile('crawler.log', logString, err => {
            if (err)
                console.log(err)
        })
        callback({ message: `Found ${linkList.length} matching link(s). ${linksPassed} link(s) loaded successfully. ${errorsReturned} failed.\nReview crawler.log for more details.`, missedLinks: linkList.length - linksPassed - errorsReturned, errorCount: errorsReturned, timeout: true })
    });
}

function jobUpdater(links, parentUrl) {
    return new Promise(resolve => {
        links.forEach(link => {
            var excluded = false
            if (link.charAt(0) == '.' || link.charAt(0) == "/") {
                if (link.charAt(0) == '.')
                    link = link.slice(1)
                if (link.charAt(0) == '/' && baseUrl.slice(-1) == '/')
                    link = link.slice(1)
                else if (baseUrl.slice(-1) != '/' && link.charAt(0) != '/')
                    link = '/' + link
                link = baseUrl + link
            }
            if (link.slice(0, parentDomain.length) == parentDomain) {
                if (exclusions) {
                    exclusions.forEach(exclusion => {
                        if (link.includes(exclusion)) {
                            excluded = true
                        }
                    })
                }
                if ((!parentDomain || link.includes(parentDomain)) && !excluded) {
                    var recordExists = false
                    linkList.forEach(linkRecord => {
                        if (linkRecord.url === link) {
                            recordExists = true
                            if (!linkRecord.sources.includes(parentUrl))
                                linkRecord.sources.push(parentUrl)
                        }
                    })
                    if (!recordExists) {
                        linkList.push({ url: link, sources: [parentUrl], results: null })
                        queue.push(async (cb) => {
                            await linkScraper(link, resolver, errorIndicator)
                            cb()
                        })
                    }
                }
            }

        })
        resolve()
    }).catch(err => { console.log("jobUpdater failed: \n", err) })
}

async function resolver(results) {
    return new Promise(async resolve => {

        fs.appendFile('crawler.log', `URL crawled: ${results.url}, Links pulled? ${results.links ? "Yes" : "No"}${results.err ? ", Error: " + results.err : ""}\n`, err => {
            if (err)
                console.log(err)
        })


        linkList.forEach(linkRecord => {
            if (linkRecord.url === results.url) {
                linkRecord.results = results.err ? results.err : "Success"
            }
        })

        if (results.links)
            await jobUpdater(results.links, results.url)

        if (!results.err)
            linksPassed++
        else
            errorsReturned++
        resolve()
    }).catch(err => console.log(err))
}
