var FBconnect
	, _ = require('underscore')
	, fs = require('fs')
	, fb = require('node-firebird');

var fbconnect;

var CFG = LoadConfig();
fb.attach(
	{
		host: CFG.host, database: CFG.database, user: CFG.user, password: CFG.password
	},
	function (err, db) {
		if (err) {
			console.log(err.message);
		} else {
			database = db;
		 //   return database;
			console.log("\nСоединение с базой установленно");
		}
	}

);
function LoadConfig() {
	  var cfg = {};
	try {
		fs.statSync(__dirname + '/cfg.json');
		var sCfg = fs.readFileSync(__dirname + '/cfg.json', 'utf8');
		cfg = JSON.parse(sCfg);
		//console.log('CFG ', __dirname);
	}
	catch (e) {
		console.log("Error loading config " + e.message)
	}
	return cfg;
};

function logerror(err) {
	console.log(err.message);
}

function toObject(results, fields, data)
{
	var tloop = fields;
	var ftype = [];
	_.each(tloop, function (metadesc, key)
	{
		fields[key] = metadesc.alias;
		ftype[key] = metadesc.type;
	});
	
	var maxCols = fields.length - 1;
	var holdrow = '';
	var fieldtype = '';
	var fieldname = '';
	var value = '';
	_.each(_.toArray(results), function (humheader, keyheader)
	{
		holdrow = '';
		_.each(fields, function (num, key)
		{
			// for json and ngrid let get rid of spaces
			fieldname = fields[key];
			fieldtype = ftype[key];
			fieldname = fieldname.replace(/ /gi, "");// golabal replace flag gi str.replace(/<br>/gi,'\r');
			value = humheader[key];
			if(key == 0)
			{
				holdrow += '{';
			}
				 
			holdrow += fieldname + ': ';
			
			if(fieldtype === 448)
				holdrow += '"' + value + '",';
			else
				holdrow += value + ',';

			if(key == maxCols)
			{
				holdrow += '}';
			}
		});
		// jsondata[keyheader] = JSON.parse(holdrow);
		data[keyheader] = holdrow;
	});
	return data;
}

