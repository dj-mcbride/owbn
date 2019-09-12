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
const charCollectionArgs = {};

describe('View Character Sheet Tests', () => {

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
        viewSheet = require('../../lib/rpc/character/viewCharacter').viewSheet;
        viewSelection = require('../../lib/rpc/character/viewCharacter').viewSelection;
        initLogs('createSheet.test.txt');
    });

    beforeEach(() => {
        testSheet = {
            name: 'Vincent Ivey',
            player: 'DeeJay McBride',
            homeGame: 'Dark Colony: Hartford',
            clan: 'Malkavian',
            generation: 8,
            sect: 'camarilla',
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
                Stealth: { rank: 5 },
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
                humanity: 3
            }
        };
    });

    afterEach(() => {
        // This runs after each test.
        // td.reset();
    });


    describe('Function: viewSheet', () => {
        const requestObject = {
            name: 'Vincent Ivey',
            player: 'DeeJay McBride'
        };

        // Each of these tests is calling an async function not in a class. 
        // This means we don't need to create an instance of characterSheet before calling them.
        it('should succeed if no error found', async () => {
            // Set up our test double
            td.when(collection.findOne(td.matchers.anything())).thenReturn(testSheet);
            
            // This is the expected responce
            // {"step":"View Sheet","responseCode":200,"results":"viewSheet","userMessage":"","user":
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = viewSheet(requestObject);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('viewSheet');
                expect(response.user).to.include('FAKE-USER');
                expect(response.message.name).to.include('Vincent Ivey');
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
                    const responceObject = viewSheet(requestObject);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('viewSheet');
                expect(response.user).to.include('FAKE-USER');
                expect(response.message).to.include('Sheet request failed.');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if character sheet does not exist', async () => {
            td.reset();
            // First we need to alter our db.findOne to return an empty value
            td.when(collection.findOne(td.matchers.anything())).thenReturn();

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = viewSheet(requestObject);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('viewSheet');
                expect(response.message).to.include('Sheet not found in database');
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
                    const responceObject = viewSheet(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('viewSheet');
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
                    const responceObject = viewSheet(updateVincentNameFail);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('viewSheet');
                expect(response.message).to.include('Value of character name not found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });
    });

    describe('Function: viewSelection', () => {
        const requestObject = {
            name: 'Vincent Ivey',
            player: 'DeeJay McBride'
        };
        const project = 'traits.physicalTraits';
        const responseMessage = {
            "_id": "5d77e7d47e730a6e5880e7e1",
            "name": "Vincent Ivey",
            "player": "DeeJay McBride",
            "traits": {
                "physicalTraits": [
                    "Graceful",
                    "Nimble",
                    "Athletic",
                    "Tough",
                    "Tough",
                    "Tough",
                    "Tough",
                    "Taco"
                ]
            }
        };

        // Each of these tests is calling an async function not in a class. 
        // This means we don't need to create an instance of characterSheet before calling them.
        it('should succeed if no error found', async () => {
            // Set up our test double
            td.when(collection.findOne(td.matchers.anything(), td.matchers.anything())).thenReturn(responseMessage);
            
            // This is the expected responce
            // {"step":"View Sheet","responseCode":200,"results":"viewSheet","userMessage":"","user":
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = viewSelection(requestObject, project);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('viewSelection');
                expect(response.message.name).to.include('Vincent Ivey');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if read fails to run through a mongo failure', async () => {
            // First we need to alter our db.findOne to return a value.
            const errorMessage = { message: 'Sheet request failed.' };

            td.when(collection.findOne(td.matchers.anything(), td.matchers.anything())).thenReturn(errorMessage);
            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = viewSelection(requestObject, project);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('viewSelection');
                expect(response.message).to.equal(errorMessage);
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });

        it('should fail if character sheet does not exist', async () => {
            td.reset();
            // First we need to alter our db.findOne to return an empty value
            td.when(collection.findOne(td.matchers.anything(), td.matchers.anything())).thenReturn();

            try {
                const response = await new Promise((resolve, reject) => {
                    const responceObject = viewSelection(requestObject, project);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('viewSelection');
                expect(response.message).to.include('Sheet not found in database');
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
                    const responceObject = viewSelection(updateVincentNameFail, project);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('viewSelection');
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
                    const responceObject = viewSelection(updateVincentNameFail, project);
                    return resolve(responceObject);
                });

                // console.log(`response : ${JSON.stringify(response, 2, null)}`);
                expect(response.results).to.exist;
                expect(response.results).to.include('viewSelection');
                expect(response.message).to.include('Value of character name not found!');
            } catch (error) {
                console.log(`error : ${JSON.stringify(error)}`);
                expect(error).to.not.exist;
            }
        });
    });
});