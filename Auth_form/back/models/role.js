const path = require('path');
const mongoose = require('mongoose');

const { Schema } = mongoose;


const generalSchema = new Schema({
  
 value:{ 
     type: Schema.Types.String,
     unique: true,
     default:"USER"
    }
    
});

const modelname = path.basename(__filename, '.js');
const model = mongoose.model(modelname, generalSchema)

module.exports = model;