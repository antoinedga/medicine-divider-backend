const MedicineDividerUserSchema = require("../models/medicineDividerUser")

async function getUserMedicineRoutine(userId) {
    return MedicineDividerUserSchema.findById({_id: userId},"medicineRoutine").then((docs) => {
        if (docs == null || docs.length === 0)
            return {
                success: false,
                code:400,
                msg: "no account with that email"
            }
        return {
            success: true,
            code: 200,
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
    return MedicineDividerUserSchema.findById(request.user._id, "id medicineRoutine.intervals").then(async result => {
        let newTimeInterval = request.body.newTime;
        let dbInterval = result.medicineRoutine.intervals.nameOfTimeSlots;
        let dbIntervalSet = new Set(dbInterval)

        for (let i = 0; i < newTimeInterval.length; i++) {
            if (dbIntervalSet.has(newTimeInterval[i])) {
                return {
                    success: false,
                    code: 400,
                    msg: "cannot insert duplicate time slot"
                }
            }
        }
        let length = newTimeInterval.length + dbInterval.length;

        if (length > 10) {
            return {
                success: false,
                code: 400,
                msg: "cannot have more than 10 time Interval, currently at " + dbInterval.length
            }
        }

        return MedicineDividerUserSchema.findById(request.user.id).then(async docs => {
            let newInterval = [...docs.medicineRoutine.intervals.nameOfTimeSlots, ...newTimeInterval];
            docs.medicineRoutine.intervals.nameOfTimeSlots = newInterval
            console.log("new " + newInterval)

            let updatedUser = await MedicineDividerUserSchema.findByIdAndUpdate(request.user.id, {medicineRoutine: {intervals: {nameOfTimeSlots: newInterval}}}, {new: true}
            );

            let updatedDays = updateDaysForNewTimeIntervals(updatedUser, newInterval)
            console.log("new with timeInterval " + updatedDays)
            updatedUser = await MedicineDividerUserSchema.findByIdAndUpdate(request.user.id, updatedDays, {new: true})

            return {
                success: true,
                code: 201,
                interval: updatedUser.medicineRoutine.intervals
            }
        })
    })
}

function updateDaysForNewTimeIntervals(model, newTimeIntervals) {
    let daysArray = model.medicineRoutine.days;
    for(let time of newTimeIntervals) {
        for(let i = 0; i < daysArray.length; i++) {
            console.log("2nd for loop")
            let interval = MedicineDividerUserSchema.createTimeInterval(time);
            daysArray[i].timeIntervals.push(interval)
            console.log(daysArray[i])
        }
    }
    console.log("days " + daysArray)
    return model;
}

function removeDaysForDeletedTimeIntervals(model, deleteInterval) {
    let daysArray = model.medicineRoutine.days;
    for(let time of deleteInterval) {
        for(let i = 0; i < daysArray.length; i++) {
            console.log("before " + daysArray[i])
            daysArray[i].timeIntervals = daysArray[i].timeIntervals.filter(item => {
                return time.localeCompare(item.time) !== 0
            })
            console.log("After " + daysArray[i])
        }
    }
    return model;
}


async function deleteTimeInterval(request) {
    return await MedicineDividerUserSchema.findById(request.user.id, "id medicineRoutine").then(docs => {
        let removal = request.body.removeInterval;
        let docsIntervals = docs.medicineRoutine.intervals.nameOfTimeSlots
        let filtered = docsIntervals.filter(time => !removal.includes(time))
        console.log("filtered: " + filtered)
        removeDaysForDeletedTimeIntervals(docs, removal)
        return MedicineDividerUserSchema.findByIdAndUpdate(request.user.id, {medicineRoutine:{intervals: {nameOfTimeSlots: filtered}}}).then(result => {
            return { success: true, msg: "updated", code: 200}
        })
    }).catch(error => {
        console.log(error)
        return {success: false,
            code: 500,
            msg: "Internal Sever Error"}
    })
}

module.exports = {getUserMedicineRoutine, getUsersInfoForPasswordReset, addTimeIntervalToUser, deleteTimeInterval}
