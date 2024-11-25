const {body, validationResult } = require('express-validator')
const { timeIntervalAsArray} = require("../utils/timeIntervalEnum");
const {isValidDayName, containsOnlyAll} = require("../utils/dayUtil")

// Custom validation function to validate individual days array
const isValidDaysArray = (value, req) => {
    // If the array contains only the value "all", override it with all days
    if (containsOnlyAll(value.days)) {
        // Replace the array with all days (Monday to Sunday)
        value.days = [...VALID_SHORT_DAYS_NAMES];
    }
    // Otherwise, return the original array
    return true;
};

const isValidTime = value => {
    return timeIntervalAsArray.includes(value)
}

module.exports = addPillValidator = [
    body('pillsToAdd').isArray({min: 1, max: 5}).withMessage('pillsToAdd must be an array'),
    // this will be for if the days array is length one and if its 'all' this is ti modify the request
    body('pillsToAdd.*').custom(isValidDaysArray),
    body('pillsToAdd.*.days.*').custom(isValidDayName)
        .withMessage('Invalid day name'),

    body('pillsToAdd.*.times').isArray()
        .withMessage('times must be an array'),
    body('pillsToAdd.*.times.*').trim().escape().custom(isValidTime)
        .withMessage('time must be in this format: 11am'),

    body('pillsToAdd.*.pill').isObject()
        .withMessage('pill must be an object with the following properties: name & dosage'),
    body('pillsToAdd.*.pill.name').trim().escape().notEmpty()
        .withMessage('Pill\'s name is required'),
    body('pillsToAdd.*.pill.dosage').trim().escape().notEmpty()
        .withMessage('Pill\'s dosage is required')
    ,(req, res, next) => {
        console.log("inside validator")
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty())
            return res.status(400).json({error: errors.array()[0].msg});
        next();
    }
]

