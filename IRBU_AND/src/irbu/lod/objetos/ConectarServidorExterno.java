package irbu.lod.objetos;

import irbu.lod.IRBUActivity;
import irbu.lod.constantes.Constantes;
import irbu.lod.sesion.SesionApplication;

import java.io.IOException;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ConnectTimeoutException;
import org.apache.http.conn.HttpHostConnectException;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

import android.content.Context;
import android.os.Handler;
import android.os.Message;
import android.util.Log;

public class ConectarServidorExterno extends Thread {

    private SesionApplication sesion;
    public Context ctx;
    private DefaultHttpClient httpclient = new DefaultHttpClient();
    
    public ConectarServidorExterno(Context con) {
	this.sesion  = IRBUActivity.sesion;
	this.ctx = con;
    }
    
    @Override
    public void run() {
	conectar();
    }

    /**
     * Conectar al servidor externo el cual redirecciona al servidor IRBU
     */
    public void conectar() {
	conectarSitioExterno();
	Constantes.refrescarVariables();
    }

    /**
     * Establece el canal ce comunicacion con la url del servidor IRBU
     */
    private void conectarSitioExterno() {
	String url = Constantes.SERVER_RUTA_IRBU;

	HttpPost httpost = new HttpPost(url);
	try {
	    HttpResponse response = httpclient.execute(httpost);
	    url = Base64
		    .desencriptar(EntityUtils.toString(response.getEntity()));
	    Log.d("Conectar A:", url);

	    String[] ruta = url.split("/");
	    sesion.setServer(ruta[2].split(":")[0]);
	    sesion.setPuerto(ruta[2].split(":").length == 2 ? ruta[2]
		    .split(":")[1] : "80");
	    sesion.setProyecto(ruta[3]);

	    handler.sendEmptyMessage(2);
	} catch (ConnectTimeoutException e) {
	    handler.sendEmptyMessage(0);
	} catch (HttpHostConnectException e) {
	    handler.sendEmptyMessage(1);
	} catch (ClientProtocolException e1) {
	    e1.printStackTrace();
	} catch (IOException e1) {
	    e1.printStackTrace();
	}
    }
    
    private Handler handler = new Handler() {
	@Override
	public void handleMessage(Message msg) {
	    switch (msg.what) {
	    case 0:
		Mensajes.mensajeConexionTimeOut(ctx);
		break;
	    case 1:
		Mensajes.mensajeNoConexionIRBU(ctx);
		break;
	    case 2:
		Mensajes.mensajeConectadoServidor(ctx);
		break;
	    }
	}
    };
}
