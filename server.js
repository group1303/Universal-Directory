var express = require('express'),
		app = express(),
		router = express.Router(),
		db = require('./server/firebird'),
		fs = require('fs'),
		_ = require('underscore');

router.use(express.static(__dirname + '/views'));

router.use(function(req, res, next) {
  console.log('%s %s', req.method, req.path);
  next();  
});

/*-----Запросы------*/
var classes = 'SELECT id_class,short_name,name,main_class,base_ei FROM chem_class;',
    products = 'SELECT id_prod,short_name,name,id_CL FROM prod;',
    params = 'SELECT id_par,short_name,name,ei_par,type_par FROM parametr;',
    ei = 'SELECT id_ei,short_name,name,code FROM ei;',
    en = 'SELECT id_enum,short_name,name FROM enum;',
    nav = 'select id_class,main_class,name from chem_class',
    classesImg = 'select id_class, image from chem_class;';
/**
 * query
 * Выполняет запрос к базе данных
 * Затем отправляет запрос в бд и передает данные на сервер в формате JSON
 *
 * @param qrystr Запрос к бд типа string
 * @param res Передача переменной res для отправки данных на клиент
 */
function query(qrystr, res){
	db.queryDB(qrystr, function(data){
		//console.log(data);
		res.setHeader('Content-Type', 'application/json');
		res.send(data);
	});
}
/**
 * queryPr
 * Формирует строку запроса с использованием процедуры и параметров
 * Затем отправляет запрос в бд и передает данные на сервер в формате JSON
 * Использование: queryPar('Название процедуры', '*',''+id+','+name+','+shName+'',res)
 * 
 * @param prName Название процедуры
 * @param select Необходимые поля
 * @param params Параметры для процедуры
 * @param res Передача переменной res для отправки данных на клиент
 */
function queryPr(prName, select, params, res){
		return query('select ' + select + ' from '+ prName + '(' + params + ');',res);
}

function queryBLOB(qrystr, res){
	db.queryBLOB(qrystr, function(data){
		res.setHeader('Content-Type', 'text/plain');
		res.send(data);
	});
}
router.get('/nav', function (req, res, next) {
  query(nav, res);
});

router.get('/classes', function (req, res, next) {
  query(classes, res);
});

router.get('/classesImg', function (req, res, next) {
  queryBLOB(classesImg, res);
});

router.get('/classes:id', function (req, res) {
	queryPr('find_list', '*',req.params.id,res)
});

router.get('/products', function (req, res, next) {
    query(products, res);
});

router.get('/params', function (req, res, next) {
    query(params, res);
});

router.get('/ei', function (req, res, next) {
    query(ei, res);
});

router.get('/en', function (req, res, next) {
    query(en, res);
});

app.use('/', router);
app.listen(8080);

console.log("Сервер стартовал!");