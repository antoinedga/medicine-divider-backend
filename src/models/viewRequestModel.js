const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const USER_MODEL_NAME = "MedicineDividerUser";

const ViewerRequestSchema = new Schema({
        objectId: Schema.ObjectId,
        sender: {
            type: Schema.ObjectId,
            ref: USER_MODEL_NAME,
            required: true,
            index: true,
            description: "sender is user that wants the receiver to have access to their records"
        },
        receiver: {
            type: Schema.ObjectId,
            ref: USER_MODEL_NAME,
            required: true,
            index: true
        },
        status: {
            type: String,
            required: true,
            default: 'PENDING',
            enum: ["ACCEPTED", "PENDING", 'REJECTED']
        }
    },
    {
        timestamps: true,
    });


let model = mongoose.model("ViewRequest", ViewerRequestSchema)

model.createNewViewRequest = function (sender, receiver) {
    let temp = new model()
    temp.sender = sender;
    temp.receiver = receiver;
    return temp;
}
model.statusEnumAsStrings = ["ACCEPTED", "PENDING", "REJECTED"]

model.getAcceptedStatus = function () {
    return model.statusEnumAsStrings[0];
}
model.getRejectedStatus = function () {
    return model.statusEnumAsStrings[2];
}
model.getPendingStatus = function () {
    return model.statusEnumAsStrings[1];
}
module.exports = ViewRequest = model;
