const MedicineRoutineUser = require("../../../../models/medicineRoutineUserModel");
const ViewSystemModel = require("../../../../models/viewSystemModel")
const MedicalResponse = require("../../../../utils/medicalResponse")
const LOGGER = require("../../../../configs/loggerWinston")

async function getListOfViewers(request) {
    try {
        // Extract user ID from the decoded JWT token's payload
        const userId = request.userId;

        let userViewers = await ViewSystemModel.findOne({userId: userId}, null, null)
            .populate('viewers', 'name email')
            .lean().exec();

        if (userViewers == null) {
            LOGGER.error(request, "Somehow valid auth0 User but no ViewSystemModel")
            return MedicalResponse.internalServerError();
        }
        LOGGER.info(request, "Successfully got List Of Viewers")
        return MedicalResponse.successWithDataOnly(userViewers, 200)
    }
    catch (error) {
        LOGGER.error(request, error.message);
        LOGGER.debug(request, error.stack);
        return MedicalResponse.internalServerError();
    }
}

// used within viewRequestService, try catch in that method
async function addNewViewerToList(request, sender, receiver) {
    try {
        let userViewers = await ViewSystemModel.findOne({userId: sender}).exec();

        if (userViewers == null) {
            LOGGER.error(request, "Somehow valid auth0 User but no ViewSystemModel")
            return MedicalResponse.internalServerError();
        }
        userViewers.viewers.push(receiver)
        await userViewers.save();
        LOGGER.info(request, "Successfully added user to list")
    }
    catch (error) {
        // error log can be done in other function for accept request
        throw error
    }
}

async function removeFromViewer(request) {
    try {
        // Extract user ID from the decoded JWT token's payload
        const userId = request.userId;
        const userToRemove = await MedicineRoutineUser.findOne({email: request.body.email}).lean().exec();

        const viewerModel = await ViewSystemModel.findOne({userId: userId}).exec();

        if (!userToRemove) {
            LOGGER.info(request, `No Such User found ${request.body.email}`)
            return MedicalResponse.error("No such user", 400)
        }

        if (!viewerModel) {
            LOGGER.error(request,"User does not have a ViewSystem record in database")
            return MedicalResponse.internalServerError();
        }

        viewerModel.viewers = viewerModel.viewers.filter(viewer =>{
            return (viewer.toString() !== userToRemove._id.toString())
        });
        await viewerModel.save();
        LOGGER.info(request, `Removed ${userToRemove.email} from viewers list of ${authId}`)
        return MedicalResponse.successWithMessage(`Removed ${userToRemove.email} from viewers list`)
    }
    catch (error) {
        LOGGER.error(request, error.message)
        LOGGER.debug(request, error.stack)
        return MedicalResponse.internalServerError();
    }
}

module.exports = {getListOfViewers, addNewViewerToList, removeFromViewer}