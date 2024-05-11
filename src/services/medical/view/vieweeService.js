const ViewerRequest = require("../../../models/viewRequestSchema");

async function getAllUserCanView(request) {
    try {
        const decodedToken = request.auth;
        // Extract user ID from the decoded JWT token's payload
        const userId = decodedToken.payload.sub;
        const [provider, id] = userId.split("|");
        let result = await ViewerRequest.find({
            receiver: id,
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