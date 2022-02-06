const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const bodyparser = require('body-parser');
const app = express()
const database = require('./database');
const { request } = require('express');
database.testConnection();
app.use(express.json());
app.use(cors({
    origin: '*'
}))
//get request
app.get('/', verifyToken, (req, res) => {
    const obj = {
        Country: "USA",
        Food: "Rice"
    }
    res.json(obj);
})
//post request
app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username === undefined || password === undefined) {
        res.json({ message: 'NO Username or Password was given' })
    }
    //TODO: We need to verify the username and password from database
    let result = await database.verifyUser(username, password);
    if (result.length === 0) {
        res.json({ message: 'Wrong Password or Username' })
        return;
    }

    console.log(result);

    const payload = {
        username: username,
        userid: result[0].userid
    }
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
    res.json({ token: token })

})

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Here')
    if (token == null) {
        res.json({ message: "Token Was Not Given" });
        return
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            res.json({ message: "Invalid Token" });
            return
        }
        req.user = payload;
        console.log(payload);
        next();
    })

}
app.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    if (username === undefined || password === undefined || email === undefined) {
        res.json({ message: 'Username, Password or email was not given' })
    }
    let result = await (database.findUser(username));
    if (result.length !== 0) {
        res.json({ message: 'Username Already Taken' })
        return;
    }
    result = await database.createUser(username, password, email);

    console.log(username, password);
    console.log(result);
    res.json({ message: "Successfully Registered, Please Login to Continue" })

})

app.post('/createTodo', verifyToken, async (req, res) => {
    const title = req.body.title;
    let result = await database.createTodo(title, req.user.userid, 'Incomplete');
    console.log(result);
    res.json({ message: "Todo successfully added" })
})

app.get('/getTodos', verifyToken, async (req, res) => {
    let result = await database.getTodo(req.user.userid);
    console.log(result);
    res.json({ result: result })
})

app.get('/deleteTodo/:todoid', verifyToken, async (req, res) => {
    const todoid = req.params.todoid;
    let result = await database.deleteTodo(todoid);
    console.log(result);
    res.json({ message: "Successfully Deleted" })
})

app.listen(3000)
