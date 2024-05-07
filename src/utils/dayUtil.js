

function getDayToIndexString(day) {

    if ("mon".localeCompare(day.toLowerCase()) === 0 || "monday".localeCompare(day.toLowerCase()) === 0) {
        return 0;
    }
    if ("tue".localeCompare(day.toLowerCase()) === 0 ||"tuesday".localeCompare(day.toLowerCase()) === 0 ) {
        return 1;
    }
    if ("wed".localeCompare(day.toLowerCase()) === 0  ||"wednesday".localeCompare(day.toLowerCase()) === 0 ) {
        return 2;
    }
    if ("thu".localeCompare(day.toLowerCase()) === 0  ||"thursday".localeCompare(day.toLowerCase()) === 0 ) {
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

const VALID_LONG_DAYS_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const VALID_SHORT_DAYS_NAMES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const isValidDayName = value => {
    // Convert the input value to lowercase for case-insensitive comparison
    const lowercaseValue = value.toLowerCase();
    // Check if the lowercase value is included in either the full or shorthand day names array
    return VALID_LONG_DAYS_NAMES.includes(lowercaseValue) || VALID_SHORT_DAYS_NAMES.includes(lowercaseValue);
};

const containsOnlyAll = (value) => {
    return Array.isArray(value) && value.length === 1 && value[0] === 'all';
};

module.exports = {
    getDayToIndexString,
    VALID_SHORT_DAYS_NAMES,
    VALID_LONG_DAYS_NAMES,
    isValidDayName,
    containsOnlyAll
};
