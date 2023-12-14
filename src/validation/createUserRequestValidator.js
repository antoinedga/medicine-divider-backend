const { body, validationResult } = require('express-validator')

function calculate_age(dob) {
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

module.exports.createUserRequestValidator = [
                body('name', 'name is required').exists().notEmpty().trim().escape(),
                body('email', 'email field is required').exists().isEmail().withMessage("not a valid email").trim().normalizeEmail(),

                body('password').exists().withMessage("Must pass Password to create User").isStrongPassword({       minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1}).withMessage("NOT A STRONG PASSWORD").trim(),
                body('dateOfBirth', "dateOfBirth is required").exists().isISO8601('yyyy-mm-dd').withMessage("Must be in yyyy-mm-dd format").toDate().custom((birthDate, { req }) => {
                    console.log(calculate_age(birthDate))
    if (calculate_age(birthDate) < 18) {
        throw new Error('Must be a minimum age of 18 to register');
    }
    console.log("Successful Date")
    return true
}),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array()}).send();
        next();
    },
    ]
