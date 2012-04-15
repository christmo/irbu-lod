package irbu.lod.objetos;

import android.content.Context;
import android.widget.Toast;

public class Mensajes {

    private static Toast t;

    /**
     * Mensaje cuando no se puede conectar al servidor por problemas en la URL
     * 
     * @param ctx
     */
    public static void mensajeNoConexionIRBU(Context ctx) {
	t = Toast
		.makeText(
			ctx,
			"No se pudo conectar al servidor las rutas no están disponibles...",
			Toast.LENGTH_LONG);
	t.show();
    }

    /**
     * Problemas al conectar al servidor por problemas de no llegar a la ruta
     * por firewall
     * 
     * @param ctx
     */
    public static void mensajeConexionTimeOut(Context ctx) {
	t = Toast
		.makeText(
			ctx,
			"No se pudo conectar al servidor tiempo de espera muy largo...",
			Toast.LENGTH_LONG);
	t.show();
    }

    /**
     * Mensaje de conexion exitosa
     * 
     * @param ctx
     */
    public static void mensajeConectadoServidor(Context ctx) {
	t = Toast.makeText(ctx, "Conectado con el servidor...",
		Toast.LENGTH_LONG);
	t.show();
    }
    
    /**
     * Mensaje de conectando al servidor
     * @param ctx
     */
    public static void mensajeConectandoServidor(Context ctx) {
	t = Toast.makeText(ctx, "Conectando con el servidor IRBU...",
		Toast.LENGTH_LONG);
	t.show();
    }

}
