const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
    },
    // Google-authenticated user reference (optional)
    googleUser: {
        googleId: { type: String },
        name: { type: String },
        email: { type: String },
        avatar: { type: String },
    },
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                refPath: 'itemModel',
            },
            itemModel: {
                type: String,
                required: true,
                enum: ['Product', 'Franchise']
            }
        },
    ],
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
}, {
    timestamps: true,
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = Order;
