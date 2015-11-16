var db = require("./firebird"),

    classes = 'SELECT id_class,short_name,name,main_class,base_ei FROM chem_class;',
    products = 'SELECT id_prod,short_name,name,id_CL FROM prod;',
    params = 'SELECT id_par,short_name,name,ei_par,type_par FROM parametr;',
    ei = 'SELECT id_ei,short_name,name,code FROM ei;',
    en = 'SELECT id_enum,short_name,name FROM enum;';

module.exports.classesData = db.queryDB(classes),
module.exports.productsData = db.queryDB(products),
module.exports.paramsData = db.queryDB(params),
module.exports.eiData = db.queryDB(ei),
module.exports.enData = db.queryDB(en);