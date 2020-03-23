const express = require('express')
const Users = require('../db/models/users');
const auth = require('../middleware/auth');
const router = new express.Router()
router.post('/users', async (req, res) => {
    const user = new Users(req.body)
    try {
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.post('/users/login',async(req,res) => {
    try {
        const user = await Users.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({user,token})
    }catch(e){
        res.status(400).send(e.message)
    }
})
router.get('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(e.message)
    }
})
router.get('/users/me', auth, async (req, res) => {
    res.status(200).send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const allowedUpdates = ['name','age','email','password']
    const keys = Object.keys(req.body)
    const isUpdationValid = keys.every(key => allowedUpdates.includes(key))
    if(!isUpdationValid)
     res.status(400).send()
    try {
        keys.forEach(update => req.user[update] = req.body[update])
        await req.user.save();
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/users/me', auth,async (req, res) => {
    try {
        await req.user.remove();
        res.status(200).send()
    } catch (e) {
        res.status(400).send()
    }
})


module.exports = router