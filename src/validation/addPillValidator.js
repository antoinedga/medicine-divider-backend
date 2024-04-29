const {body, validationResult } = require('express-validator')
const {timeIntervalSymbols, timeIntervalAsArray} = require("../utils/timeIntervalEnum");


const isValidDayName = value => {
    const validDayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const validShortDayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    // Convert the input value to lowercase for case-insensitive comparison
    const lowercaseValue = value.toLowerCase();
    // Check if the lowercase value is included in either the full or shorthand day names array
    return validDayNames.includes(lowercaseValue) || validShortDayNames.includes(lowercaseValue);
};

const isValidTime = value => {
    return timeIntervalAsArray.includes(value)
}

module.exports = addPillValidator = [
    body('pillsToAdd').isArray().withMessage('pillsToAdd must be an array'),
    body('pillsToAdd.*.days').isArray().withMessage('days must be an array'),
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

