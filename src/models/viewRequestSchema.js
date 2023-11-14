const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ViewRequestSchema = new Schema({
    objectId: Schema.ObjectId,
    requester: {
        type: Schema.ObjectId,
        required: true
    },
    recipient: {
        type: Schema.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'PENDING',
        enum: ["ACCEPTED", "PENDING", "REJECTED"]
    }
},
    {
        timestamps: true,
    })

let model = mongoose.model("ViewRequest", ViewRequestSchema)

ViewRequestSchema.statics.createViewRequest = function(requester, recipient) {
    let temp = new model()
    temp.requester = requester;
    temp.recipient = recipient;
    return temp;
}
module.exports = ViewRequest = model;
