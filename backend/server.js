
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const userRouter = require('./routes/user.routes');

const app = express();

app.use(express.json());

app.use(cors());

app.use(session({
    secret: 'dont-steal-plz',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 360000000,
    },
}));

app.use('/users', userRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});