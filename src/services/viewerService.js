const MedicineDividerUserSchema = require("../models/medicineDividerUser")
const ViewerRequest = require("../models/viewRequestSchema");


function getAllViewers(userId) {
    MedicineDividerUserSchema.findById(userId, "listOfViewers").then(docs => {
        return {
            msg: "success",
            viewers: docs
        }
    }).catch(error => {
        console.log(error)
    })
}

function searchForUserByEmail(email) {
    return MedicineDividerUserSchema.find({name: new RegExp(email, 'i')}, "name email").then(docs => {
        return {
            data: docs == null || docs.length === 0 ? [] : docs
        }
    }).catch(error => {
        console.log("Internal Error when searching for users")
        return {
            success: false,
            code: 500,
            msg: "Internal Server Error"
        }
    })
}

async function sendViewRequest(request) {
    try {
        const decodedToken = request.auth;
        // Extract user ID from the decoded JWT token's payload
        const userId = decodedToken.payload.sub;

        const receiver = await MedicineDividerUserSchema.findOne({email: req.body.email}, '_id name email').exec();
        // if receiver exist
        if (!receiver) {
            return {
                success: false,
                code: 404,
                msg: "No User with Email to send Viewer Request"
            }
        }
        const receiverId = receiver.id;

        // if viewerRequest already sent
        // Check if a viewer request already exists
        const existingRequest = await ViewerRequest.findOne({sender: userId, receiver: receiverId});
        if (existingRequest) {
            return {
                success: false,
                code: 400,
                msg: "Request already exist"
            };
        }

        const newRequest = ViewerRequest.createNewViewerRequest(userId, receiverId);
        await newRequest.save();
        return {
            success: true,
            code: 201,
            msg: "Successfully created viewer Request"
        }
    }
    catch (error) {
        console.log("Internal Error when sending viewer Request")
        return {
            success: false,
            code: 500,
        }
    }
}

async function getViewerRequest(request) {

}
function acceptViewRequest() {

}

function declineViewRequest() {

}

function removeViewerFromAccount() {

}


module.exports = {getAllViewers, searchForUserByEmail, sendViewRequest, acceptViewRequest, declineViewRequest, removeViewerFromAccount}




