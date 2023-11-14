
function getDayToIndex(day) {
    console.log("in function instance of: " + typeof day)
    if (day.match(/^[1-7]$/)) {
        console.log("its number")
        let dayToNumber = Number(day)
        return (dayToNumber - 1);
    }

    if (typeof day === "string") {
        console.log("its a string")
        return getDayToIndexString(day)
    }
}

function getDayToIndexString(day) {

    if ("mon".localeCompare(day.toLowerCase()) === 0 || "monday".localeCompare(day.toLowerCase()) === 0) {
        return 0;
    }
    if ("tues".localeCompare(day.toLowerCase()) === 0 ||"tuesday".localeCompare(day.toLowerCase()) === 0 ) {
        return 1;
    }
    if ("wed".localeCompare(day.toLowerCase()) === 0  ||"wednesday".localeCompare(day.toLowerCase()) === 0 ) {
        return 2;
    }
    if ("thur".localeCompare(day.toLowerCase()) === 0  ||"thursday".localeCompare(day.toLowerCase()) === 0 ) {
        return 3;
    }
    if ("fri".localeCompare(day.toLowerCase()) === 0  ||"friday".localeCompare(day.toLowerCase()) === 0 ) {
        return 4;
    }
    if ("sat".localeCompare(day.toLowerCase()) === 0  ||"saturday".localeCompare(day.toLowerCase()) === 0 ) {
        return 5;
    }
    if ("sun".localeCompare(day.toLowerCase()) === 0  ||"sunday".localeCompare(day.toLowerCase()) === 0 ) {
        return 6;
    }

}

module.exports = getDayToIndex;
