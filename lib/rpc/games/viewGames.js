/* globals log database */
const { Response } = require('../../Response');
const Collection = 'owbnGames';
const db = database.collection(Collection);

/**
 * Tests to see if the devices are synced.
 * @param {object} requestObject Game Info
 * @returns {Object} Returned object showing success or failure of action
 */

 // View Info Start

async function viewInfo(requestObject) {
    log.debug('Starting: viewGame.viewInfo.');
    log.trace(`Starting: viewGame.viewInfo. info object : ${JSON.stringify(requestObject)} `);
    const validationResponse = new Response({
        from: 'viewInfo',
        responseCode: 400,
        message: '',
        step: 'View Info'
    });

    // Updates must always include game name.  Without those, there can be no request.
    // Throw an error if his happens.
    if (!requestObject.name) {
        log.debug('Update: viewGame.createInfo. value of game name not found!');
        validationResponse.message = 'Value of game name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // This is what we are going to use for our info definition critera.
    // No two games can have the same name.
    try {
        const query = {
            name: requestObject.name,
        };
        // Is info currently in DB?
        log.debug('Update: viewGame.viewInfo. Is info currently in DB? ');
        const charCol = await db.findOne(query);

        // If We find the info, return it
        if (charCol) {
            log.debug('Update: viewGame.viewInfo : Info found, adding info to responce object');
            // Insert Info into DB
            validationResponse.message = charCol;
            validationResponse.responseCode = 200;
        } else {
            log.debug('Update: viewGame.viewInfo : info not found, cannot return');
            validationResponse.message = 'Info not found in database';
            validationResponse.responseCode = 455;
        }
    } catch (err) {
        log.error(`Update: viewGame.viewInfo : Info request failed : ${err}`);
        validationResponse.message = 'Info request failed.';
        validationResponse.responseCode = 457;
    }

    // Return Results
    log.debug(`Ending: viewGame.viewInfo. validationResponse : ${JSON.stringify(validationResponse)} `);
    return validationResponse;
}

// View Selection Start

async function viewSelection(requestObject, project) {
    log.debug('Starting: viewGame.viewSelection.');
    log.trace(`Starting: viewGame.viewSelection. info object : ${JSON.stringify(requestObject)} `);
    log.trace(`Starting: viewGame.viewSelection. project : ${project} `);
    const validationResponse = new Response({
        from: 'viewSelection',
        responseCode: 400,
        message: '',
        step: 'View Item From Info'
    });

    // Updates must always include the game name.  Without those, there can be no request.
    // Throw an error if his happens.
    if (!requestObject.name) {
        log.debug('Update: viewGame.viewSelection. value of game name not found!');
        validationResponse.message = 'Value of game name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }
    if (!project) {
        log.debug('Update: viewGame.viewSelection. value of projection name not found!');
        validationResponse.message = 'Value of projection name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // This is what we are going to use for our info definition critera.
    // No two games may have the same name.
    try {
        const query = {
            name: requestObject.name,
        };

        const projection = {
            fields:  { name: 1, [project]: 1 }
        };

        // Is info currently in DB?
        log.debug('Update: viewGame.viewSelection. Is info currently in DB? ');
        const charCol = await db.findOne(query, projection);
        log.trace(`Update: viewGame.viewSelection : charCol : ${JSON.stringify(charCol)}`);

        // If We find the info, return it
        if (charCol) {
            log.debug('Update: viewGame.viewSelection : Info found, adding info to responce object');
            // Insert Info into DB
            validationResponse.message = charCol;
            validationResponse.responseCode = 200;
        } else {
            log.debug('Update: viewGame.viewSelection : info not found, cannot return');
            validationResponse.message = 'Info not found in database';
            validationResponse.responseCode = 455;
        }
    } catch (err) {
        log.error(`Update: viewGame.viewSelection : Info request failed : ${err}`);
        validationResponse.message = 'Info request failed.';
        validationResponse.responseCode = 457;
    }

    // Return Results
    log.debug(`Ending: viewGame.viewSelection. validationResponse : ${JSON.stringify(validationResponse)} `);
    return validationResponse;
}

module.exports = { viewInfo, viewSelection };