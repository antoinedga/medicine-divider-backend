const MedicineRoutineUserModel = require("../../../models/medicineRoutineUserModel");
const {getDayToIndexString, areDaysNameEqual} = require("../../../utils/dayUtil");


async function addPillToRoutine(request) {
    try {
        const decodedToken = request.auth;
        // Extract user ID from the decoded JWT token's payload
        const userId = decodedToken.payload.sub;

        let documents = await MedicineRoutineUserModel.findOne({ id: userId }, null, null).exec();
        let pillsToAdd = request.body.pillsToAdd;

        let dayRoutine = null;
        let numberOfAdded = 0;
        pillsToAdd.forEach(pillRequest => {

            pillRequest.days.forEach(day => {

                let dayIndex = getDayToIndexUtil.getDayToIndexString(day);
                dayRoutine = documents.medicineRoutine.days[dayIndex];
                dayRoutine.pillsTimeSlots.forEach(timeSlot=> {

                    if (pillRequest.times.includes(timeSlot.time)) {
                        timeSlot.pills.push(
                            MedicineRoutineUserModel.createPill(pillRequest.pill.name,
                                pillRequest.pill.dosage, null, null))
                        numberOfAdded++;
                    }
                })
            })
        });
        let result = await documents.save();
        console.log('Document updated successfully:', result);
        return {
            success: true,
            code: 201,
            msg: `successfully updated, added ${numberOfAdded} pill${numberOfAdded >= 2 ? "s" : ""} to routine`
        }
    }
    catch (error) {
        console.log(error)
        return {
            success: false,
            code: 400,
            msg: "ERROR from Database"
        }
    }
}

async function deletePillFromRoutineByAllOccurrence(request) {
    try {
        let toDelete = request.body.toDelete;
        const decodedToken = request.auth;
        // Extract user ID from the decoded JWT token's payload
        const userId = decodedToken.payload.sub;

        let document = await MedicineRoutineUserModel.findOne({ id: userId }).exec();

        let days = document.medicineRoutine.days;
        let numberOfDeletes = 0;
        days.forEach(day => {
            day.pillsTimeSlots.forEach(individualPillTimeSlot => {
                individualPillTimeSlot.pills =
                    individualPillTimeSlot.pills.filter(pill => {
                        let result = pill.name !== toDelete;
                        if(!result) {
                            numberOfDeletes++;
                        }
                        return result;
                    });
            });
        });


        return {
            success: true,
            code: 200,
            msg: `Successfully removed ${numberOfDeletes}`,
            data: document
        }
    }
    catch (error) {
        console.info(error)
        console.info("ERROR IN PILL SERVICE");
        return {
            success: false,
            code: 500,
            msg: "INTERNAL SERVER ERROR"
        }
    }
}

async function deletePillFromRoutineByDays(request) {
    try {
        const decodedToken = request.auth;
        // Extract user ID from the decoded JWT token's payload
        const userId = decodedToken.payload.sub;

        let document = await MedicineRoutineUserModel.findOne({ id: userId }, null, null).exec();

        let data = request.body;
        let index = null;
        let target = null;
        let numberOfDeletes = 0;
        data.days.forEach(day => {

            index = getDayToIndexString(day)
            target = document.medicineRoutine.days[index];

            target.pillsTimeSlots.forEach(individualPillTimeSlot => {
                individualPillTimeSlot.pills =
                    individualPillTimeSlot.pills.filter(pill => {
                        let result = pill.name !== data.pill;
                        if (!result) {
                            numberOfDeletes++;
                        }
                        return result;
                    });
            });
        });
        document = await document.save();
        return {
            success: true,
            code: 200,
            msg: `Successfully removed ${numberOfDeletes}`,
            data: document
        }
    }
    catch (error) {
        console.log(error)
        console.info("ERROR IN PILL SERVICE");
        return {
            success: false,
            code: 500,
            msg: "INTERNAL SERVER ERROR"
        }
    }
}

async function deletePillFromRoutineByDayTime(request) {
    try {
        const decodedToken = request.auth;
        // Extract user ID from the decoded JWT token's payload
        const userId = decodedToken.payload.sub;
        let data = request.body;
        let document = await MedicineRoutineUserModel.findOne({ id: userId }).exec();

        let target = null;
        let index = null;
        let targetSlot = null;
        let numberOfDeletes = 0;
        data.days.forEach(day => {
            index = getDayToIndexString(day);
            target = document.medicineRoutine.days[index];
            data.times.forEach(time => {
                targetSlot = target.pillsTimeSlots.find(slot => areDaysNameEqual(slot.time,time));
                targetSlot.pills = targetSlot.pills.filter(pill => {
                    let result = (pill.name.localeCompare(data.pill.toLowerCase()) !== 0)
                    if (!result)
                        numberOfDeletes++;
                    return result;
                });
            })
        });
        document = await document.save();
        return {
            success: true,
            code: 200,
            msg: `Deleted ${numberOfDeletes} Pill` + (numberOfDeletes > 0 ? 's' : ''),
            data: document
        }
    }
    catch (error) {
        console.debug(error)
        console.info("ERROR IN PILL SERVICE");
        return {
            success: false,
            code: 500,
            msg: "INTERNAL SERVER ERROR"
        }
    }
}

//Get all the Pills Names
async function getAllPillsInRoutine(request) {
    try {
        const decodedToken = request.auth;
        // Extract user ID from the decoded JWT token's payload
        const userId = decodedToken.payload.sub;

        let document = await MedicineRoutineUserModel.findOne({id: userId}, null, {lean: true}).exec();

        if (document == null) {
            console.error(`ERROR: user with id: ${userId} from auth0 is valid but no record in database!`)
            return {
                success: false,
                code: 400,
                msg: "User Does Not Exist"
            }
        }

        const allPillNames = [];

        document.medicineRoutine.days.forEach(day => {
            day.pillsTimeSlots.forEach(timeSlot => {
                timeSlot.pills.forEach(pill => {
                    allPillNames.push(pill.name);
                });
            });
        });

// Remove duplicates
        const uniquePillNames = [...new Set(allPillNames)];
        return {
            success: true,
            code: 200,
            data: {
                pills: uniquePillNames
            }
        }
    }
    catch (error) {
        console.debug(error);
        console.error("ERROR IN GET ALL PILLS");
        return {
            success: true,
            code: 200,
            msg: "INTERNAL SERVER ERROR"
        }
    }
}

module.exports = {addPillToRoutine, deletePillFromRoutineByAllOccurrence, deletePillFromRoutineByDayTime, deletePillFromRoutineByDays, getAllPillsInRoutine}
