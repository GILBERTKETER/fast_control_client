const fs = require('fs');
const path = require('path');

function checkAndCreateFile(filePath, content) {
    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, err => {
        if (err) {
            // The file doesn't exist, create it
            fs.writeFile(filePath, content, err => {
                if (err) {
                    console.error('Error creating file:', err);
                } else {
                    console.log('File created successfully!');
                }
            });
        } else {
            console.log('File already exists.');
        }
    });
}

// Example usage
const filePath = path.resolve(__dirname, 'example.txt');
const fileContent = 'Hello, world!';

checkAndCreateFile(filePath, fileContent);
