const mongoose = require('mongoose');

const { Schema } = mongoose;

const albumSchema = new Schema({
    name: {
        type: Schema.Types.String,
        maxLength: 100,
    },
    date: {
        type: Schema.Types.Date,
    },
    description: {
        type: Schema.Types.String,
        maxLength: 200
    },
    images: [{
        id: {
            type: Schema.Types.String,
            minLength: 10,
            require: true
        },
        name: {
            type: Schema.Types.String,
        },
        imageSrc: {
            type: Schema.Types.String,
        },
        imageWaterSrc: {
            type: Schema.Types.String,
        },
        price: {
            type: Schema.Types.Number,
        },
    }],
}, { timestamps: true });

albumSchema.plugin(require('mongoose-beautiful-unique-validation'));


const model = mongoose.model('album', albumSchema);
module.exports = model;