const mongoose = require("mongoose");
const MedicineDividerUserSchema = require("../models/medicineRoutineUserModel");
const ViewSystem = require("../models/viewSystemModel");
const moment = require("moment")
const {auth0ManageClient} = require("../configs/auth0ManagementClient")
const MedicalResponse = require("../utils/medicalResponse")
async function createUserAndSaveInDB(request) {
    let userData = request.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const existingUser = await auth0ManageClient.usersByEmail.getByEmail({email: userData.email});

        if (existingUser.data.length > 0) {
            return MedicalResponse.error("Email is Already in use", 400)
        }

        // Create user in Auth0
        const userResult = await createAuth0User(request);
        let createdAuth0User = null;
        if (userResult.success) {
            createdAuth0User = userResult.user.data;
        } else {
            return MedicalResponse.error(userResult.message, 400)
        }

        const authId = createdAuth0User.user_id;
        let [provider, userId] = authId.split("|")
        // Create user in Mongoose model
        const medicineUserSchema = new MedicineDividerUserSchema({
            _id: userId,
            auth0Id: authId,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            name: userData.firstName + " " + userData.lastName, // Concatenate first and last name
            dateOfBirth: moment(userData.dateOfBirth, "MM/DD/YYYY").toDate(),
            gender: userData.gender
        });
        const result = await medicineUserSchema.save();

        // Create associated viewSystem document
        const viewingSystem = new ViewSystem({ userId: result._id });
        await viewingSystem.save();

        await session.commitTransaction();
        session.endSession();

        return {
            msg: "User created successfully",
            success: true,
            code: 201,
            userData: createdAuth0User // Optionally return Auth0 user data
        };
    } catch (error) {
        console.error('Error creating user:', error);
        await session.abortTransaction();
        session.endSession();
        return {
            msg: "Error creating user",
            success: false,
            code: 500
        };
    }
}

async function createAuth0User(request) {
    try {
        let userData = request.body;
        let user = await auth0ManageClient.users.create({
            email: userData.email,
            password: userData.password,
            connection: 'Username-Password-Authentication',
            given_name: userData.firstName,
            family_name: userData.lastName,
            user_metadata: {
                gender: userData.gender,
                dateOfBirth: moment(userData.dateOfBirth, "MM/DD/YYYY").toDate()
            }
        });
        return {
            success: true,
            user: user
        }
    } catch (error) {
        if (error.statusCode === 500) {
        }
        else {
            console.log(error)
            return {
                success: false,
                message: "Error:" + error.message
            }
        }
    }

}

module.exports = { createUserAndSaveInDB };
