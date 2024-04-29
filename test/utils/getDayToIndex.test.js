const getDayToIndex = require("../../src/utils/dayUtil")

describe('To Test getDayToIndex for Days', function () {
    test.each([
        {path: "monday", expected: 0},
        {path: "Monday", expected: 0},
        {path: "mon", expected: 0},
        {path: "Mon", expected: 0},
        {path: "tuesday", expected: 1},
        {path: "Tuesday", expected: 1},
        {path: "Tues", expected: 1},
        {path: "tues", expected: 1},
        {path: "Wednesday", expected: 2},
        {path: "wednesday", expected: 2},
        {path: "Wed", expected: 2},
        {path: "wed", expected: 2},
        {path: "Thursday", expected: 3},
        {path: "thursday", expected: 3},
        {path: "thur", expected: 3},
        {path: "Thur", expected: 3},
        {path: "Friday", expected: 4},
        {path: "friday", expected: 4},
        {path: "Fri", expected: 4},
        {path: "fri", expected: 4},
        {path: "Saturday", expected: 5},
        {path: "saturday", expected: 5},
        {path: "Sat", expected: 5},
        {path: "sat", expected: 5},
        {path: "Sunday", expected: 6},
        {path: "sunday", expected: 6},
        {path: "Sun", expected: 6},
        {path: "sun", expected: 6},
        {path: "1", expected: 0},
        {path: "2", expected: 1},
        {path: "3", expected: 2},
        {path: "4", expected: 3},
        {path: "5", expected: 4},
        {path: "6", expected: 5},
        {path: "7", expected: 6},

    ])(`To Test Day: $path`,(async ({path, expected}) => {
        console.log("path is " + path)
        console.log("Expected is " + expected)
        const result = getDayToIndex(path)
        console.log("result is " + result)
        expect(result).toBe(expected);

    }))

});