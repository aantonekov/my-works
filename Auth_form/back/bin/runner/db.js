const mongoose = require('mongoose');
const dbfile = require('../../storages/db')


const { uri, options } = require('../../config').db;

const init  = () => new Promise((resolve, reject) => {

    mongoose.connect(uri, options);

    dbfile.once('error', (err) => {
        console.log('BD error: ',err );
    });
    
    dbfile.once('open', () => {
        console.log('Connected to BD ');
    });
    
    dbfile.once('close', () => {
        console.log('Close connected to BD ');
    });
});

module.exports = init;
