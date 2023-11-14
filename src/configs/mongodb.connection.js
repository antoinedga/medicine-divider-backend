const mongoose = require('mongoose');
const MedicineDividerUserSchema = require("../models/medicineDividerUser")
const PasswordRestToken = require("../models/passwordResetToken")
const ViewRequest = require("../models/viewRequestSchema")
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_URL, {
            useNewUrlParser: true,
        });
        console.log(`MongoDB Connected`);
        MedicineDividerUserSchema.deleteMany({});
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;