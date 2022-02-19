const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
    orderId: {
        type: Schema.Types.String,
    },
    amount: {
        sum: { type: Schema.Types.Number },
        currency: { type: Schema.Types.String }
    },
    products: {
        photoId: [{ type: Schema.Types.String }],
        photoPrice: [{ type: Schema.Types.Number }],
        photoCount: [{ type: Schema.Types.Number }]
    },
    recipient: {
        clientFirstName: { type: Schema.Types.String, default: '' },
        clientLastName: { type: Schema.Types.String, default: '' },
        clientEmail: { type: Schema.Types.String, default: '' },
        clientPhone: { type: Schema.Types.Number, default: '' }
    }
}, { timestamps: true });

orderSchema.plugin(require('mongoose-beautiful-unique-validation'));

const model = mongoose.model('order', orderSchema);
module.exports = model;
