const dayUtils = require('../../../src/utils/dayUtil')


describe('first test', () => {
    test.each([
        ['mon', 0], ['monday', 0], ["mond", null],
        ['tue', 1], ['tuesday', 1], ["tues", null],
        ['wed', 2], ['wednesday', 2], ["wednes", null],
        ['thu', 3], ['thursday', 3], ["thurs", null], ["thur", null],
        ['fri', 4], ['friday', 4], ["frid", null],
        ['sat', 5], ['saturday', 5], ["satu", null],
        ['sun', 6], ['sunday', 6], ["sund", null],
    ])
    ('Test different Strings of days: \'%s\' to return: \'%s\'', (item, expected) => {
        expect(dayUtils.getDayToIndexString(item)).toBe(expected)
    })

    test.each([
        ['mon', true], ['monday', true], ["mond", false],
        ['tue', true], ['tuesday', true], ["tues", false],
        ['wed', true], ['wednesday', true], ["wednes", false],
        ['thu', true], ['thursday', true], ["thurs", false], ["thur", false],
        ['fri', true], ['friday', true], ["frid", false],
        ['sat', true], ['saturday', true, ["satu", false],
        ['sun', true], ['sunday', true], ["sund", false],
        ["abc", false], ["foo bar", false]]
    ])('test if name is valid format(full or 3 letter days) %s toBe: %s', (subject, expected)=> {
        expect(dayUtils.isValidDayName(subject)).toBe(expected);
    })

    test.each([
        [['all'], true],
        [['all', 'monday'],false]
    ])("To Test containsOnlyAll %j", (subject, expected) => {
        expect(dayUtils.containsOnlyAll(subject)).toBe(expected)
    })

    test.each([
        ['mon','Monday', true],
        ['tue','tuesday', true],
        ['wed','wednesday', true],
        ['thu','thursday', true],
        ['fri','friday', true],
        ['sat','saturday', true],
        ['sun','sunday', true],
        ['tue','sunday', false]
    ])('Testing to see if two different ways of spelling the days are equal: %s vs %s',(dayOne, dayTwo, expected) => {
        expect(dayUtils.areDaysNameEqual(dayOne, dayTwo)).toBe(expected)
    })
});