function wrapJson(results, fields, jsondata) {
var tloop = fields;
var ftype = '';
_.each(tloop, function (metadesc, key) {
		fields[key] = metadesc.alias;
		ftype[key] = metadesc.type;
		   //console.log(fields[key], ' :', metadesc, key)
	}
);
// console.log('wrapJson ', fields)
var maxCols = fields.length - 1;
var holdrow = '';
var fieldtype = '';
var fieldname = '';
var value = '';
_.each(_.toArray(results), function (humheader, keyheader) {
		holdrow = '';
		_.each(fields, function (num, key) {
				// for json and ngrid let get rid of spaces
				fieldname = fields[key];
				fieldtype = ftype[key];
				fieldname = fieldname.replace(/ /gi, "");// golabal replace flag gi str.replace(/<br>/gi,'\r');
				value = humheader[key];
				if (key == 0) {
					holdrow += '{"' + fieldname + '":"' + value + '",';
				}
				else if (key == maxCols) {
					holdrow += '"' + fieldname + '":"' + value + '"}';

				} else {
					if (fieldtype === 496) {
						// send integer #
						holdrow += '"' + fieldname + '":' + value + ',';
					}
					else {
						holdrow += '"' + fieldname + '":"' + value + '",';
					  }
				}
			}
		);
		jsondata[keyheader] = JSON.parse(holdrow);
	}
);
return jsondata;
}
module.exports = {
	wrapJson: function (results, fields, jsondata) {
		wrapJson(results, fields, jsondata)
		return jsondata;
	},
	// i think once we define database
	  database: function() {
		  var CFGs = LoadConfig();
		  console.log('JJ cfg',CFGs)
			fb.attachOrCreate(
				{
					host: CFG.host, database: CFG.database, user: CFG.user, password: CFG.password
				},
				function (err, db) {
					if (err) {
						console.log(err.message);
					} else {
						database = db;
						//return database
					   //console.log("\n Соединение с базой установленно");
					}
				}
			);

			return database;
	  },
	queryDB: function(qrystr, callback){

			var CFG = LoadConfig();
			var data = [];

			fb.attachOrCreate(
				{
					host: CFG.host, database: CFG.database, user: CFG.user, password: CFG.password
				},
				function (err, db) {
					if (err) {
						return callback(err.message);
					} else {
						database = db;
						//return database
						//console.log("\n Соединение с базой установленно");
						database.execute(qrystr, function (err, results, fields) {
						  //database.execute(qrystr, function (err, results, fields) {
						  wrapJson(results, fields, data);
						  callback(data);
						});
					}
				}
			);
	},

	queryBLOB: function(qrystr, callback){

			var CFG = LoadConfig(),
				blobData = [],
				base64 = '';

			fb.attachOrCreate(
				{
					host: CFG.host, database: CFG.database, user: CFG.user, password: CFG.password
				},
				function (err, db) {
					if (err) {
					  return callback(err.message);
					} else {
					  database = db;
					  database.query(qrystr, function (err, res){
						 res.forEach(function(item,i,arr){
							//console.log("length of blobData",blobData.length);

								item.image(function(err,name,e){

								});
							
						});//forEach
						setTimeout(function () {
							db.detach();
							callback(blobData);
						}, 2000);
					  });//database.query
					}
				  }
				)},
			queryBLOBasync: function(qrystr, callback){

			var CFG = LoadConfig(),
				blobData = [],
				base64 = '',
				img64;

			fb.attachOrCreate(
				{
					host: CFG.host, database: CFG.database, user: CFG.user, password: CFG.password
				},
				function (err, db) {
					if (err) {
					  return callback(err.message);
					} else {
					  database = db;
					  database.query(qrystr, function (err, res){
					  	//console.log(res);
							res[0].IMAGE(function(err,name,e){
								if (err) throw err;

								var pId = res[0].id;
						  	e.on('data', function(chunk){
						  		//console.log("считываю чанки");
									base64 += chunk;
						  	});
							  e.on('end', function (){
							  	//console.log("записываю чанки");
									var img64 = new Buffer(base64, 'binary').toString('utf8');
									//blobData.push({pId, img64});
									db.detach();
									callback(img64);
							  }); 
							});
						});
				  }
				});
			},
					  
	// queryBLOB: function(qrystr, callback){
	//   var CFG = LoadConfig(),
	//     blobData = [],
	//     counter = 0,
	//     base64 = '',
	//     tmpId = 0;
	//   fb.attachOrCreate({host: CFG.host, database: CFG.database, user: CFG.user, password: CFG.password},
	//     function (err, db) {
	//       if (err) {
	//         return callback(err.message);
	//       } else {
	//         database = db;
	//         database.query(qrystr, function (err, res){
	//           //console.log(res);
	//           res[0].image(function(err,name,e){
	//             //console.log(e.on);
	//             e.on('data', function(chunk){
	//               base64 += chunk;
	//             });
	//             e.on('end', function (){
	//               var buff = new Buffer(base64, 'binary').toString('utf8');
	//               callback(buff);
	//               db.detach();
	//             });
	//           });
	//         });
	//       }
	//     }
	//   );
	// },

	transactionDB: function(qrystr,callback){
	  var CFG = LoadConfig(),
		  jsondata = [];

	  fb.attachOrCreate({
		host: CFG.host, 
		database: CFG.database, 
		user: CFG.user, 
		password: CFG.password
	  },
	  
		function (err, db){
		  if (err){
			  console.log(err.message);
		  }
		  else{
			db.transaction(fb.ISOLATION_READ_COMMITED,
			  function (err, transaction){
				transaction.execute(qrystr, function(err, results, fields){
					if (err){
					  transaction.rollback();
					  logerror(err);
					  return;
					} else {
						wrapJson(results, fields, jsondata);
						transaction.commit(function(err){
						  if (err){
							transaction.rollback();
							logerror(err);}
						  else{
							callback(jsondata);
							db.detach();
						  }
						});
					}
				  });
			  });
			}
		});
	}

};