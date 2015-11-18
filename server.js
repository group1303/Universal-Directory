var express = require('express'),
		app = express(),
		db = require('./server/queries'),
		qu = require('./server/firebird'),
		fs = require('fs');

app.use(express.static(__dirname + '/views'));

app.get('/nav', function (req, res) {
    res.send(db.navData);
});

app.get('/classes', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(db.classesData);
});

app.get('/classes:id', function (req, res) {
		console.log("1 ",req.params.id);
		console.log("2 ",req.params);
   	var findList = qu.queryDB('select * from find_list(?)',[req.params.id]);
    console.log(findList);
    res.setHeader('Content-Type', 'application/json');
    res.send(findList);
});

app.get('/products', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(db.productsData);
});

app.get('/params', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(db.paramsData);
});

app.get('/ei', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(db.eiData);
});

app.get('/en', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(db.enData);
});

app.listen(8080);

console.log("Сервер стартовал!");