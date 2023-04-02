const postModel = require('../models/postModel');
const mongoose = require('mongoose')

const createPost = async (req, res) => {
    try {
        let data = req.body

        if(Object.keys(data).length==0) return res.status(400).send("please provide post and userId");

        let { post,userId} = data;

        if (!post) return res.status(400).send("please provide post");
        if (!userId) return res.status(400).send("please provide userId");

        if(!mongoose.isValidObjectId(userId)) return res.status(400).send("invalid userId");

         let createdPost = await postModel.create(data);

        return res.status(201).send({message:"post created successfully", data: createdPost });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const getPost = async (req, res) => {
    try {
        let data = req.body
        let postId = req.params.postId

        if(Object.keys(data).length==0) return res.status(400).send("please provide userId");

        let { userId} = data;

        if (!userId) return res.status(400).send("please provide userId");

        if(!mongoose.isValidObjectId(userId)) return res.status(400).send("invalid userId");
        if(!mongoose.isValidObjectId(postId)) return res.status(400).send("invalid postId");

         let viewPost = await postModel.findOne({_id:postId,userId:userId,isDeleted:false});
         if(!viewPost) return res.status(404).send({message: 'no such post found'})
        return res.status(200).send({data:viewPost});
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const getAllPost = async (req, res) => {
    try {
        let data = req.body

         let viewPost = await postModel.find({isDeleted:false});

         if(viewPost.length==0) return res.status(404).send({message: 'no post found'})
         
        return res.status(200).send({data:viewPost});
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const updatePost = async (req, res) => {
    try {
        let data = req.body
        let postId = req.params.postId

        if(Object.keys(data).length==0) return res.status(400).send("please provide post and userId");

        let { post,userId,...a} = data;

        if(Object.keys(a).length!=0) return res.status(400).send("only post and userId is required");

        if (!post) return res.status(400).send("please provide post to edit");
        if (!userId) return res.status(400).send("please provide userId");

        if(!mongoose.isValidObjectId(userId)) return res.status(400).send("invalid userId");
        if(!mongoose.isValidObjectId(postId)) return res.status(400).send("invalid postId");

        if(userId != req.userId) return res.status(403).send({message: 'you are not authorised for this action'})

         let editPost = await postModel.findOneAndUpdate({_id:postId,userId:userId,isDeleted:false},{post:post},{new:true});
         if(!editPost) return res.status(404).send({message: 'no such post found to update'})
        return res.status(200).send({message:"post edited successfully", data: editPost });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const deletePost = async (req, res) => {
    try {
        let data = req.body
        let postId = req.params.postId

        if(Object.keys(data).length==0) return res.status(400).send("please provide userId");

        let { userId,...a} = data;

        if(Object.keys(a).length!=0) return res.status(400).send("only userId is required");

        if (!userId) return res.status(400).send("please provide userId");

        if(!mongoose.isValidObjectId(userId)) return res.status(400).send("invalid userId");
        if(!mongoose.isValidObjectId(postId)) return res.status(400).send("invalid postId");

        if(userId != req.userId) return res.status(403).send({message: 'you are not authorised for this action'})

         let deletedPost = await postModel.findOneAndUpdate({_id:postId,userId:userId,isDeleted:false},{isDeleted:true},{new:true});
         if(!deletedPost) return res.status(404).send({message: 'no such post found to delete'})
        return res.status(200).send({message:"post deleted successfully"});
    } catch (err) {
        res.status(500).send(err.message);
    }
}
module.exports = { createPost, getPost, getAllPost, updatePost, deletePost }
