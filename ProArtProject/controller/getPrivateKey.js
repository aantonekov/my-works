// модуль выполняет только 1 функцию - читает ключ из файла.
// функцию require в роут авторизации

const fs = require('fs-extra');
const path = require('path');

// const keyPath = path.join(_dir, '../keys/priv.key');
const keyPath = path.join(__dirname, '../keys/priv.key');

// при первоначальном использовании - значение всегда null
let privateKey = null;

const getPrivatekey = async () => {
    if(!privateKey) {
        privateKey = await fs.readFile(keyPath, 'utf-8');
    }

    return privateKey;
};

module.exports = getPrivatekey;