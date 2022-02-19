const mongoose = require('mongoose');

const { Schema } = mongoose;

require('./userModel');

const refreshTokenSchema = new Schema({
    tokenID: {
      type: Schema.Types.String,
      unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    }
}, { timestamps: true });

const model = mongoose.model('refreshToken', refreshTokenSchema);
module.exports = model;