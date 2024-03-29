/* 
 * Contenedor Principal:
 * En este archivo se hace el maquetado de todo el menú de opciones asi como
 * se ubica el mapa en la parte inferior de la ventana
 */

var isLogin = false;
var ventanaImagenes;
Ext.onReady(function(){

    /**
     * Contenido del panel Central
     */
    var barraHerramientas = {
        id          : 'content-panel',
        region      : 'north',
        layout      : 'card',
        margins     : '0 0 0 0',
        activeItem  : 0,
        border      : false,
        tbar: [{
            xtype   : 'tbbutton',
            cls     : 'x-btn-text-icon',
            icon    : 'img/buscar.png',
            text    : 'Parada mas Cercana',
            handler: function(){
                capturarPuntoReferencia();
                
            }
        },'-',{
            xtype   : 'tbbutton',
            cls     : 'x-btn-text-icon',
            icon    : 'img/buscar1.png',
            text    : 'Buscar ruta',
            handler: function(){
                ventanaBuscarRutas();
            }
        },'-',{
            xtype   : 'tbbutton',
            cls     : 'x-btn-text-icon',
            icon    : 'img/buscar2.png',
            text    : 'Paradas por hora y sector',
            handler: function(){
                ventanaLocalizarParadaHora();
            }
        },'-',{
            xtype   : 'tbbutton',
            cls     : 'x-btn-text-icon',
            icon    : 'img/limpiar.png',
            text    : 'Limpiar Mapa',
            handler: function(){
                limpiarCapas();
            }
        },'-',{
            xtype   : 'tbbutton',
            cls     : 'x-btn-text-icon',
            icon    : 'img/pantalla.png',
            text    : 'Pantalla Completa',
            handler: function(){
                window.open ("http://www.utpl.edu.ec/irbu/","IRBU");
            }
        },'-',{
            xtype   : 'tbbutton',
            cls     : 'x-btn-text-icon',
            icon    : 'img/ayuda.png',
            text    : 'Ayuda',
            handler: function(){
                window.open ("img/ayuda.pdf","Ayuda KRADAC...");
            }
        },'-',{
            xtype   : 'tbbutton',
            cls     : 'x-btn-text-icon',
            id      : 'btnAdministrador',
            icon    : 'img/config.png',
            text    : 'Administrador',
            menu: [{
                text: 'Rutas',
                icon: 'img/map.png',
                menu: [{
                    text: 'Nueva Ruta',
                    icon: 'img/add.png',
                    handler: function(){
                        Ext.getCmp('comboRutas').emptyText='Ingresar lugares de la nueva ruta...';
                        Ext.getCmp('btnGuardarRuta').show();
                        Ext.getCmp('btnEliminarRuta').hide();
                        ventanaNuevaRuta();
                        Ext.getCmp('vtnNuevaRuta').setTitle('Nueva Ruta...');
                        Ext.getCmp('comboRutas').label.update('Ingresar lugares de la nueva ruta:');
                    }
                },{
                    text: 'Eliminar Ruta',
                    icon: 'img/delete.png',
                    handler: function(){
                        Ext.getCmp('comboRutas').emptyText='Seleccionar ruta a eliminar...';
                        Ext.getCmp('btnEliminarRuta').show();
                        Ext.getCmp('btnGuardarRuta').hide();
                        ventanaNuevaRuta();
                        Ext.getCmp('vtnNuevaRuta').setTitle('Eliminar Ruta...');
                        Ext.getCmp('comboRutas').label.update('Seleccione los lugares de la ruta a eliminar:');
                    }
                },{
                    text: 'Editar Ruta',
                    icon: 'img/edit.png',
                    handler: function(){
                        ventanaEditarRuta();
                    }
                }]
            },{
                text: 'Paradas',
                icon: 'img/stop.png',
                menu: [{
                    text: 'Nueva Parada',
                    icon: 'img/add.png',
                    handler: function(){
                        ventanaNuevaParada();
                    }
                },{
                    text: 'Eliminar Parada',
                    icon: 'img/delete.png',
                    handler: function(){
                        showVentanaImagenes(true);
                    }
                },{
                    text: 'Editar Parada',
                    icon: 'img/edit.png',
                    handler: function(){
                        showVentanaImagenes(false);
                    }
                }]
            },{
                text: 'Reportes',
                icon: 'img/reportes.png',
                menu: [{
                    text: 'N\xFAmero Estudiantes Parada',
                    icon: 'img/reportes.png',
                    handler: function(){
                        ventanaReporteEstudiantesParada();
                    }
                },{
                    text: 'Densidad de Estudiantes',
                    icon: 'img/map.png',
                    handler: function(){
                        //                        reporteDensidadEstudiantilTodo();
                        ventanaReporteDensidadEstudiantil();
                    }
                }]
            },{
                text: 'Usuarios',
                icon: 'img/user.png',
                handler: function(){
                    showVentanaUsuarios();
                }
            },{
                icon    : 'img/ayuda.png',
                text    : 'Ayuda Administrador',
                handler: function(){
                    window.open ("img/ayuda.pdf","Ayuda KRADAC...");
                }
            }]
        },
        //        '-',{
        //            xtype   : 'tbbutton',
        //            cls     : 'x-btn-text-icon',
        //            icon    : 'img/ayuda.png',
        //            text    : 'remover',
        //            handler: function(){
        //                ventanaReporteEstudiantesParada();
        //            }
        //        },
        '->',{
            xtype   : 'tbbutton',
            cls     : 'x-btn-text-icon',
            icon    : 'img/login.png',
            text    : 'Ingresar',
            id      : 'btnLogin',
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
            region      : 'center',
            contentEl   : 'map',
            split       : false,
            height      : 100,
            minSize     : 100,
            maxSize     : 200,
            collapsible : false,
            margins     : '0 0 0 0'
        }]
    });
    /**
     * Visualiza el boton de administrador dependiendo de la cookie almacenada
     * para no tener que estarse logueando a cada momento
     */
    var validar = getCookie("session");
    if(validar=="true"){
        mostrarBotonAdministrador();
    }else{
        ocultarBotonAdministrador();
    }
});

