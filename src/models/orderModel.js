const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "customer5",
        required: true,
    },
    orderPrice: {
        type: Number,
        required: true
    },
    isDeleted : {
        type :Boolean,
        default : false
    }
}, { timestamps: true })

module.exports = mongoose.model('order5', orderSchema)