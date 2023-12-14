let dayNameRegx = "^(mon|tues|wed|thurs|fri|sat|sun)$"

function checkForDuplicateDays(array) {
    let valuesAlreadySeen = []
    for (let i = 0; i < array.length; i++) {
        let value = array[i]
        if (valuesAlreadySeen.indexOf(value) !== -1) {
            return true
        }
        valuesAlreadySeen.push(value)
    }
    return false
}

function isValidDayName(value) {
    if (value === undefined || value === null || (typeof value !== "string")) {
        return false
    }
    value = value.trim()
    if (value.length === 0) {
        return false
    }

    return dayNameRegx.test(value)

}

module.exports = {dayNameRegx, checkForDuplicateDays, isValidDayName }