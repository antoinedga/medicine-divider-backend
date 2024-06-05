const ViewRequestModel = require("../../../../../models/viewRequestModel")
const MedicineRoutineUser = require("../../../../../models/medicineRoutineUserModel");
const viewModelService = require('../viewerService')
const MedicalResponse = require('../../../../../utils/medicalResponse');
const VIEWER_REQUEST_ALREADY_REJECTED = "Viewer request is already rejected";
const VIEWER_REQUEST_ALREADY_ACCEPTED = "Viewer request is already accepted";

const LOGGER = require("../../../../../configs/loggerWinston")
const {logger} = require("../../../../../configs/loggerWinston");

async function searchForUserByEmail(request){
    let emailToSearch = request.query.email;

    logger.info(`User: ${request.auth.payload.sub} searched for \'${emailToSearch}\'`)

    let user = await MedicineRoutineUser.findOne({email: emailToSearch}, "name email", {lean: true}).exec();

    if (!user) {
        return MedicalResponse.error("NO user found with that email", 404);
    }

    return MedicalResponse.successWithDataOnly(user, 200);
}

async function sendRequest(request) {
    try {
        let existingRequest = null;
        // Extract user ID from the decoded JWT token's payload
        const userId = request.userId;

        let receiverDoc = await MedicineRoutineUser.findOne({email: request.body.email}, "id name email", {lean: true}).exec();

        if (receiverDoc == null) {
            return MedicalResponse.error("No Such Users to Send Request", 400);
        }
        // check if this user has a pending request from sender already
        existingRequest = await ViewRequestModel.findOne({
            receiver: receiverDoc._id,
            sender: userId
        }).sort({updatedAt: -1}).lean().exec();

        if (existingRequest && existingRequest.status === ViewRequestModel.getPendingStatus()) {
            return MedicalResponse.error("viewer request already sent and pending", 400);
        }

        // create a new Viewer Request
        const viewerRequest = ViewRequestModel.createNewViewRequest(userId, receiverDoc._id);
        await viewerRequest.save();
        return MedicalResponse.success( null, "Viewer Request Sent", 201);
    } catch (error) {
        console.log(error)
        return MedicalResponse.internalServerError()
    }
}

async function getViewerRequestById(request) {
    try {
        // Extract user ID from the decoded JWT token's payload
        const userId = request.userId;
        const requestId = request.params.requestId;

        let viewerRequest = await ViewRequestModel.findById(requestId)
            .populate('sender', 'name email')
            .populate("receiver", 'name email')
            .lean().exec();

        if (!viewerRequest) {
            LOGGER.error(request, `ViewerRequest: ${requestId} Not Found`)
            return MedicalResponse.error("Request Not Found", 404);
        }
        LOGGER.info(request, `Successfully retrieved viewerRequest ${requestId}`)
        return MedicalResponse.successWithDataOnly( viewerRequest,200)
    }
    catch (error) {
        LOGGER.debug(request, error.message)
        LOGGER.error(request, error.stack)
        return MedicalResponse.internalServerError();
    }
}

async function acceptViewerRequest(request) {
    try {
        // Extract user ID from the decoded JWT token's payload
        const userId = request.userId;
        const requestId = request.params.requestId;

        const viewerRequest = await ViewRequestModel.findById(requestId);

        if (!viewerRequest) {
            return MedicalResponse.error("Viewer Request not found", 404)
        }

        if (viewerRequest.receiver.toString() !== userId) {
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
        await viewModelService.addNewViewerToList(request, viewerRequest.sender, viewerRequest.receiver)

        return MedicalResponse.successWithMessage("Viewer Request Accepted", 200);
    } catch (error) {
        LOGGER.error(request, error.message)
        LOGGER.debug(request, error.stack)
        return MedicalResponse.internalServerError();
    }
}

async function rejectViewerRequest(request) {
    try {
        // Extract user ID from the decoded JWT token's payload
        const userId = request.userId;
        const requestId = request.params.requestId;

        const viewerRequest = await ViewRequestModel.findById(requestId, null, null).exec();

        if (!viewerRequest) {
            return MedicalResponse.error("Viewer Request Not Found", 404);
        }

        if (viewerRequest.receiver.toString() !== userId) {
            return MedicalResponse.error("Unauthorized: cannot reject request that you are not the receiver", 401)
        }

        if (viewerRequest.status === ViewRequestModel.getRejectedStatus() || viewerRequest.status === ViewRequestModel.getAcceptedStatus()) {
            let msg = (viewerRequest.status === ViewRequestModel.getRejectedStatus() ? VIEWER_REQUEST_ALREADY_REJECTED : VIEWER_REQUEST_ALREADY_ACCEPTED);
            LOGGER.info(request, msg);
            return MedicalResponse.error(msg, 400);
        }

        viewerRequest.status = ViewRequestModel.getRejectedStatus();

        await viewerRequest.save();
        LOGGER.info(request, `Viewer request updated to  ${ViewRequestModel.getRejectedStatus()}`)
        return MedicalResponse.successWithMessage(`Viewer request set to '${ViewRequestModel.getRejectedStatus()}'`);
    }
    catch (error) {
        LOGGER.debug(request, error.message)
        LOGGER.error(request, error.stack)
        return MedicalResponse.internalServerError();
    }
}

async function getPendingRequests(request, isSender) {
    try {
        // Extract user ID from the decoded JWT token's payload
        const userId = request.userId;

        const listOfPendingRequestsReceived = await ViewRequestModel.find({status: 'PENDING', receiver: userId})
            .populate('sender', 'name email')
            .populate("receiver", 'name email')
            .lean();

        const listOfPendingRequestsSent = await ViewRequestModel
            .find({status: ViewRequestModel.getPendingStatus(), sender: userId})
            .populate('sender', 'name email')
            .populate("receiver", 'name email')
            .lean();

        let data = {
            sent: listOfPendingRequestsSent,
            received:listOfPendingRequestsReceived
        }
        LOGGER.info(request, "Successfully got list of Received and Sent Request")
        return MedicalResponse.successWithDataOnly(data)
    } catch (error) {
        LOGGER.debug(request, error.message)
        LOGGER.error(request, error.stack)
        return MedicalResponse.internalServerError();
    }
}

async function cancelRequestToBeSender(request) {
    try {
        // Extract user ID from the decoded JWT token's payload
        const userId = request.userId;

        const requestId = request.params.requestId;

        const viewerRequest = await ViewRequestModel.findById(requestId, null, null);
        if (!viewerRequest) {
            LOGGER.info(request, `Cannot find Viewer Request ${requestId}`)
            return MedicalResponse.error("Viewer Request Not Found", 404);
        }
        if (viewerRequest.sender.toString() !== userId) {
            return MedicalResponse.error("Unauthorized: Cannot cancel request that you did not sent", 401)
        }

        viewerRequest.status = ViewRequestModel.getCanceledStatus();
        await viewerRequest.save();
        LOGGER.info(request, `Successfully canceled Viewer Request ${requestId}`)
        return MedicalResponse.successWithMessage("Successfully Canceled Request")
    }
    catch (error) {
        LOGGER.debug(request, error.message)
        LOGGER.error(request, error.stack)
        return MedicalResponse.internalServerError();
    }
}

module.exports = {getViewerRequestById, sendRequest, acceptViewerRequest, rejectViewerRequest, getPendingRequests, searchForUserByEmail, cancelRequestToBeSender}

