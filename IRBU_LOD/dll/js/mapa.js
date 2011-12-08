
var map;

// coordenadas para centrar Loja
var lat = - 3.9912;
var lon = - 79.20733;
var zoom = 15;
var lienzoParadas;
var lienzoRecorridos;
var capturarPosicion;
var markerInicioFin;

var contadorPuntos=0;
var puntosLineaRuta;
var booCapturarPuntosNuevaRuta=false;
var booCapturarPuntosNuevaParada=false;
var booCapturarPuntosEditarParada=false;
var cont_puntos=0;
var lat_ini;
var lon_ini;

var puntosRutaSeleccionados;
/**
 * Store para recoger los puntos de las rutas nuevas
 */
var storePuntosRuta;

/* lista de puntos de una nueva ruta */
//var puntosLatLonRutas;

function init(){
    puntosLineaRuta = new Array();
    puntosRutaSeleccionados = new Array();
    // puntosLatLonRutas = new Array();
    capturarPosicion = false;
    
    OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
        defaultHandlerOptions: {
            'single'        : true,
            'double'        : false,
            'pixelTolerance': 0,
            'stopSingle'    : false,
            'stopDouble'    : false
        },

        initialize: function(options) {
            this.handlerOptions = OpenLayers.Util.extend({}, this.defaultHandlerOptions);
            OpenLayers.Control.prototype.initialize.apply(this, arguments);
            this.handler = new OpenLayers.Handler.Click(this, {
                'click': this.trigger
            }, this.handlerOptions);
        },

        trigger: function(e) {        
            //Capturar Punto de Referencia
            var coord   = map.getLonLatFromViewPortPx(e.xy);
            var aux     = new OpenLayers.Geometry.Point( coord.lon, coord.lat );
            aux.transform( new OpenLayers.Projection( "EPSG:900913" ),
                new OpenLayers.Projection( "EPSG:4326" ) );
            xpos = aux.x;
            ypos = aux.y;
            if (capturarPosicion) {
                capturarPosicion = false;
                RQ3_getWin();
            }

            if(booCapturarPuntosNuevaRuta){
            var features = new Array();
            var pt = new OpenLayers.Geometry.Point(xpos,ypos);
            pt.transform( new OpenLayers.Projection( "EPSG:4326" ),
                new OpenLayers.Projection( "EPSG:900913" ) );

            contadorPuntos++;

            /*poner puntos en la lista para una nueva ruta*/
            //puntosLatLonRutas[(contadorPuntos-1)]=new Array(contadorPuntos, aux.x, aux.y);
            //console.info(puntosLatLonRutas);
            /*Enviar al estore de la tabla de puntos de ruta*/
            storePuntosRuta.add(new Ext.data.Record({
                numero  : contadorPuntos,
                latitud : aux.y,
                longitud: aux.x
            }));
                
            //-
            //                if(cont_puntos==1){
            //                    console.info('entrar');
            //                    Ext.Ajax.request({
            //                        url     : 'dominioexterno.php',
            //                        method  : 'GET',
            //                        success: function (result) {
            //                            var r = Ext.util.JSON.decode(result.responseText);
            //                            if(typeof r.route_geometry != "undefined"){
            //                                console.info(r.route_geometry);
            //                                for (var i=0;i<r.route_geometry.length;i++) {
            //                                    contadorPuntos ++;
            //                                    storePuntosRuta.add(new Ext.data.Record({
            //                                        numero  : contadorPuntos,
            //                                        latitud : r.route_geometry[i][0],
            //                                        longitud: r.route_geometry[i][1]
            //                                    }));
            //                                    //--graficar puntos intermedios
            //                                    var punto = new OpenLayers.Geometry.Point(r.route_geometry[i][1],r.route_geometry[i][0]);
            //                                    punto.transform( new OpenLayers.Projection( "EPSG:4326" ),
            //                                        new OpenLayers.Projection( "EPSG:900913" ) );
            //                                                
            //                                    var puntoRutaInterna = new OpenLayers.Feature.Vector( punto, {
            //                                        id : contadorPuntos
            //                                    });
            //                                    puntoRutaInterna.id =contadorPuntos;
            //                                    features.push(puntoRutaInterna);
            //                                    lienzoRutas.addFeatures(features);
            //                
            //                                    //-- linea
            //                                    puntosLineaRuta.push(punto);
            //                
            //                                    var ruta = new OpenLayers.Geometry.LineString(puntosLineaRuta);
            //                                    //Estilo de Linea de Recorrido
            //                                    var style = {
            //                                        strokeColor     : '#0000ff',
            //                                        strokeOpacity   : 0.3,
            //                                        strokeWidth     : 5
            //                                    };
            //                
            //                                    var lineFeature = lienzoRecorridos.getFeatureById( "trazado" );
            //                                    if (lineFeature != null){
            //                                        lineFeature.destroy();
            //                                    }
            //                
            //                                    lineFeature = new OpenLayers.Feature.Vector(ruta, null, style);
            //                                    lineFeature.id = "trazado";
            //                                    lienzoRecorridos.addFeatures([lineFeature]);
            //                                //--
            //                                }
            //                                lat_ini = aux.y;
            //                                lon_ini = aux.x;
            //                            }
            //                        },
            //                        params:{
            //                            lat_ini:lat_ini,
            //                            lon_ini:lon_ini,
            //                            lat_fin:aux.y,
            //                            lon_fin:aux.x
            //                        },
            //                        timeout: 1000
            //                    });
            //                    cont_puntos=1;
            //                }else{
            //                    cont_puntos++;
            //                    console.info(cont_puntos);
            //                    lat_ini = aux.y;
            //                    lon_ini = aux.x;
            //                }
            //-

            var puntoRuta = new OpenLayers.Feature.Vector( pt, {
                id : contadorPuntos
            });
            //var puntoRuta = new OpenLayers.Feature.Vector(pt);
            puntoRuta.id = contadorPuntos;
            features.push(puntoRuta);
            lienzoRutas.addFeatures(features);

            //-- linea
            puntosLineaRuta.push(pt);

            //console.info(puntosLineaRuta);
            /**
             * Une los puntos de la ruta con una linea
             */
            dibujarLineaRuta();

            //permitirArrastrarPuntosRutas();
            }
            
            if(booCapturarPuntosNuevaParada||booCapturarPuntosEditarParada){
                dibujarPuntoLienzoRutas(xpos, ypos, '1');
                if(booCapturarPuntosNuevaParada){
                    Ext.get('latParada').dom.innerHTML = ypos;
                    Ext.get('lonParada').dom.innerHTML = xpos;
                }
                if(booCapturarPuntosEditarParada){
                    Ext.get('latParada_vep').dom.innerHTML = ypos;
                    Ext.get('lonParada_vep').dom.innerHTML = xpos;
                }
            }
        }
    });

    //Limitar navegabilidad en el mapa
    var extent = new OpenLayers.Bounds();
    extent.extend(new OpenLayers.LonLat(-79.24441,-3.93400));
    extent.extend(new OpenLayers.LonLat(-79.18123,-4.04600));
    extent.transform( new OpenLayers.Projection( "EPSG:4326" ),
        new OpenLayers.Projection( "EPSG:900913" ));

    // Mapa
    map = new OpenLayers.Map( "map", {
        controls : [
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.PanZoomBar(),
        //new OpenLayers.Control.ZoomToMaxExtent(),
        new OpenLayers.Control.KeyboardDefaults(),
        new OpenLayers.Control.LayerSwitcher(),
        ],
        restrictedExtent    : extent,
        displayProjection   : new OpenLayers.Projection( "EPSG:4326" ),
        projection          : new OpenLayers.Projection( "EPSG:4326" ),
        units               : 'm',
        numZoomLevels       : 19,
        maxResolution       : 'auto'
    });

    // Mapa sobre el que se trabaja
    map.addLayer( new OpenLayers.Layer.OSM.Mapnik( "Loja Map" ) );

    // Centrar el Mapa
    var lonLat = new OpenLayers.LonLat( lon, lat ).transform( new OpenLayers.Projection( "EPSG:4326" ),
        map.getProjectionObject() );
    map.setCenter ( lonLat, zoom );

    //Envento click sobre el mapa
    var click = new OpenLayers.Control.Click();
    map.addControl(click);
    click.activate();

    //Restringe la posibilidad de hacer zoom mas alla
    //de la zona de Loja
    map.events.register('zoomend', this, function(){
        if (map.getZoom() < 13){
            map.zoomTo(13);
        }
    });

    map.zoomToMaxExtent();

    cargarCapas();   
}

