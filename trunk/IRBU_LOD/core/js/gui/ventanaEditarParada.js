/* 
 * Permite desplegar la venta para buscar la ruta de los buses de la UTPL
 */

var winEditarParadas;

Ext.onReady(function(){

});

var ImageChooser = function(config){
    this.config = config;
}

ImageChooser.prototype = {
    // cache data by image name for easy lookup
    lookup : {},
    
    show : function(el, callback){
        if(!winEditarParadas){
            this.initTemplates();
			
            this.store = new Ext.data.JsonStore({
                url: this.config.url,
                root: 'images',
                fields: [
                'name', 
                'url',
                {
                    name:'size', 
                    type: 'float'
                },{
                    name:'lastmod', 
                    type:'date', 
                    dateFormat:'timestamp'
                },
                'direccion',
                'referencia',
                {
                    name:'lon', 
                    type: 'float'
                },{
                    name:'lat', 
                    type: 'float'
                },{
                    name:'id', 
                    type: 'int'
                }
                ],
                listeners: {
                    'load': {
                        fn:function(){
                            this.view.select(0);
                        }, 
                        scope:this, 
                        single:true
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
                this.lookup[data.name] = data;
                return data;
            };
			
            this.view = new Ext.DataView({
                tpl: this.thumbTemplate,
                singleSelect: true,
                overClass:'x-view-over',
                itemSelector: 'div.thumb-wrap',
                emptyText : '<div style="padding:10px;">No images match the specified filter</div>',
                store: this.store,
                listeners: {
                    'selectionchange': {
                        fn:this.showDetails, 
                        scope:this, 
                        buffer:100
                    },
                    'dblclick'       : {
                        fn:this.doCallback, 
                        scope:this
                    },
                    'loadexception'  : {
                        fn:this.onLoadException, 
                        scope:this
                    },
                    'beforeselect'   : {
                        fn:function(view){
                            return view.store.getRange().length > 0;
                        }
                    }
                },
                prepareData: formatData.createDelegate(this)
            });
		    
            var cfg = {
                title: 'Lista de Paradas...',
                id: 'img-chooser-dlg',
                layout: 'border',
                //minWidth: 500,
                //minHeight: 300,
                modal: true,
                closeAction: 'hide',
                border: false,
                items:[{
                    id: 'img-chooser-view',
                    region: 'center',
                    autoScroll: true,
                    width:500,
                    items: this.view,
                    tbar:[{
                        text: 'Filter:'
                    },{
                        xtype: 'textfield',
                        id: 'filter',
                        selectOnFocus: true,
                        width: 100,
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
                        id: 'sortSelect',
                        xtype: 'combo',
                        typeAhead: true,
                        triggerAction: 'all',
                        width: 100,
                        editable: false,
                        mode: 'local',
                        displayField: 'desc',
                        valueField: 'name',
                        lazyInit: false,
                        value: 'name',
                        store: new Ext.data.SimpleStore({
                            fields: ['name', 'desc'],
                            data : [
                                ['name', 'Name'],
                                ['size', 'File Size'],
                                ['lastmod', 'Last Modified']
                            ]
                        }),
                        listeners: {
                            'select': {
                                fn:this.sortImages, 
                                scope:this
                            }
                        }
                    }]
                },{
                    id: 'img-detail-panel',
                    region: 'east',
                    split: true,
                    width: 370,
                    minWidth: 150,
                    maxWidth: 370
                }],
                buttons: [{
                    id: 'ok-btn',
                    text: 'OK',
                    handler: this.doCallback,
                    scope: this
                },{
                    text: 'Cancel',
                    handler: function(){
                        this.win.hide();
                    },
                    scope: this
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
        winEditarParadas.show(el);
        this.callback = callback;
        this.animateTarget = el;
    },
	
    initTemplates : function(){
        this.thumbTemplate = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="thumb-wrap" id="{name}">',
            '<div class="thumb"><img src="{url}" title="{name}"></div>',
            '<span>{shortName}</span></div>',
            '</tpl>'
            );
        this.thumbTemplate.compile();
		
        this.detailsTemplate = new Ext.XTemplate(
            '<div class="details">',
            '<tpl for=".">',
            '<img src="{url}"><div class="details-info">',
            //'<b>Image Name:</b>',
            //'<span>{name}</span>',
            //'<b>Size:</b>',
            //'<span>{sizeString}</span>',
            //'<b>Last Modified:</b>',
            //'<span>{dateString}</span>',
            '<b>Direcci\xF3n:</b>',
            '<span>{direccion}</span>',
            '<b>Referencia:</b>',
            '<span>{referencia}</span>',
            '<b>Latitud:</b>',
            '<span>{lat}</span>',
            '<b>Longitud:</b>',
            '<span>{lon}</span>',
            '</div></tpl>',
            '</div>'
            );
        this.detailsTemplate.compile();
    },
	
    showDetails : function(){
        var selNode = this.view.getSelectedNodes();
        var detailEl = Ext.getCmp('img-detail-panel').body;
        if(selNode && selNode.length > 0){
            selNode = selNode[0];
            Ext.getCmp('ok-btn').enable();
            var data = this.lookup[selNode.id];
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
        this.view.store.filter('name', filter.getValue());
        this.view.select(0);
    },
	
    sortImages : function(){
        var v = Ext.getCmp('sortSelect').getValue();
        this.view.store.sort(v, v == 'name' ? 'asc' : 'desc');
        this.view.select(0);
    },
	
    reset : function(){
        if(this.win.rendered){
            Ext.getCmp('filter').reset();
            this.view.getEl().dom.scrollTop = 0;
        }
        this.view.store.clearFilter();
        this.view.select(0);
    },
	
    doCallback : function(){
        var selNode = this.view.getSelectedNodes()[0];
        var callback = this.callback;
        var lookup = this.lookup;
        this.win.hide(this.animateTarget, function(){
            if(selNode && callback){
                var data = lookup[selNode.id];
                callback(data);
            }
        });
    },
	
    onLoadException : function(v,o){
        this.view.getEl().update('<div style="padding:10px;">Error loading images.</div>'); 
    }
};

String.prototype.ellipse = function(maxLength){
    if(this.length > maxLength){
        return this.substr(0, maxLength-3) + '...';
    }
    return this;
};


/**
* Muestra la ventana para Editar paradas
* @return NO retorna valor
*/
function ventanaEditarParada(){
if(!winEditarParadas){
    winEditarParadas = new Ext.Window({
        layout:'fit',
        title:'Editar Paradas',
        resizable : true,
        width:650,
        height:200,
        closeAction:'hide',
        plain: false,
        items: []
    });
}

}



/**
* Permite guardar los puntos que se recolecten para la nueva ruta dentro del
* servidor...
*/
/*function guardarPuntosRuta(){
    Ext.Ajax.request({
        url: 'core/php/core/guardarPuntosRuta.php',
        method: 'POST',
        success: function (result) {
            var r = Ext.util.JSON.decode(result.responseText);
            winEditarParadas.hide();
            reiniciarCapturaNuevaRuta();
            booCapturarPuntosNuevaRuta=false;
        },
        timeout: 1000,
        params: {
            puntos: getJsonOfStore(storePuntosRuta),
            id_ruta: id_ruta
        }
    });
}*/
