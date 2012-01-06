/* 
 * Permite desplegar la ventana para ingresar una nueva ruta
 */

var winUsuarios;
var panelEdicionUsuarios;
var formUsuarios;
var gridUsuarios;
var storeUsuarios;
var id_usuario=0;

Ext.onReady(function(){
    
    storeUsuarios = new Ext.data.JsonStore({
        autoDestroy : true,
        autoLoad    : true,
        url         : "core/php/gui/getUsuarios.php",
        root        : 'nombres',
        fields      : [{
            name: 'id'
        },{
            name: 'nombre'
        },{
            name: 'usuario'
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
    
    gridUsuarios = new Ext.grid.GridPanel({
        store       : storeUsuarios,
        autoScroll  : true,
        frame       : true,
        width       : 213,
        height      : 115,
        columns: [{
            header      : 'Nombre',
            width       : 180,
            dataIndex   : 'nombre'
        }],
        viewConfig: {
            forceFit: false
        }
    });
 
    var campos = [{
        fieldLabel  : 'Nombre Completo',
        name        : 'txtUsuarioNombre',
        id          : 'txtUsuarioNombre',
        empyText    : 'Nombre del Usuario...',
        allowBlank  : false
    },{
        fieldLabel  : 'Nombre de Usuario',
        name        : 'txtUsuarioNuevo',
        id          : 'txtUsuarioNuevo',
        empyText    : 'Nombre para ingresar al sistema...',
        allowBlank  : false
    },{
        fieldLabel  : 'Clave',
        name        : 'txtUsuarioClave',
        id          : 'txtUsuarioClave',
        empyText    : 'Clave de ingreso al sistema...',
        inputType   : 'password',
        allowBlank  : false,
        listeners   : {
            specialkey: function(f,e){
                if (e.getKey() == e.ENTER) {
                    ingresarAdministrador();
                }
            }
        }
    }];
   
    formUsuarios = new Ext.FormPanel({
        border  : false,
        frame   : true,
        
        items: [{
            layout:'column',
            items:[{
                columnWidth:.45,
                layout: 'form',
                items: [gridUsuarios]
            },{
                columnWidth:.55,
                layout      : 'form',
                labelWidth  : 110,
                defaultType : 'textfield',
                defaults    : {
                    width : 200
                },
                items: [campos],

                buttons: [
                {
                    text    : 'Limpiar',
                    id      : 'btnLimpiarUsuario',
                    handler: function() {
                        limpiarVentanaUsuario();
                    }
                },{
                    text    : 'Eliminar',
                    id      : 'btnEliminarUsuario',
                    handler: function() {
                        eliminarUsuario();
                    }
                },{
                    text    : 'Guardar',
                    id      : 'btnGuardarUsuarios',
                    handler: function() {
                        if(id_usuario == 0){
                            guardarUsuario();
                        }else{
                            Ext.getCmp('txtUsuarioClave').allowBlank=true;
                            actualizarUsuario();
                        }
                    }
                },{
                    text    : 'Cancelar',
                    handler: function() {
                        limpiarVentanaUsuario();
                        winUsuarios.hide();
                    }
                }]
            }]
        }]
           
    });

    gridUsuarios.on('rowclick', function(grid, rowIndex, columnIndex, e) {
        Ext.get('txtUsuarioNombre').dom.value = storeUsuarios.getAt(rowIndex).get('nombre');
        Ext.get('txtUsuarioNuevo').dom.value = storeUsuarios.getAt(rowIndex).get('usuario');
        id_usuario = storeUsuarios.getAt(rowIndex).get('id');
        console.info(Ext.getCmp('txtUsuarioClave').allowBlank);
    }, this);

    panelEdicionUsuarios = new Ext.Panel({
        layout: {
            type  : 'vbox',
            align : 'stretch',
            pack  : 'start'
        },
        border: false,
        items:[formUsuarios]
    });

});

/**
 * Limpia los campos para salir de la ventana
 */
function limpiarVentanaUsuario(){
    formUsuarios.getForm().reset();
    Ext.getCmp('txtUsuarioClave').allowBlank=false;
    Ext.getCmp('txtUsuarioNombre').allowBlank=false;
    Ext.getCmp('txtUsuarioNuevo').allowBlank=false;
    storeUsuarios.load();
    id_usuario = 0;
}

/**
 * Guardar Datos en el sevidor
 */
function guardarUsuario(){
    formUsuarios.getForm().submit({
        url     : 'core/php/core/guardarUsuario.php',
        method  : 'POST',
        waitMsg : 'Guardando Ruta...',
        params  : {
            nombre  : Ext.get('txtUsuarioNombre').dom.value,
            usuario : Ext.get('txtUsuarioNuevo').dom.value,
            clave   : Ext.get('txtUsuarioClave').dom.value
        },
        failure : function (form, action) {
            Ext.MessageBox.show({
                title   : 'Error...',
                msg     : 'No se pudo guardar el Usuario...',
                buttons : Ext.MessageBox.OK,
                icon    : Ext.MessageBox.ERROR
            });
        },
        success: function (form, action) {
            limpiarVentanaUsuario();
        }
    });
}

/**
 * Permite actualizar los datos del usuario
 */
function actualizarUsuario(){
    formUsuarios.getForm().submit({
        url     : 'core/php/core/actualizarUsuario.php',
        method  : 'POST',
        waitMsg : 'Actualizar Usuario...',
        params  : {
            id_usuario : id_usuario,
            nombre     : Ext.get('txtUsuarioNombre').dom.value,
            usuario    : Ext.get('txtUsuarioNuevo').dom.value,
            clave      : Ext.get('txtUsuarioClave').dom.value
        },
        failure : function (form, action) {
            Ext.MessageBox.show({
                title   : 'Error...',
                msg     : 'No se pudo actualizar el Usuario...',
                buttons : Ext.MessageBox.OK,
                icon    : Ext.MessageBox.ERROR
            });
        },
        success: function (form, action) {
            limpiarVentanaUsuario();
        }
    });
}

/**
 * Eliminar el usuario seleccionado
 */
function eliminarUsuario(){
    Ext.getCmp('txtUsuarioClave').allowBlank=true;
    Ext.getCmp('txtUsuarioNombre').allowBlank=true;
    Ext.getCmp('txtUsuarioNuevo').allowBlank=true;
    formUsuarios.getForm().submit({
        url     : 'core/php/core/eliminarUsuario.php',
        method  : 'POST',
        waitMsg : 'Actualizar Usuario...',
        params  : {
            id_usuario : id_usuario
        },
        failure : function (form, action) {
            Ext.MessageBox.show({
                title   : 'Error...',
                msg     : 'No se pudo eliminar el Usuario...',
                buttons : Ext.MessageBox.OK,
                icon    : Ext.MessageBox.ERROR
            });
        },
        success: function (form, action) {
            limpiarVentanaUsuario();
        }
    });
}

/**
 * Muestra la ventana para ingresar una nueva ruta
 * @return NO retorna valor
 */
function showVentanaUsuarios(){
    if(!winUsuarios){
        winUsuarios = new Ext.Window({
            layout      : 'fit',
            title       : 'Edici\xF3n de Usuarios',
            id          : 'vtnUsuario',
            resizable   : false,
            width       : 620,
            height      : 160,
            closeAction : 'hide',
            plain       : false,
            items       : [panelEdicionUsuarios]
        });
    }
    formUsuarios.getForm().reset();
    winUsuarios.show(this);
}