#!/usr/bin/env node

const fs = require('fs');

function main() {
    // Get the arguments flag of the command line
    const args = process.argv.slice(2);

    // Initialize flag and file variable
    let flag = null;
    let file = null;

    // Check the arguments to identify the option and file name
    if (args.length === 0) {
        // No option or filename provided, read from stdin
        flag = 'default';
    } else if (args.length === 1 && args[0].startsWith('-')) {
        // Option provided, read from stdin
        flag = args[0];
    } else if (args.length === 1) {
        // No option provided, default to all counts, read from file
        flag = 'default';
        file = args[0];
    } else if (args.length === 2 && args[0].startsWith('-')) {
        flag = args[0];
        file = args[1];
    } else {
        console.error('Usage: ccwc [<filename>] or ccwc -c <filename> or ccwc -l <filename> or ccwc -w <filename>');
        process.exit(1);
    }

    function processData(data) {
        // Calculate the counts
        const byteCount = Buffer.byteLength(data);
        const lineCount = data.split('\n').length - (data.endsWith('\n') ? 1 : 0);
        const wordCount = data.split(/\s+/).filter(word => word.length > 0).length;
        const characterCount = data.split('').length;

        if (!file) file = '';

        // Check if the flag is -c
        if (flag === '-c') {
            // Print the byte count
            console.log(`${byteCount} ${file}`);
        } else if (flag === '-l') {
            console.log(`${lineCount} ${file}`)
        } else if (flag === '-w') {
            console.log(`${wordCount} ${file}`);
        } else if (flag === '-m') {
            console.log(`${characterCount} ${file}`);
        } else if (flag === 'default') {
            console.log(`${lineCount} ${wordCount} ${byteCount} ${file}`);
        }
    }

    if (file) {
        // Read the file
        fs.readFile(file, 'utf8', (error, data) => {
            if (error) {
                console.error('Error reading file:', error);
                process.exit(1);
            }

            processData(data);
        })
    } else {
        // Read from stdin
        let data = '';
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', chunk => {
            data += chunk;
        });
        process.stdin.on('end', () => {
            processData(data);
        });
    }
}

main()