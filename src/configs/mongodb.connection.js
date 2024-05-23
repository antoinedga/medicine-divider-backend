const mongoose = require('mongoose');
const MedicineDividerUserSchema = require("../models/medicineRoutineUserModel")
const ViewRequest = require("../models/viewRequestModel")
const {bootstrap} = require("../bootstrap/addUsersWithViewingSystem")
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_URL, {
            useNewUrlParser: true,
        });
        console.log(`MongoDB Connected`);
        bootstrap();
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;