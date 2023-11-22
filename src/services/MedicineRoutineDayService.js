const MedicineDividerUserSchema = require("../models/medicineDividerUser")
const {getDayToIndex} = require("../utils/getDayToIndex")


async function getRoutineByDay(request) {
    let dayIndex = getDayToIndex(request.params.day)
    return MedicineDividerUserSchema.findById(request.user.id, "id medicineRoutine.days").then(result => {
        console.log("day index is " + dayIndex)
        console.log(result.medicineRoutine.days[dayIndex])
        return {
            success: true,
            code: 200,
            msg: "successfully got " + request.params.day
        }
    })
}


module.exports = {getRoutineByDay}