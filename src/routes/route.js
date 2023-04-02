const router = require('express').Router();

const userControllers = require('../controllers/userController');
const postControllers = require('../controllers/postController');
const commentControllers = require('../controllers/commenrtController');
const replyControllers = require('../controllers/replyController');
const auth = require('../midWare/auth')


router.post('/login',userControllers.userLogin);

router.post('/post',auth.authentication, postControllers.createPost);
router.get('/getPost/:postId', postControllers.getPost);
router.get('/getAllPosts', postControllers.getAllPost);
router.put('/editPost/:postId', postControllers.updatePost);
router.delete('/deletePost/:postId', postControllers.deletePost);

router.post('/comment',commentControllers.createComment);
router.get('/getComment/:postId', commentControllers.getComment);
router.get('/getAllComments', commentControllers.getAllComment);
router.put('/editComment/:commentId', commentControllers.updateComment);
router.delete('/deleteComment/:commentId', commentControllers.deleteComment);

router.post('/reply', replyControllers.createReply);
router.get('/getReply', replyControllers.getReply);
router.get('/getAllReply', replyControllers.getAllReply);
router.put('/editReply/:replyId', replyControllers.updateReply);
router.delete('/deleteReply/:replyId', replyControllers.deleteReply);


module.exports = router;