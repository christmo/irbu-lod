/* 
 * Permite desplegar la venta para buscar la ruta de los buses de la UTPL
 */

var winNuevaParada;
var panelNuevaParada;
var frmPanelNuevaParada;

Ext.onReady(function(){

    var campos = [
    {
        fieldLabel  : 'Direcci\xf3n',
        allowBlank  : false,
        empyText    : 'Ingresar direcci\xf3n de la parada...',
        id          : 'dir',
        maxLength   : 255
    },{
        xtype       : 'textarea',
        fieldLabel  : 'Referencia',
        allowBlank  : false,
        empyText    : 'Ingresar una referencia para la parada...',
        id          : 'ref',
        maxLength   : 300,
        ancho       : '100%'
    },{
        xtype       : 'container',
        anchor      : '100%',
        layout      : 'column',
        bodyStyle   :'padding:5px 5px 0',
        items:[{
            xtype       : 'container',
            columnWidth : .5,
            layout      : 'form',
            items: [{
                xtype   : 'box',
                autoEl: {
                    cn  : '0.0'
                },
                fieldLabel  : 'Latitud',
                editable    : false,
                id          : 'latParada',
                anchor      : '90%'
            }]
        },{
            xtype       : 'container',
            columnWidth : .5,
            layout      : 'form',
            items: [{
                xtype   : 'box',
                autoEl: {
                    cn  : '0.0'
                },
                fieldLabel  : 'Longitud',
                editable    : false,
                id          : 'lonParada',
                anchor      : '97%'
            }]
        }]
    },{
        xtype       : 'fileuploadfield',
        fieldLabel  : 'Imagen',
        allowBlank  : false,
        empyText    : 'Cargar la imagen de la parada...',
        buttonText  : 'Seleccionar Imagen',
        width       : 200,
        id          : 'form-file-1',
        name        : 'img[]'
    }];

     frmPanelNuevaParada = new Ext.FormPanel({
        width       : 300,
        height      : 190,
        frame       : true,
        bodyStyle   : 'padding: 6px',
        labeWidth   : 40,
        fileUpload  : true,
        defaultType : 'textfield',
        defaults:{
            msgTarget   : 'side',
            anchor      : '-5'
        },
        items       : campos,
       
        buttons: [ {
            text: 'Limpiar',
            handler: function() {
                resetFormularioNuevaParada();
                booCapturarPuntosNuevaParada=true;
            }
        },{
            text    : 'Guardar',
            id      : 'btnGuardarParada',
            handler: function() {
                frmPanelNuevaParada.getForm().submit({
                    url     : 'core/php/core/guardarParada.php',
                    waitMsg : 'Subiendo Imagen...',
                    params: {
                        lon: Ext.get('lonParada').dom.innerHTML,
                        lat: Ext.get('latParada').dom.innerHTML
                    },
                    success: function(form, o) {
                        console.info(o.response.responseText);
                        //obj = Ext.util.JSON.decode(o.response.responseText);
                        Ext.MessageBox.show({
                            title   : 'Mensaje...',
                            msg     : 'Parada creada correctamente...',
                            buttons : Ext.MessageBox.OK,
                            icon    : Ext.MessageBox.INFO
                        });
                        resetFormularioNuevaParada();
                        booCapturarPuntosNuevaParada=true;
                    }
                });
            }
        },{
            text: 'Cancelar',
            handler: function() {
                resetFormularioNuevaParada();
                booCapturarPuntosNuevaParada=false;
                winNuevaParada.hide();
            }
        }]
    });

    panelNuevaParada = new Ext.Panel({
        layout: {
            type    : 'vbox',
            align   : 'stretch',
            pack    : 'start'
        },
        border  : false,
        items   : [frmPanelNuevaParada]
    });

});

/**
 * Muestra la ventana para ingresar una nueva parada
 * @return NO retorna valor
 */
function ventanaNuevaParada(){
    if(!winNuevaParada){
        winNuevaParada = new Ext.Window({
            layout      : 'fit',
            title       : 'Nueva Parada',
            resizable   : false,
            width       : 600,
            height      : 220,
            closeAction : 'hide',
            plain       : false,
            items       : [panelNuevaParada]
        });
    }
    booCapturarPuntosNuevaParada=true;
    winNuevaParada.show(this);
}

/**
 * Limpia la ventana para recivir nuevos datos
 */
function resetFormularioNuevaParada(){
    frmPanelNuevaParada.getForm().reset();
    Ext.get('latParada').dom.innerHTML = '0.0';
    Ext.get('lonParada').dom.innerHTML = '0.0';
    limpiarCapaNuevaRuta();
}