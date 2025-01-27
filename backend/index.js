const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const authRouter = require('./controller/authRouter.js'); // Ensure the file name matches exactly
const userRouter = require('./controller/userRouter.js');

// const UserModel = require('./models/UserModel.js');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Mount routers
app.use('/auth', authRouter);
app.use('/users', userRouter);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));