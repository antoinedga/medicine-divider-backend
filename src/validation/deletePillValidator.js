const {body, validationResult } = require('express-validator')
const {isValidDayName, containsOnlyAll, VALID_SHORT_DAYS_NAMES} = require("../utils/dayUtil")

const allOccurrenceValidator = [
    body("pill").exists().isString().trim().escape()
];

const onCertainDaysValidator = [
    body("days").exists().withMessage("request body must have days property")
        .isArray({min: 1, max: 7}).withMessage("days property must be an Array with min: 1 and max: 7"),
    body().custom(checkIfKeywordAllAndUpdate),
    body("days").custom(isValidDayName),
    body("pill").exists().notEmpty().trim().escape()
]

// got to do it like this to make it that it override the request body's days property
function checkIfKeywordAllAndUpdate(value) {

    if(containsOnlyAll(value.days)) {
        value.days = [...VALID_SHORT_DAYS_NAMES];
    }
    return true;
}



module.exports = {allOccurrenceValidator, onCertainDaysValidator}