/**
 * Capas sobre el Mapa
 */
function cargarCapas() {
    var stylePuntosParadas = new OpenLayers.StyleMap( {
        fillOpacity     : 0.7,
        pointRadius     : 9,
        idBD            : "${idBD}",
        idOrd           : "${idOrd}",
        label           : "${idOrd}",
        lat             : "${lat}",
        lon             : "${lon}",
        dir             : " ${dir}",
        ref             : "${ref}",
        img             : "${img}",
        fontColor       : "white",
        fillColor       : "#003DF5", //black
        strokeColor     : "#FFFFFF",
        strokeOpacity   : 0.7,
        fontSize        : "12px",
        fontFamily      : "Courier New, monospace",
        fontWeight      : "bold"
    });

    var stylePuntosRutas = new OpenLayers.StyleMap( {
        fillOpacity     : 0.7,
        pointRadius     : 9,
        label           : "${id}",
        fontColor       : "white",
        fillColor       : "#003DF5", //black
        strokeColor     : "#FFFFFF",
        strokeOpacity   : 0.7,
        fontSize        : "12px",
        fontFamily      : "Courier New, monospace",
        fontWeight      : "bold"
    });

    lienzoParadas = new OpenLayers.Layer.Vector('Points', {
        styleMap: stylePuntosParadas
    });

    map.addLayer(lienzoParadas);

    lienzoRutas = new OpenLayers.Layer.Vector('Puntos Rutas', {
        styleMap: stylePuntosRutas
    });

    map.addLayer(lienzoRutas);
    permitirArrastrarPuntosRutas();

    //Comportamiento de los Elementos de la Capa
    selectFeatures = new OpenLayers.Control.SelectFeature(
        [ lienzoParadas ],
        {
            clickout    : true,
            toggle      : false,
            multiple    : false,
            hover       : false,
            onSelect : function(feature){
                selectParada( feature );
            },
            onUnselect : function(feature){
                unselectParada( feature );
            }
        }
        );

    map.addControl( selectFeatures );
    selectFeatures.activate();

    /**
     * Inicializa el mapa para que permita graficar los recorridos de los buses
     */
    capaRecorridos();

}

