const {body,   validationResult} = require("express-validator");
const {timeIntervalSymbols} = require("../utils/timeIntervalEnum");

function checkForDuplicatesTimes(array) {
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

module.exports.newTimeIntervalValidators = [
    body('times').exists().custom( value => {
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
        if (checkForDuplicatesTimes(value)) {
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

module.exports.deleteTimeIntervalValidators = [
    body('times').exists().custom( value => {
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
        if (checkForDuplicatesTimes(value)) {
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

module.exports.updateTimeIntervalValidator = [
    body('updateTime').exists().isArray({min: 1, max: 5}).withMessage('updateTime must be an array'),
    body("updateTime.*").isObject().withMessage("must be an object"),
    body("updateTime.*.to").exists().custom(isTimeEnum.bind(null, "to")),
    body("updateTime.*.from").exists().custom(isTimeEnum.bind(null, "from"))
    ,(req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(400).json({error: errors.array()[0].msg});
        }
        next();
    }
];

function isTimeEnum(field, value) {
    if (!timeIntervalSymbols.propertyIsEnumerable(value)) {
        throw new Error(`value in '${field}' as ${value} is not a valid timeInterval`);
    }
    return true;
}
