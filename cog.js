/* @copyright Itential, LLC 2016 */
/* global brokers */
/* global cogs */
/* global adapterClasses */
/* global log */
/* global variablethatisglobal:true */
var getNamespace = require("continuation-local-storage").getNamespace;
var namespace = getNamespace("itential.pronghorn");
var fs = require('fs');
var os = require('os');
const dirPath = require("path");

const MongoConnector = require("@T-Mobile/isa-utils").MongoConnector;
// const { MongoDBConnection, ObjectID } = require(dirPath.join(__dirname, './lib/database.js'));



var jap_test = function () {
    // log.setLevel('console', 'debug');
    // log.setLevel('file', 'spam');
    // log.setLevel('syslog', 'spam');
    // log.error("#############################################");
    // log.warn("warn");
    // log.info("info");
    // log.debug("debug");
    // log.trace("trace");
    // log.spam("spam");
    // log.error("#############################################");

    this.DB = new MongoConnector(pronghornProps.mongoProps, true);
    this.DB.connect(true)
        .then(async (database) => {
            this.database = database;
            this.database.on("close", () => {
                console.error("close")
                //Do something if you need to handle when the DB connection closes
            });
            this.database.on("timeout", () => {
                console.error("timeout")
                //Do something if you need to handle a connection timeout
            });
            this.database.on("reconnect", () => {
                console.error("reconnect")
                //Do something if you need to handle a connection timeout
            });
            this.database.on("fullsetup", () => {
                console.error("fullsetup")
                //Do something if you need to handle a connection timeout
            });
            this.database.on("error", () => {
                console.error("error")
                //Do something if you need to handle a connection timeout
            });
            this.database.on("authenticated", () => {
                console.error("authenticated")
                //Do something if you need to handle a connection timeout
            });
            let data = await this.database.collection("accounts").findOne();
            // console.log(data);
            // console.log(new ObjectId());
        })
        .catch((error) => {
            log.error(error);
        });


    // alarm.SystemRestart(); // works
    // alarm.AdapterUnreachable("pier", "localhost", "329"); // fails last value becomes a function
    // alarm.AdapterConnected("pier", "localhost", "3330"); // fails last value becomes a function
    // alarm.AdapterFunctionError("pier", "create CR", "too many cr tickets") // fails last value becomes a function
    // alarm.SystemError("down"); // fails last value becomes a function
    // alarm.trap("1.3.6.1.4.1.47688.1.1.1.0.5", ["a"]); // fails last value becomes a function

};

jap_test.prototype.provisionXML = async function (adapter, payload, options, callback) {
    adapters[adapter].provisionXML(payload, options, (error, response) => {
        if (error) {
            return callback(error);
        }
        return callback(response);
    })
}

jap_test.prototype.dryRunXML = async function (adapter, payload, callback) {
    adapters[adapter].provisionXML(payload, (error, response) => {
        if (error) {
            return callback(error);
        }
        return callback(response);
    })
}


jap_test.prototype.do = async function (device, data, callback) {

    var promiseLiveStatus = () => {
        return new Promise(function (resolve, reject) {
            adapters['NSO-AAV'].liveStatus(device, { commandType: data.commandType, command: data.command, method: data.method }, (response, error) => {
                if (error) {
                    return reject(error);
                }
                return resolve(response);
            });
        });
    };

    const promises = [];
    for (let i = 0; i < data.runs; i++) {
        console.log("promise added");
        promises.push(promiseLiveStatus);
    }
    const results = []
    const threadResults = {}
    const threads = [];
    for (let i = 1; i <= data.threads; i++) {
        threads.push(i);
    }
    var run = new Promise((resolve, reject) => {
        threads.forEach(async function (i) {
            for (const curPromise of promises) {
                results.push(await curPromise());
            }
            threadResults[i] = results;
            resolve();
        });
    });

    run.then((values) => {
        console.log(values);
        return callback(threadResults);
    });

    // Promise.All but sequential usage
    // const promiseSerial = funcs =>
    //     funcs.reduce((promise, func) =>
    //         promise.then(result => func(result).then(Array.prototype.concat.bind(result))),
    //         Promise.resolve([]))

    // promiseSerial(promises)
    //     .then((results) => { return callback(results) })
    //     .catch((error) => { return callback(null, error) })

    // runs in parallel
    // Promise.all(promises).then(function (values) {
    //     console.log(values);
    //     return callback(values);
    // })
    
    // supposed to do sequentially but doesn't
    // return promises.reduce((promiseChain, currentTask) => {
    //     return promiseChain.then(chainResults =>
    //         currentTask.then(currentResult =>
    //             [...chainResults, currentResult]
    //         )
    //     );
    // }, Promise.resolve([])).then(arrayOfResults => {
    //     return callback(arrayOfResults);
    // });
    
}

