const upperCamelCase = require('uppercamelcase');
const { STATUS_CODES } = require('http');

class HTTPError extends Error {
    constructor(code, message, extras) {
        super(message || STATUS_CODES[code]);
        if (arguments.length >= 3 && extras) {
            Object.assign(this, extras);
        }
        this.name = this.toName(code);
        this.statusCode = code;
    }

    static isHttpError(error) {
        return error instanceof HTTPError;
    }


    toName(code) {
        const suffix = (code / 100 | 0) === 4 || (code / 100 | 0) === 5 ? 'error' : '';
        return upperCamelCase(String(STATUS_CODES[code]).replace(/error$/i, ''), suffix);
    }


}
module.exports = HTTPError;