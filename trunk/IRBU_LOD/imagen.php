<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
?>

<!DOCTYPE html> 
<html> 
  <head> 
    <title>ExtJS Thumb Dataview</title> 
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
    <link rel="stylesheet" type="text/css" href="css/ext-js/resources/css/ext-all.css">
    <link rel="stylesheet" href="dataview.css"/> 
    <script type="text/javascript" src="dll/js/ext-js/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="dll/js/ext-js/ext-all.js"></script>
    <script type="text/javascript"> 
    Ext.onReady(function() {
        /* =======================================
         * start component for thumbnails panel */
        var storeThumbs = new Ext.data.JsonStore({
            proxy: new Ext.data.HttpProxy({
                url: 'get-images.php', method: 'POST'
            }),
            root: 'images',
            fields: [
                'id', 'name', 'url',
                { name: 'size', type: 'float' },
                'thumb_url'
            ]
        });
 
        storeThumbs.load();
 
        var tplThumbs = new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="thumb-box">',
                    '<a href="#{id}">',
                        '<img src="{thumb_url}" title="{name}">',
                    '</a>',
                '</div>',
            '</tpl>'
        );
 
        var dvThumbs = new Ext.DataView({
            autoScroll: true, store: storeThumbs, tpl: tplThumbs,
            autoHeight: false, height: 410, multiSelect: true,
            overClass: 'x-view-over', itemSelector: 'div.thumb-wrap',
            emptyText: 'No images to display',
            border: false
        });
 
        // Panel for the thumbnails
        var panelThumbs = new Ext.Panel({
            region: 'west',
            split: false,
            width: 160,
            margins:'5 5 5 0',
            items: [dvThumbs]
        });
        /* end component for thumbnails panel
         * =================================== */
 
        /* =======================================
         * start component for large panel */
        var storeLarge = new Ext.data.JsonStore({
            proxy: new Ext.data.HttpProxy({
                url: 'get-images.php', method: 'POST'
            }),
            root: 'images',
            fields: [
                'id', 'name', 'url',
                { name: 'size', type: 'float' },
                'thumb_url'
            ]
        });
        storeLarge.load();
 
        var tplLarge = new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="large-box" id="{id}">',
                    '<img src="{url}" title="{name}">',
                '</div>',
            '</tpl>'
        );
 
        var dvLarge = new Ext.DataView({
            autoScroll: true, store: storeLarge, tpl: tplLarge,
            autoHeight: false, height: 410, multiSelect: true,
            overClass: 'x-view-over', itemSelector: 'div.thumb-wrap',
            emptyText: 'No images to display',
            border: false
        });
 
        // Panel for large images
        var panelLarge = new Ext.Panel({
            region: 'center',
            margins:'5 0 5 0',
            items:[dvLarge]
        });
        /* end component for large panel
         * =================================== */
 
        var win = new Ext.Window({
            title: 'ExtJS Thumb Dataview',
            closable: false,
            width: 620,
            height: 450,
            border: false,
            plain: true,
            layout: 'border',
            items: [panelThumbs, panelLarge]
        });
 
        win.show(this);
    });
    </script> 
  </head> 
  <body> 
    
  </body> 
</html> 