jap_test.prototype.doKerry = async function (device, data, callback) {
    const waitFor = (ms) => new Promise(r => setTimeout(r, ms))
    const asyncForEach = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    const promiseLiveStatus = (data) => {
        return new Promise(function (resolve, reject) {
            console.log("adapter called");
            adapters['NSO-AAV'].liveStatus(device, { commandType: data.commandType, command: data.command }, (response, error) => {
                if (error) {
                    return reject(error);
                }
                return resolve(response);
            });
        })
    }

    const start = async () => {
        await asyncForEach([1, 2, 3], async (num) => {
            // await waitFor(1000 * num);
            await promiseLiveStatus;
            console.log(num);
        })
    }

    start()
    start()

    // var promiseLiveStatus = new Promise(function (resolve, reject) {
    //     console.log("adapter called");
    //     adapters['NSO-AAV'].liveStatus(device, { commandType: data.commandType, command: data.command }, (response, error) => {
    //         if (error) {
    //             return reject(error);
    //         }
    //         return resolve(response);
    //     });
    // });
    // for (let i = 0; i < data.threads; i++) {
    //         var response = await promiseLiveStatus;
    //         console.log(response)
    // }
    
    
    return callback("done");
};

jap_test.prototype.brokerGetUser = function (username, callback) {
    brokers.aaa.getUser(username, callback);
}

jap_test.prototype.ldapQuery = function (baseDN, filter, attributes, callback) {
    console.log("1")
    adapters["LDAP Server"].query(baseDN, filter, attributes, function(results, error) {
        console.log("2")
        console.log(results);
        console.log(error);
        return callback(results);
    }) 
}

jap_test.prototype.LB4MinCall = function (message, callback) {

setTimeout(function () {
    return callback({
        message: message.test.test
    })
}, 3000)
    
}

jap_test.prototype.getTicket = function (incident_id, callback) {
    adapters["pier"].getTicket(incident_id, callback);
}

jap_test.prototype.delayStartWF = function (name, variables, callback) {
    let username = namespace.get("user").username;
    let ranValue = Math.floor(Math.random()*Math.floor(3));
    let wait = 0;
    if (ranValue === 0) {
        wait = 500;
    }
    if (ranValue === 1) {
        wait = 3000;
    }
    if (ranValue === 2) {
        wait = 5000;
    }
    // console.log("wait:" + wait);
    // console.log("random:" + ranValue);
    setTimeout(function () {
        cogs.WorkFlowEngine.startJob("doNothing", "doNothing", {
        }, (results, error) => {
            if (error) {
                log.error(JSON.stringify(error));
                return callback();
            }
            log.info(`Wait: ${wait} finished, starting workflow`);
            return callback(results);
        });
    }, wait)
}

jap_test.prototype.count = async function(count, callback) {
    var pid = process.pid;
    console.log(auditTrail.getUserObject());
    function wait(x) {
        return new Promise(resolve => {

            setTimeout(() => {
                console.log(`${pid} - Count ${x}`);
                resolve(x);
            }, 1000);
        })
    }
    for (var i = 1; i < count; i++) {
        await wait(i)
    }
    callback(count);
}

jap_test.prototype.jobQuery = function(filter, projection, callback) {
    let queryDoc = {
        collection: "jobs",
        filter: filter,
        projection: projection
    };
    brokers["persistence"].query(queryDoc, (results, error) => {
        if (error) {return callback(error)};
        return callback(results);
    });

}
jap_test.prototype.backupQuery = function (filter, projection, callback) {
    let queryDoc = {
        collection: "device_configs",
        filter: filter,
        projection: projection
    };
    brokers["persistence"].query(queryDoc, (results, error) => {
        if (error) {
            return callback(error)
        };
        return callback(results);
    });

}

jap_test.prototype.writeFile = function (file, message, callback) {
    console.log("************************************************************");
    console.log("WriteFile called for " + file + " with message: " + message);
    console.log("************************************************************");
    try {
        fs.writeFileSync(file, message, 'utf-8');
    } catch (error) {
        log.error(error);
    }
    callback(true)
}

jap_test.prototype.errorTask = function(callback) {
    callback(null, "This is a generic error task, it is supposed to error.");
}
jap_test.prototype.successTask = function(callback) {
    callback("This is a generic success task, it is supposed to succeed.");
}
jap_test.prototype.failureTask = function(callback) {
    callback();
}

jap_test.prototype.provision = function (host, data, callback) {
    brokers["device"].provision(host, data, (results, error) => {
        if (error) {
            log.error("Provision Error: " + JSON.stringify(error, null, 2));
            return callback(error);
        }
        return callback(results);
    });
};

jap_test.prototype.syncTo = function (callback) {
    var device = "alu0";
    adapters["Local NSO"].syncTo(device, (results, error) => {
        return callback(results);
    });
}


