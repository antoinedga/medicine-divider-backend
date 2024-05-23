const ViewRequestModel = require("../../../models/viewRequestModel")
const MedicineRoutineUser = require("../../../models/medicineRoutineUserModel");
const ViewSystemModel = require("../../../models/viewSystemModel")
const MedicalResponse = require('../../../utils/medicalResponse');
const VIEWER_REQUEST_ALREADY_REJECTED = "Viewer request is already rejected";
const VIEWER_REQUEST_ALREADY_ACCEPTED = "Viewer request is already accepted";

async function searchForUserByEmail(request){
    let emailToSearch = request.query.email;
    let user = await MedicineRoutineUser.findOne({email: emailToSearch}, "name email", {lean: true}).exec();
    if (!user) {
        return MedicalResponse.error("NO user found with that email", 404);
    }

    return MedicalResponse.successWithDataOnly(user, 200);
}

async function sendRequest(request) {
    try {
        const decodedToken = request.auth;
        let existingRequest = null;
        // Extract user ID from the decoded JWT token's payload
        const userId = decodedToken.payload.sub;
        const [provider, authId] = userId.split('|');

        let receiverDoc = MedicineRoutineUser.findOne({email: request.body.email}, "id name email", {lean: true}).exec();
        if (receiverDoc == null) {
            return MedicalResponse.error("No Such Users to Send Request", 400);
        }
        // check if this user has a pending request from sender already
        existingRequest = ViewRequestModel.findOne({
            receiver: receiverDoc._id,
            sender: authId
        }).sort({updatedAt: -1}).lean().exec();

        if (existingRequest && existingRequest.status === ViewRequestModel.getPendingStatus()) {
            return MedicalResponse.error("viewer request already sent and pending", 400);
        }

        // create a new Viewer Request
        const viewerRequest = ViewRequestModel.createNewViewRequest(authId, receiverDoc._id);
        await viewerRequest.save();
        return MedicalResponse.success(null, "Viewer Request Sent", 201);
    } catch (error) {
        return MedicalResponse.internalServerError()
    }
}

async function getViewerRequestById(request) {
    try {
        const decodedToken = request.auth;
        // Extract user ID from the decoded JWT token's payload
        const userId = decodedToken.payload.sub;
        const [provider, authId] = userId.split('|');
        const requestId = request.params.requestId;

        let viewerRequest = await ViewRequestModel.findById(requestId).lean().exec();

        if (!viewerRequest) {
            return MedicalResponse.error("Request Not Found", 404);
        }

        return MedicalResponse.successWithDataOnly( viewerRequest,200)
    }
    catch (error) {
        console.log(error)
        return MedicalResponse.internalServerError();
    }
}

async function acceptViewerRequest(request) {
    try {
        const decodedToken = request.auth;
        // Extract user ID from the decoded JWT token's payload
        const userId = decodedToken.payload.sub;
        const [provider, authId] = userId.split('|');
        const requestId = request.params.requestId;

        const viewerRequest = await ViewRequestModel.findById(requestId);

        if (!viewerRequest) {
            return MedicalResponse.error("Viewer Request not found", 404)
        }

        if (viewerRequest.receiver !== authId) {
            return MedicalResponse.error("This is not your request to Accept, UnAuthorized", 401)
        }

        if (viewerRequest.status === ViewRequestModel.getAcceptedStatus()) {
            return MedicalResponse.error("Viewer request is already accepted", 400);
        }

        if (viewerRequest.status === ViewRequestModel.getRejectedStatus()) {
            return MedicalResponse.error("Viewer request was rejected, cannot be accepted. Make a new Request", 400);
        }

        // Update the status to 'accepted'
        viewerRequest.status = ViewRequestModel.getAcceptedStatus();
        await viewerRequest.save();

        // Add the sender to the recipient's viewers list
        const recipient = await ViewSystemModel.findOne({userId: viewerRequest.receiver});
        recipient.viewers.push(viewerRequest.sender);
        await recipient.save();
        return MedicalResponse.successWithMessage("Viewer Request Accepted", 200);
    } catch (error) {
        console.error(error);
        return MedicalResponse.internalServerError();
    }
}

async function rejectViewerRequest(request) {
    const decodedToken = request.auth;
    // Extract user ID from the decoded JWT token's payload
    const userId = decodedToken.payload.sub;
    const [provider, authId] = userId.split('|');
    const requestId = request.params.requestId;

    const viewerRequest = await ViewRequestModel.findById(requestId);
    if (!viewerRequest) {
        return MedicalResponse.error("Viewer Request Not Found", 404);
    }

    if (viewerRequest.status === ViewRequestModel.getRejectedStatus() || viewerRequest.status === ViewRequestModel.getAcceptedStatus()) {
        let msg = (viewerRequest.status === ViewRequestModel.getRejectedStatus() ? VIEWER_REQUEST_ALREADY_REJECTED : VIEWER_REQUEST_ALREADY_ACCEPTED);
        return MedicalResponse.error(msg, 400);
    }

    viewerRequest.status = ViewRequestModel.getRejectedStatus();
    await viewerRequest.save();
    return MedicalResponse.successWithMessage(`Viewer request set to '${ViewRequestModel.getRejectedStatus()}'`);
}

async function getPendingRequests(request, isSender) {
    try {
        const decodedToken = request.auth;
        // Extract user ID from the decoded JWT token's payload
        const userId = decodedToken.payload.sub;
        const [provider, authId] = userId.split('|');
        // this will be for two flows, if getting pending request as a sender or as a receiver
        const filter = filterForGetPendingRequest(authId, isSender);

        const listOfPendingRequests = await ViewSystemModel.find(filter).populate('sender', 'name email').lean();
        return MedicalResponse.successWithMessage(listOfPendingRequests)
    } catch (error) {
        console.log(error)
        return MedicalResponse.internalServerError();
    }
}

function filterForGetPendingRequest(userId, ifSenderFlow) {
    let filter = {
        status: ViewRequestModel.getPendingStatus()
    }
    if (ifSenderFlow) {
        filter.sender = userId
    } else {
        filter.receiver = userId
    }
    return filter
}

async function cancelRequestToBeSender(request) {
    const decodedToken = request.auth;
    // Extract user ID from the decoded JWT token's payload
    const userId = decodedToken.payload.sub;
    const [provider, authId] = userId.split('|');
}

module.exports = {getViewerRequestById, sendRequest, acceptViewerRequest, rejectViewerRequest, getPendingRequests, searchForUserByEmail, cancelRequestToBeSender}

