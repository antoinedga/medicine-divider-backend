
const timeIntervalSymbols = {
        "12am": Symbol("12am"),
        "1am": Symbol("1am"),
        "2am": Symbol("2am"),
        "3am": Symbol("3am"),
        "4am": Symbol("4am"),
        "5am": Symbol("5am"),
        "6am": Symbol("6am"),
        "7am": Symbol("7am"),
        "8am": Symbol("8am"),
        "9am": Symbol("9am"),
        "10am": Symbol("10am"),
        "11am": Symbol("11am"),
        "12pm": Symbol("12pm"),
        "1pm": Symbol("1pm"),
        "2pm": Symbol("2pm"),
        "3pm": Symbol("3pm"),
        "4pm": Symbol("4pm"),
        "5pm": Symbol("5pm"),
        "6pm": Symbol("6pm"),
        "7pm": Symbol("7pm"),
        "8pm": Symbol("8pm"),
        "9pm": Symbol("9pm"),
        "10pm": Symbol("10pm"),
        "11pm": Symbol("11pm"),
    }
const timeIntervalAsArray =
        ["12am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am", "11am",
         "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm", "11pm",
        ]


function sortTimeIntervals(intervals) {
        // Define a function to convert time intervals to comparable values
        function convertToComparable(timeString) {
                // Extract the hour and AM/PM indicator from the time string
                const hour = parseInt(timeString);
                const ampm = timeString.slice(-2); // Extract last 2 characters (AM/PM)
                // Convert 12-hour format to 24-hour format for sorting
                if (ampm.toLowerCase() === 'pm' && hour !== 12) {
                        return hour + 12;
                } else if (ampm.toLowerCase() === 'am' && hour === 12) {
                        return 0;
                }
                return hour;
        }
        // Sort the intervals based on the converted values
        intervals.sort((a, b) => {
                const convertedA = convertToComparable(a);
                const convertedB = convertToComparable(b);
                return convertedA - convertedB;
        });
}


// Custom sorting function for pillsTimeSlots array
function sortPillsTimeSlots(days) {
        days.forEach(day => {
                day.pillsTimeSlots.sort((a, b) => {
                        // Extract hour and AM/PM indicator from time strings
                        let hourA = parseInt(a.time);
                        let hourB = parseInt(b.time);
                        const ampmA = a.time.slice(-2); // Extract last 2 characters (AM/PM)
                        const ampmB = b.time.slice(-2);

                        // Convert 12-hour format to 24-hour format for sorting
                        if (ampmA.toLowerCase() === 'pm' && hourA !== 12) {
                                hourA += 12;
                        } else if (ampmA.toLowerCase() === 'am' && hourA === 12) {
                                hourA = 0;
                        }
                        if (ampmB.toLowerCase() === 'pm' && hourB !== 12) {
                                hourB += 12;
                        } else if (ampmB.toLowerCase() === 'am' && hourB === 12) {
                                hourB = 0;
                        }
                        // Compare the converted time values
                        return hourA - hourB;
                });
        });
}

module.exports = {timeIntervalSymbols, timeIntervalAsArray, sortTimeIntervals, sortPillsTimeSlots};