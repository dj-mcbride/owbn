/* globals log database */
const { Response } = require('../../Response');
const Collection = 'owbnVampireSheets';
const db = database.collection(Collection);

/**
 * Tests to see if the devices are synced.
 * @param {object} sheet Character Sheet
 * @returns {Object} Returned object showing success or failure of action
 */
async function createSheet(sheet) {
    log.debug('Starting: crudCharacter.createSheet. sheet object ');
    log.trace(`Starting: crudCharacter.createSheet. sheet object : ${JSON.stringify(sheet)} `);
    const validationResponse = new Response({
        from: 'createSheet',
        responseCode: 400,
        message: '',
        step: 'Create Sheet'
    });

    // Updates must always include player and character name.  Without those, there can be no update.
    // Throw an error if his happens.
    if (!sheet.name) {
        log.debug('Update: crudCharacter.createSheet. value of character name not found!');
        validationResponse.message = 'Value of character name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }
    if (!sheet.player) {
        log.debug('Update: crudCharacter.createSheet. value of player name not found!');
        validationResponse.message = 'Value of player name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // This is what we are going to use for our sheet definition critera.
    // No player may have two characters of the same name.
    try {
        const query = {
            name: sheet.name,
            player: sheet.player
        };
        // Is sheet currently in DB?
        log.debug('Update: crudCharacter.createSheet. Is sheet currently in DB? ');
        const deviceCol = await db.findOne(query);

        if (!deviceCol) {
            log.debug('Update: crudCharacter.createSheet : Sheet not found in DB.   Adding Sheet');
            // Insert Sheet into DB
            await db.insertOne(sheet);
            validationResponse.message = 'Character sheet entered.';
            validationResponse.responseCode = 200;
        } else {
            log.debug('Update: crudCharacter.createSheet : duplicate sheet, throwing error ');
            validationResponse.message = 'Duplicate character sheet entry.';
            validationResponse.responseCode = 455;
        }
    } catch (err) {
        log.error(`Update: crudCharacter.createSheet : Sheet insert failed : ${err}`);
        validationResponse.message = 'Sheet insert failed.';
        validationResponse.responseCode = 457;
    }

    // Return Results
    log.debug(`Ending: crudCharacter.createSheet. validationResponse : ${JSON.stringify(validationResponse)} `);
    return validationResponse;
}

async function updateSheet(updates) {
    log.debug(`Starting: crudCharacter.updateSheet. sheet object : ${JSON.stringify(updates)} `);

    const validationResponse = new Response({
        from: 'updateSheet',
        responseCode: 400,
        message: '',
        step: 'Update Sheet'
    });

    // Updates must always include player and character name.  Without those, there can be no update.
    // Throw an error if his happens.
    if (!updates.name) {
        log.debug('Update: crudCharacter.updateSheet. value of character name not found!');
        validationResponse.message = 'Value of character name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }
    if (!updates.player) {
        log.debug('Update: crudCharacter.updateSheet. value of player name not found!');
        validationResponse.message = 'Value of player name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // Make sure that the character exists in the DB.   If the character does not exist, we don't want
    // to create a fragmented character
        const query = {
            name: updates.name,
            player: updates.player
        };
        // Is sheet currently in DB?
        log.debug('Update: crudCharacter.updateSheet. Is sheet currently in DB? ');
        const deviceCol = await db.findOne(query);

        if (deviceCol) {
            log.debug('Update: crudCharacter.updateSheet : Sheet found in DB.   Updating Sheet');
            // Build the update object
            const updateOneObject =  {
                filter: { name: updates.name, player: updates.player },
                update: {  $set: { updates } },
                upsert: true
            };

            log.debug(`Update: crudCharacter.updateSheet : deviceCol : ${JSON.stringify(deviceCol)}`);
            // updateOne: {
            //     filter: { _id: device },
            //     update: { $set: { status: result, nso_sync_time: now, device: device } },
            //     upsert: true
            // }

            log.debug(`Update: crudCharacter.updateSheet : updateOneObject : ${JSON.stringify(updateOneObject)}`);
            try {
                // Update the character sheet
                await db.updateOne(updateOneObject);
                validationResponse.message = 'Character sheet updated.';
                validationResponse.responseCode = 200;
            } catch (err) {
                log.error(`Ending: crudCharacter.updateSheet : Sheet update failed : ${JSON.stringify(err)}`);
                validationResponse.message = 'Sheet update failed.';
                validationResponse.responseCode = 400;
            }
        } else {
            log.debug('Ending: crudCharacter.updateSheet : Character sheet not found!  Unable to update.');
            validationResponse.message = 'Character sheet not found!  Unable to update.';
            validationResponse.responseCode = 400;
        }

    // Return Results
    return validationResponse;
}

async function deleteSheet(updates) {
    log.debug(`Starting: crudCharacter.deleteSheet. sheet object : ${JSON.stringify(updates)} `);

    const validationResponse = new Response({
        from: 'deleteSheet',
        responseCode: 400,
        message: '',
        step: 'Delete Sheet'
    });

    // Updates must always include player and character name.  Without those, there can be no update.
    // Throw an error if his happens.
    if (!updates.name) {
        log.debug('Update: crudCharacter.deleteSheet. value of character name not found!');
        validationResponse.message = 'Value of character name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }
    if (!updates.player) {
        log.debug('Starting: crudCharacter.deleteSheet. value of player name not found!');
        validationResponse.message = 'Value of player name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // Make sure that the character exists in the DB.   If the character does not exist, we don't want
    // to create a fragmented character
        const query = {
            name: updates.name,
            player: updates.player
        };
        // Is sheet currently in DB?
        log.debug('Update: crudCharacter.deleteSheet. Is sheet currently in DB? ');
        const deviceCol = await db.findOne(query);

        if (deviceCol) {
            log.debug('Update: crudCharacter.deleteSheet : Sheet found in DB.   Updating Sheet');
            try {
                // Update the character sheet
                await db.deleteOne(query);
                validationResponse.message = 'Character sheet deleted.';
                validationResponse.responseCode = 200;
            } catch (err) {
                log.error(`Ending: crudCharacter.deleteSheet : Sheet insert failed : ${JSON.stringify(err)}`);
                validationResponse.message = 'Sheet delete failed.';
                validationResponse.responseCode = 400;
            }
        } else {
            log.debug('Ending: crudCharacter.deleteSheet : Character sheet not found!  Unable to delete.');
            validationResponse.message = 'Character sheet not found!  Unable to delete.';
            validationResponse.responseCode = 400;
        }

    // Return Results
    return validationResponse;
}

module.exports = { createSheet, updateSheet, deleteSheet };

