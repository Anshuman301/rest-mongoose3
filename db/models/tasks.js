const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    isCompleted:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Users'
    },
},{
    timestamps:true
})

const Tasks = mongoose.model('Tasks',taskSchema)

module.exports = Tasks