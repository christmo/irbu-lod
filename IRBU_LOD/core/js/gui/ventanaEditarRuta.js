/* 
 * Permite desplegar la ventana para ingresar una nueva ruta
 */

var winEditarRuta;
var panelEditarRuta;
var panelEditarInfoRuta;

var rbSeleccionarTipoRecorrido='B';
var urlSeleccionarRutaEditar = phpComboRutas+"?op="+rbSeleccionarTipoRecorrido;

var rbEditarTipoRecorrido='B';
var urlEditarRuta = phpComboRutas+"?op="+rbEditarTipoRecorrido;

Ext.onReady(function(){
    
    var idRutaSeleccionada;
    var nombreRutaEditada;
 
    panelEditarInfoRuta = new Ext.FormPanel({
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
                fieldLabel  : 'Seleccionar el tipo de recorrido de la ruta a editar',
                allowBlank  :false,
                items: [
                {
                    boxLabel    : 'Baja de la UTPL',
                    name        : 'rbSeleccionarTipo',
                    inputValue  : 'B',
                    listeners   : {
                        check: function (ctl, val) {
                            recargarCbxSeleccionarRutaEditar(panelEditarInfoRuta);
                        }
                    }
                },{
                    boxLabel    : 'Sube a la UTPL',
                    name        : 'rbSeleccionarTipo',
                    inputValue  : 'R',
                    listeners   : {
                        check: function (ctl, val) {
                            recargarCbxSeleccionarRutaEditar(panelEditarInfoRuta);
                        }
                    }
                },{
                    boxLabel    : 'Sube y baja de la UTPL',
                    name        : 'rbSeleccionarTipo',
                    inputValue  : 'BR',
                    listeners   : {
                        check: function (ctl, val) {
                            recargarCbxSeleccionarRutaEditar(panelEditarInfoRuta);
                        }
                    }
                }]
            }]
        },
        cbxSeleccionarRutaEditar,
        {
            columnWidth : 1,
            layout      : 'form',
            bodyStyle   : 'padding:15px 5px 0',
            items: [{
                xtype       : 'radiogroup',
                fieldLabel  : 'Seleccionar el nuevo tipo de recorrido al que v\xE1 a pertenecer la ruta editada',
                allowBlank  :false,
                items: [
                {
                    boxLabel    : 'Baja de la UTPL',
                    name        : 'rbEditarTipo',
                    inputValue  : 'B',
                    listeners   : {
                        check: function (ctl, val) {
                            recargarCbxEditarRuta(panelEditarInfoRuta);
                        }
                    }
                },{
                    boxLabel    : 'Sube a la UTPL',
                    name        : 'rbEditarTipo',
                    inputValue  : 'R',
                    listeners   : {
                        check: function (ctl, val) {
                            recargarCbxEditarRuta(panelEditarInfoRuta);
                        }
                    }
                },{
                    boxLabel    : 'Sube y baja de la UTPL',
                    name        : 'rbEditarTipo',
                    inputValue  : 'BR',
                    listeners   : {
                        check: function (ctl, val) {
                            recargarCbxEditarRuta(panelEditarInfoRuta);
                        }
                    }
                }]
            }]
        },
        cbxEditarRuta
        ],

        buttons: [{
            text    : 'Editar',
            id      : 'btnEditarRuta_ver',
            handler : function() {
                idRutaSeleccionada  = cbxSeleccionarRutaEditar.getValue();
                nombreRutaEditada   = cbxEditarRuta.getValue();
                panelEditarInfoRuta.getForm().submit({
                    url     : 'core/php/core/editarRuta.php',
                    method  : 'POST',
                    waitMsg : 'Editando Ruta...',
                    timeout : 1000,
                    params: {
                        id_ruta     : idRutaSeleccionada,
                        radioTipoSel: rbSeleccionarTipoRecorrido,
                        nombre_ruta : nombreRutaEditada,
                        radTipoRecor: rbEditarTipoRecorrido
                    },
                    failure : function (form, action) {
                        try{
                            var resultado = Ext.util.JSON.decode(action.response.responseText);
                            switch(resultado.error){
                                case 1:
                                    Ext.MessageBox.show({
                                        title   : 'Error...',
                                        msg     : 'De seleccionar un recorrido de la lista de rutas, la cual se va a cambiar...',
                                        buttons : Ext.MessageBox.OK,
                                        icon    : Ext.MessageBox.ERROR
                                    });
                                    break;
                                case 2:
                                    Ext.MessageBox.show({
                                        title   : 'Error...',
                                        msg     : 'El recorrido ingresado ya existe, escribirlo nuevamente...',
                                        buttons : Ext.MessageBox.OK,
                                        icon    : Ext.MessageBox.ERROR
                                    });  
                                    break;
                            }
                        }catch(e){
                        //No hacer nada
                        }
                    },
                    success: function (form, action) {
                        var resultado = Ext.util.JSON.decode(action.response.responseText);

                        //Limpia las capas antes de hacer una nueva consulta
                        limpiarCapas();
                        strTipoRecorrido = "B"; //siempre la edicion de datos se va a rpoceder como la ruta que baja
                        winEditarRuta.hide();
                        panelEditarInfoRuta.getForm().reset();
                        ventanaHorasRuta(resultado.id,true);
                    }
                });
            }
        }]
    });

    panelEditarRuta = new Ext.Panel({
        layout: {
            type  : 'vbox',
            align : 'stretch',
            pack  : 'start'
        },
        border: false,
        items:[panelEditarInfoRuta]
    });

});

