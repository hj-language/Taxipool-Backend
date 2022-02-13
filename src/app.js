const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const config = require('./config')

let port = 3000;
app.use(bodyParser.urlencoded({extended: false}));

app.set('jwt-secet', config.secret)
<<<<<<< Updated upstream:src/app.js
app.use(express.json());

app.get('/', function(req, res) {
    res.send('Test Server');
});

const router = require('./api/index.js');
app.use('/api', router);

app.listen(port, function() {
    console.log(`Server is running on port - ${port}`);
});
=======
const mysql = require('mysql');
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '860925',
    database: 'taxipool_db'
});



>>>>>>> Stashed changes:app.js
