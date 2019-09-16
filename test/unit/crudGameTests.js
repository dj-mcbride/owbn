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

let testGame;
let createGame;
let updateGame;
let deleteGame;
const gameCollectionArgs = {};

describe('Game Tests', () => {

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
        td.when(database.collection('owbnGames')).thenReturn(collection);

        brokers = td.object();
        brokers.device = td.object();
        brokers.device.query = td.func();

        // Set up our interceptors
        intercept(collection)
            .methods('insertOne', 'updateOne', 'findOne', 'bulkWrite')
            .into(gameCollectionArgs);

        // Set our requirements
        createGame = require('../../lib/rpc/games/crudGames').createInfo;
        updateGame = require('../../lib/rpc/games/crudGames').updateInfo;
        deleteGame = require('../../lib/rpc/games/crudGames').deleteInfo;
        initLogs('createGame.test.txt');
    });

    beforeEach(() => {
        testGame = {
            "name" : "Dark Colony: New Haven - Bad Moon Rising",
            "activeCharacters" : [ 
                "James 'Croc' Blackwater"
            ],
            "locationRegular" : "",
            "timeRegular" : "Second Saturday of the Month, 7:30pm",
            "genrePrimary" : "Vampire",
            "genreSecondary" : "Sabbat"
        };
    });

    afterEach(() => {
        // This runs after each test.
        // td.reset();
    });


    describe('Function: createGame', () => {

        // Each of these tests is calling an async function not in a class. 
        // This means we don't need to create an instance of characterSheet before calling them.
        it('should succeed if no error found', async () => {
            // This is the expected responce
            // {"step":"Create Sheet","responseCode":200,"results":"createGame","userMessage":"","user":"FAKE-USER","message":"Character sheet entered."}
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = createGame(testGame);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('createInfo');
                expect(response.user).to.include('FAKE-USER');
                expect(response.message).to.include('Game created!');
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
                    const responceObject = createGame(testGame);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('createInfo');
                expect(response.user).to.include('FAKE-USER');
                expect(response.message).to.include('Game insert failed.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if game already exists', async () => {
            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testGame);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = createGame(testGame);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('createInfo');
                expect(response.user).to.include('FAKE-USER');
                expect(response.message).to.include('Duplicate game found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if user name was not passed', async () => {
            td.reset();
            // In this update, we will forget what name to pass
            let updateGameFail = {
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = createGame(updateGameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('createInfo');
                expect(response.message).to.include('Value of game name not found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });
    });

    describe('Function: updateGame', () => {
        // In this update, we will be updating the time of the game.
        const updateGameObject = {
            "name" : "Dark Colony: New Haven - Bad Moon Rising",
            "activeCharacters" : [ 
                "James 'Croc' Blackwater",
                "DeeJays Character"
            ],
            "locationRegular" : "",
            "timeRegular" : "Second Saturday of the Month, 7:30pm",
            "genrePrimary" : "Vampire",
            "genreSecondary" : "Sabbat"
        };
        td.reset();

        // For this we want to do a simple update of our character
        it('should succeed if no error found', async () => {
            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testGame);

            // Set our updates to return valid data 
            let returnGoodValue = { 'ok': 1, 'writeErrors': [] };
            td.when(collection.updateOne(td.matchers.anything())).thenReturn(returnGoodValue);
            td.when(collection.bulkWrite(td.matchers.anything())).thenReturn(returnGoodValue);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = updateGame(updateGameObject);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('updateInfo');
                expect(response.message).to.include('Game Info updated!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if game was not found', async () => {
            td.reset();
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                name: 'Vincent Ivey',
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = updateGame(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('updateInfo');
                expect(response.message).to.include('Game info not found!  Unable to update.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if game name was not passed', async () => {
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                player: 'DeeJay McBride',
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = updateGame(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('updateInfo');
                expect(response.message).to.include('Value of game name not found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if game was unable to be updated', async () => {
            // First we need to alter our db.findOne to return a value.
            const errorMessage = { message: 'unable to update' };
            td.when(collection.updateOne(td.matchers.anything())).thenThrow(errorMessage);
            td.when(collection.bulkWrite(td.matchers.anything())).thenThrow(errorMessage);

            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testGame);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = updateGame(updateGameObject);
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

    describe('Function: deleteGame', () => {
        // This is the object we will use to delete games
        const deleteGameObject = {
            "name" : "Dark Colony: New Haven - Bad Moon Rising",
            "activeCharacters" : [ 
                "James 'Croc' Blackwater",
                "DeeJays Character"
            ],
            "locationRegular" : "",
            "timeRegular" : "Second Saturday of the Month, 7:30pm",
            "genrePrimary" : "Vampire",
            "genreSecondary" : "Sabbat"
        };
        td.reset();

        // For this we want to do a simple update of our character
        it('should succeed if no error found', async () => {
            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testGame);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = deleteGame(deleteGameObject);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('deleteInfo');
                expect(response.message).to.include('Game info deleted.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if game does not exist', async () => {
            td.reset();
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                name: 'Vincent Ivey',
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = deleteGame(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('deleteInfo');
                expect(response.message).to.include('Game info not found!  Unable to delete.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if game name was not passed', async () => {
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                player: 'DeeJay McBride',
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = deleteGame(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('deleteInfo');
                expect(response.message).to.include('Value of game name not found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if game was unable to be updated', async () => {
            // First we need to alter our db.findOne to return a value.
            const errorMessage = { message: 'unable to update' };
            td.when(collection.deleteOne(td.matchers.anything())).thenThrow(errorMessage);

            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testGame);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = deleteGame(deleteGameObject);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.message).to.include('Info delete failed.');
                expect(response.results).to.exist;
                expect(response.results).to.include('deleteInfo');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });
    });
});