/**
* Hace el cargado del combo box con un nuevo tipo de recorrido para que se
* carguen las rutas de este.
*/
function recargarCbxSeleccionarRutaEditar(panelRuta){
    rbSeleccionarTipoRecorrido =  panelRuta.getForm().getValues()['rbSeleccionarTipo'];
    cbxSeleccionarRutaEditar.reset();
    if(typeof rbSeleccionarTipoRecorrido!='undefined'){
        urlSeleccionarRutaEditar = phpComboRutas +"?op="+ rbSeleccionarTipoRecorrido;
        storeCbxSeleccionarRutaEditar.proxy.conn.url = urlSeleccionarRutaEditar;
        storeCbxSeleccionarRutaEditar.load();
    }
}

/**
* Hace el cargado del combo box con un nuevo tipo de recorrido para que se
* carguen las rutas de este.
*/
function recargarCbxEditarRuta(panelRuta){
    rbEditarTipoRecorrido =  panelRuta.getForm().getValues()['rbEditarTipo'];
    cbxEditarRuta.reset();
    if(typeof rbEditarTipoRecorrido!='undefined'){
        urlEditarRuta = phpComboRutas+"?op="+rbEditarTipoRecorrido;
        storeCbxEditarRuta.proxy.conn.url = urlEditarRuta;
        storeCbxEditarRuta.load();
    }
}

/**
 * Obtine el id y el nombre de las rutas de la BD
 */
var storeCbxSeleccionarRutaEditar = new Ext.data.JsonStore({
    autoDestroy : true,
    url         : urlSeleccionarRutaEditar,
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
var cbxSeleccionarRutaEditar = new Ext.form.ComboBox({
    store           : storeCbxSeleccionarRutaEditar,
    fieldLabel      : 'Seleccionar ruta que se desea editar',
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
 * Obtine el id y el nombre de las rutas de la BD
 */
var storeCbxEditarRuta= new Ext.data.JsonStore({
    autoDestroy : true,
    url         : urlEditarRuta,
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
var cbxEditarRuta = new Ext.form.ComboBox({
    store           : storeCbxEditarRuta,
    fieldLabel      : 'Ingresar lugares de la ruta a editar',
    valueField      : 'id',
    displayField    : 'name',
    typeAhead       : true,
    mode            : 'local',
    triggerAction   : 'all',
    tpl             : resultadoTplRutas,
    itemSelector    : 'div.search-item',
    emptyText       : 'Ingresar lugares de la ruta a editar...',
    allowBlank      : false,
    resizable       : true,
    minListWidth    : 300,
    selectOnFocus   : true,
    width           : 455
});

/**
 * Muestra la ventana para editar una ruta
 * @return NO retorna valor
 */
function ventanaEditarRuta(){
    if(!winEditarRuta){
        winEditarRuta = new Ext.Window({
            layout      : 'fit',
            title       : 'Editar Ruta',
            id          : 'vtnEditarRuta',
            resizable   : false,
            width       : 500,
            height      : 306,
            closeAction : 'hide',
            plain       : false,
            items       : [panelEditarRuta]
        });
    }
    panelEditarInfoRuta.getForm().reset();
    winEditarRuta.show(this);
}