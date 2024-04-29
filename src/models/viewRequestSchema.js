const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ViewerRequestSchema = new Schema({
    objectId: Schema.ObjectId,
    sender: {
        type: Schema.ObjectId,
        required: true
    },
    receiver: {
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

let model = mongoose.model("ViewRequest", ViewerRequestSchema)

ViewerRequestSchema.statics.createViewRequest = function(sender, receiver) {
    let temp = new model()
    temp.sender = sender;
    temp.receiver = receiver;
    return temp;
}
module.exports = ViewRequest = model;
