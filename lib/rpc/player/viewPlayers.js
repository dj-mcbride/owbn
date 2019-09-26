/* globals log database */
const { Response } = require('../../Response');
const Collection = 'owbnPlayerList';
const db = database.collection(Collection);

/**
 * Tests to see if the devices are synced.
 * @param {object} requestObject Player Info
 * @returns {Object} Returned object showing success or failure of action
 */

 // View Info Start

async function viewInfo(requestObject) {
    log.debug('Starting: viewPlayer.viewInfo.');
    log.trace(`Starting: viewPlayer.viewInfo. info object : ${JSON.stringify(requestObject)} `);
    const validationResponse = new Response({
        from: 'viewInfo',
        responseCode: 400,
        message: '',
        step: 'View Info'
    });

    // Updates must always include player name.  Without those, there can be no request.
    // Throw an error if his happens.
    if (!requestObject.name) {
        log.debug('Update: viewPlayer.createInfo. value of player name not found!');
        validationResponse.message = 'Value of player name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // This is what we are going to use for our info definition critera.
    // No two players can have the same name.
    try {
        const query = { name: requestObject.name };
        // Is info currently in DB?
        log.debug('Update: viewPlayer.viewInfo. Is info currently in DB? ');
        const charCol = await db.findOne(query);

        // If We find the info, return it
        if (charCol) {
            log.debug('Update: viewPlayer.viewInfo : Info found, adding info to responce object');
            // Insert Info into DB
            validationResponse.message = charCol;
            validationResponse.responseCode = 200;
        } else {
            log.debug('Update: viewPlayer.viewInfo : info not found, cannot return');
            validationResponse.message = 'Info not found in database';
            validationResponse.responseCode = 455;
        }
    } catch (err) {
        log.error(`Update: viewPlayer.viewInfo : Info request failed : ${err}`);
        validationResponse.message = 'Info request failed.';
        validationResponse.responseCode = 457;
    }

    // Return Results
    log.debug(`Ending: viewPlayer.viewInfo. validationResponse : ${JSON.stringify(validationResponse)} `);
    return validationResponse;
}

// View Selection Start

async function viewPlayerSelection(requestObject, project) {
    log.debug('Starting: viewPlayer.viewPlayerSelection.');
    log.trace(`Starting: viewPlayer.viewPlayerSelection. info object : ${JSON.stringify(requestObject)} `);
    log.trace(`Starting: viewPlayer.viewPlayerSelection. project : ${project} `);
    const validationResponse = new Response({
        from: 'viewPlayerSelection',
        responseCode: 400,
        message: '',
        step: 'View Item From Info'
    });

    // Updates must always include the player name.  Without those, there can be no request.
    // Throw an error if his happens.
    if (!requestObject.name) {
        log.debug('Update: viewPlayer.viewPlayerSelection. value of player name not found!');
        validationResponse.message = 'Value of player name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }
    if (!project) {
        log.debug('Update: viewPlayer.viewPlayerSelection. value of projection name not found!');
        validationResponse.message = 'Value of projection name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // This is what we are going to use for our info definition critera.
    // No two players may have the same name.
    try {
        const query = {
            name: requestObject.name
        };

        const projection = {
            fields:  { name: 1, [project]: 1 }
        };

        // Is info currently in DB?
        log.debug('Update: viewPlayer.viewPlayerSelection. Is info currently in DB? ');
        const charCol = await db.findOne(query, projection);
        log.trace(`Update: viewPlayer.viewPlayerSelection : charCol : ${JSON.stringify(charCol)}`);

        // If We find the info, return it
        if (charCol) {
            log.debug('Update: viewPlayer.viewPlayerSelection : Info found, adding info to responce object');
            // Insert Info into DB
            validationResponse.message = charCol;
            validationResponse.responseCode = 200;
        } else {
            log.debug('Update: viewPlayer.viewPlayerSelection : info not found, cannot return');
            validationResponse.message = 'Info not found in database';
            validationResponse.responseCode = 455;
        }
    } catch (err) {
        log.error(`Update: viewPlayer.viewPlayerSelection : Info request failed : ${err}`);
        validationResponse.message = 'Info request failed.';
        validationResponse.responseCode = 457;
    }

    // Return Results
    log.debug(`Ending: viewPlayer.viewPlayerSelection. validationResponse : ${JSON.stringify(validationResponse)} `);
    return validationResponse;
}

module.exports = { viewInfo, viewPlayerSelection };