jap_test.prototype.getNEDSVerbose = function (callback) {
    var pid = process.pid;
    log.info("Starting getNEDs on server: " + pid);
    adapters["Local NSO"].getNEDs(function (results, error) {
        return callback({ results: results, hostname: pid })
    });
}



jap_test.prototype.callAppFunc = function (appName, appFunc, argsObj, callback) {
    log.console(appName + " " + appFunc);
    // var args = Array.prototype.slice.call(argsObj);
    // log.console(argsObj);
    cogs[appName][appFunc].apply(null, argsObj, callback);
}



jap_test.prototype.runActionConnect = function (host, params, callback) {
    // Example of JSON Body
    // {
    //     "host": "Local NSO",
    //     "params": {
    //         "path": "/ncs:devices/device{BLTEST34_BL_E}/connect"
    //     }
    // }  
    brokers["device"].runAction(host, params, function (results, err) {
        if (err) {
            console.log("!!!!!!! Error !!!!!!!");
            console.log(JSON.stringify(err, null, 2));
            return callback(null, err);
        }
        console.log("******* Results ******");
        console.log(JSON.stringify(results, null, 2));
        return callback(results);
    });
}

jap_test.prototype.quickTEST = function (callback) {
    let device = "MADDAL21";
    let command_type = "any";
    let command = "admin display-config | match context all \"port 1/2/10\" | match context all \"EQG-3134\" | match scheduler-policy";
    cogs.NSOManager.liveStatus(device, command_type, command, callback);
}

// params value
// {
//     "host": "Local NSO",
//         "params": {
//         "xpath_expr": "/devices/device[name='ARGDAL01']/address",
//             "selection": []
//     }
// }

jap_test.prototype.nso_query = function (host, params, callback) {
    // brokers["device"].query(host, params, (results, error) => {
    adapters[host].doQuery(params, (results, error) => {
        if (error) {
            return callback(null, error);
        }
        return callback(results);
    });
};



jap_test.prototype.applyVariableTemplate = function(device, template, variables, callback) {
    brokers["device"].applyVariableTemplate(device, template, variables, callback);
};

jap_test.prototype.pauseJob = function (job_id, callback) {
    cogs.WorkFlowEngine.pauseJob(job_id, function (status) {
        console.log("status:" + JSON.stringify(status, null, 2));
        callback(status);
    });
};

jap_test.prototype.partialSyncFromPaths = function (path, callback) {
    /* let action = {
         "devices":{
             "partial-sync-from":{
                 "path":path
             }
         }
     }; */
    //let action =  "devices partial-sync-from path " + path  ;
    let action = {
        "path": "/ncs:devices/partial-sync-from",
        "params": { "path": path }
    };
    //brokers["device"].runAction('Local NSO', action, function (results, error) {
    //brokers["NSO"].doAction('Local NSO', action, function (results, error) {
    //adapters["NSO"].doAction(action, function (results, error) {
    adapters["Loadbalancer NSO"].runAction(action, function (results, error) {
        if (error) {
            return callback(null, error);
        }
        //let value = utility.mongoify(results);
        return callback(results);
    });
};

jap_test.prototype.saveMongo = function(collection, filter, setData, callback) {
    brokers["persistence"].updateSearched(collection, filter, setData, false, true, function (data, error) {
        if (error) {
            log.error(error);
            return callback(error);
        } else {
            return callback(data);
        }
    });
};

jap_test.prototype.getDevicesFiltered = function (adapterId, options, callback) {
    adapters[adapterId].getDevicesFiltered(options, function (results, error) {
        if (error) callback(null, error);
        console.log(error);
        console.log(JSON.stringify(result, null, 2))
        callback(results);
    });
}

jap_test.prototype.headerTimeout = function (callback) {
    const postData = "";
    const http = require('http');

    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/',
        method: 'get',
        timeout: 2
    };

    const req = http.request(options, (res) => {
        let data = '';
        // console.log(`STATUS: ${res.statusCode}`);
        // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        // res.setEncoding('utf8');
        res.on('data', (chunk) => {
            data += chunk;
            // console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            // console.log('No more data in response.');
            callback(data)
        });
    });

    // req.on('socket', function (socket) {
    //     socket.setTimeout(3000);
    //     socket.on('timeout', function () {
    //         req.abort();
    //     });
    // });

    req.on('error', (e) => {
        callback("Error: " + e.message);
    });



    // write data to request body
    req.write(postData);
    req.end();

}


jap_test.prototype.pingTest = function (device, callback) {
    var action = {
        devices : {
            device: {
                name: device,
                "ping": {}
            }
        }
    };

            adapters["NetConf NSO"].runAction(action, function (results, err) {
                if (err) {
                    console.log("Error: " + err);
                }

                callback(results);
            });

};


jap_test.prototype.message = function (callback) {
    const hostname = os.hostname();
    log.warn(hostname + ": This is a debug message it, can be ignored, it's for testing.")
    callback("log message sent")
};

module.exports = new jap_test();
