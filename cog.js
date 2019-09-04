/* @copyright Itential, LLC 2016 */
/* globals log */
const path = require('path');
const crudCharacter = require(path.join(__dirname, './lib/rpc/common/crudCharacter'));

class owbn {

    constructor() {

    }

    /**
     * @description Create the character
     * @pronghornType method
     * @name characterCreate
     * @summary Create a new character
     * @param {object} characterSheet Character sheet to be created
     * @param {function} callback Callback function
     * @returns {object} response Response object
     * 
     * @route {POST} /owbn/crudCharacter
     * @roles admin player gm owbn
     * @task true
     * 
     */
    async characterCreate(characterSheet, callback) {
        log.debug('Cog : Calling: crudCharacter.createSheet');
        let returnValue;
        try {
            returnValue = await crudCharacter.createSheet(characterSheet);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ended createSheet call, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }

        /**
     * @description Update an existing character
     * @pronghornType method
     * @name characterCreate
     * @summary Update an existing character.  The first two values in the passed object should be name and player, followed by an object of updates
     * @param {object} updateObject Character object to be updated
     * @param {function} callback Callback function
     * @returns {object} response Response object
     * 
     * @route {PUT} /owbn/crudCharacter
     * @roles admin player gm owbn
     * @task true
     * 
     */
    async characterUpdate(updateObject, callback) {
        log.debug('Cog : Calling: crudCharacter.characterUpdate');
        let returnValue;
        try {
            returnValue = await crudCharacter.updateSheet(updateObject);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ended characterUpdate call, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }
}

module.exports = new owbn();
