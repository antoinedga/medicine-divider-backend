const {body, sanitizeBody,  validationResult} = require("express-validator");


module.exports.loginRequestValidator = [
    body('email', 'email field is required').exists().isEmail().withMessage("not a valid email").normalizeEmail().escape(),
    body('password').exists().withMessage("Must pass Password to create User").not().isEmpty().withMessage("must provide password to authenticate").trim().escape(),
    (req, res, next) => {
    console.log("inside validator")
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array()});
        next();
    }
]
