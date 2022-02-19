const mongoose = require('mongoose');
const crypto = require('crypto');

const { Schema } = mongoose;

const userSchema = new Schema({
    login: {
        type: Schema.Types.String,
        maxLength: 50,
        unique: true
      },
    firstName: {
        type: Schema.Types.String,
        maxLength: 100,
    },
    secondName: {
        type: Schema.Types.String,
        maxLength: 100,
        default: '',
    },
    birthday: {
        type: Schema.Types.Date,
    },
    age: {
        type: Schema.Types.Number,
        min: 18,
        max: 100
    },
    email: {
        type: Schema.Types.String,
        maxLength: 100,
        unique: true
    },
    phone: {
        type: Schema.Types.Number,
        maxLength: 50,
        unique: true
    },
    hashPwd: {
        type: Schema.Types.String,
        require: true
    },
    userPhoto: {
        type: Schema.Types.String,
    },
    role: [{
        type: Schema.Types.String,
        enum: ['moderator', 'photographer', 'buyer']
    }],
    status: {
        type: Boolean,
        default: false
    },
    albums: [{
        type: Schema.Types.ObjectId,
        ref: 'album'
    }],
    mark: {
        type: Schema.Types.String,
    }
}, { timestamps: true });

userSchema.plugin(require('mongoose-beautiful-unique-validation'));


const hashingPwd = (pwdUser) => {
    const data = new TextEncoder().encode(pwdUser);
    const result = crypto.createHash('sha256').update(data).digest('hex');
    return result;
};

userSchema.virtual('pwdUser')
    .set( function(val) {
        const hash = hashingPwd(val);
        this.hashPwd = hash;
    });

userSchema.methods.checkPwd = function(pwdUser) {
    const hash = hashingPwd(pwdUser);
    const check = hash === this.hashPwd;
    return check;
};

const model = mongoose.model('user', userSchema);
module.exports = model;