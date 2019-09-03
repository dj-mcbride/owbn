const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const { dirname, join, resolve } = require('path');
const [,, ...files] = process.argv;
try {
    const hosts = readFileSync('.scp-host').toString().split('\n');
    hosts.forEach((host) => {
        // For some reason, splitting the scp host value inserts a new line. The map statement removes it
        const [domain, path] =
            host
                .split(':')
                .map(part => part.replace(/\r?\n|\r/g, ''));

        const commands = files
            .map(f => `scp -r ${f} ${domain}:${path}${dirname(f)}`)
            .join(';');

        execSync(`${commands}`);
    });
    } catch (error) {
    if (/No such file or directory/.test(error.message)) {
        throw new Error('npm run scp does not support creating directories. Please create the directory to be copied on the target machine and try again.');
    }
    throw error;
}