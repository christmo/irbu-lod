/* 
 * Permite desplegar la ventana para ingresar una nueva ruta
 */

var winNuevaRuta;
var panelNuevaRuta;
var panelInfoRuta;

var rbTipoRecorrido='B';
var urlNuevaRuta = phpComboRutas+"?op="+rbTipoRecorrido;

Ext.onReady(function(){
    
    var nombreRuta;
 
    panelInfoRuta = new Ext.FormPanel({
        labelAlign  : 'top',
        frame       : true,
        bodyStyle   : 'padding:5px 5px 0',
        labelWidth  : 60,
        width       : 500,

        items: [{
            columnWidth : 1,
            layout      : 'form',
            items: [{
                xtype       : 'radiogroup',
                fieldLabel  : 'Tipo de recorrido',
                allowBlank  :false,
                items: [
                {
                    boxLabel    : 'Baja de la UTPL',
                    name        : 'rbTipo',
                    inputValue  : 'B',
                    listeners   : {
                        check: function (ctl, val) {
                            recargarCbxNuevaRuta(panelInfoRuta);
                        }
                    }
                },{
                    boxLabel    : 'Sube a la UTPL',
                    name        : 'rbTipo',
                    inputValue  : 'R',
                    listeners   : {
                        check: function (ctl, val) {
                            recargarCbxNuevaRuta(panelInfoRuta);
                        }
                    }
                },{
                    boxLabel    : 'Sube y baja de la UTPL',
                    name        : 'rbTipo',
                    inputValue  : 'BR',
                    listeners   : {
                        check: function (ctl, val) {
                            recargarCbxNuevaRuta(panelInfoRuta);
                        }
                    }
                }]
            }]
        },{
            layout  : 'form',
            items   : [
            cbxNuevaRuta
            ]
        }],

        buttons: [
        //        {
        //            text    : 'Editar',
        //            id      : 'btnEditarRuta',
        //            handler : function() {
        //                nombreRuta = cbxNuevaRuta.getValue();
        //                panelInfoRuta.getForm().submit({
        //                    url     : 'core/php/core/guardarRuta.php?nombreRuta='+nombreRuta+'&radioTipo='+rbTipoRecorrido,
        //                    method  : 'POST',
        //                    waitMsg : 'Editando Ruta...',
        //                    failure : function (form, action) {
        //                        Ext.MessageBox.show({
        //                            title   : 'Error...',
        //                            msg     : 'Ruta ya guardada...',
        //                            buttons : Ext.MessageBox.OK,
        //                            icon    : Ext.MessageBox.ERROR
        //                        });
        //                    },
        //                    success: function (form, action) {
        //                        var resultado = Ext.util.JSON.decode(action.response.responseText);
        //
        //                        limpiarVentana();
        //                        ventanaHorasRuta(resultado.id,false);
        //                    }
        //                });
        //            }
        //        },
        {
            text    : 'Eliminar',
            id      : 'btnEliminarRuta',
            handler: function() {
                nombreRuta=cbxNuevaRuta.getValue();
                panelInfoRuta.getForm().submit({
                    url     : 'core/php/core/eliminarRuta.php?id_ruta='+nombreRuta+'&radioTipo='+rbTipoRecorrido,
                    method  :'POST',
                    waitMsg : 'Eliminando Ruta...',
                    failure : function (form, action) {
                        Ext.MessageBox.show({
                            title   : 'Error...',
                            msg     : 'Ruta no existe...',
                            buttons : Ext.MessageBox.OK,
                            icon    : Ext.MessageBox.ERROR
                        });
                    },
                    success: function (form, action) {
                        //var resultado = Ext.util.JSON.decode(action.response.responseText);

                        Ext.MessageBox.show({
                            title   : 'Info...',
                            msg     : 'Ruta borrada correctamente...',
                            buttons : Ext.MessageBox.OK,
                            icon    : Ext.MessageBox.INFO
                        });
                        
                        limpiarVentana();
                    }
                });
            }
        },{
            text    : 'Guardar',
            id      : 'btnGuardarRuta',
            handler: function() {
                nombreRuta=cbxNuevaRuta.getValue();
                panelInfoRuta.getForm().submit({
                    url     : 'core/php/core/guardarRuta.php?nombreRuta='+nombreRuta+'&radioTipo='+rbTipoRecorrido,
                    method  : 'POST',
                    waitMsg : 'Guardando Ruta...',
                    failure : function (form, action) {
                        Ext.MessageBox.show({
                            title   : 'Error...',
                            msg     : 'Ruta ya guardada...',
                            buttons : Ext.MessageBox.OK,
                            icon    : Ext.MessageBox.ERROR
                        });
                    },
                    success: function (form, action) {
                        var resultado = Ext.util.JSON.decode(action.response.responseText);
                        /**
                         *Guardar el tipo de recorrido seleccionado para poner el 
                         *icono de inicio o fin de la nueva ruta
                         */
                        strTipoRecorrido=rbTipoRecorrido;
                        limpiarVentana();
                        console.info('R:'+resultado);
                        ventanaHorasRuta(resultado,false);
                    }
                });
            }
        }]
       
    });

    panelNuevaRuta = new Ext.Panel({
        layout: {
            type  : 'vbox',
            align : 'stretch',
            pack  : 'start'
        },
        border: false,
        items:[panelInfoRuta]
    });

});

