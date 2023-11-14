var request = require( 'supertest');
var express = require ('express');
var router= require('../../src/routes/medicineRoutine/medicineRoutine');


const app = new express();
app.use('/', router);

describe('To Test medicineRoutine Route for Days', function () {
    test.each([
        {path: "monday"},
        {path: "Monday"},
        {path: "mon"},
        {path: "Mon"},
        {path: "tuesday"},
        {path: "Tuesday"},
        {path: "Tues"},
        {path: "tues"},
        {path: "Wednesday"},
        {path: "wednesday"},
        {path: "Wed"},
        {path: "wed"},
        {path: "Thursday"},
        {path: "thursday"},
        {path: "thurs"},
        {path: "Thurs"},
        {path: "Friday"},
        {path: "friday"},
        {path: "Fri"},
        {path: "fri"},
        {path: "Saturday"},
        {path: "saturday"},
        {path: "Sat"},
        {path: "sat"},
        {path: "Sunday"},
        {path: "sunday"},
        {path: "Sun"},
        {path: "sun"},
        {path: "1"},
        {path: "2"},
        {path: "3"},
        {path: "4"},
        {path: "5"},
        {path: "6"},
        {path: "7"},

    ])(`To Test Day: $path`,(async ({path}) => {

        const res = await request(app).get(`/` + path);
        expect(res.text).toBe(path)
        expect(res.statusCode).toBe(200);
    }))


})

describe('To Test medicineRoutine Route for Days and interval', function () {

    test.each([
        {path: "monday", interval: 1},
        {path: "monday", interval: 2},
        {path: "monday", interval: 3},
        {path: "monday", interval: 4},
        {path: "monday", interval: 5},
        {path: "monday", interval: 6},
        {path: "monday", interval: 7},
        {path: "monday", interval: 8},
        {path: "monday", interval: 9},
        {path: "monday", interval: 10},
        {path: "mon", interval: 1},
        {path: "mon", interval: 2},
        {path: "mon", interval: 3},
        {path: "mon", interval: 4},
        {path: "mon", interval: 5},
        {path: "mon", interval: 6},
        {path: "mon", interval: 7},
        {path: "mon", interval: 8},
        {path: "mon", interval: 9},
        {path: "mon", interval: 10},

    ])(`To Test Day: $path interval $interval`, (async ({path, interval}) => {

        const res = await request(app).get(`/${path}/${interval}`);
        expect(res.text).toBe(interval.toString())
        expect(res.statusCode).toBe(200);
    }))
})