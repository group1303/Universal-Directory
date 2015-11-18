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
    queryDB: function(qrystr, params){

            var CFG = LoadConfig();
            var data = [];

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
                        database.execute(qrystr, [params], function (err, results, fields) {
                                //database.execute(qrystr, function (err, results, fields) {
                                //res2arr(results, fields, data);
                                wrapJson(results, fields, data);
                            },
                            logerror);
                    }
                }
            );
    return data;
    },

};