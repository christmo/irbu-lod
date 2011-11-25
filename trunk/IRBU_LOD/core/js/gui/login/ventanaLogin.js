/**
 * Muestra la ventana de Login para la autenticación de los usuarios que van
 * a tener la posibilidad de hacer cambios en el sistema, como añadir o eliminar
 * rutas.
 */
var winLogin;
var formulario;

Ext.onReady(function(){
    
    formulario = new Ext.FormPanel({
        labelWidth: 70,
        //url: '',
        frame: true,
        width: 270,
        defaultType: 'textfield',
        defaults: {
            width: 150
        },
        items: [{
            fieldLabel: 'Usuario',
            name: 'txtUsuario',
            allowBlank:false
        },{
            fieldLabel: 'Clave',
            name: 'txtClave',
            id: 'txtClave',
            inputType: 'password',
            allowBlank:false,
            listeners: {
                specialkey: function(f,e){
                    if (e.getKey() == e.ENTER) {
                        ingresarAdministrador();
                    }
                }
            }
        }],
        buttons: [{
            text: 'Entrar',
            handler : function() {
                ingresarAdministrador()
            }
        }]
        
    })
});

function ingresarAdministrador(){
    formulario.getForm().submit({
        url : 'core/php/core/login/login.php',
        waitMsg : 'Ingresando al sistema...',
        failure: function (form, action) {
            Ext.get('txtClave').dom.value = '';
            Ext.MessageBox.show({
                title: 'Error al ingresar',
                msg: 'Error al ingresar, intentelo de nuevo...',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        },
        success: function (form, request) {
           mostrarBotonAdministrador();
        }
    });
}

/**
  * Muestra la ventana para la autenticación de los usuarios
  * @return NO retorna valor
  */
function ventanaLogin(){
    if(!winLogin){
        winLogin = new Ext.Window({
            layout: 'fit',
            title: 'Login',
            closeAction:'hide',
            plain: true,
            border: false,
            width: 270,
            height: 130,
            items: formulario
        });
    }
    winLogin.show(this);
}