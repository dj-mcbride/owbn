/* eslint-disable quote-props */
/* eslint-disable no-sync */
/* eslint-disable no-undef */
/* eslint-disable global-require no-unused-vars */

const { expect } = require('chai');
const td = require('testdouble');
const {
    initLogs,
    anyMatcher,
    intercept
} = require('../testingUtils');
const { resolve } = require('path');

let havePermissions;
const charCollectionArgs = {};

describe('Character Utility Tests', () => {

    before(() => {
        // Import the libraries
        adapters = td.object();
        auditTrail = td.object();
        auditTrail.getUser = td.func();
        td.when(auditTrail.getUser()).thenReturn('FAKE-USER');

        // Define our collections
        collection = td.object();
        collection.find = td.func('collection.find');
        collection.findOne = td.func('collection.findOne');
        collection.update = td.func('collection.updateOne');
        collection.update = td.func('collection.bulkWrite');
        collection.insertOne = td.func();

        // Set general DB connections
        database = td.object();
        database.collection = td.func();
        td.when(database.collection('owbnPlayerList')).thenReturn(collection);

        brokers = td.object();
        brokers.device = td.object();
        brokers.device.query = td.func();

        // Set up our interceptors
        intercept(collection)
            .methods('insertOne', 'updateOne', 'findOne', 'bulkWrite')
            .into(charCollectionArgs);

        // Set our requirements
        havePermissions = require('../../lib/rpc/player/charUtils').havePermissions;
        addCharacterToPlayer = require('../../lib/rpc/player/charUtils').addCharacterToPlayer;
        initLogs('createSheet.test.txt');
    });

    beforeEach(() => {
        testSheet = {
            name: 'DeeJay',
            characters: [
                'Vincent Ivey'
            ]
        };
    });

    afterEach(() => {
        // This runs after each test.
        // td.reset();
    });


    describe('Function: havePermissions', () => {
        const requestObject = {
            name: 'Vincent Ivey',
            player: 'DeeJay McBride'
        };

        // Each of these tests is calling an async function not in a class. 
        // This means we don't need to create an instance of characterSheet before calling them.
        it('should return a true if the character was found in the player list', async () => {
            // Set up our test double
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testSheet);
            
            // This is the expected responce
            // {"step":"View Sheet","responseCode":200,"results":"viewSheet","userMessage":"","user":
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = havePermissions(requestObject);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.be.true;
                expect(response.user).to.include('FAKE-USER');
                expect(response.message).to.include('Character found in player repository');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should return a false if the character was not found in the player list', async () => {
            // Set up our returned value
            testSheet = {
                name: 'DeeJay',
                characters: [
                    'Taco Man'
                ]
            };

            // Set up our test double
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testSheet);
            
            // This is the expected responce
            // {"step":"View Sheet","responseCode":200,"results":"viewSheet","userMessage":"","user":
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = havePermissions(requestObject);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.be.false;
                expect(response.user).to.include('FAKE-USER');
                expect(response.message).to.include('Character NOT found in player repository');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if read fails to run through a mongo failure', async () => {
            // First we need to alter our db.findOne to return a value.
            const errorMessage = { message: 'unable to read' };
            td.when(collection.findOne(td.matchers.anything())).thenThrow(errorMessage);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = havePermissions(requestObject);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.message).to.include('Player request failed.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if player does not exist in our playerDB', async () => {
            td.reset();
            // First we need to alter our db.findOne to return an empty value
            td.when(collection.findOne(td.matchers.anything())).thenReturn();

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = havePermissions(requestObject);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.message).to.include('Player not found in database');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if user name was not passed', async () => {
            td.reset();
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                name: 'Vincent Ivey'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = havePermissions(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('havePermissions');
                expect(response.message).to.include('Value of player name not found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if character name was not passed', async () => {
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                player: 'DeeJay McBride'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = havePermissions(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('havePermissions');
                expect(response.message).to.include('Value of character name not found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });
    });

    describe('Function: addCharacterToPlayer', () => {
        const requestObject = {
            name: 'Vincent Ivey',
            player: 'DeeJay McBride'
        };

        const returnGoodValue = { 'ok': 1, 'writeErrors': [] };

        const playerInfo = {
            name : 'DeeJay',
            characters : [ 
                'Taco Person'
            ]
        };

        // Each of these tests is calling an async function not in a class. 
        // This means we don't need to create an instance of characterSheet before calling them.
        it('should return a success if the character was added to the player list', async () => {
            td.reset();
            // Set up our test double
            td.when(collection.findOne(td.matchers.anything())).thenReturn(playerInfo);
            td.when(collection.updateOne(td.matchers.anything())).thenReturn(returnGoodValue);
            td.when(collection.bulkWrite(td.matchers.anything())).thenReturn(returnGoodValue);
            
            // This is the expected responce
            // {"step":"View Sheet","responseCode":200,"results":"viewSheet","userMessage":"","user":
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = addCharacterToPlayer(requestObject);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.include('addCharacterToPlayer');
                expect(response.message).to.include('Character Vincent Ivey has been added to DeeJay McBride');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should return a false if the character was already in the character list', async () => {
            td.reset();
            // Set up our returned value
            const playerInfoWithVincent = {
                name : 'DeeJay',
                characters : [ 
                    'Vincent Ivey'
                ]
            };

            // Set up our test double
            td.when(collection.findOne(td.matchers.anything())).thenReturn(playerInfoWithVincent);
            td.when(collection.updateOne(td.matchers.anything())).thenReturn(returnGoodValue);
            td.when(collection.bulkWrite(td.matchers.anything())).thenReturn(returnGoodValue);
            
            // This is the expected responce
            // {"step":"View Sheet","responseCode":200,"results":"viewSheet","userMessage":"","user":
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = addCharacterToPlayer(requestObject);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                // expect(response.results).to.be.true;
                expect(response.step).to.include('Add Character to Player');
                expect(response.message).to.include('Character already registered to player');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if read fails to run through a mongo failure during the read', async () => {
            // First we need to alter our db.findOne to return a value.
            const errorMessage = { message: 'unable to read' };
            td.when(collection.findOne(td.matchers.anything())).thenThrow(errorMessage);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = addCharacterToPlayer(requestObject);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.message).to.include('Player request failed.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if read fails to run through a mongo failure during the write', async () => {
            td.reset();
            // First we need to alter our db.findOne to return a value.
            const errorMessage = { message: 'unable to read' };
            td.when(collection.findOne(td.matchers.anything())).thenThrow(errorMessage);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = addCharacterToPlayer(requestObject);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.message).to.include('Player request failed.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if player does not exist in our playerDB', async () => {
            td.reset();
            // First we need to alter our db.findOne to return an empty value
            td.when(collection.findOne(td.matchers.anything())).thenReturn();

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = addCharacterToPlayer(requestObject);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.message).to.include('Player not found in database');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if user name was not passed', async () => {
            td.reset();
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                name: 'Vincent Ivey'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = addCharacterToPlayer(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.message).to.include('Value of player name not found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if character name was not passed', async () => {
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                player: 'DeeJay McBride'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = addCharacterToPlayer(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.message).to.include('Value of character name not found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });
    });
});