const commentModel = require('../models/commentModel');
const postModel = require('../models/postModel');
const replyModel = require('../models/replyModel');
const mongoose = require('mongoose')

const createComment = async (req, res) => {
    try {
        let data = req.body

        if (Object.keys(data).length == 0) return res.status(400).send("please provide post and userId");

        let { comment, postId, userId, ...a } = data;

        if (Object.keys(a).length != 0) return res.status(400).send("only post and userId is required");

        if (!comment) return res.status(400).send("please provide comment");
        if (!postId) return res.status(400).send("please provide post");
        if (!userId) return res.status(400).send("please provide userId");

        if (!mongoose.isValidObjectId(userId)) return res.status(400).send("invalid userId");
        if (!mongoose.isValidObjectId(postId)) return res.status(400).send("invalid postId");

        const user = await userModel.findOne({_id:userId});
        if(!user) return res.status(404).send({message:'no such user'});

        let post = await postModel.findOne({ _id: postId, userId: userId, isDeleted: false })
        if (!post) return res.status(404).send({ message: 'no such post to comment' })

        let createdComment = await commentModel.create(data);

        return res.status(201).send({ message: "comment created successfully", data: createdComment });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const getComment = async (req, res) => {
    try {
        let data = req.body
        let postId = req.params.postId

        if (Object.keys(data).length == 0) return res.status(400).send("please provide userId");

        let { userId, ...a } = data;

        if (Object.keys(a).length != 0) return res.status(400).send("only userId is required");

        if (!userId) return res.status(400).send("please provide userId");

        if (!mongoose.isValidObjectId(userId)) return res.status(400).send("invalid userId");
        if (!mongoose.isValidObjectId(postId)) return res.status(400).send("invalid postId");

        const user = await userModel.findOne({_id:userId});
        if(!user) return res.status(404).send({message:'no such user'});

        let viewComment = await commentModel.find({ postId: postId, userId: userId, isDeleted: false }).populate('reply');
        if (!viewComment) return res.status(404).send({ message: 'no such comment found' })

        return res.status(200).send({ data: viewComment });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const getAllComment = async (req, res) => {
    try {
        let data = req.body

        if (Object.keys(data).length == 0) return res.status(400).send("please provide userId");

        let { userId, ...a } = data;

        if (Object.keys(a).length != 0) return res.status(400).send("only userId is required");

        if (!userId) return res.status(400).send("please provide userId");

        if (!mongoose.isValidObjectId(userId)) return res.status(400).send("invalid userId");

        //if(userId != req.userId) return res.status(403).send({message: 'you are not authorised for this action'})

        let viewComment = await commentModel.find({ userId: userId, isDeleted: false });
        if (viewComment.length == 0) return res.status(404).send({ message: 'no such comments found' })
        return res.status(200).send({ data: viewComment });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const updateComment = async (req, res) => {
    try {
        let data = req.body
        let commentId = req.params.commentId

        if (Object.keys(data).length == 0) return res.status(400).send("please provide comment and userId");

        let { comment, userId, ...a } = data;

        if (Object.keys(a).length != 0) return res.status(400).send("only comment and userId is required");

        if (!comment) return res.status(400).send("please provide comment to edit");
        if (!userId) return res.status(400).send("please provide userId");

        if (!mongoose.isValidObjectId(userId)) return res.status(400).send("invalid userId");
        if (!mongoose.isValidObjectId(commentId)) return res.status(400).send("invalid commentId");

        //if(userId != req.userId) return res.status(403).send({message: 'you are not authorised for this action'})

        let editComment = await commentModel.findOneAndUpdate({ _id: commentId, userId: userId, isDeleted: false }, { comment: comment }, { new: true });
        if (!editComment) return res.status(404).send({ message: 'no such comment found to update' })
        return res.status(200).send({ message: "comment edited successfully", data: editComment });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const deleteComment = async (req, res) => {
    try {
        let data = req.body
        let commentId = req.params.commentId

        if (Object.keys(data).length == 0) return res.status(400).send("please provide userId");

        let { userId, ...a } = data;

        if (Object.keys(a).length != 0) return res.status(400).send("only userId is required");

        if (!userId) return res.status(400).send("please provide userId");

        if (!mongoose.isValidObjectId(userId)) return res.status(400).send("invalid userId");
        if (!mongoose.isValidObjectId(commentId)) return res.status(400).send("invalid commentId");

        //if(userId != req.userId) return res.status(403).send({message: 'you are not authorised for this action'})

        let deletedComment = await commentModel.findOneAndUpdate({ _id: commentId, userId: userId, isDeleted: false }, { isDeleted: true }, { new: true });
        await replyModel.updateMany({ commentId: commentId, isDeleted: false }, { isDeleted: true }, { new: true });

        if (!deletedComment) return res.status(404).send({ message: 'no such comment found to delete' });

        return res.status(200).send({ message: "comment deleted successfully" });
    } catch (err) {
        res.status(500).send(err.message);
    }
}
module.exports = { createComment, getComment, getAllComment, updateComment, deleteComment }