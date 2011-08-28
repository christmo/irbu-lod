/* 
 * Permite desplegar la venta para buscar la ruta de los buses de la UTPL
 */

var winHorasRuta;
var panelHoras;
var grid;
var spiner;
var proxy;
var id_ruta;
var contadorHoras=1;

Ext.onReady(function(){

    spiner = new Ext.ux.form.Spinner({
        fieldLabel: 'Hora de Recorrido',
        width: 100,
        name: 'hora',
        value: '06:30',
        strategy: new Ext.ux.form.Spinner.TimeStrategy({
            minValue:'06:30',
            maxValue:'21:00',
            incrementValue: 30
        }),
        allowBlank:false,
        emptyText:'Hora de recorrido...'
    });
    
    grid = new Ext.grid.GridPanel({
        store: storeHorasRuta,
        bodyStyle:'padding:5px 5px 0',
        autoScroll: true,
        frame: false,
        height:220,
        columns: [{
            header: 'N\xFAmero',
            width: 30,
            dataIndex: 'numero'
        },{
            header: 'Hora',
            width: 60,
            dataIndex: 'hora'
        },{
            xtype: 'actioncolumn',
            width: 15,
            items: [{
                icon   : 'img/delete.gif',  // Use a URL in the icon config
                tooltip: 'Eliminar Hora',
                handler: function(grid, rowIndex, colIndex) {
                    storeHorasRuta.removeAt(rowIndex);
                }
            }]
        }],
        viewConfig: {
            forceFit: true
        },

        buttons: [{
            text: 'Guardar',
            handler: function() {
                //enviar los datos de la tabla a la base
                guardarHorasRuta();
            }
        }]
    });
    
    panelHoras  = new Ext.FormPanel({
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        width: 500,

        items: [{
            columnWidth:1,
            layout: 'form',
            labelWidth:105,
            items: [
            spiner
            ]
        },{
            columnWidth:1,
            layout: 'form',
            labelAlign: 'top',
            labelWidth:60,
            items: [{
                xtype: "button",
                text: "Agregar",
                icon: "img/add.png",
                buttonAlign: 'right',
                cls:"x-btn-text-icon",
                handler: function() {
                    storeHorasRuta.add(new Ext.data.Record({
                        numero: contadorHoras,
                        hora: spiner.getValue()
                    }));
                    contadorHoras++;
                }
            }]
        },{
            layout:'column',
            items:[{
                columnWidth:1,
                layout: 'form',
                labelWidth: 60,
                labelAlign: 'top',
                items: [
                grid
                ]
            }]
        }]
    });

});

/**
 * Permite guardar los puntos que se recolecten para la nueva ruta dentro del
 * servidor...
 */
function guardarHorasRuta(){
    Ext.Ajax.request({
        url: 'core/php/core/guardarHorasRuta.php',
        method: 'POST',
        success: function (result) {
            var r = Ext.util.JSON.decode(result.responseText);
            winHorasRuta.hide();
            storeHorasRuta.removeAll();
            ventanaPuntosRuta(r.id);
        },
        timeout: 1000,
        params: {
            horas: getJsonOfStore(storeHorasRuta),
            id_ruta: id_ruta
        }
    });
}

var myData = [];

proxy = new Ext.data.MemoryProxy(myData);

/**
 * Campos de la tabla de nueva ruta
 */
var myReader = new Ext.data.ArrayReader({},
    [{
        name: 'numero'
    },{
        name: 'hora',
        type: 'time'
    }]);

/**
 * Store para alamcenar los puntos que se van seleccionando para crear una
 * nueva ruta.
 */
storeHorasRuta = new Ext.data.Store({
    autoDestroy: true,
    reader: myReader,
    proxy: proxy,
    autoLoad: true
});


/**
* Muestra la ventana para buscar una ruta
* @return NO retorna valor
*/
function ventanaHorasRuta(id){
    if(!winHorasRuta){
        winHorasRuta = new Ext.Window({
            layout:'fit',
            title:'Horas Ruta',
            resizable : true,
            width:250,
            height:310,
            closeAction:'hide',
            plain: false,
            items: [panelHoras]
        });
    }
    this.id_ruta = id;
    winHorasRuta.show(this);
}
