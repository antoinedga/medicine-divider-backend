const MedicineDividerUserSchema = require("../models/medicineDividerUser")
const {managementClient, authenticationClient} = require("../configs/auth0client")

async function createUser(request, response) {
    try {
        let email = request.body.email;
        let emailExist = await doesEmailExist(email)

        if (emailExist) {
            return {
                msg: "Email already in use",
                code: 400,
                success: false
            }
        }

        // Create user in Auth0 using email as username
        const createdUser = await authenticationClient.database.signUp({
            connection: 'Username-Password-Authentication',
            email: email,
            username: email, // Use email as username
            password: request.body.password,
        });

        let medicineUserSchema = new MedicineDividerUserSchema();
        medicineUserSchema.id = createdUser.data['_id'];
        medicineUserSchema.name = request.body.name;
        medicineUserSchema.email = request.body.email;
        medicineUserSchema.dateOfBirth = request.body.dateOfBirth;

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

