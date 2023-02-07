const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    totalOrders : {
        type : Number,
        default : 0
    },
    category : {
        type : String,
        default : "regular"
    },
    amount : {
        type : Number,
        default : 0
    },
    isDeleted : {
        type :Boolean,
        default : false
    }
}, { timestamps: true })

module.exports = mongoose.model('coustmer5', userSchema)