const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'eslint_out.json');
const content = fs.readFileSync(logPath, 'utf-16le'); // or utf8 depending on powershell

try {
    let parsed = JSON.parse(content);
    if (parsed.length > 0) {
        console.log(JSON.stringify(parsed[0].messages, null, 2));
    }
} catch (e) {
    const content2 = fs.readFileSync(logPath, 'utf8');
    let parsed = JSON.parse(content2);
    if (parsed.length > 0) {
        console.log(JSON.stringify(parsed[0].messages, null, 2));
    }
}
