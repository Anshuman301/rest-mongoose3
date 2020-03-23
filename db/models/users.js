const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Tasks = require('./tasks');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        required:true,
        validate(value){
            if(value < 0){
                throw new Error('Age must be positive number')
            }
        },
        default:0
    },
    email:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is in valid')
            }
        },
        trim: true
    },
    password:{
        type:String,
        required:true,
        minlength:5
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.virtual('tasks',{
    ref:'Tasks',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON = function () {
    const user = this.toObject()
    delete user.password
    delete user.tokens
    return user;
}
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = await jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}
userSchema.statics.findByCredentials = async (email, password) => {
    try {
        const user = await Users.findOne({ email })
        if (!user)
            throw new Error()
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            throw new Error()
        return user;
    } catch (e) {
        return "Unable to login"
    }
}
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

userSchema.pre('remove',async function(next){
    const user = this
    await Tasks.remove({owner:require.user._id})
    next();
})
const Users =  mongoose.model('Users',userSchema)

module.exports = Users