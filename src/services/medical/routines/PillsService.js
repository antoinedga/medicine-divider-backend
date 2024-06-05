const MedicineRoutineUserModel = require("../../../models/medicineRoutineUserModel");
const {getDayToIndexString, areDaysNameEqual} = require("../../../utils/dayUtil");
const LOGGER = require("../../../configs/LOGGERWinston")
const MedicalResponse = require('../../../utils/medicalResponse')
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
        LOGGER.info(request,'Document updated successfully:', result);
        return MedicalResponse.successWithMessage(`successfully updated, added ${numberOfAdded} pill${numberOfAdded >= 2 ? "s" : ""} to routine`, 201)
    }
    catch (error) {
        LOGGER.debug(request, error.stack)
        LOGGER.error(request, error.message)
        return MedicalResponse.internalServerError()
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
        LOGGER.info(request,`Successfully removed ${numberOfDeletes} pills`)
        return new MedicalResponse(true,`Successfully removed ${numberOfDeletes} pills`, 200, document)
    }
    catch (error) {
        LOGGER.debug(request, error.stack);
        LOGGER.error(request, error.message);
        return MedicalResponse.internalServerError()
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
        LOGGER.info(request, `Removed ${numberOfDeletes} pills`)
        return MedicalResponse.success(document,`Successfully removed ${numberOfDeletes} pills`, 201)
    }
    catch (error) {
        LOGGER.debug(request, error.stack);
        LOGGER.error(request, error.message);
        return MedicalResponse.internalServerError();
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
        LOGGER.info(request, `Deleted ${numberOfDeletes} Pill` + (numberOfDeletes > 0 ? 's' : ''))
        return MedicalResponse.success(document, `Deleted ${numberOfDeletes} Pill` + (numberOfDeletes > 0 ? 's' : ''))
    }
    catch (error) {
        LOGGER.debug(request, error.stack)
        LOGGER.error(request, error.message);
        return MedicalResponse.internalServerError()
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
            LOGGER.error(request, `ERROR: user with id: ${userId} from auth0 is valid but no record in database!`)
            return MedicalResponse.internalServerError()
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
        LOGGER.info(request, "User got list of medicines names")
        return MedicalResponse.successWithDataOnly({pills: uniquePillNames})
    }
    catch (error) {
        LOGGER.error(request, error.message);
        LOGGER.debug(request, error.stack);
        return MedicalResponse.internalServerError()
    }
}

module.exports = {addPillToRoutine, deletePillFromRoutineByAllOccurrence, deletePillFromRoutineByDayTime, deletePillFromRoutineByDays, getAllPillsInRoutine}
