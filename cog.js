/* @copyright Itential, LLC 2016 */
/* globals log */
const path = require('path');
const crudCharacter = require(path.join(__dirname, './lib/rpc/character/crudCharacter'));
const viewCharacter = require(path.join(__dirname, './lib/rpc/character/viewCharacter'));
const crudGames = require(path.join(__dirname, './lib/rpc/games/crudGames'));
const charUtils = require(path.join(__dirname, './lib/rpc/player/charUtils'));

class owbn {

    constructor() {

    }

    /**
     * @description Create a new character.  This will import what is passed and insert it into mongo.
     * @pronghornType method
     * @name characterCreate
     * @summary Create a new character
     * @param {object} characterSheet Character sheet to be created
     * @param {function} callback Callback function
     * @returns {object} Response object
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
     * @description Update an existing character.  The first two values in the passed object should be name and player, followed by an object of updates
     * @pronghornType method
     * @name characterCreate
     * @summary Update an existing character.
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

    /**
     * @description Delete an existing character.    The first two values in the passed object should be name and player, followed by an object of deletes
     * @pronghornType method
     * @name characterDelete
     * @summary Delete an existing character.
     * @param {object} deleteObject Character object to be deleted
     * @param {function} callback Callback function
     * @returns {object} Response object
     * 
     * @route {DELETE} /owbn/crudCharacter
     * @roles admin player gm owbn
     * @task true
     *
     */
    async characterDelete(deleteObject, callback) {
        log.debug('Cog : Calling: crudCharacter.characterDelete');
        let returnValue;
        try {
            returnValue = await crudCharacter.deleteSheet(deleteObject);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ended characterDelete call, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }

    /**
     * @description Display an existing character.  The character and player name need to be passed in the request object
     * @pronghornType method
     * @name characterShow
     * @summary Display an existing character
     * @param {object} requestObject Character object to be shown
     * @param {function} callback Callback function
     * @returns {object} Response object
     *
     * @route {GET} /owbn/crudCharacter
     * @roles admin player gm owbn
     * @task true
     *
     */
    async characterShow(requestObject, callback) {
        log.debug('Cog : Calling: viewCharacter.viewSheet');
        let returnValue;
        try {
            returnValue = await viewCharacter.viewSheet(requestObject);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ending viewCharacter.viewSheet, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }

    /**
     * @description Return the a true or false, depending if you have permissions to access a character
     * @pronghornType method
     * @name havePermissions
     * @summary Return permissions for a player
     * @param {object} requestObject Character object to be polled
     * @param {function} callback Callback function
     * @returns {object} Response object
     *
     * @route {POST} /owbn/havePermissions
     * @roles admin player gm owbn
     * @task true
     *
     */
    async havePermissions(requestObject, callback) {
        log.debug('Cog : Calling: charUtils.havePermissions');
        let returnValue;
        try {
            returnValue = await charUtils.havePermissions(requestObject);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ending charUtils.havePermissions, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }


    /**
     * @description Display an existing character.  The character and player name need to be passed in the request object
     * @pronghornType method
     * @name viewSelection
     * @summary Display an existing character
     * @param {object} requestObject Character object to be shown
     * @param {string} project Selection to be shown
     * @param {function} callback Callback function
     * @returns {object} Response object
     *
     * @route {GET} /owbn/crudCharacter
     * @roles admin player gm owbn
     * @task true
     *
     */
    async viewSelection(requestObject, project, callback) {
        log.debug('Cog : Calling: viewCharacter.viewSelection');
        let returnValue;
        try {
            returnValue = await viewCharacter.viewSelection(requestObject, project);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ending viewCharacter.viewSelection, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }

    /**
     * @description Sets up a character so that it is registered to a particular player
     * @pronghornType method
     * @name havePermissions
     * @summary Register character with player
     * @param {object} requestObject Character object to be polled
     * @param {function} callback Callback function
     * @returns {object} Response object
     *
     * @route {PUT} /owbn/addCharacterToPlayer
     * @roles admin player gm owbn
     * @task true
     *
     */
    async addCharacterToPlayer(requestObject, callback) {
        log.debug('Cog : Calling: charUtils.havePermissions');
        let returnValue;
        try {
            returnValue = await charUtils.addCharacterToPlayer(requestObject);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ending charUtils.havePermissions, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }

    /**
     * @description Returns a list of characters the player has, along with a sum of the characters
     * @pronghornType method
     * @name returnListOfCharacters
     * @summary Shows characters associated with a player
     * @param {object} requestObject Character object to be polled
     * @param {function} callback Callback function
     * @returns {object} Response object
     *
     * @route {GET} /owbn/returnListOfCharacters
     * @roles admin player gm owbn
     * @task true
     *
     */
    async returnListOfCharacters(requestObject, callback) {
        log.debug('Cog : Calling: charUtils.returnListOfCharacters');
        let returnValue;
        try {
            returnValue = await charUtils.returnListOfCharacters(requestObject);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ending charUtils.returnListOfCharacters, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }

    /**
     * @description Create a new game.  This will import what is passed and insert it into mongo.
     * @pronghornType method
     * @name createInfo
     * @summary Create a new game
     * @param {object} newGame Game info to be created.
     * @param {function} callback Callback function
     * @returns {object} Response object
     *
     * @route {POST} /owbn/crudGame
     * @roles admin gm owbn
     * @task true
     *
     */
    async createInfo(newGame, callback) {
        log.debug('Cog : Calling: crudCharacter.createInfo');
        let returnValue;
        try {
            returnValue = await crudGames.createInfo(newGame);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ended createInfo call, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }

    /**
     * @description Update an existing game
     * @pronghornType method
     * @name updateInfo
     * @summary Update an existing game.
     * @param {object} updateObject Game object to be updated
     * @param {function} callback Callback function
     * @returns {object} Response object
     * 
     * @route {PUT} /owbn/crudGame
     * @roles admin gm owbn
     * @task true
     *
     */
    async updateInfo(updateObject, callback) {
        log.debug('Cog : Calling: crudCharacter.updateInfo');
        let returnValue;
        try {
            returnValue = await crudGames.updateInfo(updateObject);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ended updateInfo call, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }

    /**
     * @description Delete an existing Game.
     * @pronghornType method
     * @name deleteInfo
     * @summary Delete an existing game.
     * @param {object} deleteObject Character object to be deleted
     * @param {function} callback Callback function
     * @returns {object} Response object
     * 
     * @route {DELETE} /owbn/crudGame
     * @roles admin gm owbn
     * @task true
     *
     */
    async deleteInfo(deleteObject, callback) {
        log.debug('Cog : Calling: crudCharacter.deleteInfo');
        let returnValue;
        try {
            returnValue = await crudGames.deleteInfo(deleteObject);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ended deleteInfo call, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }

}

module.exports = new owbn();
