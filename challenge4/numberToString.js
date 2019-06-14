module.exports = function(number){
    //logic for turning number into strings...
    var numberString = ""
    var n = ('000000000' + number.toString()).substr(-9).split("")
    var a = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
    var b = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]

    if (number.toString().length > 9) {
        return "Overflow"
    } else {
        for (let i = 8; i >= 0; i--) {
            let nextNum = ""
            if (i === 5 && n[3] + n[4] + n[5] !== "000") {
                numberString = "thousand " + numberString
            } else if (i === 2 && n[0] + n[1] + n[2] !== "000") {
                numberString = "million " + numberString
            }
            if ([8, 5, 2].includes(i)) {
                nextNum = (Number(n[i-1]+n[i]) < 20) ? a[Number(n[i-1]+n[i])] : a[n[i]]
                numberString = `${nextNum?nextNum:""}${nextNum? " ":""}${numberString}`
            } else if ([7, 4, 1].includes(i) && Number(n[i]+n[i+1]) >= 20) {
                nextNum = b[n[i]]
                numberString = `${nextNum?nextNum:""}${nextNum? " ":""}${numberString}`
            } else if ([6, 3, 0].includes(i)) {
                nextNum = a[n[i]]
                numberString = `${nextNum?nextNum:""}${nextNum? " hundred ":""}${numberString}`
            }
        }

    }
    return numberString

}