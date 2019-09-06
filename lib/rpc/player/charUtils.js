/* globals log database */
const { Response } = require('../../Response');
const Collection = 'owbnPlayerList';
const db = database.collection(Collection);

/**
 * Tests to see if the devices are synced.
 * @param {object} requestObject Request showing user name and character name
 * @returns {Object} Returned object showing successful permission or failed permission
 */
async function havePermissions(requestObject) {
    log.debug(`Starting: charUtils.havePermissions. request object : ${JSON.stringify(requestObject)} `);
    const validationResponse = new Response({
        from: 'havePermissions',
        responseCode: 400,
        message: '',
        step: 'Test Player Permissions for Character'
    });

    // Updates must always include player and character name.  Without those, there can be no request.
    // Throw an error if his happens.
    if (!requestObject.name) {
        log.debug('Update: charUtils.havePermissions. value of character name not found!');
        validationResponse.message = 'Value of character name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }
    if (!requestObject.player) {
        log.debug('Update: charUtils.havePermissions. value of player name not found!');
        validationResponse.message = 'Value of player name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // We are going to pull a list of all of the characters that a player has permissions for
    try {
        const query = {
            name: requestObject.player
        };
        // Is sheet currently in DB?
        log.debug(`Update: charUtils.havePermissions : query : ${JSON.stringify(query)}`);
        const charCol = await db.findOne(query);
        log.debug(`Update: charUtils.havePermissions : charCol : ${JSON.stringify(charCol)}`);

        // If We find the sheet, return it
        if (charCol) {
            log.debug('Update: charUtils.havePermissions : Player Found, checking available characters');
            // Is the requested character in the pulled list
            const foundCharacter = charCol.characters.includes(requestObject.name);
            log.debug(`Update: charUtils.havePermissions : foundCharacter ${foundCharacter}`);

            // If foundCharacter is true, return a true value -- otherwise set the message to false
            validationResponse.results = foundCharacter;
            validationResponse.responseCode = 200;

            if (foundCharacter) { 
                validationResponse.message = 'Character found in player repository';
            } else { 
                validationResponse.message = 'Character NOT found in player repository';
            }
        } else {
            log.debug('Update: charUtils.havePermissions : Player Not Found unable to check characters');
            validationResponse.message = 'Player not found in database';
            validationResponse.results = 'N/A';
            validationResponse.responseCode = 455;
        }
    } catch (err) {
        log.error(`Update: charUtils.havePermissions : Player request failed : ${err}`);
        validationResponse.message = 'Player request failed.';
        validationResponse.responseCode = 457;
    }
    // Return Results
    log.debug(`Ending: charUtils.havePermissions. validationResponse : ${JSON.stringify(validationResponse)} `);
    return validationResponse;
}

/**
 * Adds character to player info.
 * @param {object} requestObject Request showing user name and character name
 * @returns {Object} Returned object showing successful permission or failed permission
 */
async function addCharacterToPlayer(requestObject) {
    log.debug(`Starting: charUtils.addCharacterToPlayer. sheet object : ${JSON.stringify(requestObject)} `);
    const validationResponse = new Response({
        from: 'addCharacterToPlayer',
        responseCode: 400,
        message: '',
        step: 'Add Character to Player'
    });

    // Updates must always include player and character name.  Without those, there can be no update.
    // Throw an error if his happens.
    if (!requestObject.name) {
        log.debug('Update: charUtils.addCharacterToPlayer. value of character name not found!');
        validationResponse.message = 'Value of character name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }
    if (!requestObject.player) {
        log.debug('Update: charUtils.addCharacterToPlayer. value of player name not found!');
        validationResponse.message = 'Value of player name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // Verify that our character does not already exist.
    try {
        const query = {
            name: requestObject.player
        };
        // Is character currently in DB?
        log.debug(`Update: charUtils.havePermissions : query : ${JSON.stringify(query)}`);

        const charCol = await db.findOne(query);
        log.debug(`Update: charUtils.havePermissions : charCol : ${JSON.stringify(charCol)}`);

        // If We find the character list, pull it
        if (charCol) {
            log.debug('Update: charUtils.havePermissions : Player Found, checking available characters');
            // Is the requested character in the pulled list
            const foundCharacter = charCol.characters.includes(requestObject.name);
            log.debug(`Update: charUtils.havePermissions : foundCharacter ${foundCharacter}`);

            if (foundCharacter) {
                validationResponse.message = 'Character found in player repository';

                // If foundCharacter is true, return a true value -- otherwise set the message to false
                validationResponse.results = foundCharacter;
                validationResponse.message = 'Character already registered to player';
                validationResponse.responseCode = 455;
            } else {
                // Add character to player repo.   We will push to the character array for this.
                const updateOneObject = [ {
                    updateOne: {
                        filter: { _id: charCol._id },
                        update: {  $push: { characters: requestObject.name } },
                        upsert: true
                    }
                } ] ;
                log.debug(`Update: crudCharacter.updateSheet : charCol : ${JSON.stringify(charCol)}`);
                log.debug(`Update: crudCharacter.updateSheet : updateOneObject : ${JSON.stringify(updateOneObject)}`);

                const bulkWriteResults = await db.bulkWrite(updateOneObject);
                log.debug(`Running: DeviceSync.querySyncTimeStamp. bulkWriteResults ${JSON.stringify(bulkWriteResults)}`);

                // {"ok":1,"writeErrors":[],"writeConcernErrors":[],"insertedIds":[],"nInserted":0,"nUpserted":0,"nMatched":1,"nModified":1,"nRemoved":0,"upserted":[]}]
                if (!['true', true, 1].includes(bulkWriteResults.ok)) {
                    throw new Error(`crudCharacter.updateSheet : Failed mongo update ${JSON.stringify(updateOneObject)}`);
                }
                validationResponse.message = `Character ${requestObject.name} has been added to ${requestObject.player}`;
                validationResponse.responseCode = 200;
            }
        } else {
            log.debug('Update: charUtils.havePermissions : Player Not Found unable to check characters');
            validationResponse.message = 'Player not found in database';
            validationResponse.results = 'N/A';
            validationResponse.responseCode = 455;
        }
    } catch (err) {
        log.error(`Update: charUtils.havePermissions : Player request failed : ${err}`);
        validationResponse.message = 'Player request failed.';
        validationResponse.responseCode = 457;
    }

    // Return Results
    log.debug(`Ending: charUtils.addCharacterToPlayer. validationResponse : ${JSON.stringify(validationResponse)} `);
    return validationResponse;
}

/**
 * Returns a list of characters for a specific player.
 * @param {object} requestObject Request showing user name
 * @returns {Object} Returned object showing an array of characters and a total number of characters
 */
async function returnListOfCharacters(requestObject) {
    log.debug(`Starting: charUtils.returnNumberOfCharacters. sheet object : ${JSON.stringify(requestObject)} `);
    const validationResponse = new Response({
        from: 'returnNumberOfCharacters',
        responseCode: 400,
        message: '',
        step: 'Return List of Characters'
    });

    // Updates must always include player name.  Without this, there can be no request.
    // Throw an error if his happens.
    if (!requestObject.player) {
        log.debug('Update: charUtils.returnNumberOfCharacters. value of player name not found!');
        validationResponse.message = 'Value of player name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // Get character list from DB
    // Verify that our character does not already exist.
    try {
        const query = {
            name: requestObject.player
        };
        // Is character currently in DB?
        log.debug(`Update: charUtils.returnListOfCharacters : query : ${JSON.stringify(query)}`);

        const charCol = await db.findOne(query);
        log.debug(`Update: charUtils.returnListOfCharacters : charCol : ${JSON.stringify(charCol)}`);

        // If We find the character list, pull it
        if (charCol) {
            log.debug('Update: charUtils.returnListOfCharacters : Player Found, checking available characters');
            validationResponse.message = { 
                characters: charCol.characters,
                numberOfCharacters: charCol.characters.length
            };
            validationResponse.responseCode = 200;
        } else {
            log.debug('Update: charUtils.havePermissions : Player Not Found unable to check characters');;
            validationResponse.message = 'Player not found in database';
            validationResponse.results = 'N/A';
            validationResponse.responseCode = 455;
        }
    } catch (err) {
        log.error(`Update: charUtils.havePermissions : Player request failed : ${err}`);
        validationResponse.message = 'Player request failed.';
        validationResponse.responseCode = 457;
    }

    // Return Results
    log.debug(`Ending: charUtils.returnNumberOfCharacters. validationResponse : ${JSON.stringify(validationResponse)} `);
    return validationResponse;
}

module.exports = { havePermissions, addCharacterToPlayer, returnListOfCharacters };