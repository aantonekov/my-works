const fs = require('fs-extra');
const path = require('path');

const keyPath = path.join(__dirname, '../keys/priv.key');

let privateKey = null;

const getPrivateKey = async () => {

    if(!privateKey) {
        privateKey = await fs.readFile(keyPath, 'utf-8');
    }
    return privateKey;
};

module.exports = getPrivateKey;

