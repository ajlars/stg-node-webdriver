var numToString = require('./numberToString')

module.exports = function fibonacci(order, current, previous) {
    if (order > 0) {
        if (!current)
            return fibonacci(order - 1, 1)
        if (!previous)
            return fibonacci(order - 1, 1, 1)
        return fibonacci(order - 1, current + previous, current)
    } else {
        return `${current.toString()} - ${numToString(current)}`
    }
}