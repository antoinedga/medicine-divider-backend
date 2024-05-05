const {body, validationResult } = require('express-validator')


module.exports = allOccurrenceValidator = [
    body("toDelete").exists().isString().trim().escape()
];
