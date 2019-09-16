/* globals log database */
const { Response } = require('../../Response');
const Collection = 'owbnVampireSheets';
const db = database.collection(Collection);
const Ajv = require('ajv');
const ajv = new Ajv();
const vampSheetTemplate = require('../../schemas/owbnVamp/vampSheet.json');

/**
 * Tests to see if the devices are synced.
 * @param {object} sheet Character Sheet
 * @returns {Object} Returned object showing success or failure of action
 */

//Start Create Sheet Function

async function createSheet(sheet) {
    log.debug('Starting: crudCharacter.createSheet. sheet object ');
    log.debug(`Starting: crudCharacter.createSheet. sheet object : ${JSON.stringify(sheet)} `);
    const validationResponse = new Response({
        from: 'createSheet',
        responseCode: 400,
        message: '',
        step: 'Create Sheet'
    });

    // A schema was passed.   We want to validate it
    // Apply the schema
    const validate = ajv.compile(vampSheetTemplate);
    // Compare the value and see if it's valid
    const validSheet = validate(sheet);

    log.debug(`Update: crudCharacter.createSheet. validSchema : ${validSheet} `);
    // Was the value valid?  If the validSheet value is false, then we know that we need to throw back an error
    if (!validSheet) {
    log.debug(`Update: slipedManager.buildSlipedObject : Sliped Manager Schema provided is not valid. : ${JSON.stringify(validate)}`);
    // Throw an error
    log.debug('Update: crudCharacter.createSheet : validation error ');
    // validationResponse.message = `Errors found : ${JSON.stringify(validate.errors)}`;
    validationResponse.message = `Unable to process missing value : ${validate.errors[0].message}`;
    validationResponse.responseCode = 455;
    } else {
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
    }

    // Return Results
    log.debug(`Ending: crudCharacter.createSheet. validationResponse : ${JSON.stringify(validationResponse)} `);
    return validationResponse;
}

//Start Update Sheet Function

async function updateSheet(updateSheet) {
    log.debug(`Starting: crudCharacter.updateSheet. sheet object : ${JSON.stringify(updateSheet)} `);

    const validationResponse = new Response({
        from: 'updateSheet',
        responseCode: 400,
        message: '',
        step: 'Update Sheet'
    });

    // Updates must always include player and character name.  Without those, there can be no update.
    // Throw an error if his happens.
    if (!updateSheet.name) {
        log.debug('Update: crudCharacter.updateSheet. value of character name not found!');
        validationResponse.message = 'Value of character name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }
    if (!updateSheet.player) {
        log.debug('Update: crudCharacter.updateSheet. value of player name not found!');
        validationResponse.message = 'Value of player name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // Take our updateValues and pull them out for later use.
    const updateValues =  updateSheet.updates;

    // Make sure that the character exists in the DB.   If the character does not exist, we don't want
    // to create a fragmented character
        const query = {
            name: updateSheet.name,
            player: updateSheet.player
        };
        // Is sheet currently in DB?
        log.debug('Update: crudCharacter.updateSheet. Is sheet currently in DB? ');
        const deviceCol = await db.findOne(query);

        if (deviceCol) {
            log.debug('Update: crudCharacter.updateSheet : Sheet found in DB.   Updating Sheet');
            // Build the update object.  We are using the ID we found when we queried the DB to make
            // the update faster and to allow us to update the character/player name
            const updateOneObject = [ {
                updateOne: {
                    filter: { _id: deviceCol._id },
                    update: {  $set: updateValues },
                    upsert: true
                }
            } ] ;

            log.debug(`Update: crudCharacter.updateSheet : deviceCol : ${JSON.stringify(deviceCol)}`);
            log.debug(`Update: crudCharacter.updateSheet : updateOneObject : ${JSON.stringify(updateOneObject)}`);
            
            const bulkWriteResults = await db.bulkWrite(updateOneObject);
            log.debug(`Running: DeviceSync.querySyncTimeStamp. bulkWriteResults ${JSON.stringify(bulkWriteResults)}`);
            
            // {"ok":1,"writeErrors":[],"writeConcernErrors":[],"insertedIds":[],"nInserted":0,"nUpserted":0,"nMatched":1,"nModified":1,"nRemoved":0,"upserted":[]}]
            if (!['true', true, 1].includes(bulkWriteResults.ok)) {
                throw new Error(`crudCharacter.updateSheet : Failed mongo update ${JSON.stringify(updateOneObject)}`);
            }
            validationResponse.message = 'Character Sheet updated!';
            validationResponse.responseCode = 200;
        } else {
            log.debug('Ending: crudCharacter.updateSheet : Character sheet not found!  Unable to update.');
            validationResponse.message = 'Character sheet not found!  Unable to update.';
            validationResponse.responseCode = 400;
        }

    // Return Results
    return validationResponse;
}

//Start Delete Sheet Function

async function deleteSheet(deleteSheet) {
    log.debug(`Starting: crudCharacter.deleteSheet. sheet object : ${JSON.stringify(deleteSheet)} `);

    const validationResponse = new Response({
        from: 'deleteSheet',
        responseCode: 400,
        message: '',
        step: 'Delete Sheet'
    });

    // Updates must always include player and character name.  Without those, there can be no update.
    // Throw an error if his happens.
    if (!deleteSheet.name) {
        log.debug('Update: crudCharacter.deleteSheet. value of character name not found!');
        validationResponse.message = 'Value of character name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }
    if (!deleteSheet.player) {
        log.debug('Starting: crudCharacter.deleteSheet. value of player name not found!');
        validationResponse.message = 'Value of player name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // Make sure that the character exists in the DB.   If the character does not exist, we don't want
    // to create a fragmented character
        const query = {
            name: deleteSheet.name,
            player: deleteSheet.player
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

