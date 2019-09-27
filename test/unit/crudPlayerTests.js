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

let testPlayer;
let createPlayer;
let updatePlayer;
let deletePlayer;
const playerCollectionArgs = {};

describe('Player Tests', () => {

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
            .into(playerCollectionArgs);

        // Set our requirements
        createPlayer = require('../../lib/rpc/player/crudPlayers').createPlayer;
        updatePlayer = require('../../lib/rpc/player/crudPlayers').updatePlayer;
        deletePlayer = require('../../lib/rpc/player/crudPlayers').deletePlayer;
        initLogs('createPlayer.test.txt');
    });

    beforeEach(() => {
        testPlayer = {
            "name" : "James",
            "firstname" : "James",
            "lastname" : "Monty-Carbonari",
            "street" : "39 Hampshire Drive",
            "address2" : "",
            "city" : "Glastonbury",
            "state" : "CT",
            "zip" : "06033",
            "timezone" : "eastern",
            "language" : "english",
            "characters" : [ 
                "Brian Buckley", 
                "James 'Croc' Blackwater"
            ],
            "position" : "player",
            "email" : "ryjak8@gmail.com",
            "phone" : "8609776869",
            "discord" : "ryjak8",
            "playerpoints" : "1",
            "status" : "active",
            "birthdate" : "1981/06/08",
            "secretquestion" : "kumquat",
            "membership" : "admin",
            "notifications" : [ 
                true, 
                true, 
                true, 
                true
            ]
        };
    });

    afterEach(() => {
        // This runs after each test.
        // td.reset();
    });


    describe('Function: createPlayer', () => {

        // Each of these tests is calling an async function not in a class. 
        // This means we don't need to create an instance of characterSheet before calling them.
        it('should succeed if no error found', async () => {
            // This is the expected responce
            // {"step":"Create Sheet","responseCode":200,"results":"createPlayer","userMessage":"","user":"FAKE-USER","message":"Character sheet entered."}
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = createPlayer(testPlayer);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('createPlayer');
                expect(response.user).to.include('FAKE-USER');
                expect(response.message).to.include('Player created!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if insert fails to run', async () => {
            // First we need to alter our db.findOne to return a value.
            const errorMessage = { message: 'unable to insert' };
            td.when(collection.insertOne(td.matchers.anything())).thenThrow(errorMessage);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = createPlayer(testPlayer);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('createPlayer');
                expect(response.user).to.include('FAKE-USER');
                expect(response.message).to.include('Player insert failed.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if player already exists', async () => {
            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testPlayer);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = createPlayer(testPlayer);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('createPlayer');
                expect(response.user).to.include('FAKE-USER');
                expect(response.message).to.include('Duplicate player found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if user name was not passed', async () => {
            td.reset();
            // In this update, we will forget what name to pass
            let updatePlayerFail = {
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = createPlayer(updatePlayerFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('createPlayer');
                expect(response.message).to.include('Value of player name not found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });
    });

    describe('Function: updatePlayer', () => {
        // In this update, we will be updating the time of the player.
        const updatePlayerObject = {
            "name" : "James",
            "firstname" : "James",
            "lastname" : "Monty-Carbonari",
            "street" : "39 Hampshire Drive",
            "address2" : "",
            "city" : "Glastonbury",
            "state" : "CT",
            "zip" : "06033",
            "timezone" : "eastern",
            "language" : "english",
            "characters" : [ 
                "Brian Buckley", 
                "James 'Croc' Blackwater"
            ],
            "position" : "player",
            "email" : "ryjak8@gmail.com",
            "phone" : "8609776869",
            "discord" : "ryjak8",
            "playerpoints" : "1",
            "status" : "active",
            "birthdate" : "1981/06/08",
            "secretquestion" : "kumquat",
            "membership" : "admin",
            "notifications" : [ 
                true, 
                true, 
                true, 
                true
            ]
        };
        td.reset();

        // For this we want to do a simple update of our character
        it('should succeed if no error found', async () => {
            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testPlayer);

            // Set our updates to return valid data 
            let returnGoodValue = { 'ok': 1, 'writeErrors': [] };
            td.when(collection.updateOne(td.matchers.anything())).thenReturn(returnGoodValue);
            td.when(collection.bulkWrite(td.matchers.anything())).thenReturn(returnGoodValue);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = updatePlayer(updatePlayerObject);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('updatePlayer');
                expect(response.message).to.include('Player updated!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if player was not found', async () => {
            td.reset();
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                name: 'Vincent Ivey',
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = updatePlayer(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('updatePlayer');
                expect(response.message).to.include('Player info not found!  Unable to update.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if player name was not passed', async () => {
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                player: 'DeeJay McBride',
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = updatePlayer(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('updatePlayer');
                expect(response.message).to.include('Value of player name not found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if player was unable to be updated', async () => {
            // First we need to alter our db.findOne to return a value.
            const errorMessage = { message: 'unable to update' };
            td.when(collection.updateOne(td.matchers.anything())).thenThrow(errorMessage);
            td.when(collection.bulkWrite(td.matchers.anything())).thenThrow(errorMessage);

            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testPlayer);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = updatePlayer(updatePlayerObject);
                    return resolve(responceObject);
                });

                console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.not.exist;
            } catch (error) {
                // Sinced we are throwing an error here, we want to see this throw an entire error
                // console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.exist;
                expect(error.message).to.include('unable to update');
            }
        });
    });

    describe('Function: deletePlayer', () => {
        // This is the object we will use to delete players
        const deletePlayerObject = {
            "name" : "James",
            "firstname" : "James",
            "lastname" : "Monty-Carbonari",
            "street" : "39 Hampshire Drive",
            "address2" : "",
            "city" : "Glastonbury",
            "state" : "CT",
            "zip" : "06033",
            "timezone" : "eastern",
            "language" : "english",
            "characters" : [ 
                "Brian Buckley", 
                "James 'Croc' Blackwater"
            ],
            "position" : "player",
            "email" : "ryjak8@gmail.com",
            "phone" : "8609776869",
            "discord" : "ryjak8",
            "playerpoints" : "1",
            "status" : "active",
            "birthdate" : "1981/06/08",
            "secretquestion" : "kumquat",
            "membership" : "admin",
            "notifications" : [ 
                true, 
                true, 
                true, 
                true
            ]
        };
        td.reset();

        // For this we want to do a simple update of our character
        it('should succeed if no error found', async () => {
            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testPlayer);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = deletePlayer(deletePlayerObject);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('deletePlayer');
                expect(response.message).to.include('Player deleted.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if player does not exist', async () => {
            td.reset();
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                name: 'Vincent Ivey',
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = deletePlayer(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('deletePlayer');
                expect(response.message).to.include('Player info not found!  Unable to delete.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if player name was not passed', async () => {
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                player: 'DeeJay McBride',
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = deletePlayer(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('deletePlayer');
                expect(response.message).to.include('Value of player name not found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if player was unable to be updated', async () => {
            // First we need to alter our db.findOne to return a value.
            const errorMessage = { message: 'unable to update' };
            td.when(collection.deleteOne(td.matchers.anything())).thenThrow(errorMessage);

            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testPlayer);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = deletePlayer(deletePlayerObject);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.message).to.include('Player delete failed.');
                expect(response.results).to.exist;
                expect(response.results).to.include('deletePlayer');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });
    });
});