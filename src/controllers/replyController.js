const commentModel = require('../models/commentModel');
const postModel = require('../models/postModel');
const replyModel = require('../models/replyModel');
const mongoose = require('mongoose')

const createReply = async (req, res) => {
    try {
        let data = req.body

        if (Object.keys(data).length == 0) return res.status(400).send("please provide post and userId");

        let { reply, commentId, userId, ...a } = data;

        if (Object.keys(a).length != 0) return res.status(400).send("only post and userId is required");

        if (!commentId) return res.status(400).send("please provide commentId");
        if (!reply) return res.status(400).send("please provide reply");
        if (!userId) return res.status(400).send("please provide userId");

        if (!mongoose.isValidObjectId(userId)) return res.status(400).send("invalid userId");
        if (!mongoose.isValidObjectId(commentId)) return res.status(400).send("invalid postId");

        const user = await userModel.findOne({_id:userId});
        if(!user) return res.status(404).send({message:'no such user'});

        const comment = await commentModel.findOneAndUpdate({_id:commentId,isDeleted:false},{isReply:true},{new:true});
        if(!comment) return res.status(404).send({message:'no such comment'});

        let replied = await replyModel.create(data);

        return res.status(201).send({ message: "reply created successfully", data: replied });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const  getReply= async (req, res) => {
    try {
        let data = req.body

        if (Object.keys(data).length == 0) return res.status(400).send("please provide commentId and replyId");

        let { commentId,replyId, ...a } = data;

        if (Object.keys(a).length != 0) return res.status(400).send("only commentId and replyId is required");

        if (!commentId) return res.status(400).send("please provide commentId");
        if (!replyId) return res.status(400).send("please provide replyId");

        if (!mongoose.isValidObjectId(commentId)) return res.status(400).send("invalid commentId");
        if (!mongoose.isValidObjectId(replyId)) return res.status(400).send("invalid replyId");

        let viewReply = await replyModel.findOne({ _id:replyId,commentId: commentId, isDeleted: false });
        if (!viewReply) return res.status(404).send({ message: 'no such reply found' })

        return res.status(200).send({ data: viewReply });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const getAllReply = async (req, res) => {
    try {
        let data = req.body

        if (Object.keys(data).length == 0) return res.status(400).send("please provide commentId");

        let { commentId, ...a } = data;

        if (Object.keys(a).length != 0) return res.status(400).send("only commentId is required");

        if (!commentId) return res.status(400).send("please provide commentId");


        if (!mongoose.isValidObjectId(commentId)) return res.status(400).send("invalid commentId");

        let viewReply = await replyModel.find({commentId: commentId, isDeleted: false });
        if (viewReply.length==0) return res.status(404).send({ message: 'no such reply found' })

        return res.status(200).send({ data: viewReply });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const updateReply = async (req, res) => {
    try {
        let data = req.body
        let replyId = req.params.replyId

        if (Object.keys(data).length == 0) return res.status(400).send("please provide reply and userId");

        let { reply, userId, ...a } = data;

        if (Object.keys(a).length != 0) return res.status(400).send("only reply and userId is required");

        if (!reply) return res.status(400).send("please provide reply to edit");
        if (!userId) return res.status(400).send("please provide userId");

        if (!mongoose.isValidObjectId(userId)) return res.status(400).send("invalid userId");
        if (!mongoose.isValidObjectId(replyId)) return res.status(400).send("invalid replyId");

        //if(userId != req.userId) return res.status(403).send({message: 'you are not authorised for this action'})

        let editReply = await replyModel.findOneAndUpdate({ _id: replyId, userId: userId, isDeleted: false }, { reply: reply }, { new: true });
        if (!editReply) return res.status(404).send({ message: 'no such reply found to update' })
        return res.status(200).send({ message: "reply edited successfully", data: editReply });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const deleteReply = async (req, res) => {
    try {
        let data = req.body
        let replyId = req.params.replyId

        if (Object.keys(data).length == 0) return res.status(400).send("please provide userId");

        let { userId, ...a } = data;

        if (Object.keys(a).length != 0) return res.status(400).send("only userId is required");

        if (!userId) return res.status(400).send("please provide userId");

        if (!mongoose.isValidObjectId(userId)) return res.status(400).send("invalid userId");
        if (!mongoose.isValidObjectId(replyId)) return res.status(400).send("invalid replyId");

        //if(userId != req.userId) return res.status(403).send({message: 'you are not authorised for this action'})

        let editReply = await replyModel.findOneAndUpdate({ _id: replyId, userId: userId, isDeleted: false }, { isDeleted: true }, { new: true });
        if (!editReply) return res.status(404).send({ message: 'no such reply found to delete' })
        return res.status(200).send({ message: "reply deleted successfully"});
    } catch (err) {
        res.status(500).send(err.message);
    }
}
module.exports = { createReply, getReply, getAllReply, updateReply, deleteReply }