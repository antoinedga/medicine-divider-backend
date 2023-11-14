
const MedicineDividerUserSchema = require("../models/medicineDividerUser")
const InternalResponse = require("./responses/internalResponse");
const medicineRoutineService = require("../services/MedicineRoutineService");
const bcrypt = require("bcryptjs");
const passportJwt = require("../utils/passportJwt")
const {token} = require("morgan");

async function createUser(request, response) {

    let newUser = new MedicineDividerUserSchema();
    let emailExist = await doesEmailExist(request.body.email)
    if (emailExist) {
        return response.status(400).send({msg: "Email already in use"})
    }

    newUser.name = request.body.name;
    newUser.email = request.body.email;
    newUser.dateOfBirth = request.body.dateOfBirth;

    bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(request.body.password, salt,(err, hash) => {
             if (err) throw err;
             console.log("to do hash");
             newUser.password = hash;
             newUser.save().then(result => {
                 console.log("DB " + result)
                 return response.status(201).send({msg: "Successfully created user"})
             }).catch(exception => {
                 console.log(exception);
                 return response.status(500).send({msg: "Error creating account"})
             })
         })
    })
}

async function loginUser(request, response) {
    console.log("Login called")
    return MedicineDividerUserSchema.findOne({ email: request.body.email }).then(user => {
        if (!user) {
            return response.status(404).send(
                {
                    error: "No account associated with this email!"
                })
        }

        bcrypt.compare(request.body.password, user.password).then(async isMatch => {
            // user password matches, create jwt
            console.log("comparing")
            if (isMatch) {
                const payload = {
                    id: user.id,
                    name: user.name
                };

                let token = await passportJwt.signJwt(payload);
                return response.status(200).send({
                    success: true,
                    token: "bearer " + token
                })
            } else {
                return response.status(400).send({error: "Incorrect passworfd"})
            }
        })

    })

async function forgotPasswordRequest(email) {

        MedicineDividerUserSchema.findOne({email: email}).then(result => {
            if (!result) {
                return {
                    error: "No Account associated with that email"
                }
            }
        })
    }
}

function doesEmailExist(email) {
    return MedicineDividerUserSchema.findOne({email: email}).then( result => {
        return result ? true : false;
    })
}

module.exports = {createUser, loginUser};

