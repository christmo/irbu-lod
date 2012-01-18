/* 
 * Permite desplegar la venta para buscar la ruta de los buses de la UTPL
 */

var winPuntosRuta;
var grid;
var proxy;
var id_ruta;
var storePuntosRuta;

Ext.onReady(function(){

    storePuntosRuta = new Ext.data.JsonStore({
        autoDestroy : true,
        root        : 'puntos',
        url         : "core/php/gui/getPuntosRuta.php",
        fields      : [{
            name: 'numero'
        },{
            name: 'latitud',
            type: 'float'
        },{
            name: 'longitud',
            type: 'float'
        }],
        timeout : 1000,
        params: {
            id_ruta : id_ruta
        },
        failure: function (form, action) {
            Ext.MessageBox.show({
                title   : 'Error...',
                msg     : 'Precione F5 para actualizar la p\xE1gina...',
                buttons : Ext.MessageBox.OK,
                icon    : Ext.MessageBox.ERROR
            });
        }
    });

    grid = new Ext.grid.GridPanel({
        store: storePuntosRuta,
        columns: [{
            header      : 'N\xFAmero',
            width       : 30,
            dataIndex   : 'numero'
        },{
            header      : 'Latitud',
            width       : 60,
            dataIndex   : 'latitud'
        },{
            header      : 'Longitud',
            width       : 60,
            dataIndex   : 'longitud'
        },{
            xtype: 'actioncolumn',
            width: 15,
            items: [{
                icon   : 'img/delete.png',  // Use a URL in the icon config
                tooltip: 'Eliminar Punto',
                handler: function(grid, rowIndex, colIndex) {
                    var rec = storePuntosRuta.getAt(rowIndex);
                    storePuntosRuta.removeAt(rowIndex);
                    
                    var puntoBorrar = lienzoRutas.getFeatureById(rec.get('numero'));
                    lienzoRutas.eraseFeatures(puntoBorrar);
                    puntosLineaRuta.splice(rowIndex,1);
                    lienzoRutas.features.splice(rowIndex,1);
                    /**
                             * Dibuja la linea que une los puntos de la ruta despues de
                             * eliminar lo que no sirven
                             */
                    dibujarLineaRuta();
                    storePuntosRuta.commitChanges();
                }
            }]
        }],
        viewConfig: {
            forceFit: true
        },
        autoScroll  : true,
        frame       : true,
        buttons: [{
            text    : 'Guardar',
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
        url     : 'core/php/core/guardarPuntosRuta.php',
        method  : 'POST',
        success: function (result) {
            var r = Ext.util.JSON.decode(result.responseText);
            winPuntosRuta.hide();
            limpiarCapas();
            booCapturarPuntosNuevaRuta=false;
            ventanaParadasRuta(r.id,true);
        },
        timeout : 1000,
        params: {
            puntos  : getJsonOfStore(storePuntosRuta),
            id_ruta : id_ruta
        }
    });
}

/**
 * Permite cargar los puntos desde la base  para que sean editados en la interfaz
 */
function cargarPuntosRuta(id_ruta){
    Ext.Ajax.request({
        url     : 'core/php/gui/getPuntosRuta.php',
        method  : 'POST',
        success:function ( result, request ) {
            var datos = Ext.util.JSON.decode(result.responseText);
            if(datos.puntos==0){
                cargarPuntoInicial(strTipoRecorrido);
            }else{
                dibujarPuntosLineaRutaEditar(datos);
            }
        },
        timeout : 1000,
        params: {
            id_ruta : id_ruta
        }
    });
}

/**
 * Carga las paradas en el mapa para que el usuario pueda por donde se
 * debe dibujar la ruta por que paradas debe pasar
 */
function cargarParadasMapa(){
    Ext.Ajax.request({
        url     : 'core/php/gui/getParadasTodas.php',
        method  : 'POST',
        success: function (result) {
            var resultado = Ext.util.JSON.decode(result.responseText);
            var datos = resultado.datos.coordenadas;
            lienzosRecorridoHistorico(datos);
        },
        timeout : 1000
    });
}

/**
 * Carga los iconos de inicio o de fin en la utpl para definir donde tiene
 * que comenzar o finalizar la ruta
 */
function cargarPuntoInicial(strRecorrido){
    var lon=0;
    var lat=0;
    
    if(strRecorrido=="R"){//Llega a la UTPL
        /* Punto Final Bandera */
        lon = -79.19861071;
        lat = -3.98571285;
        iconoFin(lon,lat);
        enlazarPuntoRuta(lon, lat);
    }else if(strRecorrido=="B"){ //Sale de la UTPL
        /* Punto Inicial Estrella */
        lon = -79.19852488;
        lat = -3.98547739;
        iconoInicio(lon,lat);
        enlazarPuntoRuta(lon, lat);
    }else{ // Sale de la UTPL y llega a la UTPL
        /* Punto Inicial Estrella */
        lon = -79.19852488;
        lat = -3.98547739;
        iconoInicio(lon,lat);
        enlazarPuntoRuta(lon, lat);
        
        /* Punto Final Bandera */
        lon = -79.19861071;
        lat = -3.98571285;
        iconoFin(lon,lat);
        enlazarPuntoRuta(lon, lat);
    }
}

/*
 * Hace que el punto inicial o final se unan al trazado de los puntos para 
 * restringir que el primero o el ultimo punto sea en la utpl
 */
function enlazarPuntoRuta(lon,lat){
    var ptIni = new OpenLayers.Geometry.Point(lon,lat);
    ptIni.transform( new OpenLayers.Projection( "EPSG:4326" ),
        new OpenLayers.Projection( "EPSG:900913" ) );

    puntosLineaRuta.push(ptIni);
    storePuntosRuta.add(new Ext.data.Record({
        numero  : contadorPuntos,
        latitud : lat,
        longitud: lon
    }));
}

/**
* Muestra la ventana de la lista de puntos que dibujan una ruta para ser ingresados
* o editados dependiendo del parametro de carga de datos
* @param id de la ruta
* @param cargar si tiene que llenar el store con datos o no true=cargar
*/
function ventanaPuntosRuta(id,cargar){
    if(!winPuntosRuta){
        winPuntosRuta = new Ext.Window({
            title       : 'Nueva Ruta',
            layout      : 'fit',
            resizable   : true,
            width       : 350,
            height      : 300,
            closeAction : 'hide',
            plain       : false,
            items       : [grid]
        });
    }
    this.id_ruta = id;
    booCapturarPuntosNuevaRuta=true;
    if(cargar){ // se carga al momento de editar la ruta
        storePuntosRuta.proxy.conn.url = "core/php/gui/getPuntosRuta.php?id_ruta="+id;
        storePuntosRuta.load();
    }
    limpiarCapas();
    cargarPuntosRuta(id);
    cargarParadasMapa();
    winPuntosRuta.show(this);
}
