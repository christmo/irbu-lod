/* 
 * Funciones utilitarias para utilizarlas en el proyecto
 */


/**
 * Convierte en json lo que este almacenado en un store
 */
function getJsonOfStore(store){
    var datar = new Array();
    var jsonDataEncode = "";
    var records = store.getRange();
    for (var i = 0; i < records.length; i++) {
        datar.push(records[i].data);
    }
    jsonDataEncode = Ext.util.JSON.encode(datar);

    return jsonDataEncode;
}