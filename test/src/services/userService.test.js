const MedicineRoutineUserModel = require("../../../src/models/medicineRoutineUserModel")
const ViewSystemModel = require("../../../src/models/viewSystemModel")
const { connectDB, dropDB, dropCollections } = require("../jest.setup");
const subject = require("../../../src/services/userService")

describe('User Model Tests', () => {

    beforeAll(async () => {
        await connectDB();
    });

    afterAll(async () => {
        await dropDB();
    });

    afterEach(async () => {
        await dropCollections();
    })

    test("Testing Creation of User",async () => {
        const request = {
            body: {
                userId: "auth|114fe7529c12ce6e60f9df5c",
                firstName: "Test",
                lastName: "Test",
                email: "test@gmail.com",
                dateOfBirth: "07/06/1995"
            }
        }

        let res = await subject.createUser(request)
        expect(res.success).toBe(true)
        let medDocs = await MedicineRoutineUserModel.find().exec()
        expect(medDocs.length).toEqual(1)
        let viewModel = await ViewSystemModel.find().exec();
        expect(viewModel.length).toEqual(1);
    })
})