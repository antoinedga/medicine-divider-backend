const MedicineDividerUserSchema = require("../../../models/medicineDividerUser")
const ViewerRequest = require("../../../models/viewRequestSchema");


async function getAllViewers(request) {
    try {
        const decodedToken = request.auth;
        // Extract user ID from the decoded JWT token's payload
        const userId = decodedToken.payload.sub;
        const [provider, id] = userId.split("|");
        let result = await ViewerRequest.find({
            sender: id,
            status: "PENDING"
        }, "-sender -__v -createdAt -updatedAt").lean()
            .populate("receiver", "name email").exec();
        if (result != null && result.length > 0) {
            result.forEach(request => {
                delete request.receiver._id;
                request.consentUrl = generateConsentUrl(request._id);
            })
        } else {
            result = []
        }

        return {
            success: true,
            code: 200,
            data: result
        }
    }
    catch (error) {
        console.error(error);
        return {
            success: false,
            code: 500,
            msg: "INTERNAL SERVER ERROR"
        }
    }
}

function generateConsentUrl(viewerRequestId) {
    return process.env.API_VERSION_PATH + process.env.API_VIEWER_PATH + process.env.API_VIEWER_REQUEST_PATH + `/${viewerRequestId}/consent`;
}

async function searchForUserByEmail(email) {
    try {
        let result = await MedicineDividerUserSchema.find({email: email}, "name email", null).lean().exec();

        return {
            success: true,
            code: 200,
            data: result
        }
    }
    catch (error) {
        console.log(error);
        return {
            success: false,
            code: 500,
            msg: "INTERNAL SERVER ERROR"
        }
    }
}

async function sendViewRequest(request) {
    try {
        const decodedToken = request.auth;
        // Extract user ID from the decoded JWT token's payload
        const userId = decodedToken.payload.sub;
        const [provider, authId] = userId.split("|");
        const receiver = await MedicineDividerUserSchema.findOne({email: request.body.email}, '_id name email', null).exec();
        // if receiver exist
        if (!receiver) {
            return {
                success: false,
                code: 404,
                msg: "No User with Email to send Viewer Request"
            }
        }

        const receiverId = receiver._id;

        // if viewerRequest already sent
        // Check if a viewer request already exists
        const existingRequest = await ViewerRequest.findOne(
            {sender: authId, receiver: receiverId}, null, null);
        if (existingRequest) {
            return {
                success: false,
                code: 400,
                msg: "Request already exist"
            };
        }

        const newRequest = ViewerRequest.createNewViewerRequest(authId, receiverId);
        await newRequest.save();
        return {
            success: true,
            code: 201,
            msg: "Successfully created viewer Request"
        }
    }
    catch (error) {
        console.error(error)
        console.log("Internal Error when sending viewer Request")
        return {
            msg: "INTERNAL SERVER ERROR",
            success: false,
            code: 500,
        }
    }
}

async function getViewerRequestById(request) {
    let requestId = request.params.requestId;
    console.log(requestId)
    let viewerRequest = await ViewerRequest.findById(requestId, "-sender").lean().populate("receiver", "name email").exec();

    if (viewerRequest === undefined || viewerRequest == null) {
        return {
            code: 404,
            msg: "No such Request with that Id",
            success: false
        }
    }
    if (viewerRequest.status === "ACCEPTED") {
        return {
            code: 200,
            msg: "Request Already Accepted",
            success: true
        }
    }
    viewerRequest.consentUrl = generateConsentUrl(viewerRequest._id);
    delete viewerRequest.receiver._id;
    return {
        code: 200,
        data: viewerRequest,
        success: true
    }

}

async function getViewerRequestConsent(request) {
    const decodedToken = request.auth;
    // Extract user ID from the decoded JWT token's payload
    const userId = decodedToken.payload.sub;
    const [provider, id] = userId.split("|");

    let requestId = request.params.requestId;
    console.log(requestId)
    let viewerRequest = await ViewerRequest.findById(requestId, "-sender").lean().populate("receiver", "name email").exec();

    if (viewerRequest === undefined || viewerRequest == null) {
        return {
            code: 404,
            msg: "No such Request with that Id",
            success: false
        }
    }
    if (viewerRequest.status === "ACCEPTED") {
        return {
            code: 200,
            msg: "Request Already Accepted",
            success: true
        }
    }

    return {
        code: 200,
        data: viewerRequest,
        success: true
    }
}
function acceptViewRequest(request) {

}

function declineViewRequest() {

}

function removeViewerFromAccount() {

}

async function getAllApprovedViewers(request) {
    try {
        const decodedToken = request.auth;
        // Extract user ID from the decoded JWT token's payload
        const userId = decodedToken.payload.sub;
        const [provider, id] = userId.split("|");
        let result = await ViewerRequest.find({
            sender: id,
            status: "ACCEPTED"
        }, "-sender -__v -createdAt -updatedAt").lean()
            .populate("receiver", "name email").exec();

        let formatted = result.map(doc => {
            return {
                id: doc._id,
                name: doc.receiver.name,
                email: doc.receiver.email
            }
        })

        return {
            success: true,
            code: 200,
            data: formatted
        }
    }
    catch (error) {
        console.error(error);
        return {
            success: false,
            code: 500,
            msg: "INTERNAL SERVER ERROR"
        }
    }

}

module.exports = {getAllViewers, getViewerRequestById, searchForUserByEmail, sendViewRequest, getAllApprovedViewers}




