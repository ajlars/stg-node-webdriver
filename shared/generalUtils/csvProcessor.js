const fs = require('fs')
const csv = require('csv-parser')


module.exports = {
    readCSV: function (filePath) {
        var csvTests = []
        return new Promise((resolve) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => { csvTests.push(row) })
                .on('finish', ()=>{resolve(csvTests)})
        })
    }
}