/* 
 * Permite desplegar la venta para editar una parada seleccionada
 */

var winEditarParada;
var panelEditarParada;
var idParada_vep=0;
var frmPanelEditarParada;

Ext.onReady(function(){

    var campos = [
    {
        fieldLabel:'Direcci\xf3n',
        allowBlank: false,
        empyText: 'Ingresar direcci\xf3n de la parada...',
        id: 'dir_vep', //Sufijo del archivo que se encuentra este id iniciales
        maxLength: 255
    },{
        xtype: 'textarea',
        fieldLabel:'Referencia',
        allowBlank: false,
        empyText: 'Ingresar una referencia para la parada...',
        id:'ref_vep',
        maxLength: 300,
        ancho:'100%'
    },{
        xtype: 'container',
        anchor: '100%',
        layout:'column',
        style: {
            marginTop: '6px',
            marginBottom: '6px'
        },
        items:[{
            xtype: 'container',
            columnWidth:.5,
            items: [{
                xtype: 'container',
                anchor: '100%',
                layout:'column',
                items:[{
                    xtype: 'container',
                    columnWidth:.5,
                    items: [{
                        xtype: 'label',
                        text: 'Latitud'
                    }]
                },{
                    xtype: 'container',
                    columnWidth:.5,
                    items: [{
                        xtype: 'label',
                        id: 'latParada_vep',
                        text: '0.0'
                    }]
                }]
            }]
        },{
            xtype: 'container',
            columnWidth:.5,
            items: [{
                xtype: 'container',
                columnWidth:.5,
                items: [{
                    xtype: 'container',
                    anchor: '100%',
                    layout:'column',
                    items:[{
                        xtype: 'container',
                        columnWidth:.5,
                        items: [{
                            xtype: 'label',
                            text: 'Longitud'
                        }]
                    },{
                        xtype: 'container',
                        columnWidth:.5,
                        items: [{
                            xtype: 'label',
                            id: 'lonParada_vep',
                            text: '0.0'
                        }]
                    }]
                }]
            }]
        }]
    },{
        xtype: 'fileuploadfield',
        fieldLabel:'Imagen',
        allowBlank: true,
        empyText: 'Cargar la imagen de la parada...',
        buttonText: 'Seleccionar Imagen',
        width: 200,
        id: 'form-file-1_vep',
        name: 'img[]'
    }];

    frmPanelEditarParada = new Ext.FormPanel({
        width: 300,
        height: 190,
        frame: true,
        bodyStyle: 'padding: 5px',
        labeWidth: 40,
        fileUpload: true,
        defaultType: 'textfield',
        defaults:{
            msgTarget: 'side',
            anchor: '-5'
        },
        items:campos,
       
        buttons: [ {
            text: 'Limpiar',
            handler: function() {
                resetFormularioEditarParada();
                booCapturarPuntosEditarParada=true;
            }
        },{
            text: 'Actualizar',
            id: 'btnActualizarParada_vep',
            handler: function() {
                frmPanelEditarParada.getForm().submit({
                    url: 'core/php/core/actualizarParada.php',
                    waitMsg: 'Subiendo Imagen...',
                    params: {
                        id_parada: idParada_vep,
                        lonParada_vep: Ext.get('lonParada_vep').dom.innerHTML,
                        latParada_vep: Ext.get('latParada_vep').dom.innerHTML
                    },
                    success: function(form, o) {
                        resetFormularioEditarParada();
                        booCapturarPuntosEditarParada=false;
                        winEditarParada.hide();
                        showVentanaImagenes();
                    }
                });
            }
        },{
            text: 'Cancelar',
            handler: function() {
                resetFormularioEditarParada();
                booCapturarPuntosEditarParada=false;
                winEditarParada.hide();
                showVentanaImagenes();
            }
        }]
    });

    panelEditarParada = new Ext.Panel({
        layout: {
            type: 'vbox',
            align : 'stretch',
            pack  : 'start'
        },
        border: false,
        items:[frmPanelEditarParada]
    });

});

/**
 * Muestra la ventana para editar una parada selecionada
 * @return NO retorna valor
 */
function ventanaEditarParada(id,txtDir,txtRef,txtLon,txtLat,urlImg){
    idParada_vep=id;
    if(!winEditarParada){
        winEditarParada = new Ext.Window({
            layout:'fit',
            title:'Editar Parada',
            resizable : false,
            width:600,
            height:220,
            closeAction:'hide',
            plain: false,
            items: [panelEditarParada]
        });
    }
    Ext.getCmp('dir_vep').setValue(txtDir);
    Ext.getCmp('ref_vep').setValue(txtRef);
    Ext.getCmp('lonParada_vep').setText(txtLon);
    Ext.getCmp('latParada_vep').setText(txtLat);
    /*Especificado en el archivo RQ3_AreaBusqueda.js*/
    //    0       1    2      3          4          5       6
    //ID_PARADA, LON, LAT,DIRECCION, REFERENCIA, DIR_IMG, ORDEN
    var tramaParada = id+'%'+txtLon+'%'+txtLat+'%'+txtDir+'%'+txtRef+'%'+urlImg+'%'+1+"#";
    lienzosRecorridoHistorico(tramaParada);
    //dibujarPuntoLienzoParadas(txtLon, txtLat, idParada_vep);
    booCapturarPuntosEditarParada=true;
    actualizarImagenesCargadas();
    winEditarParada.show(this);
}

/**
 * Limpia la ventana para recivir nuevos datos
 */
function resetFormularioEditarParada(){
    Ext.getCmp('latParada_vep').setText('0.0');
    Ext.getCmp('lonParada_vep').setText('0.0');
    frmPanelEditarParada.getForm().reset();
    Ext.getCmp('dir_vep').setValue("");
    Ext.getCmp('ref_vep').setValue("");
    limpiarCapaNuevaRuta();
    limpiarCapaParadas();
}