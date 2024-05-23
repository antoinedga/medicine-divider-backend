const MedicineRoutineUserModel = require("../../../models/medicineRoutineUserModel")
const MONGO_FILTER = "id medicineRoutine.timeIntervals"
const timeIntervalEnum = require("../../../utils/timeIntervalEnum");
const {sortPillsTimeSlots} = require("../../../utils/timeIntervalEnum");
const MedicalResponse = require("../../../utils/medicalResponse")
async function getTimeInterval(userId) {
    try {
        let document = await MedicineRoutineUserModel.findOne({id: userId}, MONGO_FILTER, {
            lean: true
        }).exec();
        return MedicalResponse.successWithDataOnly(document.medicineRoutine.timeIntervals, 200)
    } catch (e) {
        console.error(e)
        return MedicalResponse.internalServerError()
    }
}

async function addTimeInterval(request) {
    const decodedToken = request.auth;
    // Extract user ID from the decoded JWT token's payload
    const userId = decodedToken.payload.sub;
    let document = await MedicineRoutineUserModel.findOne({id: userId}, null, null).exec();

    let newTimeInterval = request.body.times;
    let dbIntervalSet = new Set(document.medicineRoutine.timeIntervals);
    let length = newTimeInterval.length + dbIntervalSet.size;
    if (length > 10) {
        return MedicalResponse.error("cannot have more than 10 time Interval, currently at " + dbInterval.length, 400)
    }

    for (let i = 0; i < newTimeInterval.length; i++) {
        if (dbIntervalSet.has(newTimeInterval[i])) {
            return MedicalResponse.error("cannot insert duplicate time slot", 400)
        }
        dbIntervalSet.add(newTimeInterval[i])
    }
    document.medicineRoutine.timeIntervals = Array.from(dbIntervalSet);
    timeIntervalEnum.sortTimeIntervals(document.medicineRoutine.timeIntervals)
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < newTimeInterval.length; j++) {
            document.medicineRoutine.days[i].pillsTimeSlots.push(MedicineRoutineUserModel.createTimeInterval(newTimeInterval[j]));
        }
    }
    sortPillsTimeSlots(document.medicineRoutine.days)


    let result = await document.save();
    return MedicalResponse.successWithDataOnly(result, 201)
}

async function deleteTimeIntervals(request) {
    try {
        const timesToRemove = request.body.times;

        const decodedToken = request.auth;
        // Extract user ID from the decoded JWT token's payload
        const userId = decodedToken.payload.sub;
        let document = await MedicineRoutineUserModel.findOne({id: userId}, null, null).exec();

        // Remove times from routineRoutes.timeIntervals
        for (let i = 0; i < document.medicineRoutine.timeIntervals.length; i++) {
            const timeInterval = document.medicineRoutine.timeIntervals[i];
            if (timesToRemove.includes(timeInterval)) {
                document.medicineRoutine.timeIntervals.splice(i, 1);
                i--; // Decrement i to adjust for removed item
            }
        }

        // Remove times from pillsTimeSlots arrays within each day object
        document.medicineRoutine.days.forEach(day => {
            day.pillsTimeSlots = day.pillsTimeSlots.filter(slot => !timesToRemove.includes(slot.time));
        });

        // Save the modified document back to the database
        let result = await document.save();
        return {
            success: true,
            code: 201,
            data: result
        };
    }
    catch (error) {
      console.log(error);
        return {
            success: false,
            code: 500,
            data: "INTERNAL ERROR: " + error.msg
        };
    }
}

async function updateTimeIntervals(request) {
    try {
        const decodedToken = request.auth;
        // Extract user ID from the decoded JWT token's payload
        const userId = decodedToken.payload.sub;
        const timeIntervals = request.body.updateTime;

        let document = await MedicineRoutineUserModel.findOne({id: userId}, null, null).exec();
        let existingTimeIntervals = document.medicineRoutine.timeIntervals;
        let result = null;


        for (const {from, to} of timeIntervals) {
            // Validate the update
            result = validateTimeIntervalUpdate(existingTimeIntervals, from, to);
            if (!result.success) {
                return {
                    success: false,
                    code: 400,
                    msg: result.msg
                }
            }
            // If validation passes, update the existing time intervals
            existingTimeIntervals = existingTimeIntervals.map(interval => {
                if (interval === from) {
                    return to;
                }
                return interval;
            });

            // Update timeIntervals array in routineRoutes
            document.medicineRoutine.timeIntervals = existingTimeIntervals;

            // Update pillsTimeSlots for each day
            for (const day of document.medicineRoutine.days) {
                for (const pillsTimeSlot of day.pillsTimeSlots) {
                    if (pillsTimeSlot.time === from) {
                        pillsTimeSlot.time = to;
                    }
                }
            }
        }
        let updatedDocument = await document.save();
        return {
            success: true,
            code: 201,
            data: updatedDocument
        }
    }
    catch (error) {
        console.error(error)
        console.error("ERROR IN UPDATE TIME")
        return {
            success: false,
            code: 500,
            msg: "INTERNAL SERVER ERROR"
        }
    }
}

// Function to validate a single time interval update
const validateTimeIntervalUpdate = (existingTimes, from, to) => {
    // Check if 'from' exists in existing time intervals
    if (!existingTimes.includes(from)) {
        return {
            success: false,
            msg: `Time interval starting at ${from} does not exist`
        }
    }

    // Check if 'to' value is not already present in existing time intervals
    if (existingTimes.includes(to)) {
        return {
            success: false,
            msg: `Time interval ending at ${to} already exists`
        }
    }

    return {
        success: true,
        msg: ""
    }
};

module.exports = {addTimeInterval, getTimeInterval, deleteTimeIntervals, updateTimeIntervals}