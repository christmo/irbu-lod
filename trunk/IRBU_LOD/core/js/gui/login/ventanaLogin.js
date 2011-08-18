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
            inputType: 'password',
            allowBlank:false
        }],
        buttons: [{
            text: 'Enter',
            handler : function() {
                formulario.getForm().submit({
                    url : 'core/php/core/login/login.php',
                    waitMsg : 'Ingresando al sistema...',
                    failure: function (form, action) {
                        Ext.MessageBox.show({
                            title: 'Error al ingresar',
                            msg: 'Error al ingresar, intentelo de nuevo...',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    },
                    success: function (form, request) {
                        Ext.MessageBox.show({
                            title: 'Login...',
                            msg: 'Ingresar al sistema...',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO
                        });
                        responseData = Ext.util.JSON.decode(request.response.responseText);
                        console.info(responseData.cat_id);
                        /*formCategories.getForm().load({
                            url : 'formLoader.php',
                            method: 'GET',
                            params: {
                                cat_id: responseData.cat_id
                            },
                            waitMsg : 'Espere por favor'
                        });*/
                    }
                });
            }
        }]
    })
});

/**
  * Muestra la ventana para la autenticación de los usuarios
  * @return NO retorna valor
  */
function ventanaLogin(){
    if(!winLogin){
        winLogin = new Ext.Window({
            /*layout:'fit',
            title:'Nueva Ruta',
            resizable : true,
            width:350,
            height:300,
            closeAction:'hide',
            plain: false,
            items: [grid]*/
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