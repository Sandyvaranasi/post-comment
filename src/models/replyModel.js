const mongoose = require('mongoose')
const replySchema = new mongoose.Schema({
    reply: {
        type: String,
        required: true,
        trim: true
    },
    commentId: {
        type : mongoose.Types.ObjectId,
        required : true,
        res : 'comment'
    },
    userId: {
        type : mongoose.Types.ObjectId,
        required : true,
        res : 'userComment'
    },
    isDeleted : {
        type :Boolean,
        default : false
    }
}, { timestamps: true })

module.exports = mongoose.model('reply', replySchema)