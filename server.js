var express = require('express'),
		app = express(),
		db = require('./server/firebird'),
		fs = require('fs');

app.use(express.static(__dirname + '/views'));

//var items = db.GetQuery('select * from chem_class');
var items = db.queryDB('select * from chem_class');

app.get('/api', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send('My items: %j', items);
});


app.listen(8080);

console.log("Сервер стартовал!");


