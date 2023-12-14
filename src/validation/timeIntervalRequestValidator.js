const {body,   validationResult} = require("express-validator");
const {timeIntervalSymbols} = require("../utils/timeIntervalEnum");

function checkForDuplicates(array) {
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


module.exports.checkForDuplicates = checkForDuplicates;

module.exports.newTimeIntervalValidators = [
    body('newTime').exists().custom( value => {
        if (value.length > 10) {
            throw new Error('cannot send more than 10 intervals');
        }
        // valid enum timeInterval
        for(let i = 0; i < value.length; i++) {
            if (!timeIntervalSymbols.propertyIsEnumerable(value[i])) {
                throw new Error(`value at index: ${i} is not a valid timeInterval`);
            }
        }

        // duplicate check
        if (checkForDuplicates(value)) {
            throw new Error("newTime contains duplicate timeIntervals")
        }

        return true;
    }),
    (req, res, next) => {
        console.log("inside validator for time")
        const errors = validationResult(req);
        console.log((JSON.stringify(errors.array())))
        if (!errors.isEmpty())
            return res.status(400).json({error: errors.array()[0].msg});
        next();
    }
]

module.exports.removalTimeIntervalValidators = [
    body('removeInterval').exists().custom( value => {
        if (value.length > 10) {
            throw new Error('cannot send more than 10 intervals');
        }
        // valid enum timeInterval
        for(let i = 0; i < value.length; i++) {
            if (!timeIntervalSymbols.propertyIsEnumerable(value[i])) {
                throw new Error(`value at index: ${i} is not a valid timeInterval`);
            }
        }

        // duplicate check
        if (checkForDuplicates(value)) {
            throw new Error("removeInterval contains duplicate timeIntervals")
        }

        return true;
    }),
    (req, res, next) => {
        console.log("inside validator for time")
        const errors = validationResult(req);
        console.log((JSON.stringify(errors.array())))
        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array()});
        next();
    }
]
