package irbu.lod.modulos.listarrutas;

import irbu.lod.R;
import irbu.lod.objetos.ConsultarServer;
import irbu.lod.objetos.Paradas;

import java.util.ArrayList;

import android.app.Activity;
import android.os.Bundle;
import android.widget.ListView;

public class ListaRutasParada extends Activity {

    private ConsultarServer server=new ConsultarServer();
    private Paradas parada;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.lista_rutas_parada);
        
        if(getIntent().hasExtra("parada")){
            parada = (Paradas)getIntent().getParcelableExtra("parada");
        }
        
//        ArrayList<CamposListaRutasParada> lista = new ArrayList<CamposListaRutasParada>();
        ArrayList<CamposListaRutasParada> lista = server.getRutasParada(parada.getIdParada());
        
        
//        lista.add(new CamposListaRutasParada("demo", "33:$$", "Recoge"));
//        lista.add(new CamposListaRutasParada("ddmoss", "33:$$", "R"));
//        lista.add(new CamposListaRutasParada("asd", "4:00", "Recoge"));
//        lista.add(new CamposListaRutasParada("demo", "33:$$", "Recoge"));
        
        ListAdapter adapter = new ListAdapter(this, lista);
        
        ListView listaRutas = (ListView)findViewById(R.id.listaRutasHora);
        listaRutas.setAdapter(adapter);
        
    }
}