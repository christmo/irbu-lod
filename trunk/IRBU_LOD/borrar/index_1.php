<?php
//Comprobar si la sesión ya fue iniciada
if (!isset($_SESSION)) {
    session_start();
}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
    <head>
        <meta name="generator" content="HTML Tidy for Linux (vers 6 November 2007), see www.w3.org">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>IRBU</title>
        <link rel="shortcut icon" href="img/taxi.png" type="image/x-icon">
        <!--Maquetacion-->
        <link rel="stylesheet" type="text/css" href="css/style.css">

        <!--Ext-JS-->
        <link rel="stylesheet" type="text/css" href="css/ext-js/resources/css/ext-all.css">
        <script type="text/javascript" src="dll/js/ext-js/adapter/ext/ext-base.js"></script>
        <script type="text/javascript" src="dll/js/ext-js/ext-all.js"></script>

        <!-- DataView -->    
        <link rel="stylesheet" type="text/css" href="dll/js/ext-js/ux/dataview/data-view.css">
        <script type="text/javascript" src="dll/js/ext-js/ux/dataview/DataView-more.js"></script>
        <script type="text/javascript" src="core/js/gui/ventanaParadasRuta.js"></script>

        <script type="text/javascript" src="dll/js/jquery/jquery.js"></script>
        <script type="text/javascript" src="dll/js/jquery/jquery.lightbox-0.5.js"></script>

        <script type="text/javascript">
            Ext.onReady(function(){
                var store = new Ext.data.JsonStore({
                    proxy: new Ext.data.HttpProxy({
                        url: 'core/php/core/get-images.php', method: 'POST'
                    }),
                    root: 'images',
                    fields: [
                        'name', 'url',
                        { name: 'size', type: 'float' },
                        { name: 'lastmod', type: 'date', dateFormat: 'timestamp' },
                        'thumb_url'
                    ]
                });
                store.load();

                var tpl = new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="thumb-wrap" id="{name}">',
                '<div class="thumb"><img src="{thumb_url}" title="{name}"></div>',
                '<span class="x-editable">{shortName}</span></div>',
                '</tpl>',
                '<div class="x-clear"></div>'
            );

                var menu1 = new Ext.menu.Menu({
            
                    items: [
                        {
                            text: 'I like Ext',
                            checked: true
                        }, '-', {
                            text: 'Open With',
                            menu: {
                                items: [{
                                        text: 'Notepad ++'
                                    }, {
                                        text: 'GIMP 2.0'
                                    }, {
                                        text: 'Firefox'
                                    }]
                            }
                        }, '-', {
                            text: 'Cut'
                        }, {
                            text: 'Copy'
                        }, {
                            text: 'Delete'
                        }, '-', {
                            text: 'Rename'
                        }
                    ]
                });

                var datav = new Ext.DataView({
                    autoScroll: true, 
                    store: store, 
                    tpl: tpl,
                    autoHeight: false, 
                    height: 350, 
                    multiSelect: false,
                    overClass: 'x-view-over', 
                    itemSelector: 'div.thumb-wrap',
                    emptyText: 'No images to display',
                    style: 'border:1px solid #99BBE8;',
                    listeners: {
                        render: {
                            fn: function() {
                                Ext.getBody().on("contextmenu", 
                                Ext.emptyFn,
                                null, 
                                {
                                    preventDefault: true
                                });
                            }
                        },
                        contextmenu: {
                            fn: function(obj, index, node, event) {
                                x = event.browserEvent.clientX;
                                y = event.browserEvent.clientY;
                                menu1.showAt([x, y]);
                            }
                        }
                    }
                });

                var panelLeft = new Ext.Panel({
                    id: 'images-view',
                    frame: true,
                    width: 540,
                    height: 400,
                    autoHeight: true,
                    layout: 'auto',
                    style: 'margin:0 auto;',
                    title: 'DataView With Right Click Menu',
                    items: [datav]
                });
                panelLeft.render('left');
            });
        </script>
        <title>Extjs Custom Right Click in Dataview</title>
        <style type="text/css">
            body {
                padding: 20px;
                margin: 0 auto;
            }
            #container {
                padding: 10px;
                background: #e3e3e3;
                border: 1px solid #d3d3d3;
                margin: 0 auto;
                width: 540px;
            }
        </style>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        <div id="container">
            <div id="left"></div>
        </div>
    </body>
</html>