const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth, async (req,res) => {
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        const taskRes = await task.save()
        res.status(201).send(taskRes)
    } catch (e) {
        res.status(400).send(e)
    }
})

//GET /tasks?completed=true
router.get('/tasks', auth, async (req,res) => {
    const match = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match
        }).execPopulate()
        const tasks = req.user.tasks
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner:req.user._id })
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        const _id = req.params.id
        const task = await Task.findOne({ _id, owner:req.user._id})
        
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save() 
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOneAndDelete({ _id, owner:req.user._id })

        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router