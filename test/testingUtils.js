
const { createWriteStream,
        existsSync,
        mkdirSync,
        unlinkSync } = require('fs');
const { resolve } = require('path');
const   td = require('testdouble');

// Spread this into a function to pass an arbitrary number of matchers.anything()
function anyMatcher(numParams) {
    return new Array(numParams).fill(td.matchers.anything());
}

// Adapted from work by Kerry Robinson
function initLogs(filename) {

    const fullDir = resolve(__dirname, 'logs');
    const fullFilePath = resolve(fullDir, filename);

    if (!existsSync(fullDir)) mkdirSync(fullDir);
    if (existsSync(fullFilePath)) unlinkSync(fullFilePath);

    const logFile = new createWriteStream(fullFilePath, { flags: 'a' });

    log = {
        debug: function (message) {
            //return message;
            //console.log(`DEBUG: ${message}`);
            logFile.write(`DEBUG: ${message}\n`);
        },
        trace: function (message) {
            //return message;
            //console.log(`TRACE: ${message}`);
            logFile.write(`TRACE: ${message}\n`);
        },
        info: function (message) {
            //return message;
            //console.log(`INFO: ${message}`);
            logFile.write(`INFO: ${message}\n`);
        },
        error: function (message) {
            //return message;
            //console.log(`**ERROR**: ${message}`);
            logFile.write(`**ERROR**: ${message}\n`);
        },
        spam: function (message) {
            //console.log(`SPAM: ${message}`);
            logFile.write(`SPAM: ${message}\n`);
        }
    };
}

/**
 * Builds a container for storing input arguments with the following methods:
 *  - purge
 *  - stopIntercepting
 * @param {object} obj The object to intercept parameters from
 * @param {array} methodsToIntercept The methods to intercept on obj
 * @param {object} container The object to mutate into a container
 */
function makeParamInterceptor(obj, methodsToIntercept, container) {
    const oldMethods = {};

    methodsToIntercept.forEach((method) => {
        oldMethods[method] = obj[method];

        container[method] = [];

        Object.defineProperty(obj, method, {
            get: () => { return (...input) => {
                    container[method].push(
                        input.length === 1 ? input[0] : input
                    );
                    return oldMethods[method](...input);
                }
            },
            set: (newMethod) => {
                oldMethods[method] = newMethod;
            }
        })
    });

    container.purge = (...methods) => {
        // No arguments purges everything
        if (methods.length === 0) {
            methodsToIntercept.forEach((method) => {
                container.purge(method);
            });
        }
        // Purge each method in passed methods
        else if (methods.length > 1) {
            methods.forEach((method) => {
                container.purge(method);
            });
        }
        else {
            container[methods[0]] = [];
        }
    }

    container.stopIntercepting = () => {
        methodsToIntercept.forEach((method) => {
            obj[method] = oldMethods[method];
        });
    }
}

/**
 * 
 * @param {object} obj The object to intercept from. Passed in from intercept(obj)
 * @param {array} methods The method names to intercept arguments from on obj
 */
function selectMethods(obj, methods) {
    return {
        into: container => makeParamInterceptor(obj, methods, container)
    }
}

/**
 * Intercepts method arguments into an object. Arguments are directed to seperate arrays by method call.
 * Logs are still directed to any previous logging 
 * Calling purge on the container object clears all stored arguments.
 * 
 * Usage:
 * const logObj = {};
 * intercept(log).methods('error', 'debug').into(logObj)
 * 
 * log.error('error message'); => 'error message'
 * log.debug('debug message'); => 'debug message'
 * 
 * logObj.error.pop() -> 'error message'
 * logObj.debug[0]; -> 'debug message'
 * 
 * logObj.purge('debug') -> Clears debug logs. Equivalent to logObj.debug = []
 * logObj.purge('debug', 'error') -> Clears error and debug logs.
 * logObj.purge(); -> Clears all logs
 * logObj.stopIntercepting(); -> Stops argument interception
 * 
 * @param {object} obj Object to intercept methods arguments from
 */
function intercept(obj) {
    return {
        methods: (...methods) => { return selectMethods(obj, methods); }
    };
}

function invalidateModuleCache(moduleId) {
    delete require.cache[require.resolve(moduleId)];
}

function hardRequire(moduleId) {
    delete require.cache[require.resolve(moduleId)];
    return require(moduleId);
}

module.exports = {
    anyMatcher,
    initLogs,
    intercept,
    hardRequire,
    invalidateModuleCache
}