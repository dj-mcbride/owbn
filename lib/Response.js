/* global auditTrail */

const { exists, firstExists } = require('./helpers');

// Unique key for making response objects easily identifiable
const IS_RESPONSE = Symbol('IS_RESPONSE');

/**
 * @summary Check an object to make sure it is an error object
 * @param {Object} error object to be analyzed
 * @returns {boolean} indication of if it is an error
 */
const isError = error =>
    // An object is an error if it is an instance of Error OR it is an object with properties stack and message.
    // Allowing a non-Error instance object to be an error makes responses stored in MongoDB return true from this method
     (error instanceof Error ||
        (typeof error === 'object' &&
            'stack'   in error     &&
            'message' in error));

/**
 * @summary Check an object to make sure it is a response object
 * @param {Object} response object to be analyzed
 * @returns {boolean} indication of if it is an response
 */
const isResponse = response => response && response[IS_RESPONSE];

// Store of current error codes.
const RESPONSE_CODES = [
    { code: 'WarningFailure',
      responseCode: 199 },

    { code: 'Success',
      responseCode: 200 },

    { code: 'GenericError',
      responseCode: 400 },

    { code: 'InvalidInput',
      responseCode: 455 },

    { code: 'FailedEvaluation',
      responseCode: 456 },

    { code: 'BadDBResponse',
      responseCode: 457 },

    { code: 'InternalServerError',
      responseCode: 500 }
];

const CODES_LIST = RESPONSE_CODES.reduce((arr, next) => arr.concat(next.responseCode), []);

RESPONSE_CODES.validate = (responseCode) => {
    if (!RESPONSE_CODES.find(entry => entry.responseCode === responseCode)) {
        throw new Response({
            from: responseCode,
            responseCode: 500,
            message: `RESPONSE_CODE.validate : Response code must be one of ${JSON.stringify(CODES_LIST)}`,
            step: 'Validate Response Code'
        });
    }
};

class Response {

    /**
     * @summary Generates at Response Object
     * @description Generates a user-friendly snapshot of a request's results; enabling users to derive success, error or failure.
     * @param {Number} responseCode Http Response Code (see: *RESPONSE_CODES* line 29  for complete list)
     * @param {String} message User friendly message to explain results
     * @param {Object} from results or error object you wish to document
     * @param {String} step current step a user is on
     */
    constructor({
        from,
        responseCode,
        message = 'Generic Error. Please report so this error can be changed to something more valid.',
        step = 'UnknownStep'
    } = {}) {
        if (!exists(from)) {
            throw new Response({
                from: {},
                responseCode: 500,
                message: 'Response.constructor : Provide an value for new Response({ from, ... })',
                step: 'Create Response'
            });
        }
        if (isResponse(from)) return from;

        // Error non responses look for an optional fallback response code, but do not use a fallback message
        // non error, non responses need a fallback response code and look for an optional fallback message
        const [usableResponseCode, usableMessage, usableResults] = isError(from)
            ? [firstExists(responseCode, 500), from.message, from.stack]
            : [firstExists(responseCode, 200), message, from];

        this.step = step;

        let p_code = null;
        Object.defineProperty(this, 'code', { get: () => p_code });

        let p_responseCode = usableResponseCode;
        Object.defineProperty(this, 'responseCode', {
            get: () => p_responseCode,
            set: (newCode) => {
                RESPONSE_CODES.validate(newCode);
                p_responseCode = newCode;
                p_code = RESPONSE_CODES.find(entry => entry.responseCode === newCode).code;
            },
            enumerable: true
        });
        this.responseCode = usableResponseCode;

        this.results = usableResults;
        this.userMessage = usableMessage;

        // Generate meta data related to caller and the current time

        this.user = auditTrail.getUser();
        this.timestamp = Date.now();

        this[IS_RESPONSE] = true;
    }

    /**
     * Throw or callback with error for responseCode in codes.
     * Return or callback with results for responseCode not in codes
     * @param {Array.<Number>} codes Codes to error on
     * @param {Function} [callback] Optional callback
     * @return {any} Current response or callback result
     */
    errorOn(codes, callback) {
        // Callback with results or error when callback given
        if (callback) {
            if (codes.includes(this.responseCode)) {
                return callback(null, this);
            }
            return callback(this);
        }

        // Throw or return when no callback given
        if (codes.includes(this.responseCode)) {
            throw this;
        }
        return this;
    }
}

module.exports = {
    Response
};