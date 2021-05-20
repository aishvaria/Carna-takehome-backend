const {Course} = require('../models/course');
const {Content} = require('../models/content');
const {ContentSchema} = require('../models/content');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const categoryList = await Category.find();

    if(!categoryList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(categoryList);
})

router.get('/:id', async (req, res) =>{
    const course = await Course.findById(req.params.id)
    if(!course) {
        res.status(500).json({success: false, message:"Course was not found"})
    } 
    const contents = course.contents;
    res.status(200).send(contents);
})

router.post('/:id', async (req, res) => {
    let content = new Content({
        title:req.body.title,
        description:req.body.description
    })
    content = await content.save();
    
    if(!content)
    return  res.status(404).send('The content cannot be created');
    
    const course = await Course.findByIdAndUpdate(
        req.params.id,
        { $push: { "content": content }},
        { safe: true, upsert: true, new: true}
    )
    
    if(!course)
    return res.status(400).send('the course cannot be update!')
    res.send(course);
})


router.put('/:id', async (req, res) =>{
    const content = await Content.findByIdAndUpdate(
        req.params.id,
        {
            title:req.body.title,
            description:req.body.description
        },
        {new:true}
    )

    if(!content)
    return  res.status(404).send('The content cannot be updated');

    res.send(content);
})

router.delete('/:id', (req, res) =>{

    Content.findByIdAndRemove(req.params.id)
    .then(content =>{
        if(content){
            return res.status(200).json({
                success: true,
                message:"the content is deleted"
            })
        }else{
            return res.status(404).json({
                success: false,
                message:"content not found"
            })
        }
    }).catch(err => {
        return res.status(400).json({
            success: false,
            error:err
        })
    })

})



module.exports =router;