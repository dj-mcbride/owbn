/* globals log cogs database auditTrail */
const { Response } = require('../../Response');
const Collection = 'deviceLastSynced';
const db = database.collection(Collection);

/**
 * Tests to see if the devices are synced.
 * @param {object} sheet Character Sheet
 * @returns {Object} Returned object showing success or failure of action
 */
async function createSheet(sheet) {
    log.debug(`Starting: crudCharacter.createSheet. sheet object : ${JSON.stringify(sheet)} `);
    const validationResponse = new Response({
        from: 'createSheet',
        responseCode: 400,
        message: '',
        step: 'Create Sheet'
    });

    // Does incoming sheet match template regulations?

    // This is what we are going to use for our sheet definition critera.   
    // No player may have two characters of the same name.
    try {
        const query = {
            name: sheet.name,
            player: sheet.player
        };
        // Is sheet currently in DB?
        const deviceCol = await db.findOne(query);

        if (!deviceCol) {
            log.debug('Update: crudCharacter.createSheet : Sheet not found in DB.   Adding Sheet');
            // Insert Sheet into DB
            await db.insertOne(sheet);
            validationResponse.message = 'Character sheet entered.';
            validationResponse.responseCode = 200;
        } else {
            log.debug('Ending: crudCharacter.createSheet : duplicate sheet, throwing error ');
            validationResponse.message = 'Duplicate character sheet entry.';
        }
    } catch (err) {
        log.error(`Ending: crudCharacter.createSheet : Sheet insert failed : ${err}`);
        validationResponse.message = 'Sheet insert failed.';
    }

    // Return Results
    return validationResponse;
}

