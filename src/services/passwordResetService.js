const MedicineDividerUserSchema = require("../models/medicineDividerUser")
const medicineRoutineService = require("../services/MedicineRoutineService");
const PasswordResetTokenSchema = require("../models/passwordResetToken")
const crypto = require("crypto");

const requestPasswordReset = async (email, response) => {
     medicineRoutineService.getUsersInfoForPasswordReset(email).then( async doc => {
        if (doc == null) {
            return response.status(404).send({msg: "No account associated to this email"})
        }
        let token = await passwordResetTokenSchema.findOne({ userId: user._id });
        if (token) {
            await token.deleteOne()
        }

        let resetToken = crypto.randomBytes(32).toString("hex");

        await bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(resetToken, salt, async (error, hash) => {
                if (error) {
                    return response.status(500).send({msg: "ERROR on our end, please try again later"})
                }

                await new PasswordResetTokenSchema({
                    userId: doc._id,
                    token: hash,
                    createdAt: Date.now(),
                }).save();

                const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;

            })
        })





     }).catch(error => {

    })

}