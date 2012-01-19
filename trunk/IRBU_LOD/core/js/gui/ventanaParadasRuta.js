/* 
 * Permite desplegar la ventana para seleccionar las paradas que pertenecen
 * a una ruta
 */

var winParadasRuta;
var panelParadasRuta;
var frmPanelParadasRuta;
var listaParadasSeleccionadas;
var listaParadas;
var id_ruta_vpr;
var storeParadasSelecionadas;
var storeParadas;

Ext.onReady(function(){

    storeParadas = new Ext.data.JsonStore({
        autoDestroy : true,
        //        autoLoad    : true,
        url         : "core/php/gui/listaParadas.php",
        root        : 'paradas',
        fields      : [{
            name    : 'numero',    
            mapping : 'numero'
        },{
            name    : 'id',    
            mapping : 'id'
        },{
            name    : 'direccion',  
            mapping : 'direccion'
        },{
            name    : 'url_img', 
            mapping : 'url_img'
        }],
        timeout : 1000,
        failure: function (form, action) {
            Ext.MessageBox.show({
                title   : 'Error...',
                msg     : 'Precione F5 para actualizar la p\xE1gina...',
                buttons : Ext.MessageBox.OK,
                icon    : Ext.MessageBox.ERROR
            });
        }
    });
        
    listaParadas = new Ext.grid.GridPanel({
        title           : 'Lista de paradas...',
        store           : storeParadas,
        loadMask        : true,
        stripeRows      : true,
        enableDragDrop  : true,
        ddGroup         : 'depGridDD',
        autoExpandColumn: 'numero',
        columns         : [{
            header      : '(#)',
            dataIndex   : 'numero',
            id          : 'numero',
            width       : 15
        },{
            header    : 'Direcci\xF3n',
            dataIndex : 'direccion',
            width     : 235
        }]
    });
                
    /* Tooltip para la lista derecha de todas las paradas */
    listaParadas.on('render', function() {
        /* Setup tooltip */
        listaParadas.tip = new Ext.ToolTip({
            view        : listaParadas.getView(),
            target      : listaParadas.getView().mainBody,
            delegate    : '.x-grid3-row',
            trackMouse  : true,
            renderTo    : document.body,
            listeners: {
                beforeshow: function updateTipBody(tip) {
                    var i      = listaParadas.getView().findRowIndex(tip.triggerElement);
                    var record = listaParadas.getStore().getAt(i);
                    var dir    = procesarTextoDireccion(record.get('direccion'));
                    tip.body.dom.innerHTML = "Direcci\xF3n:<br/>"+dir+'<br/>'+'<img src="'+record.get('url_img')+'" width=220 height=160 />';
                }
            }
        });
    });
                
    storeParadasSelecionadas = new Ext.data.JsonStore({
        autoDestroy : true,
        //autoLoad    : true,
        url         : "core/php/gui/getParadas.php",
        root        : 'paradas',
        fields      : [{
            name    : 'numero',    
            mapping : 'numero'
        },{
            name    : 'id',    
            mapping : 'id'
        },{
            name    : 'direccion',  
            mapping : 'direccion'
        },{
            name    : 'url_img', 
            mapping : 'url_img'
        }],
        timeout : 1000,
        params: {
            id_ruta : id_ruta_vpr
        },
        failure: function (form, action) {
            Ext.MessageBox.show({
                title   : 'Error...',
                msg     : 'Precione F5 para actualizar la p\xE1gina...',
                buttons : Ext.MessageBox.OK,
                icon    : Ext.MessageBox.ERROR
            });
        }
    });

    listaParadasSeleccionadas = new Ext.grid.GridPanel({
        title            : 'Paradas para esta ruta...',
        store            : storeParadasSelecionadas,
        loadMask         : true,
        stripeRows       : true,
        enableDragDrop   : true,
        ddGroup          : 'depGridDD',
        autoExpandColumn : 'numero',
        columns          : [{
            header    : '[#]',
            dataIndex : 'numero',
            id        : 'numero',
            width     : 15
        },{
            header    : 'Direcci\xF3n',
            dataIndex : 'direccion',
            width     : 235
        }]
    });

    /* Tooltip para la tabla de la derecha lista de paradas selecinadas */
    listaParadasSeleccionadas.on('render', function() {
        /* Setup tooltip */
        listaParadasSeleccionadas.tip = new Ext.ToolTip({
            view        : listaParadasSeleccionadas.getView(),
            target      : listaParadasSeleccionadas.getView().mainBody,
            delegate    : '.x-grid3-row',
            trackMouse  : true,
            renderTo    : document.body,
            listeners: {
                beforeshow: function updateTipBody(tip) {
                    var i      = listaParadasSeleccionadas.getView().findRowIndex(tip.triggerElement);
                    var record = listaParadasSeleccionadas.getStore().getAt(i);
                    var dir    = procesarTextoDireccion(record.get('direccion'));
                    tip.body.dom.innerHTML = "Direcci\xF3n:<br/>"+dir+'<br/>'+'<img src="'+record.get('url_img')+'" width=220 height=160 />';
                }
            }
        });
    });

    frmPanelParadasRuta = new Ext.FormPanel({
        layout   : 'hbox',
        defaults : {
            flex    : 1,
            frame   : false
        },
        layoutConfig: {
            align   : 'stretch'
        },
        items : [
        listaParadas,
        listaParadasSeleccionadas
        ],
       
        buttons: [{
            text: 'Limpiar',
            handler: function() {
                resetFormularioParadasRuta();
            }
        },{
            text: 'Guardar',
            id  : 'btnGuardarParada',
            handler: function() {
                frmPanelParadasRuta.getForm().submit({
                    url     : 'core/php/core/guardarParadasRuta.php',
                    waitMsg : 'Guardando paradas...',
                    params: {
                        paradas : getJsonOfStore(listaParadasSeleccionadas.store),
                        id_ruta : id_ruta_vpr
                    },
                    success: function(form, o) {
                        resetFormularioParadasRuta();
                        winParadasRuta.hide();
                    }
                });
            }
        },{
            text: 'Cancelar',
            handler: function() {
                resetFormularioParadasRuta();
                winParadasRuta.hide();
            }
        }]
    });

});


