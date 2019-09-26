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

let testItem;
let createItem;
let updateItem;
let deleteItem;
const itemCollectionArgs = {};

describe('Item Tests', () => {

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
        td.when(database.collection('owbnItems')).thenReturn(collection);

        brokers = td.object();
        brokers.device = td.object();
        brokers.device.query = td.func();

        // Set up our interceptors
        intercept(collection)
            .methods('insertOne', 'updateOne', 'findOne', 'bulkWrite')
            .into(itemCollectionArgs);

        // Set our requirements
        createItem = require('../../lib/rpc/items/crudItems').createProperties;
        updateItem = require('../../lib/rpc/items/crudItems').updateProperties;
        deleteItem = require('../../lib/rpc/items/crudItems').deleteProperties;
        initLogs('createItem.test.txt');
    });

    beforeEach(() => {
        testItem = {
            "name" : "Babe Ruth's Baseball Cap",
            "effects" : "Cancel one retest per session",
            "weapon" : [ 
                {
                    "weapon" : "false",
                    "bonusTraits" : 0,
                    "negTraits" : [],
                    "damage" : 0,
                    "damageType" : ""
                }
            ],
            "approvedBy" : [ 
                "Boston", 
                "Bridgeport", 
                "Bridgewater", 
                "New Haven", 
                "New York", 
                "Fredrick", 
                "Gangrel Event"
            ],
            "oneUse" : "false"
        };
    });

    afterEach(() => {
        // This runs after each test.
        // td.reset();
    });


    describe('Function: createItem', () => {

        // Each of these tests is calling an async function not in a class. 
        // This means we don't need to create an instance of itemProperties before calling them.
        it('should succeed if no error found', async () => {
            // This is the expected responce
            // {"step":"Create Properties","responseCode":200,"results":"createItem","userMessage":"","user":"FAKE-USER","message":"Item properties entered."}
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = createItem(testItem);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('createProperties');
                expect(response.user).to.include('FAKE-USER');
                expect(response.message).to.include('Item created!');
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
                    const responceObject = createItem(testItem);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('createProperties');
                expect(response.user).to.include('FAKE-USER');
                expect(response.message).to.include('Item insert failed.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if item already exists', async () => {
            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testItem);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = createItem(testItem);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('createProperties');
                expect(response.user).to.include('FAKE-USER');
                expect(response.message).to.include('Duplicate item found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if user name was not passed', async () => {
            td.reset();
            // In this update, we will forget what name to pass
            let updateItemFail = {
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = createItem(updateItemFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('createProperties');
                expect(response.message).to.include('Value of item name not found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });
    });

    describe('Function: updateItem', () => {
        // In this update, we will be updating the time of the item.
        const updateItemObject = {
            "name" : "Babe Ruth's Baseball Cap",
            "effects" : "Cancel one retest per session",
            "weapon" : [ 
                {
                    "weapon" : "false",
                    "bonusTraits" : 0,
                    "negTraits" : [],
                    "damage" : 0,
                    "damageType" : ""
                }
            ],
            "approvedBy" : [ 
                "Boston", 
                "Bridgeport", 
                "Bridgewater", 
                "New Haven", 
                "New York", 
                "Fredrick", 
                "Gangrel Event"
            ],
            "oneUse" : "false"
        };
        td.reset();

        // For this we want to do a simple update of our item
        it('should succeed if no error found', async () => {
            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testItem);

            // Set our updates to return valid data 
            let returnGoodValue = { 'ok': 1, 'writeErrors': [] };
            td.when(collection.updateOne(td.matchers.anything())).thenReturn(returnGoodValue);
            td.when(collection.bulkWrite(td.matchers.anything())).thenReturn(returnGoodValue);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = updateItem(updateItemObject);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('updateProperties');
                expect(response.message).to.include('Item Properties updated!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if item was not found', async () => {
            td.reset();
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                name: 'Vincent Ivey',
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = updateItem(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('updateProperties');
                expect(response.message).to.include('Item properties not found!  Unable to update.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if item name was not passed', async () => {
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                player: 'DeeJay McBride',
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = updateItem(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('updateProperties');
                expect(response.message).to.include('Value of item name not found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if item was unable to be updated', async () => {
            // First we need to alter our db.findOne to return a value.
            const errorMessage = { message: 'unable to update' };
            td.when(collection.updateOne(td.matchers.anything())).thenThrow(errorMessage);
            td.when(collection.bulkWrite(td.matchers.anything())).thenThrow(errorMessage);

            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testItem);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = updateItem(updateItemObject);
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

    describe('Function: deleteItem', () => {
        // This is the object we will use to delete items
        const deleteItemObject = {
            "name" : "Babe Ruth's Baseball Cap",
            "effects" : "Cancel one retest per session",
            "weapon" : [ 
                {
                    "weapon" : "false",
                    "bonusTraits" : 0,
                    "negTraits" : [],
                    "damage" : 0,
                    "damageType" : ""
                }
            ],
            "approvedBy" : [ 
                "Boston", 
                "Bridgeport", 
                "Bridgewater", 
                "New Haven", 
                "New York", 
                "Fredrick", 
                "Gangrel Event"
            ],
            "oneUse" : "false"
        };
        td.reset();

        // For this we want to do a simple update of our item
        it('should succeed if no error found', async () => {
            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testItem);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = deleteItem(deleteItemObject);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('deleteProperties');
                expect(response.message).to.include('Item properties deleted.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if item does not exist', async () => {
            td.reset();
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                name: 'Vincent Ivey',
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = deleteItem(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('deleteProperties');
                expect(response.message).to.include('Item properties not found!  Unable to delete.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if item name was not passed', async () => {
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                player: 'DeeJay McBride',
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = deleteItem(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('deleteProperties');
                expect(response.message).to.include('Value of item name not found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if item was unable to be updated', async () => {
            // First we need to alter our db.findOne to return a value.
            const errorMessage = { message: 'unable to update' };
            td.when(collection.deleteOne(td.matchers.anything())).thenThrow(errorMessage);

            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testItem);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = deleteItem(deleteItemObject);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.message).to.include('Properties delete failed.');
                expect(response.results).to.exist;
                expect(response.results).to.include('deleteProperties');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });
    });
});