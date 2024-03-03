import path from 'path';
import fs from 'fs';

export async function readFromJSONObjectFile(filePath) {
    try {
        const resolvedFilePath = path.resolve(__dirname, filePath);
        if (fs.existsSync(resolvedFilePath)) {
            // file exists
            // read the file
            return new Promise((resolve, reject) => {
                if (path.extname(resolvedFilePath) !== '.json') reject('File not a JSON file');
                const rawJSONString = fs.readFileSync(resolvedFilePath);
                resolve(rawJSONString.toString());
            });
        } else {
            return new Promise((resolve, reject) => {
                resolve('');
            });
        }
    } catch (err) {
        throw err;
    }
}

export function isJsonString(str) {
    try {
        const o = JSON.parse(str);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object",
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === 'object') {
            return true;
        }
    } catch (e) {}

    return false;
}

export async function fileExists(path) {
    return new Promise((resolve, reject) => {
        try {
            if (fs.existsSync(path)) {
                resolve(true);
            } else {
                fs.writeFile(path, '', { flag: 'wx' }, function (err) {
                    if (err) throw err;
                    resolve(true);
                });
            }
        } catch (err) {
            reject(err);
        }
    });
}

function checkAndCreateFile(filePath, content) {
    // Check if the file exists
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.constants.F_OK, err => {
            if (err) {
                // The file doesn't exist, create it
                fs.writeFile(filePath, '', err => {
                    if (err) {
                        // console.error('Error creating file:', err);
                        reject(err);
                    } else {
                        // console.log('File created successfully!');
                        resolve(filePath);
                    }
                });
            } else {
                // console.log('File already exists.');
                resolve(filePath);
            }
        });
    });
}

export async function writeToJSONFile(filePath, data, resolve_path) {
    try {
        // console.log('WRITING');
        // console.log(data);
        const resolvedFilePath = resolve_path ? path.resolve(__dirname, filePath) : filePath;
        return new Promise((resolve, reject) => {
            // console.log(resolvedFilePath);
            checkAndCreateFile(resolvedFilePath)
                .then(() => {
                    fs.writeFileSync(resolvedFilePath, JSON.stringify(data, null, 4));
                    resolve(true);
                })
                .catch(err => {
                    reject(err);
                });
        });
    } catch (err) {
        throw err;
    }
}
