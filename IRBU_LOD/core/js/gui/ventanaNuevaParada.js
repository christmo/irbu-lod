/* 
 * Permite desplegar la venta para buscar la ruta de los buses de la UTPL
 */

var winNuevaParada;
var panelNuevaParada;

Ext.onReady(function(){

    var campos = [
    {
        fieldLabel:'Direcci\xf3n',
        allowBlank: false,
        empyText: 'Ingresar direcci\xf3n de la parada...',
        id: 'dir',
        maxLength: 255
    },{
        xtype: 'textarea',
        fieldLabel:'Referencia',
        allowBlank: false,
        empyText: 'Ingresar una referencia para la parada...',
        id:'ref',
        maxLength: 300,
        ancho:'100%'
    },{
        xtype: 'fileuploadfield',
        fieldLabel:'Imagen',
        allowBlank: false,
        empyText: 'Cargar la imagen de la parada...',
        buttonText: 'Seleccionar Imagen',
        width: 200,
        id: 'form-file-1',
        name: 'img[]'
    }];

    var formPanel = new Ext.FormPanel({
        width: 300,
        height: 170,
        frame: true,
        bodyStyle: 'padding: 6px',
        labeWidth: 40,
        fileUpload: true,
        buttonAlign: 'center',
        defaultType: 'textfield',
        defaults:{
            msgTarget: 'side',
            anchor: '-10'
        },
        items:campos,
       
        buttons: [{
            text: 'Subir',
            handler: function() {
                formPanel.getForm().submit({
                    url: 'core/php/core/upload.php',
                    waitMsg: 'Subiendo Imagen...',
                    success: function(form, o) {
                        console.info(o.response.responseText);
                        /*obj = Ext.util.JSON.decode(o.response.responseText);
                        if (obj.failed == '0' && obj.uploaded != '0') {
                            Ext.Msg.alert('Success', 'All files uploaded');
                        } else if (obj.uploaded == '0') {
                            Ext.Msg.alert('Success', 'Nothing Uploaded');
                        } else {
                            Ext.Msg.alert('Success',
                                obj.uploaded + ' files uploaded <br/>' +
                                obj.failed + ' files failed to upload');
                        }
                        formPanel.getForm().reset();*/
                    //store.load();
                    }
                });
            }
        }, {
            text: 'Limpiar',
            handler: function() {
                formPanel.getForm().reset();
            }
        }]
    });

    panelNuevaParada = new Ext.Panel({
        layout: {
            type: 'vbox',
            align : 'stretch',
            pack  : 'start'
        },
        border: false,
        items:[formPanel]
    });

});

/**
 * Muestra la ventana para ingresar una nueva parada
 * @return NO retorna valor
 */
function ventanaNuevaParada(){
    if(!winNuevaParada){
        winNuevaParada = new Ext.Window({
            layout:'fit',
            title:'Nueva Parada',
            resizable : false,
            width:600,
            height:200,
            closeAction:'hide',
            plain: false,
            //html: '<img src="http://www.google.co.za/intl/en%5Fcom/images/logo%5Fplain.png" />'
            items: [panelNuevaParada]
        });
    }
    winNuevaParada.show(this);
}

