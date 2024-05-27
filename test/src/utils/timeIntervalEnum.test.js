describe("Test For timeIntervalEnum Utility", () => {

    const subject = require("../../../src/utils/timeIntervalEnum")

    test("To Test Sorting Time Interval", () => {
        const testSubject = ["11pm", "9am", "5am", "7pm", "12pm", "12am"]
        let expected = ["12am", "5am", "9am","12pm", "7pm", "11pm",]
        subject.sortTimeIntervals(testSubject);
        console.log(testSubject)
        expect(testSubject).toEqual(expected)
    })

    test("To Test Sorting for Pills", () => {
        let daysToTest = [
            {
                pillsTimeSlots: [
                    {
                        time: "12pm"
                    },
                    {
                        time: "8am"
                    },
                    {
                        time: "5am"
                    },
                    {
                        time: "7pm"
                    },
                    {
                        time: "12am"
                    },
                    {
                        time: "11pm"
                    }
                ]
            }
        ]

        let expected = [
            {
                pillsTimeSlots: [
                    {
                        time: "12am"
                    },
                    {
                        time: "5am"
                    },
                    {
                        time: "8am"
                    },
                    {
                        time: "12pm"
                    },
                    {
                        time: "7pm"
                    },
                    {
                        time: "11pm"
                    }
                ]
            }
        ]

        subject.sortPillsTimeSlots(daysToTest);
        expect(daysToTest).toEqual(expected)
    })

    test("To Test Sorting for Pills pt2", () => {
        let daysToTest = [
            {
                pillsTimeSlots: [
                    {
                        time: "12am"
                    },
                    {
                        time: "12pm"
                    },
                    {
                        time: "5am"
                    },
                    {
                        time: "7pm"
                    },
                    {
                        time: "11am"
                    },
                    {
                        time: "11pm"
                    }
                ]
            }
        ]

        let expected = [
            {
                pillsTimeSlots: [
                    {
                        time: "12am"
                    },
                    {
                        time: "5am"
                    },
                    {
                        time: "11am"
                    },
                    {
                        time: "12pm"
                    },
                    {
                        time: "7pm"
                    },
                    {
                        time: "11pm"
                    }
                ]
            }
        ]

        subject.sortPillsTimeSlots(daysToTest);
        expect(daysToTest).toEqual(expected)
    })

});