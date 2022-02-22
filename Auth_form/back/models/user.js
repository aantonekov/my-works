const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');

const { Schema } = mongoose;

require('./role')

const generalSchema = new Schema({
    
    userLogin: {
        type: Schema.Types.String,
        default: '',
        maxlength: 255,
        required: true,
        unique: true
    },
    userName: {
        type: Schema.Types.String,
        default: '',
        maxlength: 255
    },
    role:[{
        type:Schema.Types.String, ref:'role'
    }],
    hashPwd: {
        type: Schema.Types.String, 
       
    }
    
})


const hashingPwd = (pwd) => {
    const data = new TextEncoder().encode(pwd);
    const result = crypto.createHash('sha256').update(data).digest('hex');
    return result;
};
  
generalSchema.virtual('pwd')
.set(function(val) {
    const hash = hashingPwd(val);
    this.hashPwd = hash;
})
.get(() => {
    throw new Error('use method checkPWd for check password! Don`t read this field');
    return 'sam durak';
});

generalSchema.methods.checkPwd = function(pwd) {
const hash = hashingPwd(pwd);
// console.log('1:', hash)
// console.log('2:', this.hashPwd)
// console.log('3:', this)
const check = hash === this.hashPwd;
return check;
}



const modelname = path.basename(__filename, '.js');
const model = mongoose.model(modelname, generalSchema)

module.exports = model;