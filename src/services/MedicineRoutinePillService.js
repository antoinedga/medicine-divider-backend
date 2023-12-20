const MedicineDividerUserSchema = require("../models/medicineDividerUser")
const {getDayToIndex} = require("../utils/getDayToIndex")


async function addPillFromRoutine(request) {
    console.log(request.body)
    MedicineDividerUserSchema.findById(request.user._id).then(document => {
        let addPillRequest = request.body;
        let timeInRequest = addPillRequest.frequency.times;
        console.log(document)
        timeInRequest.forEach(value => {
            if (!document.medicineRoutine.intervals.nameOfTimeSlots.includes(value)) {
                return {
                    success: false,
                    msg: `${value} is not in your TimeInterval, please add to Time Interval before adding Pill to designated time Interval`,
                    code: 400
                }
            }
        })
    })
    return {
        code: 200,
        msg: "successfully added medicine",
        success: true
    }
}


async function removePillFromRoutine(request){
    return {
        code: 200,
        msg: "uwu",
        success: true
    }
}


module.exports = {addPillFromRoutine, removePillFromRoutine}
