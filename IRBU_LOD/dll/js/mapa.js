
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

function init(){
    puntosLineaRuta = new Array();
    
    capturarPosicion = false;
    
    OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
        defaultHandlerOptions: {
            'single': true,
            'double': false,
            'pixelTolerance': 0,
            'stopSingle': false,
            'stopDouble': false
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
            var coord = map.getLonLatFromViewPortPx(e.xy);
            var aux =  new OpenLayers.Geometry.Point( coord.lon, coord.lat );
            aux.transform( new OpenLayers.Projection( "EPSG:900913" ),
                new OpenLayers.Projection( "EPSG:4326" ) );
            xpos = aux.x;
            ypos = aux.y;
            if (capturarPosicion) {
                capturarPosicion = false;
                RQ3_getWin();
            }

            //alert("X: "+aux.x+" Y: "+aux.y);
            var features = new Array();
            var pt = new OpenLayers.Geometry.Point(xpos,ypos);
            pt.transform( new OpenLayers.Projection( "EPSG:4326" ),
                new OpenLayers.Projection( "EPSG:900913" ) );
            contadorPuntos++;
            var puntoRuta = new OpenLayers.Feature.Vector( pt, {
                id : contadorPuntos
            });
            features.push(puntoRuta);
            lienzoRutas.addFeatures(features);

        //-- linea
            puntosLineaRuta.push(pt);
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
        //---
        }
    });

    //Limitar navegabilidad en el mapa
    var extent = new OpenLayers.Bounds();
    extent.extend(new OpenLayers.LonLat(-79.24441,-3.93400  ));
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
        restrictedExtent : extent,
        displayProjection : new OpenLayers.Projection( "EPSG:4326" ),
        projection : new OpenLayers.Projection( "EPSG:4326" ),
        units : 'm',
        numZoomLevels : 19,
        maxResolution : 'auto'
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
    map.events.register('zoomend', this, function() {
        if (map.getZoom() < 13)
        {
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
    var stylePuntos = new OpenLayers.StyleMap( {
        fillOpacity : 0.7,
        pointRadius: 9,
        idBD : "${idBD}",
        idOrd : "${idOrd}",
        label: "${idOrd}",
        lat : "${lat}",
        lon : "${lon}",
        dir : " ${dir}",
        ref : "${ref}",
        img : "${img}",
        fontColor: "white",
        fillColor: "#003DF5", //black
        strokeColor: "#FFFFFF",
        strokeOpacity: 0.7,
        fontSize: "12px",
        fontFamily: "Courier New, monospace",
        fontWeight: "bold"
    }
    );

    var stylePuntosRutas = new OpenLayers.StyleMap( {
        fillOpacity : 0.7,
        pointRadius: 9,
        label : "${id}",
        fontColor: "white",
        fillColor: "#003DF5", //black
        strokeColor: "#FFFFFF",
        strokeOpacity: 0.7,
        fontSize: "12px",
        fontFamily: "Courier New, monospace",
        fontWeight: "bold"
    }
    );

    lienzoParadas = new OpenLayers.Layer.Vector('Points', {
        styleMap: stylePuntos
    });

    map.addLayer(lienzoParadas);

    lienzoRutas = new OpenLayers.Layer.Vector('Puntos Rutas', {
        styleMap: stylePuntosRutas
    });

    map.addLayer(lienzoRutas);

    //Comportamiento de los Elementos de la Capa
    selectFeatures = new OpenLayers.Control.SelectFeature(
        [ lienzoParadas ],
        {
            clickout: true,
            toggle: false,
            multiple: false,
            hover : false,
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