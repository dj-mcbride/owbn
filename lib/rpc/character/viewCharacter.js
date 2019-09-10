/* globals log database */
const { Response } = require('../../Response');
const Collection = 'owbnVampireSheets';
const db = database.collection(Collection);

/**
 * Tests to see if the devices are synced.
 * @param {object} requestObject Character Sheet
 * @returns {Object} Returned object showing success or failure of action
 */

 // View Sheet Start

async function viewSheet(requestObject) {
    log.debug('Starting: viewCharacter.viewSheet.');
    log.trace(`Starting: viewCharacter.viewSheet. sheet object : ${JSON.stringify(requestObject)} `);
    const validationResponse = new Response({
        from: 'viewSheet',
        responseCode: 400,
        message: '',
        step: 'View Sheet'
    });

    // Updates must always include player and character name.  Without those, there can be no request.
    // Throw an error if his happens.
    if (!requestObject.name) {
        log.debug('Update: viewCharacter.createSheet. value of character name not found!');
        validationResponse.message = 'Value of character name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }
    if (!requestObject.player) {
        log.debug('Update: viewCharacter.createSheet. value of player name not found!');
        validationResponse.message = 'Value of player name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // This is what we are going to use for our sheet definition critera.
    // No player may have two characters of the same name.
    try {
        const query = {
            name: requestObject.name,
            player: requestObject.player
        };
        // Is sheet currently in DB?
        log.debug('Update: viewCharacter.viewSheet. Is sheet currently in DB? ');
        const charCol = await db.findOne(query);

        // If We find the sheet, return it
        if (charCol) {
            log.debug('Update: viewCharacter.viewSheet : Sheet found, adding sheet to responce object');
            // Insert Sheet into DB
            validationResponse.message = charCol;
            validationResponse.responseCode = 200;
        } else {
            log.debug('Update: viewCharacter.viewSheet : sheet not found, cannot return');
            validationResponse.message = 'Sheet not found in database';
            validationResponse.responseCode = 455;
        }
    } catch (err) {
        log.error(`Update: viewCharacter.viewSheet : Sheet request failed : ${err}`);
        validationResponse.message = 'Sheet request failed.';
        validationResponse.responseCode = 457;
    }

    // Return Results
    log.debug(`Ending: viewCharacter.viewSheet. validationResponse : ${JSON.stringify(validationResponse)} `);
    return validationResponse;
}

// View Selection Start

async function viewSelection(requestObject, project) {
    log.debug('Starting: viewCharacter.viewSelection.');
    log.trace(`Starting: viewCharacter.viewSelection. sheet object : ${JSON.stringify(requestObject)} `);
    const validationResponse = new Response({
        from: 'viewSelection',
        responseCode: 400,
        message: '',
        step: 'View Sheet'
    });

    // Updates must always include player and character name.  Without those, there can be no request.
    // Throw an error if his happens.
    if (!requestObject.name) {
        log.debug('Update: viewCharacter.viewSelection. value of character name not found!');
        validationResponse.message = 'Value of character name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }
    if (!requestObject.player) {
        log.debug('Update: viewCharacter.viewSelection. value of player name not found!');
        validationResponse.message = 'Value of player name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }
    if (!project) {
        log.debug('Update: viewCharacter.viewSelection. value of projection name not found!');
        validationResponse.message = 'Value of projection name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // This is what we are going to use for our sheet definition critera.
    // No player may have two characters of the same name.
    try {
        const query = {
            name: requestObject.name,
            player: requestObject.player
        };
      
        const projection = {
            name: 1,
            player: 1,
            project: 1
        }; 

        // Is sheet currently in DB?
        log.debug('Update: viewCharacter.viewSelection. Is sheet currently in DB? ');
        const charCol = await db.findOne(query, projection);

        // If We find the sheet, return it
        if (charCol) {
            log.debug('Update: viewCharacter.viewSelection : Sheet found, adding sheet to responce object');
            // Insert Sheet into DB
            validationResponse.message = charCol;
            validationResponse.responseCode = 200;
        } else {
            log.debug('Update: viewCharacter.viewSelection : sheet not found, cannot return');
            validationResponse.message = 'Sheet not found in database';
            validationResponse.responseCode = 455;
        }
    } catch (err) {
        log.error(`Update: viewCharacter.viewSelection : Sheet request failed : ${err}`);
        validationResponse.message = 'Sheet request failed.';
        validationResponse.responseCode = 457;
    }

    // Return Results
    log.debug(`Ending: viewCharacter.viewSelection. validationResponse : ${JSON.stringify(validationResponse)} `);
    return validationResponse;
}

module.exports = { viewSheet, viewSelection };