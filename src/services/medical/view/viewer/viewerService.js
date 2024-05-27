const MedicineRoutineUser = require("../../../../models/medicineRoutineUserModel");
const ViewSystemModel = require("../../../../models/viewSystemModel")
const MedicalResponse = require("../../../../utils/medicalResponse")

async function getListOfViewers(request) {
    const decodedToken = request.auth;
    // Extract user ID from the decoded JWT token's payload
    const userId = decodedToken.payload.sub;
    const [provider, authId] = userId.split('|');

    let userViewers = await ViewSystemModel.findOne({userId: authId})
        .populate('viewers', 'name email')
        .lean().exec();
    if (userViewers == null) {
        console.log("error")
        return MedicalResponse.internalServerError();
    }

    return MedicalResponse.successWithDataOnly(userViewers, 200)
}

// used within viewRequestService, try catch in that method
async function addNewViewerToList(sender, receiver) {
    try {
        let userViewers = await ViewSystemModel.findOne({userId: sender}).exec();

        if (userViewers == null) {
            console.log("error")
            return MedicalResponse.internalServerError();
        }
        userViewers.viewers.push(receiver)
        await userViewers.save();
        console.log("Successfully added user to list")
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

async function removeFromViewer(request) {
    try {
        const decodedToken = request.auth;
        // Extract user ID from the decoded JWT token's payload
        const userId = decodedToken.payload.sub;
        const [provider, authId] = userId.split('|');

        const userToRemove = await MedicineRoutineUser.findOne({email: request.body.email}).lean().exec();

        const viewerModel = await ViewSystemModel.findOne({userId: authId}).exec();

        if (!userToRemove) {
            return MedicalResponse.error("No such user", 400)
        }

        if (!viewerModel) {
            console.error("ERROR, NO viewerSystem record in database")
            return MedicalResponse.internalServerError();
        }

        viewerModel.viewers = viewerModel.viewers.filter(viewer =>{
            return (viewer.toString !== userToRemove._id)
        });
        await viewerModel.save();
        return MedicalResponse.successWithMessage(`Removed ${userToRemove.email} from viewers list`)
    }
    catch (error) {
        console.log(error)
        return MedicalResponse.internalServerError();
    }
}

module.exports = {getListOfViewers, addNewViewerToList, removeFromViewer}