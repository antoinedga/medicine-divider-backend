const MedicineRoutineUser = require("../../../../models/medicineRoutineUserModel");
const ViewSystemModel = require("../../../../models/viewSystemModel")
const MedicalResponse = require("../../../../utils/medicalResponse")


async function getListOfUserCanView(request) {
    try {
        const decodedToken = request.auth;
        // Extract user ID from the decoded JWT token's payload
        const userId = decodedToken.payload.sub;
        const [provider, authId] = userId.split('|');

        const viewSystems = await ViewSystemModel.find({ viewers: authId })
            .select("userId")
            .populate('userId', 'name email -_id')
            .lean();

        let data = viewSystems.map(view => {
            return {
                name: view.userId.name,
                email: view.userId.email
            }
        })
        return MedicalResponse.successWithDataOnly(data, 200);
    }
    catch (error) {
        console.error(error)
        return MedicalResponse.internalServerError();
    }
}

module.exports = {getListOfUserCanView}