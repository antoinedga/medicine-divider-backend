const MedicineDividerUserSchema = require("../../../models/medicineDividerUser")
const {getDayToIndexString} = require("../../../utils/dayUtil")
async function getUserMedicineRoutine(userId) {
    try {
        let docs = await MedicineDividerUserSchema.findOne({ id: userId }, null, {lean: true}).exec();
        if (docs == null) {
            console.error("Invalid UserId with Valid token")
            return {
                success: false,
                code: 400,
                msg: "no account with that email"
            }
        }
        return {
            success: true,
            code: 200,
            data: docs
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

async function getUserMedicineRoutineByDay(userId, day) {
    try {
        let index = getDayToIndexString(day);
        let docs = await MedicineDividerUserSchema.findOne({ id: userId }, null,{
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
        return {
            success: false,
            code: 400,
            msg: "ERROR from Database"
        }
    }
}

module.exports = {getUserMedicineRoutine,getUserMedicineRoutineByDay}
