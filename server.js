var express = require('express'),
    app = express(),
    router = express.Router(),
    db = require('./server/firebird'),
    fs = require('fs'),
    _ = require('underscore');

router.use(express.static(__dirname + '/views'));

router.use(function (req, res, next) {
    console.log('%s %s', req.method, req.path);
    next();
});

/*-----Запросы------*/
var classes = 'SELECT id_class,short_name,name,main_class,base_ei FROM chem_class;',
    products = 'SELECT p.id_prod,p.short_name,p.name,cc.name as class_name FROM prod p, chem_class cc where p.id_CL=cc.id_class;',
    params = 'SELECT id_par,short_name,name,ei_par,type_par FROM parametr;',
    ei = 'SELECT id_ei,short_name,name,code FROM ei;',
    en = 'SELECT id_enum,short_name,name FROM enum;',
    nav = 'select id_class,main_class,name from chem_class',
    prodImg = 'select id_prod as id, image from prod where id_prod=',
    classImg = 'select id_class as id, image from chem_class where id_class=';
     
/**
 * query
 * Выполняет запрос к базе данных
 * Затем отправляет запрос в бд и передает данные на сервер в формате JSON
 *
 * @param qrystr Запрос к бд типа string
 * @param res Передача переменной res для отправки данных на клиент
 */
function query(qrystr, res) {

    db.queryDB(qrystr, function (data) {
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
function queryPr(prName, select, params, res) {
    return query('select ' + select + ' from ' + prName + '(' + params + ');', res);
}
function getFindList(id, res) {
    var str1 = 'select * from find_list(' + id + ');';
    var arrProdPars = [], prodParams = [];
    db.queryDB(str1, function (dataOne) {
        dataOne.forEach(function (item, i, arr) {
            var str2 = 'select * from find_par_prod(' + item.OIDEL + ');';
            var productName = item.ONAME;
            var productID = item.OIDEL;
            var productClassName = item.ONAMECLASS;
            var productImage = '';
          	db.queryBLOBasync(prodImg + productID, function (data) {
            	ok = data;
			        if (ok == "0" || undefined) {
			            productImage = img;
			        }
			        else {
			            productImage = data;
			        }
            	getParams();
          	});
          	function getParams(){
          		setTimeout(function () {
	          		db.queryDB(str2, function (dataTwo) {
	          				dataTwo.forEach(function (item, i, arr) {
	                  	var idPar = item.OIDPAR;
		                  var valuePar = item.OVAL;
		                  var namePar = item.ONAME;
		                  var shortNamePar = item.OSHNAME;
		                  prodParams.push({idPar, valuePar, namePar, shortNamePar});
	                });
                	arrProdPars.push([{productID, productName, productClassName, productImage, prodParams}]);
                	prodParams = [];
	            	});
            	},5);
          	}
        });
        setTimeout(function () {
            //console.log(arrProdPars[0].prodParams);
            res.setHeader('Content-Type', 'application/json');
            res.send(arrProdPars);
        }, 150);
    });
};

function getImage(qrystr, id, res) {
    //res.setHeader('Content-Type', 'text/plain');
    db.queryBLOBasync(qrystr + id, function (data) {
        ok = data;
        if (ok == "0" || undefined) {
            res.send(img);
        }
        else {
            res.send(data);
        }
    });
}

router.get('/nav', function (req, res, next) {
    query(nav, res);
});

router.get('/classes', function (req, res, next) {
    query(classes, res);
});

router.get('/getClasses:id', function (req, res, next) {
    query("select id_class,name,main_class,\'\' as image from chem_class where main_class=" + req.params.id, res);
});

router.get('/prodImg:id', function (req, res, next) {
    getImage(prodImg, req.params.id, res);
});

router.get('/classImg:id', function (req, res, next) {
    getImage(classImg, req.params.id, res);
});

router.get('/getProds:id', function (req, res) {
    getFindList(req.params.id, res);
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
router.get('/pars:id', function (req, res, next) {
    queryPr('find_par_class', '*', req.params.id, res)
});
app.use('/', router);
app.listen(8080);

console.log("Сервер стартовал!");

var img = "data:image/jpeg;base64,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rmm4C3hnjH8FwN4/Pr+tAHtNFcTpPxLsLorHqUL2jnjevzp/iP1rsba6gvIFmtZkmibo6MCDQBLRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAZusa/p+hQ+ZfThWIysS8u/0H9elea678QNR1MtFZE2VsePkP7xh7t2/D9a5vUJpbjULiSeRpJGkOWc5J5qtQApJYksSSeST3pK2tK8JaxrGGt7RkiP/AC1m+Rf15P4ZrstO+F9tGA2pXjyt/chG1fzOSf0oA8zqza6be3v/AB6Wk8//AFzjLfyr2ux8MaNp2DbafAGHR3Xe35nJrVAAGAMAdqAPFYPBHiCfG3TnUHvI6rj8zmr0fw31xx832ZPZpf8AAGvXKKAPKF+GOskZNxYr7GR//iaafhprYBIe0PsJDz/47XrNFAHjk3w+8QRZ22qS4/uTL/Uis658M61af67TLkAd1jLD8xmvdKKAPnd0aNyrqVYdQRgikr6CubK1vU2XdtFOvpIgb+dc7qHw90S9y0MUlpIe8Lcfkcj8sUAeP1d03V77SJ/NsLl4W7gHhvqOhrpdU+G2p2gL2Mkd6g/hHyP+R4/WuSubWezmMN1DJDKOqSKVP60Aem+H/iNa3pWDV1W1mPAmH+rb6/3f5V2ysGUMpBUjII6GvnevVfhlNJJoNwskjMsdwVQMc7RtBwPSgDtKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAPIdM8DanrN1JLIv2S1LkiSUcsM/wr1P6Cu/0fwZpGj4dIPtE4/5az4Yj6DoK36KACiiigAooooAKKKKACiiigAooooAKKKKACq1/ptnqcHk31tHPH2DjOPoeo/CrNFAHnet/DMHdLos+O/kTH+Tf4/nWt8PdPutN0u8t72B4JRck7XHUbV5HqK66igAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==";