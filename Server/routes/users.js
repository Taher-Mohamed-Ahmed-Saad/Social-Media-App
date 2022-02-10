const router = require('express').Router(); 
const bcrypt = require('bcrypt'); 
const User = require('../models/User');

// update user
router.put('/:id', async (req, res)=>{

    if (req.body.userId == req.params.id || req.body.isAdmin){

        if (req.body.password){

            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password , salt);
            } catch(err){
                res.status(500).json(err);
            }
        }

        try {
            const user = await User.findByIdAndUpdate(req.params.id , {$set : req.body});
            res.status(200).json('updated');
        } catch(err){
            res.status(500).json(err);
        }

    } else {
        res.status(403).json('you can update only your account');
    }
});

// delete user
router.delete('/:id', async (req, res)=>{

    if (req.body.userId == req.params.id || req.body.isAdmin){       

        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json('deleted');
        } catch(err){
            res.status(500).json(err);
        }

    } else {
        res.status(403).json('you can delete only your account');
    }
});

// get a user
router.get('/:id', async (req, res)=>{ 
    try {
        const user = await User.findById(req.params.id);
        !user && res.status(404).json('user not found');
        const {password, createdAt, updatedAt , ...other} = user._doc;            
        res.status(200).json(other);
    } catch(err){
        res.status(500).json(err);
    }
})

// follow a user
router.put('/:id/follow', async (req, res)=>{ 

    if (req.body.userId !== req.params.id ){

        try {          

            const userToFollow = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (!userToFollow.followers.includes(req.body.userId)){
                await userToFollow.updateOne({$push : {followers : req.body.userId}});
                await currentUser.updateOne({$push : {followings : req.params.id}});
                res.status(200).json('you followed this user successfully');
            } else {
                res.status(403).json('you already follow this user');
            }

        } catch(err){
            console.log(err);
            res.status(500).json(err);
        }

    } else {
        res.status(403).json('you can\'t follow yourself');
    } 
})

// unfollow a user
router.put('/:id/unfollow', async (req, res)=>{ 

    if (req.body.userId !== req.params.id ){

        try {         

            const userToUnfollow = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (userToUnfollow.followers.includes(req.body.userId)){
                await userToUnfollow.updateOne({$pull : {followers : req.body.userId}});
                await currentUser.updateOne({$pull : {followings : req.params.id}});
                res.status(200).json('you unfollowed this user successfully');
            } else {
                res.status(403).json('you don\'t follow this user');
            }

        } catch(err){
            console.log(err);
            res.status(500).json(err);
        }

    } else {
        res.status(403).json('you can\'t unfollow yourself');
    } 
})

module.exports = router;