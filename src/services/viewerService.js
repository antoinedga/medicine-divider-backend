const MedicineDividerUserSchema = require("../models/medicineDividerUser")



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

function sendViewRequest() {

}

function acceptViewRequest() {

}

function declineViewRequest() {

}

function removeViewerFromAccount() {

}


module.exports = {getAllViewers, searchForUserByEmail, sendViewRequest, acceptViewRequest, declineViewRequest, removeViewerFromAccount}




