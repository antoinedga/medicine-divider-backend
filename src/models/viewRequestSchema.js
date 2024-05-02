const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const USER_MODEL_NAME = "MedicineDividerUser";

const ViewerRequestSchema = new Schema({
    objectId: Schema.ObjectId,
    sender: {
        type: Schema.ObjectId,
        ref: USER_MODEL_NAME,
        required: true,
        index: true
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
        enum: ["ACCEPTED", "PENDING"]
    },
    consent: {
        isAgreed: {
            type: Boolean,
            default: false
        },
        acceptedAt: {
            type: Date,
        }
    }
},
    {
        timestamps: true,
    });

ViewerRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

let model = mongoose.model("ViewRequest", ViewerRequestSchema)

model.createNewViewerRequest = function(sender, receiver) {
    return {sender, receiver};
}
module.exports = ViewRequest = model;