/**
 * Limpia los campos para salir de la ventana
 */
function limpiarVentana(){
    //Limpia las capas antes de hacer una nueva consulta
    limpiarCapas();

    winNuevaRuta.hide();
    panelInfoRuta.getForm().reset();
}

/**
* Hace el cargado del combo box con un nuevo tipo de recorrido para que se
* carguen las rutas de este.
*/
function recargarCbxNuevaRuta(panelRuta){
    rbTipoRecorrido =  panelRuta.getForm().getValues()['rbTipo'];
    cbxNuevaRuta.reset();
    if(typeof rbTipoRecorrido!='undefined'){
        urlNuevaRuta = phpComboRutas +"?op="+ rbTipoRecorrido;
        storeCbxNuevaRuta.proxy.conn.url = urlNuevaRuta;
        storeCbxNuevaRuta.load();
    }
}

/**
 * Obtine el id y el nombre de las rutas de la BD
 */
var storeCbxNuevaRuta = new Ext.data.JsonStore({
    autoDestroy : true,
    url         : urlNuevaRuta,
    root        : 'rutas',
    fields      : ['id', 'name'],
    failure: function (form, action) {
        Ext.MessageBox.show({
            title   : 'Error...',
            msg     : 'No a ingresado correctamente vuelva a ingresar al sistema...',
            buttons : Ext.MessageBox.OK,
            icon    : Ext.MessageBox.ERROR
        });
    }
});

/**
 * Carga el combo con las rutas
 */
var cbxNuevaRuta = new Ext.form.ComboBox({
    store           : storeCbxNuevaRuta,
    fieldLabel      : 'Ingresar lugares de la nueva ruta',
    id              : 'comboRutas',
    valueField      : 'id',
    displayField    : 'name',
    typeAhead       : true,
    mode            : 'local',
    triggerAction   : 'all',
    tpl             : resultadoTplRutas,
    itemSelector    : 'div.search-item',
    emptyText       : 'Ingresar lugares de la nueva ruta...',
    allowBlank      : false,
    resizable       : true,
    minListWidth    : 300,
    selectOnFocus   : true,
    width           : 455
});

/**
 * Muestra la ventana para ingresar una nueva ruta
 * @return NO retorna valor
 */
function ventanaNuevaRuta(){
    if(!winNuevaRuta){
        winNuevaRuta = new Ext.Window({
            layout      : 'fit',
            title       : 'Nueva Ruta',
            id          : 'vtnNuevaRuta',
            resizable   : false,
            width       : 500,
            height      : 187,
            closeAction : 'hide',
            plain       : false,
            items       : [panelNuevaRuta]
        });
    }
    panelInfoRuta.getForm().reset();
    winNuevaRuta.show(this);
}