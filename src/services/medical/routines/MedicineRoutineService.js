const MedicineDividerUserSchema = require("../../../models/medicineDividerUser")
const getDayToIndexUtil = require("../../../utils/dayUtil")
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

module.exports = {getUserMedicineRoutine}
