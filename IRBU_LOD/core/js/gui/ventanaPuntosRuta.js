/* 
 * Permite desplegar la venta para buscar la ruta de los buses de la UTPL
 */

var winPuntosRuta;
var grid;
var proxy;
var id_ruta;

Ext.onReady(function(){

    grid = new Ext.grid.GridPanel({
        store: storePuntosRuta,
        columns: [{
            header: 'N\xFAmero',
            width: 30,
            dataIndex: 'numero'
        },{
            header: 'Longitud',
            width: 60,
            dataIndex: 'longitud'
        },{
            header: 'Latitud',
            width: 60,
            dataIndex: 'latitud'
        },{
            xtype: 'actioncolumn',
            width: 15,
            items: [{
                icon   : 'img/delete.png',  // Use a URL in the icon config
                tooltip: 'Eliminar Punto',
                handler: function(grid, rowIndex, colIndex) {
                    var rec = storePuntosRuta.getAt(rowIndex);
                    storePuntosRuta.removeAt(rowIndex);
                    
                    console.info(rec.get('numero'));
                    var puntoBorrar = lienzoRutas.getFeatureById(rec.get('numero'));
                    lienzoRutas.eraseFeatures(puntoBorrar);

                    puntosLineaRuta.splice(rowIndex,1);

                    var ruta = new OpenLayers.Geometry.LineString(puntosLineaRuta);
                    //Estilo de Linea de Recorrido
                    var style = {
                        strokeColor: '#0000ff',
                        strokeOpacity: 0.3,
                        strokeWidth: 5
                    };
                    
                    var lineFeature = lienzoRecorridos.getFeatureById( "trazado" );
                    if (lineFeature != null){
                        lineFeature.destroy();
                    }

                    lineFeature = new OpenLayers.Feature.Vector(ruta, null, style);
                    lineFeature.id = "trazado";
                    lienzoRecorridos.addFeatures([lineFeature]);
                }
            }]
        }],
        viewConfig: {
            forceFit: true
        },
        //renderTo: ,
        //title: 'Simple Ext JS Grid',
        //width: 500,
        autoScroll: true,
        //autoHeight: true,
        frame: true,
        buttons: [{
            text: 'Guardar',
            handler: function() {
                //enviar los datos de la tabla a la base
                guardarPuntosRuta();
            }
        }]
    });

});

/**
 * Permite guardar los puntos que se recolecten para la nueva ruta dentro del
 * servidor...
 */
function guardarPuntosRuta(){
    Ext.Ajax.request({
        url: 'core/php/core/guardarPuntosRuta.php',
        method: 'POST',
        success: function (result) {
            var r = Ext.util.JSON.decode(result.responseText);
            winPuntosRuta.hide();
            reiniciarCapturaNuevaRuta();
            booCapturarPuntosNuevaRuta=false;
        },
        timeout: 1000,
        params: {
            puntos: getJsonOfStore(storePuntosRuta),
            id_ruta: id_ruta
        }
    });
}

var myData = [];

proxy = new Ext.data.MemoryProxy(myData);

/**
 * Campos de la tabla de nueva ruta
 */
var myReader = new Ext.data.ArrayReader({},
    [{
        name: 'numero'
    },{
        name: 'latitud',
        type: 'float'
    },{
        name: 'longitud',
        type: 'float'
    }]);

/**
 * Store para alamcenar los puntos que se van seleccionando para crear una
 * nueva ruta.
 */
storePuntosRuta = new Ext.data.Store({
    autoDestroy: true,
    reader: myReader,
    proxy: proxy,
    autoLoad: true//,
    /*listeners: {
        load: function(obj,records){
            Ext.each(records, function(rec){
                //console.info('Ver:'+rec.get('latitud'));
                });
        }
    }*/
});

/**
 * Limpia la tabla de puntos y el mapa para recibir una nueva ruta
 */
/*function limpiar_tabla_puntos(){
    storePuntosRuta.removeAll();
    limpiarCapas();
}*/

/**
* Muestra la ventana para buscar una ruta
* @return NO retorna valor
*/
function ventanaPuntosRuta(id){
    if(!winPuntosRuta){
        winPuntosRuta = new Ext.Window({
            layout:'fit',
            title:'Nueva Ruta',
            resizable : true,
            width:350,
            height:300,
            closeAction:'hide',
            plain: false,
            items: [grid]
        });
    }
    this.id_ruta = id;
    booCapturarPuntosNuevaRuta=true;
    reiniciarCapturaNuevaRuta();
    winPuntosRuta.show(this);
}
