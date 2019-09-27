/* globals log database */
const { Response } = require('../../Response');
const Collection = 'owbnPlayerList';
const db = database.collection(Collection);

/**
 * Tests to see if the devices are synced.
 * @param {object} info Player Player
 * @returns {Object} Returned object showing success or failure of action
 */

// Start Create Player Function

async function createPlayer(info) {
    log.debug('Starting: crudPlayer.createPlayer info object ');
    log.trace(`Starting: crudPlayer.createPlayer info object : ${JSON.stringify(info)} `);
    const validationResponse = new Response({
        from: 'createPlayer',
        responseCode: 400,
        message: '',
        step: 'Create Player'
    });

    // Updates must always include player name.  Without those, there can be no update.
    // Throw an error if his happens.
    if (!info.name) {
        log.debug('Update: crudPlayer.createPlayer. value of player name not found!');
        validationResponse.message = 'Value of player name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // This is what we are going to use for our info definition critera.
    // There may not be two players of the same name.
    try {
        const query = {
            name: info.name
        };
        // Is info currently in DB?
        log.debug('Update: crudPlayer.createPlayer. Is info currently in DB? ');
        const playerCol = await db.findOne(query);

        if (!playerCol) {
            log.debug('Update: crudPlayer.createPlayer : Player not found in DB.   Adding Player');
            // Insert Player into DB
            await db.insertOne(info);
            validationResponse.message = 'Player created!';
            validationResponse.responseCode = 200;
        } else {
            log.debug('Update: crudPlayer.createPlayer : duplicate info, throwing error ');
            validationResponse.message = 'Duplicate player found!';
            validationResponse.responseCode = 455;
        }
    } catch (err) {
        log.error(`Update: crudPlayer.createPlayer : Player insert failed. : ${err}`);
        validationResponse.message = 'Player insert failed.';
        validationResponse.responseCode = 457;
    }

    // Return Results
    log.debug(`Ending: crudPlayer.createPlayer. validationResponse : ${JSON.stringify(validationResponse)} `);
    return validationResponse;
}

// Start Update Player Function

async function updatePlayer(updatePlayer) {
    log.debug(`Starting: crudPlayer.updatePlayer. info object : ${JSON.stringify(updatePlayer)} `);

    const validationResponse = new Response({
        from: 'updatePlayer',
        responseCode: 400,
        message: '',
        step: 'Update Player'
    });

    // Updates must always include player name.  Without that, there can be no update.
    // Throw an error if his happens.
    if (!updatePlayer.name) {
        log.debug('Update: crudPlayer.updatePlayer. value of player name not found!');
        validationResponse.message = 'Value of player name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // Take our updateValues and pull them out for later use.
    const updateValues =  updatePlayer.updates;

    // Make sure that the player exists in the DB.   If the player does not exist, we don't want
    // to create a fragmented player
        const query = {
            name: updatePlayer.name
        };
        // Is info currently in DB?
        log.debug('Update: crudPlayer.updatePlayer. Is info currently in DB? ');
        const playerCol = await db.findOne(query);

        if (playerCol) {
            log.debug('Update: crudPlayer.updatePlayer : Player found in DB.   Updating Player');
            // Build the update object.  We are using the ID we found when we queried the DB to make
            // the update faster and to allow us to update the player name
            const updateOneObject = [ {
                updateOne: {
                    filter: { _id: playerCol._id },
                    update: {  $set: updateValues },
                    upsert: true
                }
            } ] ;

            log.debug(`Update: crudPlayer.updatePlayer : playerCol : ${JSON.stringify(playerCol)}`);
            log.debug(`Update: crudPlayer.updatePlayer : updateOneObject : ${JSON.stringify(updateOneObject)}`);

            const bulkWriteResults = await db.bulkWrite(updateOneObject);
            log.debug(`Running: DeviceSync.querySyncTimeStamp. bulkWriteResults ${JSON.stringify(bulkWriteResults)}`);

            // {"ok":1,"writeErrors":[],"writeConcernErrors":[],"insertedIds":[],"nInserted":0,"nUpserted":0,"nMatched":1,"nModified":1,"nRemoved":0,"upserted":[]}]
            if (!['true', true, 1].includes(bulkWriteResults.ok)) {
                throw new Error(`crudPlayer.updatePlayer : Failed mongo update ${JSON.stringify(updateOneObject)}`);
            }
            validationResponse.message = 'Player updated!';
            validationResponse.responseCode = 200;
        } else {
            log.debug('Ending: crudPlayer.updatePlayer : Player info not found!  Unable to update.');
            validationResponse.message = 'Player info not found!  Unable to update.';
            validationResponse.responseCode = 400;
        }

    // Return Results
    return validationResponse;
}

// Start Delete Player Function
async function deletePlayer(deletePlayer) {
    log.debug(`Starting: crudPlayer.deletePlayer. info object : ${JSON.stringify(deletePlayer)} `);

    const validationResponse = new Response({
        from: 'deletePlayer',
        responseCode: 400,
        message: '',
        step: 'Delete Player'
    });

    // Updates must always include player name.  Without those, there can be no update.
    // Throw an error if his happens.
    if (!deletePlayer.name) {
        log.debug('Update: crudPlayer.deletePlayer. value of player name not found!');
        validationResponse.message = 'Value of player name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // Make sure that the player exists in the DB.   If the player does not exist, we don't want
    // to create a fragmented player
        const query = {
            name: deletePlayer.name
        };
        // Is info currently in DB?
        log.debug('Update: crudPlayer.deletePlayer. Is info currently in DB? ');
        const playerCol = await db.findOne(query);

        if (playerCol) {
            log.debug('Update: crudPlayer.deletePlayer : Player found in DB.   Updating Player');
            try {
                // Update the player info
                await db.deleteOne(query);
                validationResponse.message = 'Player deleted.';
                validationResponse.responseCode = 200;
            } catch (err) {
                log.error(`Ending: crudPlayer.deletePlayer : Player insert failed : ${JSON.stringify(err)}`);
                validationResponse.message = 'Player delete failed.';
                validationResponse.responseCode = 400;
            }
        } else {
            log.debug('Ending: crudPlayer.deletePlayer : Player info not found!  Unable to delete.');
            validationResponse.message = 'Player info not found!  Unable to delete.';
            validationResponse.responseCode = 400;
        }

    // Return Results
    return validationResponse;
}

module.exports = { createPlayer, updatePlayer, deletePlayer };