/**
 * Permite crear el efecto para arrastras una parada de las lista hacia
 * la otra tabla para luego guardar solo las listas seleccionadas
 */
function efectoDragAndDropListas(){
    var dropZoneOverrides = {
        ddGroup           : 'depGridDD',
        onContainerOver : function(ddSrc, evtObj, ddData) {
            var destGrid  = this.grid;
            var tgtEl     = evtObj.getTarget();
            var tgtIndex  = destGrid.getView().findRowIndex(tgtEl);
            this.clearDDStyles();

            // is this a row?
            if (typeof tgtIndex === 'number') {
                var tgtRow       = destGrid.getView().getRow(tgtIndex);
                var tgtRowEl     = Ext.get(tgtRow);
                var tgtRowHeight = tgtRowEl.getHeight();
                var tgtRowTop    = tgtRowEl.getY();
                var tgtRowCtr    = tgtRowTop + Math.floor(tgtRowHeight / 2);
                var mouseY       = evtObj.getXY()[1];

                // below
                if (mouseY >= tgtRowCtr) {
                    this.point = 'below';
                    tgtIndex ++;
                    tgtRowEl.addClass('gridRowInsertBottomLine');
                    tgtRowEl.removeClass('gridRowInsertTopLine');
                }
                // above
                else if (mouseY < tgtRowCtr) {
                    this.point = 'above';
                    tgtRowEl.addClass('gridRowInsertTopLine');
                    tgtRowEl.removeClass('gridRowInsertBottomLine')
                }
                this.overRow = tgtRowEl;
            } else {
                tgtIndex = destGrid.store.getCount();
            }
            this.tgtIndex = tgtIndex;

            destGrid.body.addClass('gridBodyNotifyOver');

            return this.dropAllowed;
        },
        notifyOut : function() {
            this.clearDDStyles();
        },
        clearDDStyles : function() {
            this.grid.body.removeClass('gridBodyNotifyOver');
            if (this.overRow) {
                this.overRow.removeClass('gridRowInsertBottomLine');
                this.overRow.removeClass('gridRowInsertTopLine');
            }
        },
        onContainerDrop : function(ddSrc, evtObj, ddData){
            var grid        = this.grid;
            var srcGrid     = ddSrc.view.grid;
            var destStore   = grid.store;
            var tgtIndex    = this.tgtIndex;
            var records     = ddSrc.dragData.selections;

            this.clearDDStyles();

            var srcGridStore = srcGrid.store;
            Ext.each(records, srcGridStore.remove, srcGridStore);

            if (tgtIndex > destStore.getCount()){
                tgtIndex = destStore.getCount();
            }
            destStore.insert(tgtIndex, records);
                        
            //var fila = destStore.getAt(tgtIndex);
       
            var i=1;
            destStore.each(function(record){  
                record.set('numero',i);
                destStore.commitChanges();
                i++;
            },this);
            return true;
        }
    };
    // This will make sure we only drop to the view container
    var leftGridDroptgtCfg = Ext.apply({}, dropZoneOverrides, {
        grid : listaParadas
    });
    new Ext.dd.DropZone(listaParadas.el, leftGridDroptgtCfg);
    

    // This will make sure we only drop to the view container
    var needdUpgradesDZConfig = Ext.apply({}, dropZoneOverrides, {
        grid : listaParadasSeleccionadas
    });
    new Ext.dd.DropZone(listaParadasSeleccionadas.el, needdUpgradesDZConfig);
}

