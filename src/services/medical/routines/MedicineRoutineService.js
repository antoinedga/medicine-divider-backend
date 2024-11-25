const MedicineRoutineUserModel = require("../../../models/medicineRoutineUserModel")
const {getDayToIndexString} = require("../../../utils/dayUtil")
const MedicalResponse = require('../../../utils/medicalResponse')
const LOGGER = require("../../../configs/loggerWinston")
async function getUserMedicineRoutine(request) {
    try {
        let docs = await MedicineRoutineUserModel.findOne({ _id: request.userId }, null, {lean: true}).exec();
        if (docs == null) {
            LOGGER.error(request,"Invalid UserId with Valid token")
            return MedicalResponse.error("no account with that email", 400)
        }
        LOGGER.info(request, `Successfully got ${request.userId} MedicalRoutine`)
        return MedicalResponse.success(docs, null, 200)
    }
    catch (error) {
        LOGGER.error(request, error.message)
        LOGGER.debug(request, error.stack)
        return MedicalResponse.internalServerError();
    }
}

async function getUserMedicineRoutineByDay(request, day) {
    try {
        let index = getDayToIndexString(day);
        let docs = await MedicineRoutineUserModel.findOne({ id: request.userId }, null,{
            lean: true
        }).exec();
        if (docs == null) {
            LOGGER.error(request,"Invalid UserId with Valid token")
            return MedicalResponse.error("no account with that userId")
        }
        LOGGER.info(request, `Successfully got ${request.userId} for '${day}'`)
        return MedicalResponse.successWithDataOnly(docs.medicineRoutine.days[index])
    }
    catch (error) {
        LOGGER.error(request, error.stack)
        LOGGER.debug(request, error.message)
        return MedicalResponse.internalServerError();
    }
}

module.exports = {getUserMedicineRoutine,getUserMedicineRoutineByDay}
