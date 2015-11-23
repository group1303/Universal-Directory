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
    //nav = 'select cc.id_class as "id",cc.main_class as "parentId",cc.name as "text",case gg.OTERM when 0 then \'true\' else \'false\' end as "expanded" from chem_class cc, (select * from find_gr_gr(2)) gg where cc.id_class = gg.oidgr';
    //nav = 'select id_class as "id",main_class as "parentId",name as "text" from chem_class',
    nav = 'select id_class,main_class,name from chem_class';
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
 * Использование: queryPar('Название процедуры', ''+id+','+name+','+shName+'',res)
 * 
 * @param prName Название процедуры
 * @param params Параметры для процедуры
 * @param res Передача переменной res для отправки данных на клиент
 */
function queryPr(prName, params,res){
		return query('select * from '+ prName + '(' + params + ');',res);
}

router.get('/nav', function (req, res, next) {
  query(nav, res);
});

router.get('/classes', function (req, res, next) {
  query(classes, res);
});


router.get('/classes:id', function (req, res) {
	queryPr('find_list',req.params.id,res)
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