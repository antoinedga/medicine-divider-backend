const MedicineDividerUserSchema = require("../../models/medicineDividerUser")

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
        let docs = await MedicineDividerUserSchema.findOne({ id: userId }).exec();

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
