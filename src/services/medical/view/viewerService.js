const ViewRequestModel = require("../../../models/viewRequestModel")
const MedicineRoutineUser = require("../../../models/medicineRoutineUserModel");
const ViewSystemModel = require("../../../models/viewSystemModel")


async function getListOfViewers(request) {
    const decodedToken = request.auth;
    // Extract user ID from the decoded JWT token's payload
    const userId = decodedToken.payload.sub;
    const [provider, authId] = userId.split('|');

    let userViewers = await ViewRequestModel.findOne({userId: authId}).lean().exec();

    if (userViewers == null) {
        console.log("error")
        return MedicalResponse.internalServerError();
    }

    return MedicalResponse.successWithDataOnly(userViewers, 200)
}