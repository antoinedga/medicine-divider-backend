const MedicineRoutineUserModel = require("../../../models/medicineRoutineUserModel")
const {getDayToIndexString} = require("../../../utils/dayUtil")
const MedicalResponse = require('../../../utils/medicalResponse')
const logger = require("../../../configs/loggerWinston")
async function getUserMedicineRoutine(request, userId) {
    try {
        let docs = await MedicineRoutineUserModel.findOne({ id: userId }, null, {lean: true}).exec();
        if (docs == null) {
            logger.error(request,"Invalid UserId with Valid token")
            return MedicalResponse.error("no account with that email", 400)
        }
        logger.info(request, `Successfully got ${userId} MedicalRoutine`)
        return MedicalResponse.success(docs, null, 200)
    }
    catch (error) {
        logger.error(error)
        return MedicalResponse.internalServerError();
    }
}

async function getUserMedicineRoutineByDay(request, userId, day) {
    try {
        let index = getDayToIndexString(day);
        let docs = await MedicineRoutineUserModel.findOne({ id: userId }, null,{
            lean: true
        }).exec();
        if (docs == null) {
            logger.error(request,"Invalid UserId with Valid token")
            return {
                success: false,
                code: 400,
                msg: "no account with that userId"
            }
        }
        logger.info(request, `Successfully got ${userId} for '${day}'`)
        return {
            success: true,
            code: 200,
            data: docs.medicineRoutine.days[index]
        }
    }
    catch (error) {
        logger.error(error)
        return MedicalResponse.internalServerError();
    }
}

module.exports = {getUserMedicineRoutine,getUserMedicineRoutineByDay}
