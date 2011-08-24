/* 
 * Permite desplegar la venta para buscar la ruta de los buses de la UTPL
 */

var winNuevaRuta;
var panelNuevaRuta;
var panelInfoRuta;

//var idRuta;
var rbTipoRecorrido='B';
var urlNuevaRuta = phpComboRutas+"?op="+rbTipoRecorrido;

Ext.onReady(function(){
    
    var nombreRuta;
 
    panelInfoRuta = new Ext.FormPanel({
        labelAlign: 'top',
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        labelWidth:60,
        width: 500,

        items: [{
            columnWidth:1,
            layout: 'form',
            items: [{
                xtype: 'radiogroup',
                fieldLabel: 'Tipo de recorrido',
                allowBlank:false,
                items: [
                {
                    boxLabel: 'Baja de la UTPL',
                    name: 'rbTipo',
                    inputValue: 'B',
                    //checked: true,
                    listeners: {
                        check: function (ctl, val) {
                            //recargarCbxRutasNuevaRuta();
                            recargarCbxNuevaRuta(panelInfoRuta);
                        }
                    }
                },{
                    boxLabel: 'Sube a la UTPL',
                    name: 'rbTipo',
                    inputValue: 'R',
                    listeners: {
                        check: function (ctl, val) {
                            //recargarCbxRutasNuevaRuta();
                            recargarCbxNuevaRuta(panelInfoRuta);
                        }
                    }
                },{
                    boxLabel: 'Sube y baja de la UTPL',
                    name: 'rbTipo',
                    inputValue: 'BR',
                    listeners: {
                        check: function (ctl, val) {
                            //recargarCbxRutasNuevaRuta();
                            recargarCbxNuevaRuta(panelInfoRuta);
                        }
                    }
                }]
            }]
        },{
            layout: 'form',
            items: [
            cbxNuevaRuta
            ]
        }],

        buttons: [{
            text: 'Guardar',
            handler: function() {
                nombreRuta=cbxNuevaRuta.getValue();
                panelInfoRuta.getForm().submit({
                    url : 'core/php/core/guardarRuta.php?nombreRuta='+nombreRuta+'&radioTipo='+rbTipoRecorrido,
                    method:'POST',
                    waitMsg : 'Guardando Ruta...',
                    failure: function (form, action) {
                        Ext.MessageBox.show({
                            title: 'Error...',
                            msg: 'Ruta ya guardada...',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    },
                    success: function (form, action) {
                        var resultado = Ext.util.JSON.decode(action.response.responseText);

                        //Limpia las capas antes de hacer una nueva consulta
                        limpiarCapas();

                        //dibujar la ruta en el mapa
                        //dibujarTrazado(resultado.datos.msg);

                        //dibujar las paradas en esa ruta
                        //buscarParadas(id_ruta,radioTipo);

                        //Limpia los datos del formulario y lo oculta
                        //limpiar_datos_rutas();

                        /* Ext.MessageBox.show({
                            title: 'Mensaje...',
                            msg: 'Guardado correctamente...',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFORMATION
                        });*/
                        console.info(resultado.id);
                        winNuevaRuta.close();
                        ventanaPuntosRuta();
                    }
                });
            }
        }]
       
    });

    panelNuevaRuta = new Ext.Panel({
        layout: {
            type: 'vbox',
            align : 'stretch',
            pack  : 'start'
        },
        border: false,
        items:[panelInfoRuta]
    });

});

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
 * Obtiene el ID de la ruta seleccionada en el combo box
 */
function seleccionarRutaCbx(){
//idRuta = cbxNuevaRuta.getValue();
}

/**
 * Obtine el id y el nombre de las rutas de la BD
 */
var storeCbxNuevaRuta = new Ext.data.JsonStore({
    autoDestroy: true,
    url: urlNuevaRuta,
    root: 'rutas',
    fields: ['id', 'name'],
    failure: function (form, action) {
        Ext.MessageBox.show({
            title: 'Error...',
            msg: 'No a ingresado correctamente vuelva a ingresar al sistema...',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
});
/**
 * Carga el combo con las rutas
 */
var cbxNuevaRuta = new Ext.form.ComboBox({
    store: storeCbxNuevaRuta,
    fieldLabel: 'Ingresar lugares de la nueva ruta',
    valueField: 'id',
    displayField: 'name',
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    tpl: resultadoTplRutas,
    itemSelector: 'div.search-item',
    emptyText:'Ingresar lugares de la nueva ruta...',
    allowBlank:false,
    resizable:true,
    minListWidth:300,
    selectOnFocus:true,
    width: 455/*,
    listeners:{
        'select': seleccionarRutaCbx
    }*/
});

/**
 * Muestra la ventana para ingresar una nueva ruta
 * @return NO retorna valor
 */
function ventanaNuevaRuta(){
    if(!winNuevaRuta){
        winNuevaRuta = new Ext.Window({
            layout:'fit',
            title:'Nueva Ruta',
            resizable : false,
            width:500,
            height:180,
            closeAction:'hide',
            plain: false,
            items: [panelNuevaRuta]
        });
    }
    winNuevaRuta.show(this);
}