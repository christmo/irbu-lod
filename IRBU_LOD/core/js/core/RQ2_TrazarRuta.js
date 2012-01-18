/* 
 * Dibuja el trazado de una ruta en el mapa
 */
function dibujarTrazado(coord){
    iconosInicioFin(coord);
    var fil = coord.split("#");
    var cantPuntos = 0;

    //PUNTOS PARA RUTA
    var puntosRuta = new Array();

    for ( i=0; i<fil.length-1; i++ ) {
        var col = fil[i].split("%");
        for ( j=0; j<col.length; j++ ) {
            var pt = new OpenLayers.Geometry.Point(col[0],col[1]);
            pt.transform( new OpenLayers.Projection( "EPSG:4326" ),new OpenLayers.Projection( "EPSG:900913" ) );
            puntosRuta.push(pt);
            cantPuntos++;
        }
    }
    if (puntosRuta.length > 0){
        var ruta = new OpenLayers.Geometry.LineString(puntosRuta);
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

    }else{
        Ext.MessageBox.show({
            title: 'Error',
            msg: 'Ups... Datos no encontrados',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
}

/**
 * Permite dibujar los iconos de inicio y fin en la ruta para diferenciar hacia
 * donde es la trayectoria del recorrido
 */
function iconosInicioFin(coordPuntos){
    var fil = coordPuntos.split("#");
    markerInicioFin.clearMarkers();
    var filIni = fil[0].split("%");
    iconoInicio(filIni[0],filIni[1]);
    var filFin = fil[fil.length-2].split("%");
    iconoFin(filFin[0],filFin[1]);
}

/**
 * Poner el icono de inicio de ruta sobre el mapa
 */
function iconoInicio(lon,lat){
    var size = new OpenLayers.Size(32,32);
    var iconIni = new OpenLayers.Icon(
        'img/inicio.png',
        size, null, 0);
    var pInicio = new OpenLayers.LonLat(lon,lat);
    pInicio.transform(new OpenLayers.Projection( "EPSG:4326" ),
        new OpenLayers.Projection( "EPSG:900913" ));
    markerInicioFin.addMarker(new OpenLayers.Marker(pInicio, iconIni));

    
}

/**
 * Poner el icono de Fin de la ruta sobre el mapa 
 */
function iconoFin(lon,lat){
    var size = new OpenLayers.Size(32,32);
    var iconFin = new OpenLayers.Icon(
        'img/fin.png',
        size, null, 0);
    var pFin = new OpenLayers.LonLat(lon,lat);
    pFin.transform(new OpenLayers.Projection( "EPSG:4326" ),
        new OpenLayers.Projection( "EPSG:900913" ) );
    markerInicioFin.addMarker(new OpenLayers.Marker(pFin, iconFin));
}
