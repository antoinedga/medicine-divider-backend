const MedicineRoutineUser = require("../../../../models/medicineRoutineUserModel");
const ViewSystemModel = require("../../../../models/viewSystemModel")
const MedicalResponse = require("../../../../utils/medicalResponse")
const mongoose = require("mongoose")

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

async function getMedicalRecordOfUser(request) {
    try {
        const decodedToken = request.auth;
        // Extract user ID from the decoded JWT token's payload
        const userId = decodedToken.payload.sub;
        const [provider, authId] = userId.split('|');
        const emailParam = request.params.email;

        let medicalRecord = await MedicineRoutineUser.findOne({email: emailParam}, "_id name", {lean: true}).exec();

        if (!medicalRecord) {
            return MedicalResponse.error("Unknown user", 404)
        }

        let userViewModel = await ViewSystemModel.findOne({userId: medicalRecord._id}).exec();

        if (!userViewModel) {
            console.log("ERROR in getting viewModel schema")
            return MedicalResponse.error("Unknown Error")
        }

        if (userViewModel.includesViewer(authId)) {
            medicalRecord = await MedicineRoutineUser.findOne({email: emailParam}, "-_id name email medicineRoutine -dateOfBirth", {lean: true}).exec();
        } else {
            return MedicalResponse.error("Unauthorized", 401)
        }
        return MedicalResponse.successWithDataOnly(medicalRecord)

    } catch (error) {
        console.log(error);
        return MedicalResponse.internalServerError();
    }
}

async function removeSelfFromUsersViewerList(request) {
    try {
        const decodedToken = request.auth;
        // Extract user ID from the decoded JWT token's payload
        const userId = decodedToken.payload.sub;
        const [provider, authId] = userId.split('|');
        const emailParam = request.params.email;

        let medicalRecord = await MedicineRoutineUser.findOne({email: emailParam}, "_id name", {lean: true}).exec();

        if (!medicalRecord) {
            return MedicalResponse.error("Unknown user", 404)
        }

        let userViewModel = await ViewSystemModel.findOne({userId: medicalRecord._id}).exec();

        if (!userViewModel) {
            console.log("ERROR in getting viewModel schema")
            return MedicalResponse.error("Unknown Error")
        }

        userViewModel.viewers.filter(viewer => {
            return viewer.toString() !== authId
        });

        await userViewModel.save();

        return MedicalResponse.successWithDataOnly(medicalRecord)

    } catch (error) {
        console.log(error);
        return MedicalResponse.internalServerError();
    }
}

module.exports = {getListOfUserCanView, getMedicalRecordOfUser, removeSelfFromUsersViewerList}