const router = require('express').Router(); 
const Post = require('../models/Post');
const User = require('../models/User');

// create post
router.post('/', async (req, res)=>{
    const newPost  = new Post(req.body);
    try{
        const result  = await newPost.save();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

// update post
router.put('/:id', async (req, res)=>{

    try{
        const post  = await Post.findById(req.params.id);
        if (post.userId === req.body.userId){
            const newPost = await post.updateOne({$set: req.body});
            res.status(200).json('updated');
        } else {
            res.status(403).json('you can only edit your posts');
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// delete post
router.delete('/:id', async (req, res)=>{

    try{
        const post  = await Post.findById(req.params.id);
        if (post.userId === req.body.userId){
            await post.deleteOne();
            res.status(200).json('deleted');
        } else {
            res.status(403).json('you can only delete your posts');
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// like / dislike post
router.put('/:id/like', async (req, res)=>{
    try{
        const post  = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)){
            await post.updateOne({$push: {likes : req.body.userId}});
            res.status(200).json('liked');
        } else {
            await post.updateOne({$pull: {likes : req.body.userId}});
            res.status(200).json('disliked');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// get timeline posts
router.get('/timeline', async (req, res)=>{

    try{
        const currUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId :req.body.userId });
        const friendsPost = await Promise.all( 
            currUser.followings.map((friendId)=>{
                return Post.find({userId :friendId });
            })
        );
        res.status(200).json(userPosts.concat(...friendsPost));       
    
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// get post
router.get('/:id', async (req, res)=>{

    try{
        const post  = await Post.findById(req.params.id);        
        res.status(200).json(post);      
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;