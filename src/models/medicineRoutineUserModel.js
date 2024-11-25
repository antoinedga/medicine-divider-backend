const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TimeIntervalEnum = require("../utils/timeIntervalEnum");

const PillSchema = new Schema({
    name: { type: String, default: "", required: true },
    dosage: { type: String, default: "", required: true },
    delivery: { type: String, default: "" },
    endDate: Date
}, {
    _id: false
});

const TimeIntervalSchema = new Schema({
    time: { type: String, required: true },
    pills: [PillSchema]
}, {
    _id: false
});

const DaysSchema = new Schema({
    name: { type: String, default: "" },
    pillsTimeSlots: {
        type: [TimeIntervalSchema],
        default: null
    }
}, {
    _id: false
});

const MedicineRoutineSchema = new Schema({
    timeIntervals: [{
        type: String,
        default: () => [],
        enum: TimeIntervalEnum.timeIntervalAsArray
    }],
    days: {
        type: [DaysSchema],
        validation: [arrayLimit, "{PATH} exceeds the limit of 7(days in the week"],
        default: () => [{ name: "Monday" }, { name: "Tuesday" }, { name: "Wednesday" }, { name: "Thursday" }, { name: "Friday" }, { name: "Saturday" }, { name: "Sunday" }]
    }
}, {
    timestamps: {
        updatedAt: 'lasUpdated' // and `updated_at` to store the last updated date
    },
    _id: false
});

function arrayLimit(val) {
    return val.length <= 6;
}

const MedicineDividerUserSchema = new Schema({
    _id: {type: String, required: true},
    auth0Id: { type: String, required: true, unique: true }, // Use Auth0 user_id as ID
    email: { type: String, required: true, index: true, unique: true },
    name: { type: String, required: true },
    firstName: {type: String, required:true, minLength: 3, maxLength: 50},
    middleName: {type:String, default: "", maxLength: 50},
    lastName: {type: String, required: true, maxLength: 50},
    dateOfBirth: { type: Date, required: true},
    gender: {type: String, maxLength: 25},
    medicineRoutine: { type: MedicineRoutineSchema, default: () => ({}) },
}, {
    timestamps: true,
});

const medicineRoutineModel = mongoose.model("MedicineDividerUser", MedicineDividerUserSchema);
module.exports = medicineRoutineModel;

medicineRoutineModel.createTimeInterval = function (time) {
    return {
        time: time,
        pills: []
    };
};

medicineRoutineModel.createPill = function (name, dosage, delivery, endDate) {
    return {
        name, dosage, delivery, endDate
    };
};

medicineRoutineModel.createDay = function (name, dosage, delivery, endDate) {
    return {
        name, dosage, delivery, endDate
    };
};

// Middleware function to apply toObject transformation
MedicineDividerUserSchema.post('findOne', function (doc, next) {
    if (doc) {
        return next(null, doc.toObject());
    }
    return next(); // Call next without modifying if no document is found
});
