package irbu.lod.modulos.listarrutas;

import irbu.lod.R;
import irbu.lod.objetos.ConsultarServer;
import irbu.lod.objetos.Paradas;

import java.util.ArrayList;

import org.apache.http.conn.ConnectTimeoutException;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.widget.ListView;

public class ListaRutasParada extends Activity {

    private ConsultarServer server = new ConsultarServer();
    private Paradas parada;

    @Override
    public void onCreate(Bundle savedInstanceState) {
	super.onCreate(savedInstanceState);
	setContentView(R.layout.lista_rutas_parada);

	if (getIntent().hasExtra("parada")) {
	    parada = (Paradas) getIntent().getParcelableExtra("parada");
	}

	ArrayList<CamposListaRutasParada> lista;
	try {
	    lista = server.getRutasParada(parada);

	    ListAdapter adapter = new ListAdapter(this, lista);

	    ListView listaRutas = (ListView) findViewById(R.id.listaRutasHora);
	    listaRutas.setAdapter(adapter);
	} catch (ConnectTimeoutException e) {
	    mensajeErrorServidorOcupado();
	}
    }

    /**
     * Mensaje de error cuando el servidor se demora mucho en contestar
     */
    private void mensajeErrorServidorOcupado() {
	AlertDialog.Builder builder1 = new AlertDialog.Builder(
		ListaRutasParada.this);
	builder1.setMessage(R.string.txtErrorTimeOut).setCancelable(false)
		.setPositiveButton("OK", new DialogInterface.OnClickListener() {
		    public void onClick(DialogInterface dialog, int id) {
			ListaRutasParada.this.finish();
		    }
		});
	AlertDialog alert1 = builder1.create();
	alert1.show();
    }
}