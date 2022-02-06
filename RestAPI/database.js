const { Client } = require('pg');
const client = new Client({
    user: "nodeapi",
    password: "dhaka1212",
    database: "todoapi",
    host: "localhost",
    port: 5432
})
client.connect()
async function findUser(username) {
    const SQLquery = `select * from users where username = '${username}'`;
    console.log(SQLquery)
    try {
        const res = await client.query(SQLquery)
        return (res.rows);
    } catch (error) {
        console.error(error);
        return;
    }
}

async function testConnection() {
    const SQLquery = `select * from users;`;
    try {
        const res = await client.query(SQLquery)
        console.log(res.rows);
    } catch (error) {
        console.error(error);
    }
}
async function createUser(username, password, email) {
    const SQLquery = `insert into users(username, pass, email) values('${username}', '${password}', '${email}');`;
    console.log(SQLquery)
    try {
        const res = await client.query(SQLquery)
        return (res.rows);
    } catch (error) {
        console.error(error);
        return;
    }
}
async function verifyUser(username, password) {
    const SQLquery = `select * from users where username = '${username}' and pass = '${password}'
    `;
    console.log(SQLquery)
    try {
        const res = await client.query(SQLquery)
        return (res.rows);
    } catch (error) {
        console.error(error);
        return;
    }
}
async function createTodo(title, userid, status) {
    const SQLquery = `insert into todolist(title, userid, status) values('${title}', ${userid}, '${status}');`;
    console.log(SQLquery)
    try {
        const res = await client.query(SQLquery)
        return (res.rows);
    } catch (error) {
        console.error(error);
        return;
    }
}

async function getTodo(userid) {
    const SQLquery = `select * from todolist where userid = '${userid}';`;
    console.log(SQLquery)
    try {
        const res = await client.query(SQLquery)
        return (res.rows);
    } catch (error) {
        console.error(error);
        return;
    }
}

async function deleteTodo(todoid){
    const SQLquery = `delete from todolist where todoid = ${todoid};`;
    console.log(SQLquery)
    try {
        const res = await client.query(SQLquery)
        return (res.rows);
    } catch (error) {
        console.error(error);
        return;
    }
}

module.exports = {
    testConnection,
    findUser,
    createUser,
    verifyUser,
    createTodo,
    getTodo,
    deleteTodo
}