/**
 * Permite cortar las direcciones a 42 caracteres para que sean mostrados sobre
 * la imagen que se muestra en el tooltip de la lista de paradas
 */
function procesarTextoDireccion(txtDireccion){
    var fin = 42;
    if(txtDireccion.length>=fin){
        return txtDireccion.substring(0, fin)+"...";
    }
    return txtDireccion;
}


/**
 * Limpia la ventana para recivir nuevos datos
 */
function resetFormularioParadasRuta(){
    //listaParadasSeleccionadas.store.loadData([],false);
    storeParadasSelecionadas.removeAll();
    //storeParadasSelecionadas.loadData([],false);
    listaParadas.store.load();
    
}

/**
 * Muestra la ventana para ingresar una nueva parada
 * @param id_ruta de la ruta
 * @param cargar si tiene que llenar el store con datos o no true=cargar
 */
function ventanaParadasRuta(id_ruta,cargar){
    id_ruta_vpr = id_ruta;
    if(!winParadasRuta){
        winParadasRuta = new Ext.Window({
            layout      : 'fit',
            title       : 'Paradas para una ruta...',
            resizable   : false,
            width       : 650,
            height      : 420,
            closeAction : 'hide',
            plain       : false,
            items       : [frmPanelParadasRuta]
        });
    }
    winParadasRuta.show(this);
    efectoDragAndDropListas();
    
    if(cargar){
        listaParadasSeleccionadas.store.proxy.conn.url = "core/php/gui/getParadas.php?id_ruta="+id_ruta_vpr;
        listaParadasSeleccionadas.store.load();
    }
    listaParadas.store.proxy.conn.url = "core/php/gui/listaParadas.php";
    listaParadas.store.load({
        scope   : this,
        params  :{
            paradas:Ext.util.JSON.encode(paradasCercanasRuta),
            id_ruta:id_ruta_vpr
        },
        callback: function() {
            //resultado cuando trae los datos y llena el store
        }
    });
    console.info(paradasCercanasRuta);
    paradasCercanasRuta=null;
}
