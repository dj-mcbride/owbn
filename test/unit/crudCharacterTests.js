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

let testSheet;
let createSheet;
let updateSheet;
let deleteSheet;
const charCollectionArgs = {};

describe('Character Sheet Tests', () => {

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
        td.when(database.collection('owbnVampireSheets')).thenReturn(collection);

        brokers = td.object();
        brokers.device = td.object();
        brokers.device.query = td.func();

        // Set up our interceptors
        intercept(collection)
            .methods('insertOne', 'updateOne', 'findOne', 'bulkWrite')
            .into(charCollectionArgs);

        // Set our requirements
        createSheet = require('../../lib/rpc/character/crudCharacter').createSheet;
        updateSheet = require('../../lib/rpc/character/crudCharacter').updateSheet;
        deleteSheet = require('../../lib/rpc/character/crudCharacter').deleteSheet;
        addAttribute = require('../../lib/rpc/character/crudCharacter').addAttribute;
        initLogs('createSheet.test.txt');
    });

    beforeEach(() => {
        testSheet = {
            name: 'Vincent Ivey',
            player: 'DeeJay McBride',
            homeGame: 'Dark Colony: Hartford',
            clan: 'Malkavian',
            generation: 8,
            bloodline: 'Main',
            sect: 'Camarilla',
            sire: 'Unknown',
            age: '78',
            position: 'None',
            nature: 'Architect',
            demeanor: 'Confidant',      
            traits: {
                physicalTraits: [
                    'Graceful',
                    'Nimble',
                    'Athletic',
                    'Tough',
                    'Tough',
                    'Tough',
                    'Tough'
                ],
                socialTraits: [
                    'Empathetic',
                    'Empathetic',
                    'Persuasive', 
                    'Persuasive',
                    'Persuasive',
                    'Persuasive',
                    'Commanding',
                    'Commanding',
                    'Charming',
                    'Charming',
                    'Charming',
                    'Friendly', 
                    'Friendly',
                    'Friendly'
                ],
                mentalTraits: [
                    'Clever',
                    'Clever',
                    'Cunning',
                    'Cunning',
                    'Cunning',
                    'Cunning',
                    'Insightful',
                    'Insightful',
                    'Attentive',
                    'Attentive',
                    'Observant',
                    'Observant',
                    'Observant',
                    'Observant'
                ]
            },
        
            negTraits : {
                negPhysicalTraits: [
                    'Cowardly',
                    'Docile'
                ],
                negSocialTraits: [
                    'Callous',
                    'Tactless'
                ],
                negMentalTraits: [
                    'Shortsighted'
                ]
            },
            abilities : {
                Stealth: { name: "Stealth", rank: 5 },
                Area_Knowedge: {
                    Cape_Cod:  { name: "Cape Cod", rank: 5, focus: "Cape Cod" },
                    Boston: { name: "Boston", rank: 5, focus: "Boston", }
                },
                Awareness: { rank: 1 },
                MalkTime: { rank: 5  },
                Investigation: { rank: 5, specalization: 'auspex', extraXp : 1 },
                Empathy: { rank: 5, specalization: 'dementation' , extraXp : 1 },
                Intimidation: { rank: 5, specalization: 'dominate' , extraXp : 1 },
                Academics: { rank: 1 },
                Psychology: { rank: 3 },
                Asura_Lore: { rank: 2 },
                Hunting: { rank: 2 },
                Leadership: { rank: 4 }
            },
            disciplines: {
                Auspex: { rank: 5, inClan: true },
                Dementation: { rank: 5, inClan: true },
                Obfuscate: { rank: 5, inClan: true },
                Dominate: { rank: 5, inClan: true },
                Presence: { rank: 2,  inClan: false },
                Fortitude: { rank: 4,  inClan: false }
            },
            combodisciplines: [
                'Psychic Double'
            ],
            customdisciplines: {
                Song_Of_Mehket: { rank: 5, inClan: false }
            },
            backgrounds: {
                Generation: { rank: 5 },
                Resources: { rank: 4 },
                Herd: { rank: 5 },
                Retainers: { rank: 3 },
                Mentor: { rank: 5, specalization: 'Mehket' }
            },
            influences: {
                Media: { rank: 5 },
                Finance: { rank: 5 },
                Health: { rank: 4 },
                Occult: { rank: 5 },
                Police: { rank: 2 }
            },
            merits: [
            ],
            customMerits: [
                'Coldly Logical',
                'Subtle Whispers',
                'Immaculate Aura',
                'Sympathetic Bond',
                'Sanguine Lucidity',
                'Malleable Blood : Dominate',
                'Aptitude : Intimidation',
                'Aptitude : Empathy',
                'Aptitude : Investigation',
                'Aptitude : Stealth'
            ],
            flaws: [
                'Grip of the Damned',
                'Eerie Presence',
                'Touch of Frost',
                'Extra Derrangement'
            ],
            status: [
                'Clever',
                'Chivalrous',
                'Acknowledged',
                'Brave'
            ],

            moralityPath: 'humanity',

            virtues: {
                conscienceConviction: 3,
                selfControlInstinct: 4,
                courage: 3,
                morality: 3
            }
        };
    });

    afterEach(() => {
        // This runs after each test.
        // td.reset();
    });


    describe('Function: createSheet', () => {

        // Each of these tests is calling an async function not in a class. 
        // This means we don't need to create an instance of characterSheet before calling them.
        it('should succeed if no error found', async () => {
            // This is the expected responce
            // {"step":"Create Sheet","responseCode":200,"results":"createSheet","userMessage":"","user":"FAKE-USER","message":"Character sheet entered."}
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = createSheet(testSheet);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('createSheet');
                expect(response.user).to.include('FAKE-USER');
                expect(response.message).to.include('Character sheet entered.');
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
                    const responceObject = createSheet(testSheet);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('createSheet');
                expect(response.user).to.include('FAKE-USER');
                expect(response.message).to.include('Sheet insert failed.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if character sheet already exists', async () => {
            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testSheet);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = createSheet(testSheet);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('createSheet');
                expect(response.user).to.include('FAKE-USER');
                expect(response.message).to.include('Duplicate character sheet entry.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if user name was not passed', async () => {
            td.reset();
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                name: 'Vincent Ivey',
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = createSheet(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('createSheet');
                expect(response.message).to.include("Unable to process missing value : should have required property 'player'");
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if character name was not passed', async () => {
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                player: 'DeeJay McBride',
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = createSheet(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('createSheet');
                expect(response.message).to.include("Unable to process missing value : should have required property 'name'");
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });
    });

    describe('Function: updateSheet', () => {
        // In this update, Vincent will have become keeper
        let updateVincent = {
            name: 'Vincent Ivey',
            player: 'DeeJay McBride',
            updates: {
                position: 'Keeper'
            }
        };
        td.reset();

        // For this we want to do a simple update of our character
        it('should succeed if no error found', async () => {
            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testSheet);

            // Set our updates to return valid data 
            let returnGoodValue = { 'ok': 1, 'writeErrors': [] };
            td.when(collection.updateOne(td.matchers.anything())).thenReturn(returnGoodValue);
            td.when(collection.bulkWrite(td.matchers.anything())).thenReturn(returnGoodValue);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = updateSheet(updateVincent);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.message).to.include('Character Sheet updated!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if user name was not passed', async () => {
            td.reset();
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                name: 'Vincent Ivey',
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = updateSheet(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('updateSheet');
                expect(response.message).to.include('Value of player name not found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if character name was not passed', async () => {
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                player: 'DeeJay McBride',
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = updateSheet(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('updateSheet');
                expect(response.message).to.include('Value of character name not found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if character sheet was not found', async () => {
            // Since we are not mocking findOne, we should not find the sheet 
            // in our DB
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = updateSheet(updateVincent);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('updateSheet');
                expect(response.message).to.include('Character sheet not found!  Unable to update.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if character sheet was unable to be updated', async () => {
            // First we need to alter our db.findOne to return a value.
            const errorMessage = { message: 'unable to update' };
            td.when(collection.updateOne(td.matchers.anything())).thenThrow(errorMessage);
            td.when(collection.bulkWrite(td.matchers.anything())).thenThrow(errorMessage);

            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testSheet);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = updateSheet(updateVincent);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.not.exist;
            } catch (error) {
                // Sinced we are throwing an error here, we want to see this throw an 
                // entire error
                // console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.exist;
                expect(error.message).to.include('unable to update');
            }
        });
    });

    describe('Function: deleteSheet', () => {
        // In this update, Vincent will have become keeper
        let updateVincent = {
            name: 'Vincent Ivey',
            player: 'DeeJay McBride',
            position: 'Keeper'
        };

        // For this we want to do a simple update of our character
        it('should succeed if no error found', async () => {
            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testSheet);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = deleteSheet(updateVincent);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('deleteSheet');
                expect(response.message).to.include('Character sheet deleted.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if user name was not passed', async () => {
            td.reset();
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                name: 'Vincent Ivey',
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = deleteSheet(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('deleteSheet');
                expect(response.message).to.include('Value of player name not found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if character name was not passed', async () => {
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                player: 'DeeJay McBride',
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = deleteSheet(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('deleteSheet');
                expect(response.message).to.include('Value of character name not found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if character sheet was not found', async () => {
            // Since we are not mocking findOne, we should not find the sheet 
            // in our DB
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = deleteSheet(updateVincent);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('deleteSheet');
                expect(response.message).to.include('Character sheet not found!  Unable to delete.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if character sheet was unable to be updated', async () => {
            // First we need to alter our db.findOne to return a value.
            const errorMessage = { message: 'unable to update' };
            td.when(collection.deleteOne(td.matchers.anything())).thenThrow(errorMessage);

            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testSheet);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = deleteSheet(updateVincent);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.message).to.include('Sheet delete failed.');
                expect(response.results).to.exist;
                expect(response.results).to.include('deleteSheet');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });
    });

    describe('Function: addAttribute', () => {
        // In this update, Vincent will have become keeper
        let updateVincent = {
            'name': 'Vincent Ivey',
            'player': 'DeeJay McBride',
            updateValues: {
                    'physicalTraits': [
                        'Tacos'
                    ],
                    'socialTraits': [
                        'Rule'
                    ],
                    'mentalTraits': [
                        'onTuesday'
                    ]
            }
        };
        td.reset();

        // For this we want to do a simple update of our character
        it('should succeed if no error found', async () => {
            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testSheet);

            // Set our updates to return valid data 
            const returnGoodValue = { 'ok': 1, 'writeErrors': [] };
            td.when(collection.updateOne(td.matchers.anything())).thenReturn(returnGoodValue);
            td.when(collection.bulkWrite(td.matchers.anything())).thenReturn(returnGoodValue);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = addAttribute(updateVincent);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.message).to.include('Character Sheet updated!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        xit('should fail if user name was not passed', async () => {
            td.reset();
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                name: 'Vincent Ivey',
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = addAttribute(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('updateSheet');
                expect(response.message).to.include('Value of player name not found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        xit('should fail if character name was not passed', async () => {
            // In this update, we will forget what name to pass
            let updateVincentNameFail = {
                player: 'DeeJay McBride',
                position: 'Keeper'
            };

            // Run our promise
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = addAttribute(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('updateSheet');
                expect(response.message).to.include('Value of character name not found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        xit('should fail if character sheet was not found', async () => {
            // Since we are not mocking findOne, we should not find the sheet 
            // in our DB
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = addAttribute(updateVincent);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('updateSheet');
                expect(response.message).to.include('Character sheet not found!  Unable to update.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        xit('should fail if character sheet was unable to be updated', async () => {
            // First we need to alter our db.findOne to return a value.
            const errorMessage = { message: 'unable to update' };
            td.when(collection.updateOne(td.matchers.anything())).thenThrow(errorMessage);
            td.when(collection.bulkWrite(td.matchers.anything())).thenThrow(errorMessage);

            // First we need to alter our db.findOne to return a value.
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testSheet);

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = addAttribute(updateVincent);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.not.exist;
            } catch (error) {
                // Sinced we are throwing an error here, we want to see this throw an 
                // entire error
                // console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.exist;
                expect(error.message).to.include('unable to update');
            }
        });
    });
});