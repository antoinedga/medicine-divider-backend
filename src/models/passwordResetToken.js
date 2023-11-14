const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const passwordResetToken = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'MedicineDividerUser'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 3600
    }
})

module.exports = mongoose.model("passwordResetToken", passwordResetToken);
