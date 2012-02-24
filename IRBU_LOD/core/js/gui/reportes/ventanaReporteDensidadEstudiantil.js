/* 
 * Permite desplegar la venta para buscar la ruta de los buses de la UTPL
 */

var winReporteDensidadEstudiantil;
var panelComponentesDensidadEstudiantil;
var gridReporteDensidadEstudiantil;
var storeReporteDensidadEstudiantil;
var strPeridoDensidadEstudiantil;

Ext.onReady(function(){
    
    storeReporteDensidadEstudiantil = new Ext.data.JsonStore({
        autoDestroy : true,
        url         : "core/php/gui/reportes/getDensidadEstudiantes.php",
        root        : 'casas',
        fields      : 
        [{
            name:'numero',
            type:'int'
        }, 
        'ci',
        'dir',
        {
            name:'lat',
            type:'float'
        },{
            name:'lon',
            type:'float'
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
    
    gridReporteDensidadEstudiantil = new Ext.grid.GridPanel({
        store       : storeReporteDensidadEstudiantil,
        height      : 400,
        stripeRows  : true,
        autoScroll  : true,
        frame       : true,
        title       : 'Reporte',

        columns: [{
            header      : '# Estudiantes',
            width       : 30,
            dataIndex   : 'numero'
        },{
            header      : 'Cedula',
            width       : 60,
            dataIndex   : 'ci'
        },{
            header      : 'Direccion',
            width       : 130,
            dataIndex   : 'dir'
        },{
            header      : 'Latitud',
            width       : 60,
            dataIndex   : 'lat'
        },{
            header      : 'Longitud',
            width       : 60,
            dataIndex   : 'lon'
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
                if(gridReporteDensidadEstudiantil.store.data.length>0){
                    var exportar = panelComponentesDensidadEstudiantil.getForm().getValues()['rbTipo']
                    if(typeof exportar != 'undefined'){
                        generarReporteDE(exportar);
                    
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
        
        },{
            text: 'Graficar',
            handler: function() {
                winReporteDensidadEstudiantil.hide();
                graficarDensidadEstudiantil();
            }
        }]
    });
    
    panelComponentesDensidadEstudiantil  = new Ext.FormPanel({
        frame       : true,
        bodyStyle   : 'padding:5px 5px 0',
        items: [{
            columnWidth : 1,
            layout      : 'form',
            labelWidth  : 120,
            items: [
            cbxPeriodoAcademicoDE
            ]
        },{
            layout:'column',
            items:[{
                columnWidth : 1,
                layout      : 'form',
                labelWidth  : 60,
                labelAlign  : 'top',
                items: [
                gridReporteDensidadEstudiantil
                ]
            }]
        }]
    });

});

/**
 * Obtine el id y el nombre del periodo academico
 */
var storeCbxPeriodoAcademicoDE = new Ext.data.JsonStore({
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
var cbxPeriodoAcademicoDE = new Ext.form.ComboBox({
    store           : storeCbxPeriodoAcademicoDE,
    fieldLabel      : 'Periodo Acad\xE9mico',
    id              : 'cbxPeriodoAcademicoDE',
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
            recargarTablaPeridoDE(record.data.name);
        }
    }
});

/* 
 * Hace la consulta al servidor para traer las viviendas de los estudiantes
 * para generar el reporte grafico de densidad estudiantil
 */
function graficarDensidadEstudiantil(){
    var url = 'core/php/gui/reportes/getDensidadEstudiantes.php?periodo='+strPeridoDensidadEstudiantil;
    
    Ext.Ajax.request({
        url     : url,
        method  : 'GET',
        success: function (result) {
            var r = Ext.util.JSON.decode(result.responseText);
            try{
                limpiarCapas();
                var datos = r.casas;
                selectFeaturesEstudiante.activate();
                dibujarDensidadEstudiantes(datos);
            }catch(e){
            //No hacer nada si no encuentra paradas
            }  
        },
        timeout : 1000
    });
}

/**
 * Recarga la tabla con el parametro a filtrar
 */
function recargarTablaPeridoDE(periodo){
    strPeridoDensidadEstudiantil = periodo;
    storeReporteDensidadEstudiantil.proxy.conn.url = "core/php/gui/reportes/getDensidadEstudiantes.php?periodo="+periodo;
    storeReporteDensidadEstudiantil.load();
}

/**
 * Permite guardar los puntos que se recolecten para la nueva ruta dentro del
 * servidor...
 */
function generarReporteDE(formato){
    if(formato=='xls'){
        var link = 'data:application/vnd.ms-excel;base64,' + Base64.encode(gridReporteDensidadEstudiantil.getExcelXml());
        document.location = link;
    }else{
        window.open('core/php/gui/reportes/getDensidadEstudiantesPDF.php?periodo='+strPeridoDensidadEstudiantil);
    }
}

/**
* Muestra la ventana para buscar una ruta
*/
function ventanaReporteDensidadEstudiantil(){
    if(!winReporteDensidadEstudiantil){
        winReporteDensidadEstudiantil = new Ext.Window({
            layout      : 'fit',
            title       : 'Reporte de Densidad de Viviendas de Estudiantes...',
            resizable   : true,
            width       : 600,
            height      : 480,
            closeAction : 'hide',
            plain       : false,
            items       : [panelComponentesDensidadEstudiantil]
        });
    }
   
    winReporteDensidadEstudiantil.show(this);
}
