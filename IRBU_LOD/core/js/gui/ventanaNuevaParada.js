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
        xtype: 'container',
        anchor: '100%',
        layout:'column',
        //labelAlign: 'top',
        bodyStyle:'padding:5px 5px 0',
        items:[{
            xtype: 'container',
            columnWidth:.5,
            layout: 'form',
            items: [{
                //xtype:'textfield',
                xtype: 'box',
                autoEl: {
                    cn: '0.0'
                },
                fieldLabel: 'Latitud',
                editable: false,
                id: 'latParada',
                anchor:'90%'
            }]
        },{
            xtype: 'container',
            columnWidth:.5,
            layout: 'form',
            items: [{
                //xtype:'textfield',
                xtype: 'box',
                autoEl: {
                    cn: '0.0'
                },
                fieldLabel: 'Longitud',
                editable: false,
                id: 'lonParada',
                anchor:'97%'
            }]
        }]
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
        height: 190,
        frame: true,
        bodyStyle: 'padding: 6px',
        labeWidth: 40,
        fileUpload: true,
        //buttonAlign: 'center',
        defaultType: 'textfield',
        defaults:{
            msgTarget: 'side',
            anchor: '-10'
        },
        items:campos,
       
        buttons: [ {
            text: 'Limpiar',
            handler: function() {
                formPanel.getForm().reset();
                Ext.get('latParada').dom.innerHTML = '0.0';
                Ext.get('lonParada').dom.innerHTML = '0.0';
                booCapturarPuntosNuevaParada=false;
            }
        },{
            text: 'Guardar',
            id: 'btnGuardarParada',
            handler: function() {
                formPanel.getForm().submit({
                    url: 'core/php/core/guardarParada.php',
                    waitMsg: 'Subiendo Imagen...',
                    params: {
                        lon: Ext.get('lonParada').dom.innerHTML,
                        lat: Ext.get('latParada').dom.innerHTML
                    },
                    success: function(form, o) {
                        console.info(o.response.responseText);
                        //obj = Ext.util.JSON.decode(o.response.responseText);
                        Ext.MessageBox.show({
                            title: 'Mensaje...',
                            msg: 'Parada creada correctamente...',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO
                        });
                        formPanel.getForm().reset();
                        Ext.get('latParada').dom.innerHTML = '0.0';
                        Ext.get('lonParada').dom.innerHTML = '0.0';
                        booCapturarPuntosNuevaParada=true;
                        
                        limpiarCapaNuevaRuta();
                    }
                });
            }
        },{
            text: 'Cancelar',
            handler: function() {
                formPanel.getForm().reset();
                Ext.get('latParada').dom.innerHTML = '0.0';
                Ext.get('lonParada').dom.innerHTML = '0.0';
                booCapturarPuntosNuevaParada=false;
                winNuevaParada.hide();
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
            height:220,
            closeAction:'hide',
            plain: false,
            //html: '<img src="http://www.google.co.za/intl/en%5Fcom/images/logo%5Fplain.png" />'
            items: [panelNuevaParada]
        });
    }
    booCapturarPuntosNuevaParada=true;
    winNuevaParada.show(this);
}

