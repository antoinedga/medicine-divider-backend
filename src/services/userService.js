const MedicineDividerUserSchema = require("../models/medicineDividerUser")
const {managementClient, authenticationClient} = require("../configs/auth0client")

async function createUser(request) {
    try {
        let data = request.body;
        console.log("received: " + data)
        let medicineUserSchema = new MedicineDividerUserSchema();
        medicineUserSchema.id = data.userId;
        medicineUserSchema.name = data.firstName + " " + data.lastName;
        medicineUserSchema.email = data.email;
        medicineUserSchema.dateOfBirth = Date.parse(data.dateOfBirth);

        let result = await medicineUserSchema.save();
        console.log("DB " + result);

        return {
            msg: "User created successfully",
            success: true,
            code: 201
        };
    } catch (error) {
        console.log(error);
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

