const mongoose = require('mongoose');
const MedicineDividerUserSchema = require("../models/medicineDividerUser")
const PasswordRestToken = require("../models/passwordResetToken")
const ViewRequest = require("../models/viewRequestSchema")
const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://antoineMac:Adga7241805@cluster0.al0gwkk.mongodb.net/?retryWrites=true&w=majority', {
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