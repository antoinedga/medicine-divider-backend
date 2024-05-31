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

// Custom instance method to check if ObjectId exists in viewers array
ViewSystemSchema.methods.includesViewer = function (authId) {
    const authIdAsObjectId = new mongoose.Types.ObjectId(authId);
    return this.viewers.some(id => id.equals(authIdAsObjectId));
};

let model = mongoose.model("ViewSystem", ViewSystemSchema)

// model.includesViewer = function (authId) {
//     const authIdAsObjectId = new mongoose.Types.ObjectId(authId);
//     return this.viewers.some(id => id.equals(authIdAsObjectId));
// };
module.exports = ViewSystem = model
