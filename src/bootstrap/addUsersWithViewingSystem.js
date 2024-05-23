const MedicineRoutineUserModel = require("../models/medicineRoutineUserModel");
const ViewingSystem = require("../models/viewSystemModel");


module.exports.bootstrap = async () => {
    let docs = await MedicineRoutineUserModel.find().exec();
    let viewDocs = await ViewingSystem.find().exec();

    if (docs.length === viewDocs.length)
        return;

    docs.forEach(async doc => {
        let view = new ViewingSystem();
        view.userId = doc._id
        await view.save();
    });
}
