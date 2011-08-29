/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var isLogin = false;

Ext.onReady(function(){

    /**
     * Contenido del panel Central
     */
    var barraHerramientas = {
        id: 'content-panel',
        region: 'north', // this is what makes this panel into a region
        // within the containing layout
        layout: 'card',
        margins: '0 0 0 0',
        activeItem: 0,
        border: false,
        tbar: [{
            xtype: 'tbbutton',
            cls: 'x-btn-text-icon',
            icon: 'img/buscar.png',
            text: 'Parada mas Cercana',
            handler: function(){
                capturarPuntoReferencia();
            //ventanaNuevaRuta();
            }
        },'-',{
            xtype: 'tbbutton',
            cls: 'x-btn-text-icon',
            icon: 'img/buscar1.png',
            text: 'Buscar ruta',
            handler: function(){
                ventanaBuscarRutas();
            }
        },'-',{
            xtype: 'tbbutton',
            cls: 'x-btn-text-icon',
            icon: 'img/buscar2.png',
            text: 'Paradas por hora y sector',
            handler: function(){
                ventanaLocalizarParadaHora();
            }
        },'-',{
            xtype: 'tbbutton',
            cls: 'x-btn-text-icon',
            icon: 'img/limpiar.png',
            text: 'Limpiar Mapa',
            handler: function(){
                limpiarCapas();
            }
        },'-',{
            xtype: 'tbbutton',
            cls: 'x-btn-text-icon',
            icon: 'img/pantalla.png',
            text: 'Pantalla Completa',
            handler: function(){
                window.open ("http://www.utpl.edu.ec/irbu/","IRBU");
            }
        },'-',{
            xtype: 'tbbutton',
            cls: 'x-btn-text-icon',
            icon: 'img/ayuda.png',
            text: 'Ayuda',
            handler: function(){
                window.open ("img/ayuda.pdf","Ayuda KRADAC...");
            }
        },'-',{
            xtype: 'tbbutton',
            cls: 'x-btn-text-icon',
            id: 'btnAdministrador',
            icon: 'img/config.png',
            text: 'Administrador',
            menu: [{
                text: 'Rutas',
                icon: 'img/map.png',
                menu: [{
                    text: 'Nueva Ruta',
                    id: 'btnNuevaRuta',
                    icon: 'img/add.png',
                    handler: function(){
                        Ext.getCmp('btnEliminarRuta').hide();
                        Ext.getCmp('btnEditarRuta').hide();
                        Ext.getCmp('btnGuardarRuta').show();
                        ventanaNuevaRuta();
                    }
                },{
                    text: 'Eliminar Ruta',
                    id: 'btnEliminarRuta',
                    icon: 'img/delete.png',
                    handler: function(){
                        Ext.getCmp('btnEliminarRuta').show();
                        Ext.getCmp('btnGuardarRuta').hide();
                        Ext.getCmp('btnEditarRuta').hide();
                        ventanaNuevaRuta();
                    }
                },{
                    text: 'Editar Ruta',
                    id: 'btnEditarRuta',
                    icon: 'img/edit.png',
                    handler: function(){
                        Ext.getCmp('btnEliminarRuta').hide();
                        Ext.getCmp('btnGuardarRuta').hide();
                        Ext.getCmp('btnEditarRuta').show();
                        ventanaNuevaRuta();
                    }
                }]
            },{
                text: 'Paradas',
                icon: 'img/ayuda.png',
                menu: [{
                    text: 'Nueva Parada',
                    icon: 'img/ayuda.png',
                    handler: function(){
                    //ventanaNuevaRuta();
                    }
                },{
                    text: 'Eliminar Parada'
                },{
                    text: 'Editar Parada'
                }]
            },{
                text: 'Ayuda'
            }]
        },'-',{
            xtype: 'tbbutton',
            cls: 'x-btn-text-icon',
            icon: 'img/ayuda.png',
            text: 'remover',
            handler: function(){
                ventanaNuevaParada();
            }
        },'->',{
            xtype: 'tbbutton',
            cls: 'x-btn-text-icon',
            icon: 'img/login.png',
            text: 'Ingresar',
            id: 'btnLogin',
            handler: function(){
                if(!isLogin){
                    ventanaLogin();
                }else{
                    ocultarBotonAdministrador();
                }
            }
        }]

    };

    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [
        barraHerramientas,
        {
            region: 'center',
            contentEl: 'map',
            split: false,
            height: 100,
            minSize: 100,
            maxSize: 200,
            collapsible: false,
            margins: '0 0 0 0'
        }]
    });

    Ext.get('btnAdministrador').hide();
});

/**
* Muestra el boton de administracion el que permite hacer toda la edicion de
* rutas, paradas y usuarios
 */
function mostrarBotonAdministrador(){
    Ext.get('btnAdministrador').show();
    winLogin.hide();
    formulario.getForm().reset();

    Ext.getCmp('btnLogin').setText('Salir');

    isLogin = true;
}

/**
* Oculta el boton de administracion el que permite hacer toda la edicion de
* rutas, paradas y usuarios
 */
function ocultarBotonAdministrador(){
    Ext.get('btnAdministrador').hide();

    Ext.getCmp('btnLogin').setText('Ingresar');

    isLogin = false;
}