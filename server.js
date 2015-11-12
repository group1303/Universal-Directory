var express = require('express'),
		app = express(),
		db = require('./server/firebird'),
		fs = require('fs');

app.use(express.static(__dirname + '/views'));

var classes = db.queryDB('select * from chem_class');

app.get('/classes', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(classes);
});


app.listen(8080);

console.log("Сервер стартовал!");


