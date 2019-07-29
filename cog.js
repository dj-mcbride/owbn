/* @copyright Itential, LLC 2016 */
/* globals log */
const path = require('path');
const characterSheet = require(path.join(__dirname, './lib/rpc/common/characterSheet'));


class owbn {

    constructor() {

    }

    /**
     * @description Create the character
     * @pronghornType method
     * @name characterCreate
     * @summary Create a new character
     * @param {object} sheet Character sheet to be created
     * @param {function} callback Callback function
     * @returns {object} response Response object
     * 
     * @route {POST} /owbn/characterSheet
     * @roles admin player gm owbn
     * @task true
     * 
     */
    characterCreate(sheet, callback) {
        log.debug(`Starting characterCreate for ${sheet}`);
        try {
            let charResults =  characterSheet.characterCreate(sheet);
            return callback(charResults);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
    }
}

module.exports = new owbn();
