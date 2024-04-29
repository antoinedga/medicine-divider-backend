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
        if (docs == null || docs.length === 0)
            return {
                msg: "no account with that email"
            }
        return {
            msg: "success",
            search: docs
        }
    }).catch(error => {
        throw new Error("Internal Error when searching for users")
    })
}

async function sendViewRequest(request) {
    const decodedToken = req.auth;
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
    // if viewerRequest already sent
    // Check if a viewer request already exists
    const existingRequest = await ViewerRequest.findOne({ sender: userId, receiver: receiver._id });
    if (existingRequest) {
        return res.status(400).json({ message: "Viewer request already sent" });
    }

    const newRequest = new ViewerRequest({ sender: userId, receiver: receiverId });


}

function acceptViewRequest() {

}

function declineViewRequest() {

}

function removeViewerFromAccount() {

}


module.exports = {getAllViewers, searchForUserByEmail, sendViewRequest, acceptViewRequest, declineViewRequest, removeViewerFromAccount}




