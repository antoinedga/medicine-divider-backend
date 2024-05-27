const {query,   validationResult, body} = require("express-validator");
const VIEWER_REQUEST_STATUS = ["pending", "accepted"];
const validateEmailQueryParam = (req, res, next) => {
    // Check if there are any query parameters other than 'email'
    const allowedParams = ['email'];
    const invalidParams = Object.keys(req.query).filter(param => !allowedParams.includes(param));

    // If there are any invalid parameters, return an error
    if (invalidParams.length > 0) {
        return res.status(400).json({ error: `Invalid query parameter(s): ${invalidParams.join(', ')}` });
    }

    // If all query parameters are valid, move to the next middleware
    next();
};

module.exports.viewerGetValidator = [
    query("status").optional().trim().escape()
        .isString()
        .isIn(VIEWER_REQUEST_STATUS)
]

module.exports.viewerSearchValidator = [
    validateEmailQueryParam,
    query("email").notEmpty().trim().escape(),
    (req, res, next) => {
        console.log("inside validator for time")
        const errors = validationResult(req);
        console.log((JSON.stringify(errors.array())))
        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array()});
        next();
    }
]

module.exports.viewerCreationValidator = [
    body("email").notEmpty().trim().escape().isEmail(),
    (req, res, next) => {
        console.log("inside validator for time")
        const errors = validationResult(req);
        console.log((JSON.stringify(errors.array())))
        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array()});
        next();
    }
]
