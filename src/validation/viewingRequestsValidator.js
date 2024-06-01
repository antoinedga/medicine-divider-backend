const {validationResult, param} = require("express-validator");

module.exports.viewingEmailParamValidator =
    [
        param("email").isEmail().trim().escape(),
        (req, res, next) => {
            console.log("inside validator for time")
            const errors = validationResult(req);
            console.log((JSON.stringify(errors.array())))
            if (!errors.isEmpty())
                return res.status(400).json({errors: errors.array()});
            next();
        }
    ]