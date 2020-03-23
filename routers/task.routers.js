const express = require('express')
const Tasks = require('../db/models/tasks');
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks',auth,async (req,res) =>{
    const task = new Tasks({...req.body,owner:req.user._id})
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(500).send(e.message)
    }
})

router.get('/tasks',auth,async (req,res) => {
    try {
        const tasks = await Tasks.find({owner:req.user._id})
        if(!tasks)
       return  res.status(404).send()
        res.status(200).send(tasks)
    }catch(e) {
        res.status(400).send(e.message)
    }
})

router.get('/tasks/:id',auth,async (req,res) => {
    try {
        const task = await Tasks.findByOne({_id:req.params.id,owner:req.user._id})
        if (!task)
           return  res.status(404).send()
        res.status(200).send(task)
    }catch(e){
        res.status(400).send()
    }
})

router.patch('/tasks/:id',auth,async (req,res) => {
    const allowedUpdates = ['name','isCompleted']
    const keys = Object.keys(req.body);
    const isUpdationValid = keys.every(key => allowedUpdates.includes(key))
    if(!isUpdationValid)
    res.status(400).send()
    try {
        const task = await Tasks.findByOne({_id:req.params.id,owner:req.user._id})
        if(!task)
           return res.status(404).send()
        res.status(200).send(task)
    }catch(e){
        res.status(400).send()
    }
})

router.delete('/tasks/:id',auth,async (req,res) =>{
    try{
        const task = await Tasks.findByOne({ _id: req.params.id, owner: req.user._id })
        if (!task)
          return res.status(404).send()
        res.status(200).send(task)

    }catch(e){
        res.status(400).send()
    }
})
module.exports = router
