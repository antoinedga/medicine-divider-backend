const {body, validationResult } = require('express-validator')
const { timeIntervalAsArray} = require("../utils/timeIntervalEnum");
const {VALID_LONG_DAYS_NAMES, VALID_SHORT_DAYS_NAMES} = require("../utils/dayUtil")


const isValidDayName = value => {
    // Convert the input value to lowercase for case-insensitive comparison
    const lowercaseValue = value.toLowerCase();
    // Check if the lowercase value is included in either the full or shorthand day names array
    return VALID_LONG_DAYS_NAMES.includes(lowercaseValue) || VALID_SHORT_DAYS_NAMES.includes(lowercaseValue);
};
// Custom validation function to check if the array contains only the value "all"
const containsOnlyAll = (value) => {
    return Array.isArray(value) && value.length === 1 && value[0] === 'all';
};

// Custom validation function to validate individual days array
const isValidDaysArray = (value) => {
    // If the array contains only the value "all", override it with all days
    if (containsOnlyAll(value)) {
        // Replace the array with all days (Monday to Sunday)
        return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    }

    // Otherwise, return the original array
    return value;
};

const isValidTime = value => {
    return timeIntervalAsArray.includes(value)
}

module.exports = addPillValidator = [
    body('pillsToAdd').isArray({min: 1, max: 5}).withMessage('pillsToAdd must be an array'),
    body('pillsToAdd.*.days').isArray({min: 1, max: 7}).custom(isValidDaysArray).withMessage('days must be an array'),
    body('pillsToAdd.*.days.*').custom(isValidDayName).withMessage('Invalid day name'),

    body('pillsToAdd.*.times').isArray().withMessage('times must be an array'),
    body('pillsToAdd.*.times.*').custom(isValidTime).withMessage('time must be in this format: 11am'),

    body('pillsToAdd.*.pill').isObject().withMessage('pill must be an object with the following properties: name & dosage'),
    body('pillsToAdd.*.pill.name').notEmpty().withMessage('Pill\'s name is required'),
    body('pillsToAdd.*.pill.dosage').notEmpty().withMessage('Pill\'s dosage is required')
    ,(req, res, next) => {
        console.log("inside validator")
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({error: errors.array()[0].msg});
        next();
    }
]