/**
* Muestra el boton de administracion el que permite hacer toda la edicion de
* rutas, paradas y usuarios
 */
function mostrarBotonAdministrador(){
    Ext.get('btnAdministrador').show();
    if(winLogin!=null){
        winLogin.hide();
    }
    if(formulario!=null){
        formulario.getForm().reset();
    }
    Ext.getCmp('btnLogin').setText('Salir');
    Ext.getCmp('btnLogin').setIcon("img/salir.png");
    document.cookie='session=true'
    isLogin = true;
}

/**
* Oculta el boton de administracion el que permite hacer toda la edicion de
* rutas, paradas y usuarios
 */
function ocultarBotonAdministrador(){
    Ext.get('btnAdministrador').hide();
    Ext.getCmp('btnLogin').setText('Ingresar');
    Ext.getCmp('btnLogin').setIcon("img/login.png");
    document.cookie='session=false'
    isLogin = false;
}

/**
 * Lee la cookie almacenada dependiendo del key que se envie
 */
function getCookie(name){
    var cname = name + "=";               
    var dc = document.cookie;             
    if (dc.length > 0) {              
        begin = dc.indexOf(cname);       
        if (begin != -1) {           
            begin += cname.length;       
            end = dc.indexOf(";", begin);
            if (end == -1) end = dc.length;
            return unescape(dc.substring(begin, end));
        } 
    }
    return null;
}

/**
 * Muestra la ventana con las imagenes que se encuentran subidas de las paradas
 * el parametro que se resive es para saber si se llamo por editar parada o
 * eliminar parada, permite ocultar el otro boton
 */
function showVentanaImagenes(showBotonEliminar){
    if(!ventanaImagenes){
        ventanaImagenes = new ImageChooser({
            url     : 'core/php/core/get-images.php',
            width   : 720, 
            height  : 500
        });
    }
    ventanaImagenes.show();
    if(showBotonEliminar==true){
        Ext.getCmp('btnEditarParada').hide();
        Ext.getCmp('btnEliminarParada').show();
    }else{
        Ext.getCmp('btnEditarParada').show();
        Ext.getCmp('btnEliminarParada').hide();
    }
}