const MedicineRoutineUser = require("../../../../models/medicineRoutineUserModel");
const ViewSystemModel = require("../../../../models/viewSystemModel")
const MedicalResponse = require("../../../../utils/medicalResponse")
const LOGGER = require("../../../../configs/loggerWinston");

async function getListOfUserCanView(request) {
    try {
        // Extract user ID from the decoded JWT token's payload
        const userId = request.userId;

        const viewSystems = await ViewSystemModel.find({ viewers: userId })
            .select("userId")
            .populate('userId', 'name email -_id')
            .lean();
        if (!viewSystems) {
            LOGGER.error(request, "ERROR, User does not have viewingSystem record in database")
            return MedicalResponse.internalServerError();
        }
        let data = viewSystems.map(view => {
            return {
                name: view.userId.name,
                email: view.userId.email
            }
        });
        LOGGER.info(request, "successfully got List of other Users that this user has access to")
        return MedicalResponse.successWithDataOnly(data, 200);
    }
    catch (error) {
        LOGGER.error(request, error.message)
        LOGGER.debug(request, error.stack)
        return MedicalResponse.internalServerError();
    }
}

async function getMedicalRecordOfUser(request) {
    try {
        const userId = request.userId;
        const emailParam = request.params.email;

        let medicalRecord = await MedicineRoutineUser.findOne({email: emailParam}, "_id name", {lean: true}).exec();

        if (!medicalRecord) {
            return MedicalResponse.error("Unknown user", 404)
        }

        let userViewModel = await ViewSystemModel.findOne({userId: medicalRecord._id}).exec();

        if (!userViewModel) {
            LOGGER.error(request,"ERROR in getting viewModel schema")
            return MedicalResponse.error("Unknown Error")
        }

        if (userViewModel.includesViewer(userId)) {
            medicalRecord = await MedicineRoutineUser.findOne({email: emailParam}, "-_id name email medicineRoutine -dateOfBirth", {lean: true}).exec();
        } else {
            LOGGER.error(request, `user does not have access to ${emailParam}`)
            return MedicalResponse.error("Unauthorized", 401)
        }
        return MedicalResponse.successWithDataOnly(medicalRecord)

    } catch (error) {
        LOGGER.debug(request, error.stack)
        LOGGER.error(request, error.message)
        return MedicalResponse.internalServerError();
    }
}

async function removeSelfFromUsersViewerList(request) {
    try {
        // Extract user ID from the decoded JWT token's payload
        const userId = request.userId;
        const emailParam = request.params.email;

        let medicalRecord = await MedicineRoutineUser.findOne({email: emailParam}, "_id name", {lean: true}).exec();

        if (!medicalRecord) {
            LOGGER.error(request, "Error, valid auth0 token, but no user record")
            return MedicalResponse.error("Unknown user", 404)
        }

        let userViewModel = await ViewSystemModel.findOne({userId: medicalRecord._id}).exec();

        if (!userViewModel) {
            console.log("ERROR in getting viewModel schema")
            return MedicalResponse.error("Unknown Error")
        }

        userViewModel.viewers.filter(viewer => {
            return viewer.toString() !== userId
        });

        await userViewModel.save();
        LOGGER.info(request, `User got ${emailParam} medical records`)
        return MedicalResponse.successWithDataOnly(medicalRecord)
    } catch (error) {
        LOGGER.debug(request, error.stack)
        LOGGER.error(request, error.message)
        return MedicalResponse.internalServerError();
    }
}

module.exports = {getListOfUserCanView, getMedicalRecordOfUser, removeSelfFromUsersViewerList}