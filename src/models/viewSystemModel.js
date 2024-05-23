const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const USER_MODEL_NAME = "MedicineDividerUser";


const ViewSystemSchema = new Schema({
        objectId: Schema.ObjectId,
        userId: {
            type: Schema.ObjectId,
            ref: USER_MODEL_NAME,
            required: true,
            index: true,
            unique: true
        },
        viewers: {
            type: [{
                type: Schema.ObjectId,
                ref: USER_MODEL_NAME
            }],
            default: [],
            description: "Users who have access to this record."
        }
    },
    {
        timestamps: true
    });

let model = mongoose.model("ViewSystem", ViewSystemSchema)

module.exports = ViewSystem = model
