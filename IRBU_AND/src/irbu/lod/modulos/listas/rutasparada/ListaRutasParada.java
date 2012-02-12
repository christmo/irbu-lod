package irbu.lod.modulos.listas.rutasparada;

import irbu.lod.R;
import irbu.lod.objetos.ConsultarServer;
import irbu.lod.objetos.Paradas;

import java.util.ArrayList;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.widget.ListView;

public class ListaRutasParada extends Activity {

    private Paradas parada;
    private ConsultarServer server = new ConsultarServer();

    @Override
    public void onCreate(Bundle savedInstanceState) {
	super.onCreate(savedInstanceState);
	setContentView(R.layout.lista_rutas_parada);

	if (getIntent().hasExtra("parada")) {
	    parada = (Paradas) getIntent().getParcelableExtra("parada");
	}
	Log.d("Parada", "" + parada.getIdParada());
	// ArrayList<CamposListaRutasParada> lista = new
	// ArrayList<CamposListaRutasParada>();
	ArrayList<CamposListaRutasParada> lista = server.getRutasParada(parada
		.getIdParada());

	// lista.add(new CamposListaRutasParada("demo", "33:$$", "Recoge"));
	// lista.add(new CamposListaRutasParada("ddmoss", "33:$$", "R"));
	// lista.add(new CamposListaRutasParada("asd", "4:00", "Recoge"));
	// lista.add(new CamposListaRutasParada("demo", "33:$$", "Recoge"));

	ListAdapterRutasParada adapter = new ListAdapterRutasParada(this, lista);

	ListView listaRutas = (ListView) findViewById(R.id.listaRutasHora);
	listaRutas.setAdapter(adapter);

    }
}