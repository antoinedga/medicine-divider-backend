const MedicineDividerUserSchema = require("../models/medicineDividerUser")
var Mongoose = require('mongoose');


async function getUserMedicineRoutine(userId) {
    return await MedicineDividerUserSchema.findById({_id: userId},"medicineRoutine").then((docs) => {
        if (docs == null || docs.length === 0)
            return {
                success: false,
                msg: "no account with that email"
            }
        return {
            success: true,
            medicineRoutine: docs
        }
    }).catch((err) => {
        return { success: false, msg: err.msg}
    })
}


async function getUsersInfoForPasswordReset(email) {
    return await MedicineDividerUserSchema.find({email: email}, "email id name").then(doc => {
        return doc;
    })
}



async function addTimeIntervalToUser(request) {
    return await MedicineDividerUserSchema.findById(request.user._id, "id medicineRoutine.intervals").then(result => {
        let newTimeInterval = request.body.newTime;
        let dbInterval = result.medicineRoutine.intervals.nameOfTimeSlots;
        let dbIntervalSet = new Set(dbInterval)

        for(let i = 0; i < newTimeInterval.length; i++) {
            if (dbIntervalSet.has(newTimeInterval[i])) {
                return { success: false,
                msg: "cannot insert duplicate time slot"}
            }
        }
        let length = newTimeInterval.length + dbInterval.length;

        if (length > 10) {
            return {success: false,
            msg: "cannot have more than 10 time Interval, currently at " + dbInterval.length}
        }

         return MedicineDividerUserSchema.findById(request.user.id).then(docs => {
            let newInterval = [...docs.medicineRoutine.intervals.nameOfTimeSlots, ...newTimeInterval];
            docs.medicineRoutine.intervals.nameOfTimeSlots = newInterval
            console.log("new " + newInterval)
            return MedicineDividerUserSchema.findByIdAndUpdate(request.user.id, {medicineRoutine:{intervals: {nameOfTimeSlots: newInterval}}}
            ).then(result, error => {
                console.log("error " + error)
                console.log(result)
                return {
                    success: true,
                    interval: result.medicineRoutine.intervals
                }
            })
        })
    })
}

module.exports = {getUserMedicineRoutine, getUsersInfoForPasswordReset, addTimeIntervalToUser}