/**
 * Activa el control para arrastrar los puntos de una ruta para editarlos de 
 * forma manual
 */
function permitirArrastrarPuntosRutas(){
    //--Add a drag feature control to move features around.
    var dragFeature = new OpenLayers.Control.DragFeature(lienzoRutas, {
        // onStart: iniciarArrastre,
        onDrag      : arrastrar,
        onComplete  : finalizarArrastre
    });
    map.addControl(dragFeature);
    dragFeature.activate();
}

/**
 * Activa la capa de recorridos para poder dibujar en el mapa estos
 */
function capaRecorridos(){
    /**
     * Inicializar la capa para los recorridos
     */
    lienzoRecorridos = new OpenLayers.Layer.Vector("Recorridos");
    markerInicioFin = new OpenLayers.Layer.Markers( "Inicio-Fin" );
    map.addLayer(lienzoRecorridos);
    map.addLayer(markerInicioFin);
}


function cargarTrazoLineas(){
    /**
     * Capa para hacer el trazado de las lineas de una nueva ruta de bus
     */
    var pointLayer = new OpenLayers.Layer.Vector("Point Layer");
    var lineLayer = new OpenLayers.Layer.Vector("Line Layer");
    var polygonLayer = new OpenLayers.Layer.Vector("Polygon Layer");

    map.addLayers([wmsLayer, pointLayer, lineLayer, polygonLayer]);
    map.addControl(new OpenLayers.Control.LayerSwitcher());
    map.addControl(new OpenLayers.Control.MousePosition());

    drawControls = {
        point: new OpenLayers.Control.DrawFeature(pointLayer,
            OpenLayers.Handler.Point),
        line: new OpenLayers.Control.DrawFeature(lineLayer,
            OpenLayers.Handler.Path),
        polygon: new OpenLayers.Control.DrawFeature(polygonLayer,
            OpenLayers.Handler.Polygon)
    };

    for(var key in drawControls) {
        map.addControl(drawControls[key]);
    }
}

