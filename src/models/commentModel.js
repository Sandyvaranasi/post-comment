const mongoose = require('mongoose')
const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
        trim: true
    },
    postId: {
        type : mongoose.Types.ObjectId,
        required : true,
        res : 'postComment'
    },
    userId: {
        type : mongoose.Types.ObjectId,
        required : true,
        res : 'userComment'
    },
    isReply:{
        type: Boolean,
        default: false
    },
    isDeleted : {
        type :Boolean,
        default : false
    }
}, { timestamps: true })

module.exports = mongoose.model('comment', commentSchema)