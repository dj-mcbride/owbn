/* globals log database */
const { Response } = require('../../Response');
const Collection = 'owbnVampireSheets';
const db = database.collection(Collection);
const Ajv = require('ajv');
const ajv = new Ajv();
const vampSheetTemplate = require('../../schemas/owbnVamp/vampSheet.json');


/**
 * @description Create a new character.  This will import what is passed and insert it into mongo.
 * @name createSheet
 * @summary Create a new character
 * @param {object} sheet Character sheet to be createdn
 * @returns {object} Response object
 */
async function createSheet(sheet) {
    log.debug('Starting: crudCharacter.createSheet. sheet object ');
    log.debug(`Starting: crudCharacter.createSheet. sheet object : ${JSON.stringify(sheet)} `);
    // The sheet should look something like this
    //     "characterSheet" :  {
    //     "name" : "Vincent Ivey",
    //     "player" : "DeeJay McBride",
    //     "homeGame" : "Dark Colony: Hartford",
    //     "clan" : "Malkavian",
    //     "bloodline" : "Main",
    //     "generation" : 8,
    //     "sect" : "Camarilla",
    //     "sire" : "Unknown",
    //     "age" : "78",
    //     "position" : "None",
    //     "nature" : "Architect",
    //     "demeanor" : "Confidant",
    //     "traits" : {
    //         "physicalTraits" : [
    //             "Graceful",
    //             "Nimble",
    //             ]
    //         }
    //     }
    
    // Build our validation response that we will return to the requester.
    const validationResponse = new Response({
        from: 'createSheet',
        responseCode: 400,
        message: '',
        step: 'Create Sheet'
    });

    // A schema was passed.   We want to validate it
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
            const charCol = await db.findOne(query);

            if (!charCol) {
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

/**
 * @description Update an existing character.  The first two values in the passed object should be name and player, followed by an object of updates
 * @name updateSheet
 * @summary Update an existing character.
 * @param {object} updateSheet Character object to be updated
 * @returns {object} response Response object
 */
async function updateSheet(updateSheet) {
    log.debug(`Starting: crudCharacter.updateSheet. sheet object : ${JSON.stringify(updateSheet)} `);
    // The update object should look like this.
	// "updateObject" : {
    // 	"name": "Vincent Ivey",
    //     "player": "DeeJay McBride",
    //     "updates": {
    //     	"position": "Keeper",
    //     	"sect": "Camarilla",
    //     	"traits": {
    //         "physicalTraits": [
	//             "Tacos"
	//             ]
    //     	}
    // 	}
	// }

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
        const charCol = await db.findOne(query);

        if (charCol) {
            log.debug('Update: crudCharacter.updateSheet : Sheet found in DB.   Updating Sheet');
            // Build the update object.  We are using the ID we found when we queried the DB to make
            // the update faster and to allow us to update the character/player name
            const updateOneObject = [ {
                updateOne: {
                    filter: { _id: charCol._id },
                    update: {  $set: updateValues },
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

/**
 * @description Delete an existing character.
 * @name deleteSheet
 * @summary Update an existing character.
 * @param {object} deleteSheet Character object to be deleteSheet
 * @returns {object} response Response object
 */
async function deleteSheet(deleteSheet) {
    log.debug(`Starting: crudCharacter.deleteSheet. sheet object : ${JSON.stringify(deleteSheet)} `);
    // The deleteSheet object should look like the following
    // "deleteObject" : {
    // 	"name": "Vincent Ivey",
    //     "player": "DeeJay McBride"
	// }

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
        const charCol = await db.findOne(query);

        if (charCol) {
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

/**
 * @description Add an attribute to an existing character. Valid fields are physicalTraits, socialTraits, mentalTraits, negPhysicalTraits, negSocialTraits, negMentalTraits, merits, customMerits, flaws, and status
 * @name addAttribute
 * @summary Update an existing character.
 * @param {object} updateObject Object to be updated.
 * @returns {object} response Response object
 */
async function addAttribute(updateObject) {
    log.debug(`Starting: crudCharacter.addAttribute. sheet object : ${JSON.stringify(updateObject)} `);
    console.log(`Starting: crudCharacter.addAttribute. sheet object : ${JSON.stringify(updateObject)} `);
    // The updateObject  should look like the following
    // "updateObject" : {
    //     "name": "Vincent Ivey",
    //     "player": "DeeJay McBride",
    //     updateValues: {
    //          "physicalTraits": [
    //             "Tacos"
    //          ],
    //          "socialTraits": [
    //             "Rule"
    //          ],
    //          "mentalTraits": [
    //              "onTuesday"
    //           ],
    //         },
    //     }
    // }

    // Valid fields are
    // physicalTraits, socialTraits, mentalTraits, 
    // negPhysicalTraits, negSocialTraits, negMentalTraits
    // merits, customMerits, flaws, and status
    const validationResponse = new Response({
        from: 'addAttribute',
        responseCode: 400,
        message: '',
        step: 'Add Attribute'
    });

    // Updates must always include player and character name.  Without those, there can be no update.
    // Throw an error if his happens.
    log.debug('Update: crudCharacter.addAttribute. Testing incoming values');
    console.log('Update: crudCharacter.addAttribute. Testing incoming values');
    if (!updateObject.name) {
        log.debug('Update: crudCharacter.addAttribute. value of character name not found!');
        validationResponse.message = 'Value of character name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }
    if (!updateObject.player) {
        log.debug('Starting: crudCharacter.addAttribute. value of player name not found!');
        validationResponse.message = 'Value of player name not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // Make sure that the character exists in the DB.   If the character does not exist, we don't want
    // to create a fragmented character
        const query = {
            name: updateObject.name,
            player: updateObject.player
        };
        // Is sheet currently in DB?
        log.debug('Update: crudCharacter.addAttribute. Is sheet currently in DB? ');
        console.log('Update: crudCharacter.addAttribute. Is sheet currently in DB? ');
        const charCol = await db.findOne(query);

        if (charCol) {
            log.debug('Update: crudCharacter.addAttribute : Sheet found in DB.   Updating Sheet');
            console.log('Update: crudCharacter.addAttribute : Sheet found in DB.   Updating Sheet');

            // Pull our list of keys, this is what we will use to build our update object.
            const keys = Object.keys(updateObject.updateValues);
            console.log(`Update: crudCharacter.addAttribute : keys : ${keys}`);
            let updateValue = '';

            keys.forEach((element) => {
                console.log(`Working on key : ${element}`);
                if (element === 'physicalTraits') {
                    updateValue =  updateValue + `"traits.physicalTraits" : "${updateObject.updateValues.physicalTraits}", `;
                } else if (element === 'socialTraits') {
                    updateValue =  updateValue + `"traits.socialTraits" : "${updateObject.updateValues.socialTraits}", `;
                } else if (element === 'mentalTraits') {
                    updateValue =  updateValue + `"traits.mentalTraits" : "${updateObject.updateValues.mentalTraits}", `;
                } else if (element === 'negPhysicalTraits') {
                    updateValue =  updateValue + `"negTraits.negPhysicalTraits" : "${updateObject.updateValues.negPhysicalTraits}", `;
                } else if (element === 'negSocialTraits') {
                    updateValue =  updateValue + `"negTraits.negSocialTraits" : "${updateObject.updateValues.negSocialTraits}", `;
                } else if (element === 'negMentalTraits') {
                    updateValue =  updateValue + `"negTraits.negMentalTraits" : "${updateObject.updateValues.negMentalTraits}", `;
                } else if (element === 'merits') {
                    updateValue =  updateValue + `"merits" : "${updateObject.updateValues.merits}, "`;
                } else if (element === 'customMerits') {
                    updateValue =  updateValue + `"customMerits" : "${updateObject.updateValues.customMerits}", `;
                } else if (element === 'flaws') {
                    updateValue =  updateValue + `"flaws" : "${updateObject.updateValues.flaws}", `;
                } else if (element === 'combodisciplines') {
                    updateValue =  updateValue + `"combodisciplines" : "${updateObject.updateValues.combodisciplines}", `;
                } else if (element === 'status') {
                    updateValue =  updateValue + `"status" : "${updateObject.updateValues.status}", `;
                }
              });
            updateValue = updateValue.slice(0, -2);
            console.log(`Update: crudCharacter.addAttribute : updateValue : ${updateValue}`);

            // Build the update object.  We are using the ID we found when we queried the DB to make
            // the update faster and to allow us to update the character/player name
            const updateOneObject = [ {
                updateOne: {
                    filter: { _id: charCol._id },
                    update: {  $push: { updateValue } }
                }
            } ] ;

            log.trace(`Update: crudCharacter.addAttribute : charCol : ${JSON.stringify(charCol)}`);
            log.debug(`Update: crudCharacter.addAttribute : updateOneObject : ${JSON.stringify(updateOneObject)}`);

            // console.log(`Update: crudCharacter.addAttribute : charCol : ${JSON.stringify(charCol)}`);
            console.log(`Update: crudCharacter.addAttribute : updateOneObject : ${JSON.stringify(updateOneObject)}`);

            const bulkWriteResults = await db.bulkWrite(updateOneObject);
            log.debug(`Running: DeviceSync.querySyncTimeStamp. bulkWriteResults ${JSON.stringify(bulkWriteResults)}`);
            console.log(`Running: DeviceSync.querySyncTimeStamp. bulkWriteResults ${JSON.stringify(bulkWriteResults)}`);
            
            // {"ok":1,"writeErrors":[],"writeConcernErrors":[],"insertedIds":[],"nInserted":0,"nUpserted":0,"nMatched":1,"nModified":1,"nRemoved":0,"upserted":[]}]
            if (!['true', true, 1].includes(bulkWriteResults.ok)) {
                throw new Error(`crudCharacter.addAttribute : Failed mongo update ${JSON.stringify(updateOneObject)}`);
            }
            validationResponse.message = 'Character Sheet updated!';
            validationResponse.responseCode = 200;
        } else {
            log.debug('Ending: crudCharacter.addAttribute : Character sheet not found!  Unable to update.');
            validationResponse.message = 'Character sheet not found!  Unable to update.';
            validationResponse.responseCode = 400;
        }

    // Return Results
    return validationResponse;
}

module.exports = { createSheet, updateSheet, deleteSheet, addAttribute };

