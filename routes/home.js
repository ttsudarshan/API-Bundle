const express = require("express");
const router = express.Router();
const fs = require('fs');
const app = express();

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

router.get("/", (req, res) => {
  fs.readFile(__dirname + '/../public/index.html', 'utf8', (err, text) => {
    res.send(text);
})});

module.exports = router;
