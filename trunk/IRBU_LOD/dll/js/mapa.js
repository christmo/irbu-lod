
var map;

// coordenadas para centrar Loja
var lat = - 3.9912;
var lon = - 79.20733;
var zoom = 15;
var lienzoParadas;
var lienzoEstudiantes;
var lienzoRecorridos;
var capturarPosicion;
var markerInicioFin;
/**
 * Lleva el conteo de los puntos que conforma la lista de puntos de una ruta
 */
var contadorPuntos=0;
var puntosLineaRuta;
/**
 * Bandera para permitir ir poniendo puntos en el mapa cuando se cree
 * una nueva ruta
 */
var booCapturarPuntosNuevaRuta=false;

/**
 * Bandera para capturar un solo punto sobre el mapa para coseguir las 
 * coordenadas de la parada
 */
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
var dragPuntosRuta;
/**
 *Define donde se pondra el icono de donde comienza o terrmina la ruta a ingresar
 */
var strTipoRecorrido="";
/**
 * Paradas cercanas a una nueva ruta
 */
var paradasCercanasRuta = new Array();

function init(){
    puntosLineaRuta = new Array();
    puntosRutaSeleccionados = new Array();
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
           
            /**
             * Captura los puntos que van a componer una nueva ruta para el trazado
             */
            if(booCapturarPuntosNuevaRuta){
                contadorPuntos++;
                /**
                 * Inserta los datos capturados en la tabla de puntos de ruta
                 */
                insertarDatosTablaPuntosRuta(aux);
                getParadasCercanasPuntoRuta(xpos, ypos);
                /**
                 * Une los puntos de la ruta con una linea
                 */
                dibujarLineaRuta();
            }
            
            /**
             * Pone las coordenadas de la nueva parada a crearse
             */
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
 * permite activar el arrastre de los features dentro del lienzo de Rutas
 * @param activar boolean 
 */
function activarArrastradoPuntos(activar){
    if(activar){
        dragPuntosRuta.activate();
    }else{
        dragPuntosRuta.deactivate();
        selectFeatures.activate();
    }
}

/**
 * Captura el movimiento del feature de un punto de la ruta dibujada
 */
function arrastrar(feature, pixel){
    var aux = new OpenLayers.Geometry.Point(feature.geometry.x, feature.geometry.y);
    aux.transform( new OpenLayers.Projection( "EPSG:900913" ),
        new OpenLayers.Projection( "EPSG:4326" ) );
        
    storePuntosRuta.getAt(storePuntosRuta.find('numero',feature.id)).set('latitud',aux.y);
    storePuntosRuta.getAt(storePuntosRuta.find('numero',feature.id)).set('longitud',aux.x);
}

/**
 * Busca si el valor ya esta ingresado en el arreglo para no ingresarlo 
 * nuevamente
 */
function buscarValorArregloParadas(idParada){
    var insertar=true;
    for(var i=0; i<paradasCercanasRuta.length;i++){
        if(idParada==paradasCercanasRuta[i]){
            insertar = false;
            break;
        }
    }
    if(insertar){
        paradasCercanasRuta.push(idParada);
    }
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
        //        fillColor       : "#003DF5", //azul
        fillColor       : "#1C5E06", //verde
        strokeColor     : "#FFFFFF",
        strokeOpacity   : 0.7,
        fontSize        : "12px",
        fontFamily      : "Courier New, monospace",
        fontWeight      : "bold"
    });

    var stylePuntosEstudiante = new OpenLayers.StyleMap( {
        fillOpacity     : 0.7,
        pointRadius     : 6,
        ci              : "${ci}",
        lat             : "${lat}",
        lon             : "${lon}",
        dir             : "${dir}",
        fontColor       : "white",
        fillColor       : "#DF3A01", //naranja
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
   
    lienzoEstudiantes = new OpenLayers.Layer.Vector('Puntos Estudiantes', {
        styleMap: stylePuntosEstudiante
    });

    map.addLayer(lienzoEstudiantes);

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
    
    selectFeaturesEstudiante = new OpenLayers.Control.SelectFeature(
        [ lienzoEstudiantes ],
        {
            clickout    : true,
            toggle      : false,
            multiple    : false,
            hover       : false,
            onSelect : function(feature){
                infoEstudiantePopUp(feature);
            },
            onUnselect : function(feature){
                map.removePopup( feature.popup );
                feature.popup.destroy();
                feature.attributes.poppedup = false;
                feature.popup = null;
            }
        }
        );

    map.addControl( selectFeaturesEstudiante );
   
    /**
     * Inicializa el mapa para que permita graficar los recorridos de los buses
     */
    capaRecorridos();
    permitirArrastrarPuntosRutas();
}

function infoEstudiantePopUp(feature){
    var contenidoPopUp = "<div id='popid'><b>Direcci\xF3n:</b><br />"
    + feature.data.dir + "<br /><br /><b>C\xE9dula:</b><br />"
    + feature.data.ci  + "</div>";
    var popup = 
    new OpenLayers.Popup.AnchoredBubble( null,
        new OpenLayers.LonLat( feature.geometry.x, feature.geometry.y ),
        new OpenLayers.Size(170,75),
        contenidoPopUp,
        null,
        true,
        function () {
            selectFeaturesEstudiante.unselect( feature );
        }
        );

    //    popup.setBackgroundColor('#C8C8C8 '); // fondo
    feature.popup = popup;
    feature.attributes.poppedup = true;
    map.addPopup( popup );
}

/**
 * Carga el trazado de las lineas de una nueva ruta de bus
 */
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
    dibujarLineaRuta();
}

