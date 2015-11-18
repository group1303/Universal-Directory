var db = require("./firebird"),

    classes = 'SELECT id_class,short_name,name,main_class,base_ei FROM chem_class;',
    products = 'SELECT id_prod,short_name,name,id_CL FROM prod;',
    params = 'SELECT id_par,short_name,name,ei_par,type_par FROM parametr;',
    ei = 'SELECT id_ei,short_name,name,code FROM ei;',
    en = 'SELECT id_enum,short_name,name FROM enum;',
    //nav = 'select cc.id_class as "id",cc.main_class as "parentId",cc.name as "text",case gg.OTERM when 0 then \'true\' else \'false\' end as "expanded" from chem_class cc, (select * from find_gr_gr(2)) gg where cc.id_class = gg.oidgr';
    //nav = 'select id_class as "id",main_class as "parentId",name as "text" from chem_class',
    nav = 'select id_class,main_class,name from chem_class';

module.exports.classesData = db.queryDB(classes,[]),
module.exports.productsData = db.queryDB(products,[]),
module.exports.paramsData = db.queryDB(params,[]),
module.exports.eiData = db.queryDB(ei,[]),
module.exports.enData = db.queryDB(en,[]),
module.exports.navData = db.queryDB(nav,[]);