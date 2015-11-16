var express = require('express'),
		app = express(),
		db = require('./server/queries'),
		fs = require('fs');

app.use(express.static(__dirname + '/views'));

app.get('/classes', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(db.classesData);
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