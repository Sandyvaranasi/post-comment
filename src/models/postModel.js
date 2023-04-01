const mongoose = require('mongoose')
const postSchema = new mongoose.Schema({
    post: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required:true,
        ref: 'userComment'
    },
    isDeleted : {
        type :Boolean,
        default : false
    }
}, { timestamps: true })

module.exports = mongoose.model('postComment', postSchema)