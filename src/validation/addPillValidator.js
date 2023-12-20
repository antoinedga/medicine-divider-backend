const {body, validationResult } = require('express-validator')
const {timeIntervalSymbols} = require("../utils/timeIntervalEnum");
const {checkForDuplicatesTimes} = require("./timeIntervalRequestValidator");
const {isValidDayName, checkForDuplicateDays} = require("../utils/dayNameUtil")

module.exports = addPillValidator = [
body("name")
    .exists().withMessage("Objects in array must have \'name\' property")
    .isString().withMessage("name property in object(s) must be a String")
    .isLength({min: 3}).withMessage("Object's name property must be a minimum of 3 characters")
    .isLength({max: 50}).withMessage("Object's name property must not exceed 50 characters")
    .trim().escape(),

body("dosage")
    .exists().withMessage("Pills must have dosage")
    .isString().withMessage("Pill's Dosage must be a String")
    .isLength({min:3}).withMessage("Pill's dosage needs to be a minimum of 3 characters long")
    .trim().escape(),

body("frequency")
    .exists().withMessage("Pills requires a Frequency property")
    .isObject().withMessage("Pill's Frequency property is required to be an object with the following properties: [\"times: [10am, 12pm]\", \"days: [\"mon\", \"thurs\", \"fri\"]\"]"),

body("frequency.days")
    .exists().withMessage("")
    .isArray({min: 1}).withMessage("")
    .custom(value => {
        for(let i = 0; i < value.length; i++) {
            if(!isValidDayName(value[i])) {
                throw new Error(`value at index: ${i} in day array is not valid day name. i.e: [mon, tues, wed, thurs, fri, sat, sun] `)
            }
        }

        if(checkForDuplicateDays(value)) {
            throw new Error("Pill's Frequency Day Array cannot contain duplicate days")
        }
    }),
body("frequency.times")
    .exists().withMessage("")
    .isArray({min: 1}).withMessage("")
    .custom(value => {

        // valid enum timeInterval
        for(let i = 0; i < value.length; i++) {
            if (!timeIntervalSymbols.propertyIsEnumerable(value[i])) {
                throw new Error(`value at index: ${i} is not a valid timeInterval`);
            }
        }

        // duplicate check
        if (checkForDuplicatesTimes(value)) {
            throw new Error("Pill's Frequency Times cannot contain duplicate times")
        }

        return true;
    })
    ,(req, res, next) => {
        console.log("inside validator")
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({error: errors.array()[0].msg});
        next();
    }
]