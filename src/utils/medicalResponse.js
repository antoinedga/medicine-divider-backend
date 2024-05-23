
module.exports = class MedicalResponse {
    constructor(success, message, code, data = null) {
        this.success = success;
        this.msg = message;
        this.data = data;
        this.code = code;
    }

    static success(data = null, message = null, code = 200) {
        return new MedicalResponse(true, message, code, data);
    }
    static successWithDataOnly(data, code = 200) {
        return new MedicalResponse(true, null, code, data);
    }
    static successWithMessage(message, code = 200) {
        return new MedicalResponse(true, message, code);
    }

    static error(message, code = 500) {
        return new MedicalResponse(false, message, code, null);
    }
    static internalServerError() {
        return new MedicalResponse(false, "INTERNVAL SERVER ERROR", 500, null);
    }
}
