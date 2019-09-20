/* globals log database */
const { Response } = require('../../Response');
const Collection = 'owbnItems';
const db = database.collection(Collection);

/**
 * Tests to see if the devices are synced.
 * @param {object} requestObject Item Properties
 * @returns {Object} Returned object showing success or failure of action
 */

 // View Properties Start

async function viewProperties(requestObject) {
    log.debug('Starting: viewItems.viewProperties.');
    log.trace(`Starting: viewItems.viewProperties. properties object : ${JSON.stringify(requestObject)} `);
    const validationResponse = new Response({
        from: 'viewProperties',
        responseCode: 400,
        message: '',
        step: 'View Properties'
    });

    // Updates must always include item name.  Without those, there can be no request.
    // Throw an error if his happens.
    if (!requestObject.name) {
        log.debug('Update: viewItems.createProperties. value of item name not found!');
        validationResponse.message = 'Value of item name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // This is what we are going to use for our properties definition critera.
    // No two items can have the same name.
    try {
        const query = {
            name: requestObject.name,
        };
        // Is properties currently in DB?
        log.debug('Update: viewItems.viewProperties. Is properties currently in DB? ');
        const charCol = await db.findOne(query);

        // If We find the properties, return it
        if (charCol) {
            log.debug('Update: viewItems.viewProperties : Properties found, adding properties to responce object');
            // Insert Properties into DB
            validationResponse.message = charCol;
            validationResponse.responseCode = 200;
        } else {
            log.debug('Update: viewItems.viewProperties : properties not found, cannot return');
            validationResponse.message = 'Properties not found in database';
            validationResponse.responseCode = 455;
        }
    } catch (err) {
        log.error(`Update: viewItems.viewProperties : Properties request failed : ${err}`);
        validationResponse.message = 'Properties request failed.';
        validationResponse.responseCode = 457;
    }

    // Return Results
    log.debug(`Ending: viewItems.viewProperties. validationResponse : ${JSON.stringify(validationResponse)} `);
    return validationResponse;
}

// View Selection Start

async function viewItemSelection(requestObject, project) {
    log.debug('Starting: viewItems.viewItemSelection.');
    log.trace(`Starting: viewItems.viewItemSelection. properties object : ${JSON.stringify(requestObject)} `);
    log.trace(`Starting: viewItems.viewItemSelection. project : ${project} `);
    const validationResponse = new Response({
        from: 'viewItemSelection',
        responseCode: 400,
        message: '',
        step: 'View Item From Properties'
    });

    // Updates must always include the item name.  Without those, there can be no request.
    // Throw an error if his happens.
    if (!requestObject.name) {
        log.debug('Update: viewItems.viewItemSelection. value of item name not found!');
        validationResponse.message = 'Value of item name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }
    if (!project) {
        log.debug('Update: viewItems.viewItemSelection. value of projection name not found!');
        validationResponse.message = 'Value of projection name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // This is what we are going to use for our properties definition critera.
    // No two items may have the same name.
    try {
        const query = {
            name: requestObject.name,
        };

        const projection = {
            fields:  { name: 1, [project]: 1 }
        };

        // Is properties currently in DB?
        log.debug('Update: viewItems.viewItemSelection. Is properties currently in DB? ');
        const charCol = await db.findOne(query, projection);
        log.trace(`Update: viewItems.viewItemSelection : charCol : ${JSON.stringify(charCol)}`);

        // If We find the properties, return it
        if (charCol) {
            log.debug('Update: viewItems.viewItemSelection : Properties found, adding properties to responce object');
            // Insert Properties into DB
            validationResponse.message = charCol;
            validationResponse.responseCode = 200;
        } else {
            log.debug('Update: viewItems.viewItemSelection : properties not found, cannot return');
            validationResponse.message = 'Properties not found in database';
            validationResponse.responseCode = 455;
        }
    } catch (err) {
        log.error(`Update: viewItems.viewItemSelection : Properties request failed : ${err}`);
        validationResponse.message = 'Properties request failed.';
        validationResponse.responseCode = 457;
    }

    // Return Results
    log.debug(`Ending: viewItems.viewItemSelection. validationResponse : ${JSON.stringify(validationResponse)} `);
    return validationResponse;
}

module.exports = { viewProperties, viewItemSelection };