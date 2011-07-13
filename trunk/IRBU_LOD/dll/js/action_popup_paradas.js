//Direccion de Imagen por Defecto
var Default_Img = 'img/default_parada.jpg';

/**
 * Comment
 */
function test() {
    alert("enlazado");
}

/**
 * Comportamiento de Selección
 */
function selectParada( feature ) {

    var dir = feature.attributes.dir;
    var ref = feature.attributes.ref;
    var img = feature.attributes.img;
    var idBD = feature.attributes.idBD;
    if (!img) {
        //no tiene imagen
        img = Default_Img;
    }
//style='position: absolute;'
    var contenidoPopUp = "<div id='popid'  >"+dir+"<br /><center>"
        + "<a href='" + img + "' class='photo' title='" + dir + " <br/> " + ref + "'><img src='"
        + img + "' width='100' height='75'/></a></center>"
        + ref + " <br /><center><div id= 'infoparada' onclick='RQ2_PopUP_getWin("+idBD+")'><b> Hora y Ruta</b></div></center></div>";

    var popup =
    new OpenLayers.Popup.AnchoredBubble( null,
        new OpenLayers.LonLat( feature.geometry.x, feature.geometry.y ),
        new OpenLayers.Size(120,145),
        contenidoPopUp,
        null,
        true,
        function () {
            onCloseParada( feature )
        }
        );

    popup.setBackgroundColor('#C8C8C8 '); // fondo
    feature.popup = popup;
    feature.attributes.poppedup = true;
    map.addPopup( popup );

    //El evento necesita ser sobrescrito debido
    //a que el objeto(img) es puesto dinamicamente
    $(function() {
        $('.photo').lightBox();
    });


}

/**
 * Comportamiento de Deselección
 */
function unselectParada( feature ) {
    map.removePopup( feature.popup );
    feature.popup.destroy();
    feature.attributes.poppedup = false;
    feature.popup = null;
}

/**
 * Comportamiento de Cerrar PopUp
 */
function onCloseParada( feature ) {
    selectFeatures.unselect( feature );
}