const mongoose = require("mongoose");
const MedicineDividerUserSchema = require("../models/medicineRoutineUserModel");
const ViewSystem = require("../models/viewSystemModel");

async function createUser(request) {
    // start mongo transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let data = request.body;
        console.log("received: " + data)
        let medicineUserSchema = new MedicineDividerUserSchema();
        const [provider, authId] = data.userId.split('|')
        medicineUserSchema._id = authId;
        medicineUserSchema.id = data.userId;
        medicineUserSchema.name = data.firstName + " " + data.lastName;
        medicineUserSchema.email = data.email;
        medicineUserSchema.dateOfBirth = new Date(1995, 6, 6)

        let result = await medicineUserSchema.save();
        console.log("DB " + result);

        let viewingSystem = new ViewSystem();
        viewingSystem.userId = result._id;
        await viewingSystem.save();

        // end transaction
        await session.commitTransaction();
        await session.endSession();
        return {
            msg: "User created successfully",
            success: true,
            code: 201
        };
    } catch (error) {
        console.log(error);
        await session.abortTransaction();
        await session.endSession();
        return {
            msg: "Error creating user",
            success: false,
            code: 500
        };
    }
}

async function doesEmailExist(email) {
    let usersByEmail = await managementClient.usersByEmail.getByEmail({email: email});
    return usersByEmail && usersByEmail.data.length > 0;
}


module.exports = {createUser};

