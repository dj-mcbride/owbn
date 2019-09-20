/* globals log database */
const { Response } = require('../../Response');
const Collection = 'owbnItems';
const db = database.collection(Collection);

/**
 * Tests to see if the devices are synced.
 * @param {object} properties Item Properties
 * @returns {Object} Returned object showing success or failure of action
 */

// Start Create Properties Function

async function createProperties(properties) {
    log.debug('Starting: crudItem.createProperties. properties object ');
    log.trace(`Starting: crudItem.createProperties. properties object : ${JSON.stringify(properties)} `);
    const validationResponse = new Response({
        from: 'createProperties',
        responseCode: 400,
        message: '',
        step: 'Create Properties'
    });

    // Updates must always include item name.  Without those, there can be no update.
    // Throw an error if his happens.
    if (!properties.name) {
        log.debug('Update: crudItem.createProperties. value of item name not found!');
        validationResponse.message = 'Value of item name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // This is what we are going to use for our properties definition critera.
    // There may not be two items of the same name.
    try {
        const query = {
            name: properties.name
        };
        // Is properties currently in DB?
        log.debug('Update: crudItem.createProperties. Is properties currently in DB? ');
        const deviceCol = await db.findOne(query);

        if (!deviceCol) {
            log.debug('Update: crudItem.createProperties : Properties not found in DB.   Adding Properties');
            // Insert Properties into DB
            await db.insertOne(properties);
            validationResponse.message = 'Item created!';
            validationResponse.responseCode = 200;
        } else {
            log.debug('Update: crudItem.createProperties : duplicate properties, throwing error ');
            validationResponse.message = 'Duplicate item found!';
            validationResponse.responseCode = 455;
        }
    } catch (err) {
        log.error(`Update: crudItem.createProperties : Item insert failed. : ${err}`);
        validationResponse.message = 'Item insert failed.';
        validationResponse.responseCode = 457;
    }

    // Return Results
    log.debug(`Ending: crudItem.createProperties. validationResponse : ${JSON.stringify(validationResponse)} `);
    return validationResponse;
}

// Start Update Properties Function

async function updateProperties(updateProperties) {
    log.debug(`Starting: crudItem.updateProperties. properties object : ${JSON.stringify(updateProperties)} `);

    const validationResponse = new Response({
        from: 'updateProperties',
        responseCode: 400,
        message: '',
        step: 'Update Properties'
    });

    // Updates must always include item name.  Without that, there can be no update.
    // Throw an error if his happens.
    if (!updateProperties.name) {
        log.debug('Update: crudItem.updateProperties. value of item name not found!');
        validationResponse.message = 'Value of item name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // Take our updateValues and pull them out for later use.
    const updateValues =  updateProperties.updates;

    // Make sure that the item exists in the DB.   If the item does not exist, we don't want
    // to create a fragmented item
        const query = {
            name: updateProperties.name
        };
        // Is properties currently in DB?
        log.debug('Update: crudItem.updateProperties. Is properties currently in DB? ');
        const deviceCol = await db.findOne(query);

        if (deviceCol) {
            log.debug('Update: crudItem.updateProperties : Properties found in DB.   Updating Properties');
            // Build the update object.  We are using the ID we found when we queried the DB to make
            // the update faster and to allow us to update the item name
            const updateOneObject = [ {
                updateOne: {
                    filter: { _id: deviceCol._id },
                    update: {  $set: updateValues },
                    upsert: true
                }
            } ] ;

            log.debug(`Update: crudItem.updateProperties : deviceCol : ${JSON.stringify(deviceCol)}`);
            log.debug(`Update: crudItem.updateProperties : updateOneObject : ${JSON.stringify(updateOneObject)}`);
            
            const bulkWriteResults = await db.bulkWrite(updateOneObject);
            log.debug(`Running: DeviceSync.querySyncTimeStamp. bulkWriteResults ${JSON.stringify(bulkWriteResults)}`);
            
            // {"ok":1,"writeErrors":[],"writeConcernErrors":[],"insertedIds":[],"nInserted":0,"nUpserted":0,"nMatched":1,"nModified":1,"nRemoved":0,"upserted":[]}]
            if (!['true', true, 1].includes(bulkWriteResults.ok)) {
                throw new Error(`crudItem.updateProperties : Failed mongo update ${JSON.stringify(updateOneObject)}`);
            }
            validationResponse.message = 'Item Properties updated!';
            validationResponse.responseCode = 200;
        } else {
            log.debug('Ending: crudItem.updateProperties : Item properties not found!  Unable to update.');
            validationResponse.message = 'Item properties not found!  Unable to update.';
            validationResponse.responseCode = 400;
        }

    // Return Results
    return validationResponse;
}

// Start Delete Properties Function
async function deleteProperties(deleteProperties) {
    log.debug(`Starting: crudItem.deleteProperties. properties object : ${JSON.stringify(deleteProperties)} `);

    const validationResponse = new Response({
        from: 'deleteProperties',
        responseCode: 400,
        message: '',
        step: 'Delete Properties'
    });

    // Updates must always include item name.  Without those, there can be no update.
    // Throw an error if his happens.
    if (!deleteProperties.name) {
        log.debug('Update: crudItem.deleteProperties. value of item name not found!');
        validationResponse.message = 'Value of item name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // Make sure that the item exists in the DB.   If the item does not exist, we don't want
    // to create a fragmented item
        const query = {
            name: deleteProperties.name
        };
        // Is properties currently in DB?
        log.debug('Update: crudItem.deleteProperties. Is properties currently in DB? ');
        const deviceCol = await db.findOne(query);

        if (deviceCol) {
            log.debug('Update: crudItem.deleteProperties : Properties found in DB.   Updating Properties');
            try {
                // Update the item properties
                await db.deleteOne(query);
                validationResponse.message = 'Item properties deleted.';
                validationResponse.responseCode = 200;
            } catch (err) {
                log.error(`Ending: crudItem.deleteProperties : Properties insert failed : ${JSON.stringify(err)}`);
                validationResponse.message = 'Properties delete failed.';
                validationResponse.responseCode = 400;
            }
        } else {
            log.debug('Ending: crudItem.deleteProperties : Item properties not found!  Unable to delete.');
            validationResponse.message = 'Item properties not found!  Unable to delete.';
            validationResponse.responseCode = 400;
        }

    // Return Results
    return validationResponse;
}

module.exports = { createProperties, updateProperties, deleteProperties };

