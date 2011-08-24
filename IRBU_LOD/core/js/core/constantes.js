/**
 * Ruta constante para la utilización en todo el proyecto
 */

/**
 * Permite obtener las rutas para ser cargadas en un combo box
 */
var phpComboRutas = "core/php/gui/comboRutas.php";


/**
 * permite ponerle una plantilla en la presentación del combo de rutas
 * las clases de la hoja de estilos es "css/style.css"
 */
var resultadoTplRutas = new Ext.XTemplate(
    '<tpl for="."><div class="search-item">',
    //'<h3><span>{id}</span></h3>',
    '{name}',
    '</div></tpl>'
    );
