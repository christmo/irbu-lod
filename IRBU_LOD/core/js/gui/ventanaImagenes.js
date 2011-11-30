/*
 * Ext JS Library 2.0.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */
var view;
 
var ImageChooser = function(config){
    this.config = config;
}

ImageChooser.prototype = {
    // cache data by image name for easy lookup
    lookup : {},
    
    show : function(){
        if(!this.win){
            this.initTemplates();
            this.store = new Ext.data.JsonStore({
                url     : this.config.url,
                root    : 'images',
                fields: [
                    'name', 
                    'url',
                {
                    name: 'size', 
                    type: 'float'
                },{
                    name        :'lastmod', 
                    type        :'date', 
                    dateFormat  :'timestamp'
                },
                'direccion',
                'referencia',
                {
                    name: 'lon', 
                    type: 'float'
                },{
                    name: 'lat', 
                    type: 'float'
                },{
                    name: 'id', 
                    type: 'int'
                }
                ],
                listeners: {
                    'load': {
                        fn:function(){
                            view.select(0);                            
                        }, 
                        scope   : this, 
                        single  : true
                    }
                }
            });
            this.store.load();
			
            var formatSize = function(data){
                if(data.size < 1024) {
                    return data.size + " bytes";
                } else {
                    return (Math.round(((data.size*10) / 1024))/10) + " KB";
                }
            };
			
            var formatData = function(data){
                data.shortName = data.name.ellipse(15);
                data.sizeString = formatSize(data);
                data.dateString = new Date(data.lastmod).format("m/d/Y g:i a");
                if(data.direccion!=null){
                    data.shortDir = data.direccion.ellipse(17);
                }
                //console.info('info:'+data.direccion.ellipse(15));
                this.lookup[data.name] = data;
                return data;
            };
			
            view = new Ext.DataView({
                tpl         : this.thumbTemplate,
                singleSelect: true,
                overClass   : 'x-view-over',
                itemSelector: 'div.thumb-wrap',
                emptyText   : '<div style="padding:10px;">No hay imagenes que coincidan con ese filtro...</div>',
                store       : this.store,
                listeners: {
                    'selectionchange': {
                        fn      : this.showDetails, 
                        scope   : this, 
                        buffer  : 100
                    },
                    'loadexception'  : {
                        fn      : this.onLoadException, 
                        scope   : this
                    },
                    'beforeselect'   : {
                        fn:function(view){
                            return view.store.getRange().length > 0;
                        }
                    }
                },
                prepareData : formatData.createDelegate(this)
            });
		    
            var cfg = {
                title       : 'Lista de Paradas...',
                id          : 'img-chooser-dlg',
                layout      : 'border',
                minWidth    : 500,
                minHeight   : 300,
                modal       : true,
                closeAction : 'hide',
                border      : false,
                items:[{
                    id          : 'img-chooser-view',
                    region      : 'center',
                    autoScroll  : true,
                    width       : 500,
                    items       : view,
                    tbar:[{
                        text: 'Filtro:'
                    },{
                        xtype           : 'textfield',
                        id              : 'filter',
                        selectOnFocus   : true,
                        width           : 100,
                        listeners: {
                            'render': {
                                fn:function(){
                                    Ext.getCmp('filter').getEl().on('keyup', function(){
                                        this.filter();
                                    }, this, {
                                        buffer:500
                                    });
                                }, 
                                scope:this
                            }
                        }
                    }, ' ', '-', {
                        text: 'Ordenar Por:'
                    }, {
                        id              : 'sortSelect',
                        xtype           : 'combo',
                        typeAhead       : true,
                        triggerAction   : 'all',
                        width           : 100,
                        editable        : false,
                        mode            : 'local',
                        displayField    : 'desc',
                        valueField      : 'name',
                        lazyInit        : false,
                        value           : 'name',
                        store: new Ext.data.SimpleStore({
                            fields  : ['name', 'desc'],
                            data    : [
                            ['direccion', 'Direcci\xF3n'],
                            ['size', 'Peso Imagen'],
                            ['lastmod', 'Modificado']
                            ]
                        }),
                        listeners: {
                            'select': {
                                fn      : this.sortImages, 
                                scope   : this
                            }
                        }
                    }]
                },{
                    id      : 'img-detail-panel',
                    region  : 'east',
                    split   : true,
                    width   : 370,
                    minWidth: 370,
                    maxWidth: 370
                }],
                buttons: [{
                    id      : 'btnEliminarParada',
                    text    : 'Eliminar',
                    handler : this.eliminarParada,
                    scope   : this
                },{
                    id      : 'btnEditarParada',
                    text    : 'Editar',
                    handler : this.editarParada,
                    scope   : this
                },{
                    id      : 'ok-btn',
                    text    : 'Actualizar',
                    handler : this.actualizarImagenes,
                    scope   : this
                },{
                    text    : 'Salir',
                    handler: function(){
                        this.win.hide();
                    },
                    scope   : this
                }],
                keys: {
                    key: 27, // Esc key
                    handler: function(){
                        this.win.hide();
                    },
                    scope: this
                }
            };
            Ext.apply(cfg, this.config);
            this.win = new Ext.Window(cfg);
        }
		
        this.reset();
        this.win.show();
    //this.callback = callback;
    //this.animateTarget = el;
    },
	
    initTemplates : function(){
        this.thumbTemplate = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="thumb-wrap" id="{name}">',
            '<div class="thumb"><img src="{url}" title="{direccion}"></div>',
            //'<span>{shortName}</span></div>',
            '<span>{shortDir}</span></div>',
            '</tpl>'
            );
        this.thumbTemplate.compile();
		
        this.detailsTemplate = new Ext.XTemplate(
            '<div class="details">',
            '<tpl for=".">',
            '<img id="imgParada" src="{url}"><div class="details-info">',
            '<b>Direcci\xF3n:</b>',
            '<span id="txtDireccion" class="editText">{direccion}</span>',
            '<b>Referencia:</b>',
            '<span id="txtReferencia" class="editText">{referencia}</span>',
            '<b>Latitud:</b>',
            '<span id="txtLat" class="editText">{lat}</span>',
            '<b>Longitud:</b>',
            '<span id="txtLon" class="editText">{lon}</span>',
            '</div></tpl>',
            '</div>'
            );
        this.detailsTemplate.compile();
    },
	
    showDetails : function(){
        var selNode = view.getSelectedNodes();
        var detailEl = Ext.getCmp('img-detail-panel').body;
        if(selNode && selNode.length > 0){
            selNode = selNode[0];
            Ext.getCmp('ok-btn').enable();
            var data = this.lookup[selNode.id];
            //console.info(data);
            detailEl.hide();
            this.detailsTemplate.overwrite(detailEl, data);
            detailEl.slideIn('l', {
                stopFx:true,
                duration:.2
            });
        }else{
            Ext.getCmp('ok-btn').disable();
            detailEl.update('');
        }
    },
	
    filter : function(){
        var filter = Ext.getCmp('filter');
        view.store.filter('direccion', filter.getValue());
        view.select(0);
    },
	
    sortImages : function(){
        var v = Ext.getCmp('sortSelect').getValue();
        view.store.sort(v, v == 'direccion' ? 'asc' : 'desc');
        view.select(0);
    },
	
    reset : function(){
        if(this.win.rendered){
            Ext.getCmp('filter').reset();
            view.getEl().dom.scrollTop = 0;
        }
        view.store.clearFilter();
        actualizarImagenesCargadas();
        //view.select(0);
    },
    
    editarParada: function(){
        var selNode = view.getSelectedNodes()[0];
        if(selNode != undefined){
            var data = this.lookup[selNode.id];
            var dir = Ext.get('txtDireccion');
            var ref = Ext.get('txtReferencia');
            var lat = Ext.get('txtLat');
            var lon = Ext.get('txtLon');
            ventanaEditarParada(
                data.id,
                dir.dom.innerHTML,
                ref.dom.innerHTML,
                lon.dom.innerHTML,
                lat.dom.innerHTML,
                Ext.get('imgParada').dom.src
                );
            this.win.hide();
        }else{
            Ext.MessageBox.show({
                title: 'Error...',
                msg: 'Seleccionar una imagen de una parada para editarla...',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    },
    
    eliminarParada:function(){
        var selNode = view.getSelectedNodes()[0];
        if(selNode != undefined){
            var data = this.lookup[selNode.id];
        
            Ext.Ajax.request({
                url     : 'core/php/core/eliminarParada.php',
                method  : 'post',
                success: function (result) {
                    //var r = Ext.util.JSON.decode(result.responseText);
                    actualizarImagenesCargadas();
                },
                timeout : 1000,
                params: {
                    id_parada: data.id
                }
            });
        }else{
            Ext.MessageBox.show({
                title   : 'Error...',
                msg     : 'Seleccionar una imagen de una parada para eliminar...',
                buttons : Ext.MessageBox.OK,
                icon    : Ext.MessageBox.ERROR
            });
        }
    },
	
    actualizarImagenes: function(){
        actualizarImagenesCargadas();
    },
	
    onLoadException : function(v,o){
        view.getEl().update('<div style="padding:10px;">Error cargando las imagenes, intentar nuevamente...</div>'); 
    }
};

String.prototype.ellipse = function(maxLength){
    if(this.length > maxLength){
        return this.substr(0, maxLength-3) + '...';
    }
    return this;
};

/**
 * Recargar las imagenes de la lista de paradas
 */
function actualizarImagenesCargadas(){
    if(view!=null){
        view.store.load();
        view.select(0);
    }
}