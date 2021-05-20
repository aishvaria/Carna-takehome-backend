const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserGroup } = require('../models/user-groups');

router.get(`/`, async (req, res) =>{
    const userGroupList = await UserGroup.find();

    if(!userGroupList) {
        res.status(500).json({success: false})
    } 
    res.send(userGroupList);
})

router.get('/:id', async(req,res)=>{
    const userGroupList = await UserGroup.findById(req.params.id).populate('users.user');

    if(!userGroupList) {
        res.status(500).json({message: 'The user with the given ID was not found.'})
    } 
    res.status(200).send(userGroupList);
})

router.post('/', async (req,res)=>{

    let userGroup = new UserGroup({
        name: req.body.name
    })
    userGroup = await userGroup.save();
    res.send(userGroup);
})

router.post('/group/:groupId/user/:userId', async (req,res)=>{
    const user = await User.findById(req.params.userId).select('-passwordHash');

    if(!user)
    return res.status(400).send('The user does not exists!')

    const userGroup = await UserGroup.findByIdAndUpdate(
        req.params.groupId,
        { $push: { "users": user }},
        { safe: true, upsert: true, new: true}
    )

    res.send(userGroup);
})


router.delete('/:id', (req, res)=>{
    UserGroup.findByIdAndRemove(req.params.id).then(userGroup =>{
        if(userGroup) {
            return res.status(200).json({success: true, message: 'the user-group is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user-group not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

module.exports =router;