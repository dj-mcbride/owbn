/* @copyright Itential, LLC 2016 */
/* globals log */
const path = require('path');
const crudCharacter = require(path.join(__dirname, './lib/rpc/character/crudCharacter'));
const viewCharacter = require(path.join(__dirname, './lib/rpc/character/viewCharacter'));
const crudGames = require(path.join(__dirname, './lib/rpc/games/crudGames'));
const viewGames = require(path.join(__dirname, './lib/rpc/games/viewGames'));
const crudItems = require(path.join(__dirname, './lib/rpc/items/crudItems'));
const viewItems = require(path.join(__dirname, './lib/rpc/items/viewItems'));
const charUtils = require(path.join(__dirname, './lib/rpc/player/charUtils'));
const crudPlayers = require(path.join(__dirname, './lib/rpc/player/crudPlayers'));
const viewPlayers = require(path.join(__dirname, './lib/rpc/player/viewPlayers'));
const rpsb = require(path.join(__dirname, './lib/rpc/rpsb/rpsbAPI'));

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
        log.debug('Cog : Calling: crudGames.createInfo');
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
        log.debug('Cog : Calling: crudGames.updateInfo');
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
        log.debug('Cog : Calling: crudGames.deleteInfo');
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

    /**
     * @description Display an existing game.  The game name needs to be passed in the request object
     * @pronghornType method
     * @name characterShow
     * @summary Display an existing game
     * @param {object} requestObject Game object to be shown
     * @param {function} callback Callback function
     * @returns {object} Response object
     *
     * @route {GET} /owbn/viewGame
     * @roles admin player gm owbn
     * @task true
     *
     */
    async gameShow(requestObject, callback) {
        log.debug('Cog : Calling: viewGames.viewInfo');
        let returnValue;
        try {
            returnValue = await viewGames.viewInfo(requestObject);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ending viewGames.viewInfo, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }

    /**
     * @description Display an existing element of a game.  The game name needs to be passed in the request object
     * @pronghornType method
     * @name viewGameSelection
     * @summary Display an existing game
     * @param {object} requestObject Game object to be shown
     * @param {string} project Selection to be shown
     * @param {function} callback Callback function
     * @returns {object} Response object
     *
     * @route {GET} /owbn/viewGameSelection
     * @roles admin player gm owbn
     * @task true
     *
     */
    async viewGameSelection(requestObject, project, callback) {
        log.debug('Cog : Calling: viewGames.viewGameSelection');
        let returnValue;
        try {
            returnValue = await viewGames.viewGameSelection(requestObject, project);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ending viewGames.viewGameSelection, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }


    /**
     * @description Create a new item.  This will import what is passed and insert it into mongo.
     * @pronghornType method
     * @name createProperties
     * @summary Create a new item
     * @param {object} newItem Item properties to be created.
     * @param {function} callback Callback function
     * @returns {object} Response object
     *
     * @route {POST} /owbn/crudItems
     * @roles admin gm owbn
     * @task true
     *
     */
    async createProperties(newItem, callback) {
        log.debug('Cog : Calling: crudItems.createProperties');
        let returnValue;
        try {
            log.debug('Cog : ALERT: crudItems.createProperties');
            returnValue = await crudItems.createProperties(newItem);
            log.debug(`Cog : END ALERT: crudItems.createProperties ${JSON.stringify(returnValue)}`);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ended createProperties call, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }

    /**
     * @description Update an existing item
     * @pronghornType method
     * @name updateProperties
     * @summary Update an existing item.
     * @param {object} updateObject Item object to be updated
     * @param {function} callback Callback function
     * @returns {object} Response object
     * 
     * @route {PUT} /owbn/crudItems
     * @roles admin gm owbn
     * @task true
     *
     */
    async updateProperties(updateObject, callback) {
        log.debug('Cog : Calling: crudItems.updateProperties');
        let returnValue;
        try {
            returnValue = await crudItems.updateProperties(updateObject);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ended updateProperties call, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }

    /**
     * @description Delete an existing Item.
     * @pronghornType method
     * @name deleteProperties
     * @summary Delete an existing item.
     * @param {object} deleteObject Items object to be deleted
     * @param {function} callback Callback function
     * @returns {object} Response object
     * 
     * @route {DELETE} /owbn/crudItems
     * @roles admin gm owbn
     * @task true
     *
     */
    async deleteProperties(deleteObject, callback) {
        log.debug('Cog : Calling: crudItems.deleteProperties');
        let returnValue;
        try {
            returnValue = await crudItems.deleteProperties(deleteObject);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ended deleteProperties call, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }

    /**
     * @description Display an existing item.  The item name needs to be passed in the request object
     * @pronghornType method
     * @name characterShow
     * @summary Display an existing item
     * @param {object} requestObject Item object to be shown
     * @param {function} callback Callback function
     * @returns {object} Response object
     *
     * @route {GET} /owbn/viewItems
     * @roles admin player gm owbn
     * @task true
     *
     */
    async itemShow(requestObject, callback) {
        log.debug('Cog : Calling: viewItems.viewProperties');
        let returnValue;
        try {
            returnValue = await viewItems.viewProperties(requestObject);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ending viewItems.viewProperties, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }

    /**
     * @description Display an existing element of a item.  The item name needs to be passed in the request object
     * @pronghornType method
     * @name viewItemSelection
     * @summary Display an existing item
     * @param {object} requestObject Item object to be shown
     * @param {string} project Selection to be shown
     * @param {function} callback Callback function
     * @returns {object} Response object
     *
     * @route {GET} /owbn/viewItemSelection
     * @roles admin player gm owbn
     * @task true
     *
     */
    async viewItemSelection(requestObject, project, callback) {
        log.debug('Cog : Calling: viewItems.viewItemSelection');
        let returnValue;
        try {
            returnValue = await viewItems.viewItemSelection(requestObject, project);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ending viewItems.viewItemSelection, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }


    /**
     * @description Create a new player.  This will import what is passed and insert it into mongo.
     * @pronghornType method
     * @name createPlayer
     * @summary Create a new item
     * @param {object} newPlayer Item properties to be created.
     * @param {function} callback Callback function
     * @returns {object} Response object
     *
     * @route {POST} /owbn/viewPlayers
     * @roles admin gm owbn
     * @task true
     *
     */
    async createPlayer(newPlayer, callback) {
        log.debug('Cog : Calling: crudPlayers.createPlayer');
        let returnValue;
        try {
            log.debug('Cog : ALERT: crudPlayers.createPlayer');
            returnValue = await crudPlayers.createPlayer(newPlayer);
            log.debug(`Cog : END ALERT: crudPlayers.createPlayer ${JSON.stringify(returnValue)}`);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ended createPlayer call, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }

    /**
     * @description Update an existing item
     * @pronghornType method
     * @name updatePlayer
     * @summary Update an existing item.
     * @param {object} updateObject Item object to be updated
     * @param {function} callback Callback function
     * @returns {object} Response object
     * 
     * @route {PUT} /owbn/viewPlayers
     * @roles admin gm owbn
     * @task true
     *
     */
    async updatePlayer(updateObject, callback) {
        log.debug('Cog : Calling: crudPlayers.updatePlayer');
        let returnValue;
        try {
            returnValue = await crudPlayers.updatePlayer(updateObject);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ended crudPlayers.updatePlayer call, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }

    /**
     * @description Delete an existing Player.
     * @pronghornType method
     * @name deletePlayer
     * @summary Delete an existing item.
     * @param {object} deleteObject Items object to be deleted
     * @param {function} callback Callback function
     * @returns {object} Response object
     * 
     * @route {DELETE} /owbn/viewPlayers
     * @roles admin gm owbn
     * @task true
     *
     */
    async deletePlayer(deleteObject, callback) {
        log.debug('Cog : Calling: crudPlayers.deletePlayer');
        let returnValue;
        try {
            returnValue = await crudPlayers.deletePlayer(deleteObject);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ended crudPlayers.deletePlayer call, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }


    /**
     * @description Display an existing player.  The player name needs to be passed in the request object
     * @pronghornType method
     * @name playerShow
     * @summary Display an existing player
     * @param {object} requestObject Player object to be shown
     * @param {function} callback Callback function
     * @returns {object} Response object
     *
     * @route {GET} /owbn/viewPlayers
     * @roles admin player gm owbn
     * @task true
     *
     */
    async playerShow(requestObject, callback) {
        log.debug('Cog : Calling: playerShow.viewProperties');
        let returnValue;
        try {
            returnValue = await viewItems.viewProperties(requestObject);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ending playerShow.viewProperties, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }

    /**
     * @description Display an existing element of a item.  The item name needs to be passed in the request object
     * @pronghornType method
     * @name viewPlayerSelection
     * @summary Display an existing item
     * @param {object} requestObject Item object to be shown
     * @param {string} project Selection to be shown
     * @param {function} callback Callback function
     * @returns {object} Response object
     *
     * @route {GET} /owbn/viewPlayersSelection
     * @roles admin player gm owbn
     * @task true
     *
     */
    async viewPlayerSelection(requestObject, project, callback) {
        log.debug('Cog : Calling: viewPlayerSelection.viewPlayerSelection');
        let returnValue;
        try {
            returnValue = await viewPlayers.viewPlayerSelection(requestObject, project);
        } catch (error) {
            error => new Response({
                    from: error
                })
                .errorOn([500], callback);
        }
        log.debug(`Cog : Ending viewPlayerSelection.viewPlayerSelection, return value is ${JSON.stringify(returnValue)}`);
        return callback(returnValue);
    }

        /**
     * @description Create a new character.  This will import what is passed and insert it into mongo.
     * @pronghornType method
     * @name staticRPSB
     * @summary Create a new character
     * @param {object} requestStaticRPSB paramerters of game of RPSB to be played
     * @param {function} callback Callback function
     * @returns {object} Response object
     *
     * @route {GET} /owbn/staticRPSB
     * @roles admin player gm owbn
     * @task true
     *
     */
    staticRPSB(requestStaticRPSB, callback) {
        log.debug('Cog : Calling: rpsb.staticRPSB');
        // const returnWinLoseTie;
        const returnWinLoseTie = rpsb.staticRPSB(requestStaticRPSB);
        // try {
        //     log.debug(`Cog : Update: rpsb.staticRPSB : requestStaticRPSB == ${requestStaticRPSB}`);
        //     returnWinLoseTie = rpsb.staticRPSB(requestStaticRPSB);
        //     log.debug(`Cog : Update: rpsb.staticRPSB : returnWinLoseTie == ${returnWinLoseTie}`);
        // } catch (error) {
        //     error => new Response({
        //             from: error
        //         })
        //         .errorOn([500], callback);
        // }
        log.debug(`Cog : Ended createSheet call, return value is ${JSON.stringify(returnWinLoseTie)}`);
        return callback(returnWinLoseTie);
    }

}

module.exports = new owbn();
