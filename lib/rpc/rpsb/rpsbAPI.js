/* globals log */
const { Response } = require('../../Response');
const Ajv = require('ajv');
const ajv = new Ajv();
const shemaSheetTemplate = require('../../schemas/rpsb/rpsbSchema.json');

/**
 * Tests a Rock-Paper-Sissors-Bomb result
 * @param {object} rpsbObject Item Properties
 * @returns {Object} Returned object showing success or failure of action
 */

function staticRPSB(rpsbObject) {
    log.debug('Starting: rpsb.staticRPSB.');
    log.trace(`Starting: rpsb.staticRPSB. rpsbObject object : ${JSON.stringify(rpsbObject)} `);

    // Build our proper validation value
    const validationResponse = new Response({
        from: 'staticRPSB',
        responseCode: 400,
        message: '',
        step: 'Call for Static RPSB Chop'
    });
    // Validate our incoming object rpsbObject
    // The object should look like this
    // {
    //    userChoice : "rock",
    //    cpuBomb : true,
    //    pcTraits : 11
    //    cpuTraits : 10
    //    pcWinsTies : true,
    //    cpuWinsTies : false
    // }

    // A schema was passed.   We want to validate it
    const validate = ajv.compile(shemaSheetTemplate);
    // Compare the value and see if it's valid
    const validForm = validate(rpsbObject);

    log.debug(`Update: rpsb.rpsbAPI. validSchema : ${validForm} `);
    // Was the value valid?  If the validSheet value is false, then we know that we need to throw back an error
    if (!validForm) {
        log.debug(`Update: slipedManager.buildSlipedObject : Sliped Manager Schema provided is not valid. : ${JSON.stringify(validate)}`);
        // Throw an error
        log.debug('Update: crudCharacter.createSheet : validation error ');
        // validationResponse.message = `Errors found : ${JSON.stringify(validate.errors)}`;
        validationResponse.message = `Unable to process missing value : ${validate.errors[0].message}`;
        validationResponse.responseCode = 455;
    } else {
        // This is where your RPSB logic goes
        try {
        // RPSB logic goes here
        log.debug('Update: rpsb.rpsbAPI. Calling game');
        const chopResults = game(rpsbObject);

        // When you are done, build your response object for our success
        validationResponse.message = chopResults;
        validationResponse.responseCode = 200;

        } catch (err) {
            log.error(`Update: rpsb.callForChop : RPSB Chop failed : ${err}`);
            validationResponse.message = 'RPS Chop failed. ${err}';
            validationResponse.responseCode = 457;
        }
    }

    // Return Results
    log.debug(`Ending: rpsb.rpsbAPI. validationResponse : ${JSON.stringify(validationResponse)} `);
    return validationResponse;
}

// Comp's Choice
function getCompChoice(bomb) {

    let compChoices;
    let compChoice;
    
    // (bomb) is the same as (bomb == true) I know, it's stupid. Just roll with it.
        if (bomb) {
        compChoices = ["r","b","s"];
        compChoice = Math.floor(Math.random()*3)}
        else {
        compChoices = ["r", "p", "s"];
        compChoice = Math.floor(Math.random()*3) 
        }

        //make this a log.debug
    // log.debug(compChoices[compChoice]); 
        return compChoices[compChoice];
        
};

// Game Function
function game(rpsbObject) {
    log.debug(`Entering: rpsb.game. rpsbObject : ${rpsbObject}.`);
    const compGameChoice = getCompChoice(rpsbObject.cpuBomb);
    const userChoice = rpsbObject.userChoice;
    let result;
    let userRPSB;
    let compRPSB;

    if (userChoice === 'r') {
        userRPSB = 'Rock';
    } else if (userChoice === 'p') {
        userRPSB = 'Paper';
    } else if (userChoice === "s") {
        userRPSB = "Scissors"
    } else if (userChoice === "b") {
        userRPSB = "Bomb"
    }

    if (compGameChoice === "r") {
        compRPSB = "Rock";
    } else if (compGameChoice === "p") {
        compRPSB = "Paper";
    } else if (compGameChoice === "s") {
        compRPSB = "Scissors"
    } else if (compGameChoice === "b") {
        compRPSB = "Bomb"
    }

    // give me comments or give me death
    let pcTies = rpsbObject.pcWinsTies;
    let cpuTies = rpsbObject.cpuWinsTies;
    log.debug("Virtual GM Says: The Player Chose " + userRPSB + ". The Computer Chose " + compRPSB + ".");
    // console.log ("Virtual GM Says: The Player Chose " + userRPSB + ". The Computer Chose " + compRPSB + ".");

// Game Logic - tells which instances win, lose, or tie    
    if (pcTies == false && cpuTies == false || pcTies == true && cpuTies == true) {
        switch (userChoice + compGameChoice) {
            case "rs":
            case "sp":
            case "pr":
            case "bp":
            case "br":
            case "sb":
            result = "win"
            log.debug (userChoice + " beats " + compGameChoice + ": User Wins!");
            break; 
            case "rr":
            case "pp":
            case "ss":
            case "bb":
            let userTraits = rpsbObject.pcTraits;
            let compTraits = rpsbObject.cpuTraits;
            
                if (userTraits > compTraits) {
                    result = "win";
                    log.debug("The user has more traits.");
                }
            
                else if (userTraits < compTraits) {
                    result = "loss"
                    log.debug("The computer has more traits.");
                }
            
                else if (userTraits == compTraits) {
                result = "tie";
                log.debug ("Wins: " + userScore + " Ties: " + tiesScore + " Losses: " +  compScore);
                log.debug("The player and computer have tied!")
                };
            log.debug (userChoice + " matches " + compGameChoice + ": Tie! Compare your traits.");
            break;
            case "sr":
            case "ps":
            case "rp":
            case "rb":
            case "pb":
            case "bs":
            result = "loss"
            log.debug ( compGameChoice + " beats " + userChoice + ": User Loses!");
            break; 
        } ;
    }
    else if ( pcTies == true,  cpuTies == false) {
        switch (userChoice + compGameChoice) {
            case "rs":
            case "sp":
            case "pr":
            case "bp":
            case "br":
            case "sb":
            case "rr":
            case "pp":
            case "ss":
            case "bb":
            result = "win"
            log.debug (userChoice + " beats " + compGameChoice + ": User Wins!");
            break;
            case "sr":
            case "ps":
            case "rp":
            case "rb":
            case "pb":
            case "bs":
            result = "loss"
            log.debug ( compGameChoice + " beats " + userChoice + ": User Loses!");
            break; 
        } ;
    }
    else if ( pcTies == false,  cpuTies == true) {
        switch (userChoice + compGameChoice) {
            case "rs":
            case "sp":
            case "pr":
            case "bp":
            case "br":
            case "sb":
            result = "win";
            log.debug (userChoice + " beats " + compGameChoice + ": User Wins!");
            break;
            case "rr":
            case "pp":
            case "ss":
            case "bb":
            case "sr":
            case "ps":
            case "rp":
            case "rb":
            case "pb":
            case "bs":
            result = "loss";
            log.debug ( compGameChoice + " beats " + userChoice + ": User Loses!");
            break; 
        } ;
    };

    return result;
};

module.exports = { staticRPSB };