/* globals log */
const { Response } = require('../../Response');

/**
 * Tests a Rock-Paper-Sissors-Bomb result
 * @param {object} rpsbObject Item Properties
 * @returns {Object} Returned object showing success or failure of action
 */

function callForChop(rpsbObject) {
    log.debug('Starting: rpsb.callForChop.');
    log.trace(`Starting: rpsb.callForChop. rpsbObject object : ${JSON.stringify(rpsbObject)} `);

    // Build our proper validation value
    const validationResponse = new Response({
        from: 'callForChop',
        responseCode: 400,
        message: '',
        step: 'Call for Chop'
    });

    // Validate our incoming object rpsbObject
    // The object should look like this
    // {
    //    userChoice : "rock",
    //    userBomb : false,
    //    cpuBomb : true,
    //    pcRetest : 0
    //    cpuRetest : 1
    //    pcWinsTies : true,
    //    cpuWinsTies : false
    // }
    if (!rpsbObject.userChoice) {
        log.debug('Update: rpsb.callForChop. value of userChoice not found!');
        validationResponse.message = 'Value of userChoice not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    } else if (rpsbObject.userChoice !== 'r' || Object.userChoice !== 'p' || Object.userChoice !== 's' || Object.userChoice !== 'b')  {
        log.debug('Update: rpsb.callForChop. value of userChoice not valid!');
        validationResponse.message = 'Value of userChoice not valid!';
        validationResponse.responseCode = 456;
        return validationResponse;
    } else if (!rpsbObject.userBomb) {
        log.debug('Update: rpsb.callForChop. value of userBomb name not found!');
        validationResponse.message = 'Value of userBomb not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    } else if (!rpsbObject.cpuBomb) {
        log.debug('Update: rpsb.callForChop. value of cpuBomb name not found!');
        validationResponse.message = 'Value of cpuBomb not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    } else if (!rpsbObject.pcRetest) {
        log.debug('Update: rpsb.callForChop. value of pcRetest name not found!');
        validationResponse.message = 'Value of pcRetest not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    } else if (!rpsbObject.cpuRetest) {
        log.debug('Update: rpsb.callForChop. value of cpuRetest name not found!');
        validationResponse.message = 'Value of cpuRetest not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    } else if (!rpsbObject.pcWinsTies) {
        log.debug('Update: rpsb.callForChop. value of pcWinsTies name not found!');
        validationResponse.message = 'Value of pcWinsTies not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    } else if (!rpsbObject.cpuWinsTies) {
        log.debug('Update: rpsb.callForChop. value of cpuWinsTies name not found!');
        validationResponse.message = 'Value of cpuWinsTies not found!';
        validationResponse.responseCode = 456;
        return validationResponse;
    }

    // This is where your RPS logic goes
    try {
        // RPSB logic goes here


        // When you are done, build your response object


    } catch (err) {
        log.error(`Update: rpsb.callForChop : RPS Chop failed : ${err}`);
        validationResponse.message = 'RPS Chop failed. ${err}';
        validationResponse.responseCode = 457;
    }

    // Return Results
    log.debug(`Ending: rpsb.callForChop. validationResponse : ${JSON.stringify(validationResponse)} `);
    return validationResponse;
}

module.exports = { callForChop };