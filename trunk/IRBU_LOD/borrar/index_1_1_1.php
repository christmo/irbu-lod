<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
        <title>Ext JS in Action Chapter 11</title>
        <link rel="stylesheet" type="text/css" href="css/ext-js/resources/css/ext-all.css">
        <script type="text/javascript" src="dll/js/ext-js/adapter/ext/ext-base.js"></script>
        <script type="text/javascript" src="dll/js/ext-js/ext-all.js"></script>


    </head>
    <body>
        <style type="text/css">
            .gridBodyNotifyOver {
                border-color: #00cc33 !important;
            }
            .gridRowInsertBottomLine {
                border-bottom:1px dashed #00cc33;
            }
            .gridRowInsertTopLine {
                border-top:1px dashed #00cc33;
            }
        </style>

        <script type="text/javascript">
            
            //var frmPanelParadasRuta;
            var winParadasRuta;
            Ext.onReady(function() {
                var remoteProxy = new Ext.data.ScriptTagProxy({
                    url : 'core/php/gui/listaParadas.php'
                });

                var remoteJsonStore = {
                    xtype         : 'jsonstore',
                    proxy         : remoteProxy,
                    id            : 'ourRemoteStore',
                    root          : '',
                    autoLoad      : true,
                    fields        : [
                        { name : 'numero',    mapping : 'numero' },
                        { name : 'id',    mapping : 'id' },
                        { name : 'direccion',  mapping : 'direccion' },
                        { name : 'url_img', mapping : 'url_img'}
                    ]
                };

                var listaParadas = new Ext.grid.GridPanel({
                    title          : 'Lista de paradas...',
                    store          : remoteJsonStore,
                    loadMask       : true,
                    stripeRows     : true,
                    enableDragDrop : true,
                    ddGroup        : 'depGridDD',
                    autoExpandColumn : 'numero',
                    columns          : [
                        {
                            header    : '(#)',
                            dataIndex : 'numero',
                            id        : 'numero',
                            width     : 15
                        },
                        {
                            header    : 'Direcci\xF3n',
                            dataIndex : 'direccion',
                            width     : 235
                        }
                    ]
                });
                
                /* Tooltip para la lista derecha de todas las paradas */
                listaParadas.on('render', function() {
                    /* Setup tooltip */
                    listaParadas.tip = new Ext.ToolTip({
                        view: listaParadas.getView(),
                        target: listaParadas.getView().mainBody,
                        delegate: '.x-grid3-row',
                        trackMouse: true,
                        renderTo: document.body,
                        listeners: {
                            beforeshow: function updateTipBody(tip) {
                                var i      = listaParadas.getView().findRowIndex(tip.triggerElement);
                                var record = listaParadas.getStore().getAt(i);
                                var dir = procesarTextoDireccion(record.get('direccion'));
                                tip.body.dom.innerHTML = "Direcci\xF3n:<br/>"+dir+'<br/>'+'<img src="'+record.get('url_img')+'" width=220 height=160 />';
                            }
                        }
                    });
                });
                
                var needUpgradeStore = Ext.apply({}, {
                    proxy    : null,
                    autoLoad : false
                }, remoteJsonStore);

                var listaParadasSeleccionadas = new Ext.grid.GridPanel({
                    title            : 'Paradas para esta ruta...',
                    store            : needUpgradeStore,
                    loadMask         : true,
                    stripeRows       : true,
                    enableDragDrop   : true,
                    ddGroup          : 'depGridDD',
                    autoExpandColumn : 'numero',
                    columns          : [
                        {
                            header    : '[#]',
                            dataIndex : 'numero',
                            id        : 'numero',
                            width     : 15
                        },
                        {
                            header    : 'Direcci\xF3n',
                            dataIndex : 'direccion',
                            width     : 235
                        }
                    ]
                });

                /* Tooltip para la tabla de la derecha lista de paradas selecinadas */
                listaParadasSeleccionadas.on('render', function() {
                    /* Setup tooltip */
                    listaParadasSeleccionadas.tip = new Ext.ToolTip({
                        view: listaParadasSeleccionadas.getView(),
                        target: listaParadasSeleccionadas.getView().mainBody,
                        delegate: '.x-grid3-row',
                        trackMouse: true,
                        renderTo: document.body,
                        listeners: {
                            beforeshow: function updateTipBody(tip) {
                                var i      = listaParadasSeleccionadas.getView().findRowIndex(tip.triggerElement);
                                var record = listaParadasSeleccionadas.getStore().getAt(i);
                                var dir = procesarTextoDireccion(record.get('direccion'));
                                tip.body.dom.innerHTML = "Direcci\xF3n:<br/>"+dir+'<br/>'+'<img src="'+record.get('url_img')+'" width=220 height=160 />';
                            }
                        }
                    });
                });
                
                //                var btnGuardar = new Ext.Button({
                //                    text: 'submit ExtJS',
                //                    handler: function() {
                //                        Ext.getDom('form_main').submit();
                //                    },
                //                    id: 'btnGuardarParadasRuta'
                //                });


                var frmPanelParadasRuta = new Ext.FormPanel({
                    width    : 650,
                    height   : 400,
                    frame    : true,
                    bodyStyle: 'padding: 6px',
                    labeWidth: 40,
                    defaults : {
                        msgTarget: 'side',
                        anchor: '-5'
                    },
                    items:[{
                            layout   : 'hbox',
                            border   : false,
                            defaults :  {
                                frame : true,
                                flex  : 1
                            },
                            layoutConfig : {
                                align : 'stretch'
                            },
                            items        : [
                                listaParadas,
                                listaParadasSeleccionadas
                            ]
                        }],
       
                    buttons: [
                        {
                            text: 'Limpiar',
                            handler: function() {
                                resetFormularioNuevaParada();
                                booCapturarPuntosNuevaParada=true;
                            }
                        },{
                            text: 'Guardar',
                            id: 'btnGuardarParada',
                            handler: function() {
                                frmPanelNuevaParada.getForm().submit({
                                    url: 'core/php/core/guardarParada.php',
                                    waitMsg: 'Subiendo Imagen...',
                                    params: {
                                        lon: Ext.get('lonParada').dom.innerHTML,
                                        lat: Ext.get('latParada').dom.innerHTML
                                    },
                                    success: function(form, o) {
                                        //                                        console.info(o.response.responseText);
                                        //                                        //obj = Ext.util.JSON.decode(o.response.responseText);
                                        //                                        Ext.MessageBox.show({
                                        //                                            title: 'Mensaje...',
                                        //                                            msg: 'Parada creada correctamente...',
                                        //                                            buttons: Ext.MessageBox.OK,
                                        //                                            icon: Ext.MessageBox.INFO
                                        //                                        });
                                        //                                        resetFormularioNuevaParada();
                                        //                                        booCapturarPuntosNuevaParada=true;
                                    }
                                });
                            }
                        },{
                            text: 'Cancelar',
                            handler: function() {
                                //resetFormularioNuevaParada();
                                //booCapturarPuntosNuevaParada=false;
                                //winNuevaParada.hide();
                            }
                        }]
                });


                //                new Ext.Window({
                //                    width    : 650,
                //                    height   : 400,
                //                    layout   : 'hbox',
                //                    border   : false,
                //                    defaults :  {
                //                        frame : true,
                //                        flex  : 1
                //                    },
                //                    layoutConfig : {
                //                        align : 'stretch'
                //                    },
                //                    items        : [
                //                        listaParadas,
                //                        listaParadasSeleccionadas
                //                    ]
                //                }).show();
                
                new Ext.Window({
                    layout:'fit',
                    title:'Paradas para una ruta...',
                    resizable : false,
                    width:650,
                    height:400,
                    closeAction:'hide',
                    plain: false,
                    items: [frmPanelParadasRuta]
                }).show();
    

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
                        }
                        else {
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
                        var tgtIndex = this.tgtIndex;
                        var records     = ddSrc.dragData.selections;

                        this.clearDDStyles();

                        var srcGridStore = srcGrid.store;
                        Ext.each(records, srcGridStore.remove, srcGridStore);

                        if (tgtIndex > destStore.getCount()) {
                            tgtIndex = destStore.getCount();
                        }
                        destStore.insert(tgtIndex, records);
                        
                        //var fila = destStore.getAt(tgtIndex);
       
                        var i=1;
                        destStore.each(function(record)  
                        {  
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
            });

            function procesarTextoDireccion(txtDireccion){
                var fin = 42;
                if(txtDireccion.length>=fin){
                    return txtDireccion.substring(0, fin)+"...";
                }
                return txtDireccion;
            }
            
            /**
             * Muestra la ventana para ingresar una nueva parada
             * @return NO retorna valor
             */
            function ventanaParadasRuta(){
                if(!winParadasRuta){
                    winParadasRuta = new Ext.Window({
                        layout:'fit',
                        title:'Paradas para una ruta...',
                        resizable : false,
                        width:650,
                        height:400,
                        closeAction:'hide',
                        plain: false,
                        items: [frmPanelParadasRuta]
                    });
                }
                winParadasRuta.show(this);
            }

        </script>
    </body>
</html>