/**
 * Dibuja un punto en el lienzo de rutas
 */
function dibujarPuntoLienzoRutas(lon,lat,id){
    limpiarCapaNuevaRuta();
    var marca = new Array();
    var punto = new OpenLayers.Geometry.Point(lon,lat);
    punto.transform( new OpenLayers.Projection( "EPSG:4326" ),
        new OpenLayers.Projection( "EPSG:900913" ) );
                    
    var puntoParada = new OpenLayers.Feature.Vector( punto, {
        id : ''+id
    });
    puntoParada.id = id;
    marca.push(puntoParada);
    lienzoRutas.addFeatures(marca);
}

/**
 * Se ejecuta al iniciar el movimiento de un feature.
 */
//function iniciarArrastre(feature, pixel){
//    console.info('startDrag');
//}

/**
 * Captura el movimiento del feature de un punto de la ruta dibujada
 */
function arrastrar(feature, pixel){
    var aux     = new OpenLayers.Geometry.Point(feature.geometry.x, feature.geometry.y);
    aux.transform( new OpenLayers.Projection( "EPSG:900913" ),
        new OpenLayers.Projection( "EPSG:4326" ) );
        
    storePuntosRuta.getAt(storePuntosRuta.find('numero',feature.id)).set('latitud',aux.y);
    storePuntosRuta.getAt(storePuntosRuta.find('numero',feature.id)).set('longitud',aux.x);
}

/**
 * Se ejecuta al finalizar el movimiento del feature seleccionado
 */
function finalizarArrastre(feature, pixel){
    dibujarLineaRuta();
    storePuntosRuta.commitChanges();
}

/**
 * Dibuja la linea que une los puntos de la ruta que está siendo dibujada
 */
function dibujarLineaRuta(){
    var ruta = new OpenLayers.Geometry.LineString(puntosLineaRuta);
    //Estilo de Linea de Recorrido
    var style = {
        strokeColor     : '#0000ff',
        strokeOpacity   : 0.3,
        strokeWidth     : 5
    };

    var lineFeature = lienzoRecorridos.getFeatureById( "trazado" );
    if (lineFeature != null){
        lineFeature.destroy();
    }

    lineFeature = new OpenLayers.Feature.Vector(ruta, null, style);
    lineFeature.id = "trazado";
    lienzoRecorridos.addFeatures([lineFeature]);
}

/**
 * Dibuja una ruta con la linea y los puntos de unión para poder editarla de forma
 * manual
 */
function dibujarPuntosLineaRutaEditar(datos){
    limpiarCapaNuevaRuta();
    var marca = new Array();
    contadorPuntos=datos.puntos.length;
    for(var i=0; i<datos.puntos.length;i++){
        var punto = new OpenLayers.Geometry.Point(datos.puntos[i].longitud,datos.puntos[i].latitud);
        punto.transform( new OpenLayers.Projection( "EPSG:4326" ),
            new OpenLayers.Projection( "EPSG:900913" ) );
        var puntoNumero = new OpenLayers.Feature.Vector( punto, {
            id : ''+datos.puntos[i].numero
        });
        puntoNumero.id = datos.puntos[i].numero;
        marca.push(puntoNumero);
        puntosLineaRuta.push(punto);
    }
    lienzoRutas.addFeatures(marca);
    permitirArrastrarPuntosRutas();
    dibujarLineaRuta();
}
