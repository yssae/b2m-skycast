const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv').config({ path: 'src/.env' });

const successColor = '\x1b[32m%s\x1b[0m';
const checkSign = '\u{2705}';

const envFileContent = `export const environment = {
    APIKEY: '${process.env.APIKEY}'
};
`;

const targetPaths = [
    path.join(__dirname, './src/environments/environment.ts'),
    path.join(__dirname, './src/environments/environment.development.ts')
];

const writeEnvFile = (filePath, content) => {
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error(err);
            throw err;
        } else {
            console.log(successColor, `${checkSign} Successfully generated ${path.basename(filePath)}`);
        }
    });
};

targetPaths.forEach(filePath => writeEnvFile(filePath, envFileContent));
