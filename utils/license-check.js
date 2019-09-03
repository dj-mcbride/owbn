/**
 * This script will evaluate all licenses that this package uses
 * and all sub-packages. The list of Itential blessed licenses is
 * contained in this script.
 */

const nlv = require('node-license-validator');
const path = require('path');

// Build a path to the directory that has the package.json
const pathToPackageDotJson = path.resolve(__dirname, '..');
// The array of acceptable licences
const acceptableLicenses = [
  'Apache',
  'Apache License',
  'BSD',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'CC-BY-3.0',
  'CC0-1.0',
  'ISC',
  'MIT',
  'MIT/X11',
  'SEE LICENSE IN ITENTIAL.lic',
];
// The packages to inspect, in our case, all packages.
const packagesToInspect = [];
// Config object for node-license-validator
const nlvConfig = {
  licenses: acceptableLicenses,
  packages: packagesToInspect,
};
// A list of packages that can have their license ignored.
const ignorePackages = [
  'taffydb',
];

/**
 * Prints out all packages and associated licences
 * @param {array} packagesObj - The list of packages discovered.
 */
function printPackageInfo(packagesObj) {
  const packageNames = Object.keys(packagesObj);
  packageNames.forEach((packageName) => {
    const license = packagesObj[packageName];
    console.log(`${packageName}: ${license}`);
  });
}

/**
 * Prints out the package name and license of any modules that violate our
 * license restrictions.
 * @param {array} invalids - The list of packages in violation.
 * @param {array} packages - The list of packages discovered.
 */
function printInvalids(invalids, packages) {
  if (invalids.length > 0) {
    console.log('packages with invalid licenses:');
    invalids.forEach((trulyInvalid) => {
      console.log(`${trulyInvalid}: ${packages[trulyInvalid]}`);
    });
  }
  console.log(`There are ${invalids.length} packages with invalid licenses`);
}

/**
 * Prints out a list of packages that do not match our acceptable licences.
 * @param {array} invalids - The list of packages in violation.
 * @param {array} packages - The list of packages discovered.
 * @returns {number} - The exit code to return for this process, 0 is success,
 *    1 represents a license violation.
 */
function determineInvalids(invalids, packages) {
  let exit = 0;
  const trulyInvalids = [];
  // first, loop through invalids list to check for exceptions
  if (invalids.length > 0) {
    invalids.forEach((invalid) => {
      // strip package name from version
      const packageName = invalid.substring(0, invalid.lastIndexOf('@'));
      // make exceptions for specific modules defined in ignorePackages
      if (!ignorePackages.includes(packageName)) {
        trulyInvalids.push(invalid);
        exit = 1;
      }
    });
  }
  // print out any violators
  printInvalids(trulyInvalids, packages);
  return exit;
}

/**
 * Prints out a list of acceptable licenses defined by Itential.
 * @param {array} licences - The list of acceptable licenses defined by Itential.
 */
function printAcceptableLicenses(licenses) {
  console.log('Inspecting software licenses of dependencies...');
  console.log('Acceptable licenses are:');
  licenses.forEach((license) => {
    console.log(`  ${license}`);
  });
}

/*
 * A toggle that will just print all packages and associated licences.
 * Use a command line arg "list" to activate.
 */
let showCompleteList = false;
if (process.argv[2] && process.argv[2] === 'list') {
  showCompleteList = true;
}

// Print out the acceptable licences for informational purposes
printAcceptableLicenses(acceptableLicenses);

// Use nlv package to inspect all licences in all packages
nlv(pathToPackageDotJson, nlvConfig, (error, data) => {
  console.log('\n\n');
  if (error) {
    console.log(`Inspecting licenses returned an error: ${error}`);
    process.exit(2);
  } else {
    let exitCode = 0;
    const numPkgs = Object.keys(data.packages).length;
    console.log(`Inspecting ${numPkgs} packages...`);
    if (showCompleteList) {
      printPackageInfo(data.packages);
    } else {
      exitCode = determineInvalids(data.invalids, data.packages);
    }
    process.exit(exitCode);
  }
});
