var fs = require('fs')
module.exports = screenshot

function screenshot(driver, name){
    driver.takeScreenshot()
    .then(function(base64Image){
        var decodedImage = new Buffer.from(base64Image,'base64');
        var date = new Date();
        var filename = name + date.getTime() + '.jpg';
        fs.writeFile(filename, decodedImage, function(err){if(err)console.log(`there was an error writing ${filename} ; error: ${err}`)});
    })
}