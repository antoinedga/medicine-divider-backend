const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const TimeIntervalEnum = require("../utils/timeIntervalEnum")

const PillSchema
    = new Schema({
    name: {type: String, default: "", required: true},
    dosage: {type: String, default: "", required: true},
    delivery: {type: String, default: ""},
    endDate: Date
})

const TimeIntervalSchema
    = new Schema({
    time: {type: String, required: true},
    pills: [PillSchema]

})

const DaysSchema = new Schema({
    name: {type: String, default: ""},
    timeIntervals: {
        type: [TimeIntervalSchema],
        default: null
    }

})


const MedicineRoutineSchema
    = new Schema({
    intervals: {
        nameOfTimeSlots: {
            type:[String],
            default: () => [],
            enum: TimeIntervalEnum.timeIntervalAsArray
        }
    },
    days: {
        type: [DaysSchema],
        validation: [arrayLimit,"{PATH} exceeds the limit of 7(days in the week"],
        default: () => [{name: "Monday"}, {name: "Tuesday"}, {name: "Wednesday"}, {name: "Thursday"}, {name: "Friday"}, {name: "Saturday"}, {name: "Sunday"}]
    },

}, {
    timestamps: {
        updatedAt: 'lasUpdated' // and `updated_at` to store the last updated date
    }
})
function arrayLimit(val) {
    return val.length <= 6;
}

const MedicineDividerUserSchema = new Schema({
    objectId: Schema.ObjectId,
    name: {type: String, default: "", required: true}, // String is shorthand for {type: String}
    email: {type: String, default: "", required: true, index: true, unique: true },
    password: {type: String, required: true},
    dateOfBirth: {type: Date, default: null, required: true},
    medicineRoutine: {type: MedicineRoutineSchema, default: () => ({})},
    listOfViewers: [Schema.ObjectId]
},
    {
        timestamps: true
    });

module.exports = MedicineDividerUser = mongoose.model("MedicineDividerUser", MedicineDividerUserSchema);
