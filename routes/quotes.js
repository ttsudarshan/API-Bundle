const express = require("express");
const router = express.Router();
require('dotenv').config();
const mysql = require('mysql');

//Database  Connection
const connection = mysql.createConnection({
    host:       process.env.DB_HOST,
    user:       process.env.DB_USERNAME,
    database:   process.env.DB_NAME,
    password:   process.env.DB_PASSWORD,
    port:       process.env.DB_PORT
});

connection.connect((err, result)=>{
    if(err) throw err;
    console.log('Connected to the database!');
})

router.get('/', async (req, res) => {
    const sql = 'SELECT * FROM `quotes` ORDER BY RAND() LIMIT 1;'
    connection.query(sql, (err,  result)=>{
        if(err){
            console.log('Error', err);
            res.status(500).json({ error: 'Failed to fetch random quote' });
        } else {
            res.json(result[0]);
            console.log('Sent', result)
        }
    });
});

module.exports = router;