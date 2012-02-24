/* 
 * Permite desplegar la venta para buscar la ruta de los buses de la UTPL
 */

var winReporteEstudiantesParada;
var panelComponentes;
var gridReporteEstudiantesParada;
var storeReporteEstudiantesParadas;
var strPerido;

Ext.onReady(function(){
    
    storeReporteEstudiantesParadas = new Ext.data.JsonStore({
        autoDestroy : true,
        url         : "core/php/gui/reportes/getNumeroEstudiantesParada.php",
        root        : 'reporte',
        fields      : [{
            name:'numero',
            type:'int'
        }, 'parada',{
            name:'estudiantes',
            type:'int'
        }],
        timeout     : 1000,
        failure: function (form, action) {
            Ext.MessageBox.show({
                title   : 'Error...',
                msg     : 'No a ingresado correctamente vuelva a ingresar al sistema...',
                buttons : Ext.MessageBox.OK,
                icon    : Ext.MessageBox.ERROR
            });
        }
    });
    
    gridReporteEstudiantesParada = new Ext.grid.GridPanel({
        store       : storeReporteEstudiantesParadas,
        height      : 400,
        stripeRows  : true,
        autoScroll  : true,
        frame       : true,
        title       : 'Reporte',

        columns: [{
            header      : '# Paradas',
            width       : 30,
            dataIndex   : 'numero'
        },{
            header      : 'Paradas',
            width       : 120,
            dataIndex   : 'parada'
        },{
            header      : '# Estudiantes',
            width       : 60,
            dataIndex   : 'estudiantes'
        }],
        viewConfig: {
            forceFit: true
        },

        buttons: [{
            xtype       : 'radiogroup',
            fieldLabel  : 'Exportar',
            allowBlank  : false,
            width       : 100,
            items: [
            {
                boxLabel    : 'PDF',
                name        : 'rbTipo',
                inputValue  : 'pdf'
            },{
                boxLabel    : 'Excel',
                name        : 'rbTipo',
                inputValue  : 'xls'
            }]
        },{
            text: 'Exportar',
            handler: function() {
                if(gridReporteEstudiantesParada.store.data.length>0){
                    var exportar = panelComponentes.getForm().getValues()['rbTipo']
                    if(typeof exportar != 'undefined'){
                        generarReporte(exportar);
                    
                    }else{
                        Ext.MessageBox.show({
                            title   : 'Error...',
                            msg     : 'Debe seleccionar un formato para generar el reporte...',
                            buttons : Ext.MessageBox.OK,
                            icon    : Ext.MessageBox.ERROR
                        });
                    }
                }else{
                    Ext.MessageBox.show({
                        title   : 'Error...',
                        msg     : 'Debe seleccionar el periodo acad\xE9mico del que se quiere generar el reporte...',
                        buttons : Ext.MessageBox.OK,
                        icon    : Ext.MessageBox.ERROR
                    });
                }
            }
        }]
    });
    
    panelComponentes  = new Ext.FormPanel({
        frame       : true,
        bodyStyle   : 'padding:5px 5px 0',
        items: [{
            columnWidth : 1,
            layout      : 'form',
            labelWidth  : 120,
            items: [
            cbxPeriodoAcademico
            ]
        },{
            layout:'column',
            items:[{
                columnWidth : 1,
                layout      : 'form',
                labelWidth  : 60,
                labelAlign  : 'top',
                items: [
                gridReporteEstudiantesParada
                ]
            }]
        }]
    });

});

/**
 * Obtine el id y el nombre del periodo academico
 */
var storeCbxPeriodoAcademico = new Ext.data.JsonStore({
    autoDestroy : true,
    autoLoad    : true,
    url         : "core/php/gui/comboPeriodosAcademicos.php",
    root        : 'periodos',
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
 * Carga el combo con los periodos academicos
 */
var cbxPeriodoAcademico = new Ext.form.ComboBox({
    store           : storeCbxPeriodoAcademico,
    fieldLabel      : 'Periodo Acad\xE9mico',
    id              : 'cbxPeriodo',
    valueField      : 'id',
    displayField    : 'name',
    typeAhead       : true,
    mode            : 'local',
    triggerAction   : 'all',
    tpl             : resultadoTplRutas,
    itemSelector    : 'div.search-item',
    emptyText       : 'Seleccionar Periodo...',
    allowBlank      : false,
    resizable       : true,
    editable        : false,
    minListWidth    : 300,
    selectOnFocus   : true,
    width           : 250,
    listeners: {
        select: function(combo, record, index){
            recargarTablaPerido(record.data.name);
        }
    }
});

/**
 * Recarga la tabla con el parametro a filtrar
 */
function recargarTablaPerido(periodo){
    strPerido = periodo;
    storeReporteEstudiantesParadas.proxy.conn.url = "core/php/gui/reportes/getNumeroEstudiantesParada.php?periodo="+periodo;
    storeReporteEstudiantesParadas.load();
}

/**
 * Permite guardar los puntos que se recolecten para la nueva ruta dentro del
 * servidor...
 */
function generarReporte(formato){
    if(formato=='xls'){
        var link = 'data:application/vnd.ms-excel;base64,' + Base64.encode(gridReporteEstudiantesParada.getExcelXml());
        document.location = link;
    }else{
        window.open('core/php/gui/reportes/getNumeroEstudiantesParadaPDF.php?periodo='+strPerido);
    }
}

/**
* Muestra la ventana para buscar una ruta
*/
function ventanaReporteEstudiantesParada(){
    if(!winReporteEstudiantesParada){
        winReporteEstudiantesParada = new Ext.Window({
            layout      : 'fit',
            title       : 'Reporte de N\xFAmero de Estudiantes por Parada...',
            resizable   : true,
            width       : 600,
            height      : 480,
            closeAction : 'hide',
            plain       : false,
            items       : [panelComponentes]
        });
    }
   
    winReporteEstudiantesParada.show(this);
}