/**
 * Se ejecuta al finalizar el movimiento del feature seleccionado
 */
function finalizarArrastre(feature, pixel){
    dibujarLineaRuta();
    storePuntosRuta.commitChanges();
    var aux = new OpenLayers.Geometry.Point(feature.geometry.x, feature.geometry.y);
    aux.transform( new OpenLayers.Projection( "EPSG:900913" ),
        new OpenLayers.Projection( "EPSG:4326" ) );
    getParadasCercanasPuntoRuta(aux.x,aux.y);
}

/**
 * Obtiene los ids de las paradas que se encuentren cerca a un punto la distancia
 * esta definida en el archivo php del servidor
 */
function getParadasCercanasPuntoRuta(lon,lat){
    Ext.Ajax.request({
        url     : 'core/php/gui/getParadasCercanasPunto.php',
        method  : 'POST',
        success: function (result) {
            var r = Ext.util.JSON.decode(result.responseText);
            try{
                var datos = r.datos.paradas.split(',');
                for(var i=0; i<datos.length; i++){
                    buscarValorArregloParadas(datos[i]); 
                }
                console.info(paradasCercanasRuta);
            }catch(e){
            //No hacer nada si no encuentra paradas
            }  
        },
        timeout : 1000,
        params: {
            lon : lon,
            lat : lat
        }
    });
}

/**
 * Inserta las coordenadas capturadas del mapa dentro de la tabla de puntos
 * de ruta, dependiendo del tipo de recorrido que se haya seleccionado y el
 * icono que se haya cargado en el mapa
 */
function insertarDatosTablaPuntosRuta(aux){
    var features = new Array();
    
    var pt = new OpenLayers.Geometry.Point(aux.x,aux.y);
    pt.transform( new OpenLayers.Projection( "EPSG:4326" ),
        new OpenLayers.Projection( "EPSG:900913" ) );
    
    var idPt = new OpenLayers.Feature.Vector( pt, {
        id : contadorPuntos
    });

    if(strTipoRecorrido=="B"){
        /*Enviar al estore de la tabla de puntos de ruta*/
        storePuntosRuta.add(new Ext.data.Record({
            numero  : contadorPuntos,
            latitud : aux.y,
            longitud: aux.x
        }));
                    
        /* linea */
        puntosLineaRuta.push(pt);
    }else if(strTipoRecorrido=="R"){
        /*Enviar al estore de la tabla de puntos de ruta*/
        storePuntosRuta.insert((contadorPuntos-1),new Ext.data.Record({
            numero  : contadorPuntos,
            latitud : aux.y,
            longitud: aux.x
        }));
          
        /* linea */
        puntosLineaRuta.splice((contadorPuntos-1),0,pt);
    }else if(strTipoRecorrido=="BR"){
        /*Enviar al estore de la tabla de puntos de ruta*/
        storePuntosRuta.insert(contadorPuntos,new Ext.data.Record({
            numero  : contadorPuntos,
            latitud : aux.y,
            longitud: aux.x
        }));
        
        /* linea */
        puntosLineaRuta.splice(contadorPuntos,0,pt);
    }
    idPt.id = contadorPuntos;
    features.push(idPt);
    lienzoRutas.addFeatures(features);
}    

/**
 * Inserta el punto al final de la linea dibujada para que se vaya editando la
 * ruta ya ingresada
 */
//function insertarDatosTablaPuntosRutaEditar(aux){
//    var features = new Array();
//    var pt = new OpenLayers.Geometry.Point(aux.x,aux.y);
//    pt.transform( new OpenLayers.Projection( "EPSG:4326" ),
//        new OpenLayers.Projection( "EPSG:900913" ) );
//    
//    var idPt = new OpenLayers.Feature.Vector( pt, {
//        id : contadorPuntos
//    });
//    
//    storePuntosRuta.add(new Ext.data.Record({
//        numero  : contadorPuntos,
//        latitud : aux.y,
//        longitud: aux.x
//    }));
//                    
//    /* linea */
//    puntosLineaRuta.push(pt);
//    idPt.id = contadorPuntos;
//    features.push(idPt);
//    lienzoRutas.addFeatures(features);
//}

/**
 * Activa el control para arrastrar los puntos de una ruta para editarlos de 
 * forma manual
 */
function permitirArrastrarPuntosRutas(){
    //--Add a drag feature control to move features around.
    dragPuntosRuta = new OpenLayers.Control.DragFeature(lienzoRutas, {
        // onStart: iniciarArrastre,
        onDrag      : arrastrar,
        onComplete  : finalizarArrastre
    });
    map.addControl(dragPuntosRuta);
    activarArrastradoPuntos(true);
}

/**
 * Permite dibujar la casa de cada estudiante sobre el mapa, para identificar los
 * sectores de mayor densidad estudiantil y reconocer graficamente cuales son 
 * los sectores más habitados por parte de los estudiante
 */
function dibujarDensidadEstudiantes(datos){
    var features = new Array();

    for(var i=0;i<datos.length; i++){
        var pt = new OpenLayers.Geometry.Point(datos[i].lon,datos[i].lat);
        pt.transform( new OpenLayers.Projection( "EPSG:4326" ),
            new OpenLayers.Projection( "EPSG:900913" ) );
            
        var puntoMap = new OpenLayers.Feature.Vector( pt, {
            ci : datos[i].ci,
            lat : datos[i].lat,
            lon : datos[i].lon,
            dir : datos[i].dir,
            poppedup : true
        });
        features.push(puntoMap);
    }
    lienzoEstudiantes.addFeatures(features);
}