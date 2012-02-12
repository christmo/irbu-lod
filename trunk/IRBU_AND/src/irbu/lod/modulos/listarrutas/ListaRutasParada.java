package irbu.lod.modulos.listarrutas;

import irbu.lod.R;

import java.util.ArrayList;

import android.app.Activity;
import android.os.Bundle;
import android.widget.ListView;

public class ListaRutasParada extends Activity {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.lista_rutas_parada);
        
        ArrayList<CamposListaRutasParada> lista = new ArrayList<CamposListaRutasParada>();
        
        
        lista.add(new CamposListaRutasParada("demo", "33:$$", "Recoge"));
        lista.add(new CamposListaRutasParada("ddmoss", "33:$$", "R"));
        lista.add(new CamposListaRutasParada("asd", "4:00", "Recoge"));
        lista.add(new CamposListaRutasParada("demo", "33:$$", "Recoge"));
        
        ListAdapter adapter = new ListAdapter(this, lista);
        
        ListView listaRutas = (ListView)findViewById(R.id.listaRutasHora);
        listaRutas.setAdapter(adapter);
        
    }
}