/* globals log database */
const { Response } = require('../../Response');
const Collection = 'owbnGames';
const db = database.collection(Collection);

/**
 * Tests to see if the devices are synced.
 * @param {object} info Game Info
 * @returns {Object} Returned object showing success or failure of action
 */

// Start Create Info Function

async function createInfo(info) {
    log.debug('Starting: crudGame.createInfo. info object ');
    log.trace(`Starting: crudGame.createInfo. info object : ${JSON.stringify(info)} `);
    const validationResponse = new Response({
        from: 'createInfo',
        responseCode: 400,
        message: '',
        step: 'Create Info'
    });

    // Updates must always include game name.  Without those, there can be no update.
    // Throw an error if his happens.
    if (!info.name) {
        log.debug('Update: crudGame.createInfo. value of game name not found!');
        validationResponse.message = 'Value of game name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // This is what we are going to use for our info definition critera.
    // There may not be two games of the same name.
    try {
        const query = {
            name: info.name
        };
        // Is info currently in DB?
        log.debug('Update: crudGame.createInfo. Is info currently in DB? ');
        const deviceCol = await db.findOne(query);

        if (!deviceCol) {
            log.debug('Update: crudGame.createInfo : Info not found in DB.   Adding Info');
            // Insert Info into DB
            await db.insertOne(info);
            validationResponse.message = 'Game created!';
            validationResponse.responseCode = 200;
        } else {
            log.debug('Update: crudGame.createInfo : duplicate info, throwing error ');
            validationResponse.message = 'Duplicate game found!';
            validationResponse.responseCode = 455;
        }
    } catch (err) {
        log.error(`Update: crudGame.createInfo : Game insert failed. : ${err}`);
        validationResponse.message = 'Game insert failed.';
        validationResponse.responseCode = 457;
    }

    // Return Results
    log.debug(`Ending: crudGame.createInfo. validationResponse : ${JSON.stringify(validationResponse)} `);
    return validationResponse;
}

// Start Update Info Function

async function updateInfo(updateInfo) {
    log.debug(`Starting: crudGame.updateInfo. info object : ${JSON.stringify(updateInfo)} `);

    const validationResponse = new Response({
        from: 'updateInfo',
        responseCode: 400,
        message: '',
        step: 'Update Info'
    });

    // Updates must always include game name.  Without that, there can be no update.
    // Throw an error if his happens.
    if (!updateInfo.name) {
        log.debug('Update: crudGame.updateInfo. value of game name not found!');
        validationResponse.message = 'Value of game name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // Take our updateValues and pull them out for later use.
    const updateValues =  updateInfo.updates;

    // Make sure that the game exists in the DB.   If the game does not exist, we don't want
    // to create a fragmented game
        const query = {
            name: updateInfo.name
        };
        // Is info currently in DB?
        log.debug('Update: crudGame.updateInfo. Is info currently in DB? ');
        const deviceCol = await db.findOne(query);

        if (deviceCol) {
            log.debug('Update: crudGame.updateInfo : Info found in DB.   Updating Info');
            // Build the update object.  We are using the ID we found when we queried the DB to make
            // the update faster and to allow us to update the game name
            const updateOneObject = [ {
                updateOne: {
                    filter: { _id: deviceCol._id },
                    update: {  $set: updateValues },
                    upsert: true
                }
            } ] ;

            log.debug(`Update: crudGame.updateInfo : deviceCol : ${JSON.stringify(deviceCol)}`);
            log.debug(`Update: crudGame.updateInfo : updateOneObject : ${JSON.stringify(updateOneObject)}`);
            
            const bulkWriteResults = await db.bulkWrite(updateOneObject);
            log.debug(`Running: DeviceSync.querySyncTimeStamp. bulkWriteResults ${JSON.stringify(bulkWriteResults)}`);
            
            // {"ok":1,"writeErrors":[],"writeConcernErrors":[],"insertedIds":[],"nInserted":0,"nUpserted":0,"nMatched":1,"nModified":1,"nRemoved":0,"upserted":[]}]
            if (!['true', true, 1].includes(bulkWriteResults.ok)) {
                throw new Error(`crudGame.updateInfo : Failed mongo update ${JSON.stringify(updateOneObject)}`);
            }
            validationResponse.message = 'Game Info updated!';
            validationResponse.responseCode = 200;
        } else {
            log.debug('Ending: crudGame.updateInfo : Game info not found!  Unable to update.');
            validationResponse.message = 'Game info not found!  Unable to update.';
            validationResponse.responseCode = 400;
        }

    // Return Results
    return validationResponse;
}

// Start Delete Info Function
async function deleteInfo(deleteInfo) {
    log.debug(`Starting: crudGame.deleteInfo. info object : ${JSON.stringify(deleteInfo)} `);

    const validationResponse = new Response({
        from: 'deleteInfo',
        responseCode: 400,
        message: '',
        step: 'Delete Info'
    });

    // Updates must always include game name.  Without those, there can be no update.
    // Throw an error if his happens.
    if (!deleteInfo.name) {
        log.debug('Update: crudGame.deleteInfo. value of game name not found!');
        validationResponse.message = 'Value of game name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // Make sure that the game exists in the DB.   If the game does not exist, we don't want
    // to create a fragmented game
        const query = {
            name: deleteInfo.name
        };
        // Is info currently in DB?
        log.debug('Update: crudGame.deleteInfo. Is info currently in DB? ');
        const deviceCol = await db.findOne(query);

        if (deviceCol) {
            log.debug('Update: crudGame.deleteInfo : Info found in DB.   Updating Info');
            try {
                // Update the game info
                await db.deleteOne(query);
                validationResponse.message = 'Game info deleted.';
                validationResponse.responseCode = 200;
            } catch (err) {
                log.error(`Ending: crudGame.deleteInfo : Info insert failed : ${JSON.stringify(err)}`);
                validationResponse.message = 'Info delete failed.';
                validationResponse.responseCode = 400;
            }
        } else {
            log.debug('Ending: crudGame.deleteInfo : Game info not found!  Unable to delete.');
            validationResponse.message = 'Game info not found!  Unable to delete.';
            validationResponse.responseCode = 400;
        }

    // Return Results
    return validationResponse;
}

module.exports = { createInfo, updateInfo, deleteInfo };

