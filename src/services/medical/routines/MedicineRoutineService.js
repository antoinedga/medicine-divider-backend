const MedicineRoutineUserModel = require("../../../models/medicineRoutineUserModel")
const {getDayToIndexString} = require("../../../utils/dayUtil")
const MedicalResponse = require('../../../utils/medicalResponse')
async function getUserMedicineRoutine(userId) {
    try {
        let docs = await MedicineRoutineUserModel.findOne({ id: userId }, null, {lean: true}).exec();
        if (docs == null) {
            console.error("Invalid UserId with Valid token")
            return MedicalResponse.error("no account with that email", 400)
        }
        return MedicalResponse.success(docs, null, 200)
    }
    catch (error) {
        console.log(error)
        return MedicalResponse.internalServerError();
    }
}

async function getUserMedicineRoutineByDay(userId, day) {
    try {
        let index = getDayToIndexString(day);
        let docs = await MedicineRoutineUserModel.findOne({ id: userId }, null,{
            lean: true
        }).exec();
        if (docs == null) {
            console.error("Invalid UserId with Valid token")
            return {
                success: false,
                code: 400,
                msg: "no account with that userId"
            }
        }
        return {
            success: true,
            code: 200,
            data: docs.medicineRoutine.days[index]

        }
    }
    catch (error) {
        console.log(error)
        return MedicalResponse.internalServerError();
    }
}

module.exports = {getUserMedicineRoutine,getUserMedicineRoutineByDay}
