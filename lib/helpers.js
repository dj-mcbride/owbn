
const lastIn = arr => arr[arr.length - 1];

/**
 * view accesses a value at a nested location in an object.
 * view can also be used as a data pipeline, passing a value through
 * a progression of functions taking only one value
 * @param {object|array} obj Subject
 * @param {array} props Property or data pipeline functions
 * @returns {any} Value pointed to by props
 */
const view = (obj, props) => props.reduce(
        (currentLevel, nextProp) => {
            if (exists(currentLevel)) {
                // Support for array methods
                if (typeof nextProp === 'function') return nextProp(currentLevel);
                return currentLevel[nextProp];
            }
            return undefined;
        },
        obj
    );

/**
 * chute puts a value into a nested location in an object, creating objects
 * or arrays when they are not present along the path
 * @param {object} obj Object to mutate
 * @param {array} props Array of properties pointing to a part of the object
 * @param {any} value New value for the specified location in obj
 */
const chute = (obj, props, value) => {
    let current = obj;
    const allPropsButLast = props.slice(0, -1);
    for (const prop of allPropsButLast) {
        if (!defined(current[prop])) {
            current[prop] = typeof prop === 'number' ? [] : {};
        }
        current = current[prop];
    }

    if (!defined(value)) delete current[lastIn(props)];
    else current[lastIn(props)] = value;
};

// Tells whether an object or array is empty
const isEmpty = subject => Object.keys(subject).length === 0;

// prefixKeys adds a string prefix to all shallow keys in an object
const prefixKeys =
    (obj, prefix) => Object
        .keys(obj)
        .reduce(
            (accumulator, key) => Object.assign(
                accumulator,
                { [`${prefix}${key}`]: obj[key] }
            ),
            {}
        );

/**
 * WARNING: flattenAsPaths is naive to cycles. Do not pass an object with cyclic references to flattenAsPaths. TODO: Implement cycle checking
 *
 * Builds path/value key/value pairs from a non-cyclic object
 * @param {object} obj Object to build paths for
 * @param {string} [delimiter] String to separate keys with
 * @return {object} Path tuples conaining [key]: value -> [path]: <value-pointed-to-by-path>
 */
const flattenAsPaths = (obj, delimiter = '.') => {
    const flattened = {};
    Object.keys(obj).forEach((key) => {
        if (exists(obj[key]) && (Array.isArray(obj[key]) || typeof obj[key] === 'object') && !isEmpty(obj[key])) {
            const subFlattened = flattenAsPaths(obj[key]);
            Object.assign(flattened, prefixKeys(subFlattened, `${key}${delimiter}`));
        } else {
            flattened[key] = obj[key];
        }
    });
    return flattened;
};

/**
 * Mask takes a subject and applies a mask to it recursively without deleting deeper parallel properties:
 *
 * Example:
 * obj = {
 *   prop1: { a: 1, b: 2 },
 *   prop2: 'a string'
 * }
 * maskObj = {
 *   prop1: { c: 3 },
 *   prop2: 'a different string'
 * }
 *
 * mask(obj, maskObj)
 * returns -> {
 *   prop1: { a: 1, b: 2, c: 3 },
 *   prop2: 'a different string'
 * }
 * @param {object|array} obj Subject object
 * @param {object|array} maskObj Masking object
 * @return {object|array} Masked object
 */
const mask = (obj, maskObj) => {
    const pathObj = flattenAsPaths(maskObj, '.');
    const masked = deepClone(obj);
    Object.keys(pathObj).forEach(
        path => chute(masked, path.split('.'), pathObj[path])
    );
    return masked;
};

const exists = val => val !== undefined && val !== null && val !== 'null';
const defined = val => val !== undefined;

const firstExists = (...list) => list.find(exists);

// Returns the next element in the list. Returns undefined if 'element' is not found or if
// it lies at the end of the sequence
const nextInSequence = (sequence, element) => sequence[sequence.indexOf(element) + 1 || sequence.length];

/**
 * WARNING: deepClone is naive to cycles. Do not pass an object with cyclic references to deepClone. TODO: Implement optional cycle checking
 * @param {object} obj Object to clone
 * @returns {object} Deep cloned object
 */
const deepClone = (obj /* TODO: implement , checkCycles = true */) => {
    const cloned = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
        if (obj[key] !== null && typeof obj[key] === 'object') {
            cloned[key] = deepClone(obj[key]);
        } else {
            cloned[key] = obj[key];
        }
    }

    return cloned;
};

const makeUnique = arr => Array.from(new Set(arr));

const flatten = array => array.reduce((acc, elem) => acc.concat(elem), []);

const disjoint = (a, b) => !a.some(elem => b.includes(elem));

module.exports = {
    view,
    chute,
    exists,
    defined,
    firstExists,
    nextInSequence,
    deepClone,
    lastIn,
    isEmpty,
    prefixKeys,
    flattenAsPaths,
    mask,
    disjoint,
    makeUnique,
    flatten
};