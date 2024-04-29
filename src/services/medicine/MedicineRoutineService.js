const MedicineDividerUserSchema = require("../../models/medicineDividerUser")
const getDayToIndexUtil = require("../../utils/dayUtil")
async function getUserMedicineRoutine(userId) {
    try {
        let docs = await MedicineDividerUserSchema.findOne({ id: userId }).exec();
        if (docs == null || docs.length === 0)
            return {
                success: false,
                code: 400,
                msg: "no account with that email"
            }
        return {
            success: true,
            code: 200,
            medicineRoutine: docs
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

async function addPillToRoutine(request) {
    try {
        const decodedToken = request.auth;
        // Extract user ID from the decoded JWT token's payload
        const userId = decodedToken.payload.sub;

        let documents = await MedicineDividerUserSchema.findOne({ id: userId }).exec();
        let pillsToAdd = request.body.pillsToAdd;

        let dayRoutine = null;
        let numberOfAdded = 0;
        pillsToAdd.forEach(pillRequest => {

            pillRequest.days.forEach(day => {

                let dayIndex = getDayToIndexUtil.getDayToIndex(day);
                dayRoutine = documents.medicineRoutine.days[dayIndex];
                dayRoutine.pillsTimeSlots.forEach(timeSlot=> {

                    if (pillRequest.times.includes(timeSlot.time)) {
                        timeSlot.pills.push(
                        MedicineDividerUserSchema.createPill(pillRequest.pill.name,
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

module.exports = {getUserMedicineRoutine, addPillToRoutine}
