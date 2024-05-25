const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const USER_MODEL_NAME = "MedicineDividerUser";

const VIEWER_REQUEST_STATUS = ["ACCEPTED", "PENDING", "REJECTED", "CANCELED"]

const ViewerRequestSchema = new Schema({
        objectId: Schema.ObjectId,
        sender: {
            type: Schema.ObjectId,
            ref: USER_MODEL_NAME,
            required: true,
            index: true,
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
            default: "PENDING",
            enum: VIEWER_REQUEST_STATUS
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
model.statusEnumAsStrings = VIEWER_REQUEST_STATUS

model.getAcceptedStatus = function () {
    return VIEWER_REQUEST_STATUS[0];
}
model.getPendingStatus = function () {
    return VIEWER_REQUEST_STATUS[1];
}
model.getRejectedStatus = function () {
    return VIEWER_REQUEST_STATUS[2];
}
model.getCanceledStatus = function () {
    return VIEWER_REQUEST_STATUS[3];
}
module.exports = ViewRequest = model;
