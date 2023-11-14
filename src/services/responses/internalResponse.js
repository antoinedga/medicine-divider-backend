module.exports = class InternalResponse {
    constructor(msg, httpStatus) {
        this.msg = msg;
        this.httpStatusCode = httpStatus;
    }
}
