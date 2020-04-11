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