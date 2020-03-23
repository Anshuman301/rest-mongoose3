require('./db/connection')
const express = require('express')
const userRouter = require('./routers/user.routers')
const taskRouter = require('./routers/task.routers')
const app = express();
app.use(express.json())
app.use(userRouter);
app.use(taskRouter);
const port = process.env.PORT || 3000
app.listen(port);

// const Tasks = require('./db/models/tasks')
// const Users = require('./db/models/users')
// const myFunction = async() =>{
//     // const task = await Tasks.findById('5e78fb78bc0fe61668dc1c16')
//     // await task.populate('owner').execPopulate()
//     // console.log(task)

//     const user = await Users.findById('5e78d7139290870e281b04c9')
//     await user.populate('tasks').execPopulate()
//     console.log(user)
// }
// myFunction()