package irbu.lod.modulos;

import irbu.lod.R;
import irbu.lod.mapa.ViewMapaActivity;
import irbu.lod.objetos.ConsultarServer;
import irbu.lod.objetos.Paradas;
import irbu.lod.objetos.Puntos;
import irbu.lod.objetos.Ruta;

import java.io.IOException;
import java.net.SocketException;
import java.util.ArrayList;

import android.app.AlertDialog;
import android.app.ListActivity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

public class ListaRutasActivity extends ListActivity implements Runnable {
    private ArrayList<Ruta> listaRutas = null;
    private IconListViewAdapter m_adapter;
    private ProgressDialog pd;
    private String strTipoRuta;
    private String strHora;
    private boolean isHora;
    private int idRuta;
    private Intent mapa;

    @Override
    public void onCreate(Bundle savedInstanceState) {
	super.onCreate(savedInstanceState);
	setContentView(R.layout.lista_rutas);

	Bundle extras = getIntent().getExtras();
	if (extras.getString("hora") != null) {
	    strHora = extras.getString("hora");
	    strTipoRuta = extras.getString("op");
	    isHora = true;
	} else {
	    strTipoRuta = extras.getString("op");
	    isHora = false;
	}
	pd = ProgressDialog.show(ListaRutasActivity.this, "",
		"Cargando Datos...", true);
	Thread thread = new Thread(this);
	thread.start();
    }

    @Override
    protected void onListItemClick(ListView l, View v, int position, long id) {
	Ruta ruta = (Ruta) l.getItemAtPosition(position);
	idRuta = ruta.getIdRuta();
	Toast.makeText(this, ruta.getNombreRuta(), Toast.LENGTH_LONG).show();
	cargarDatosParaMapa();
    }

    public class IconListViewAdapter extends ArrayAdapter<Ruta> {

	private ArrayList<Ruta> items;

	public IconListViewAdapter(Context context, int textViewResourceId,
		ArrayList<Ruta> items) {
	    super(context, textViewResourceId, items);
	    this.items = items;
	}

	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
	    View v = convertView;
	    if (v == null) {
		LayoutInflater vi = (LayoutInflater) getSystemService(Context.LAYOUT_INFLATER_SERVICE);
		v = vi.inflate(R.layout.fila_rutas, null);
	    }
	    Ruta ruta = items.get(position);
	    if (ruta != null) {
		// poblamos la lista de elementos
		TextView tt = (TextView) v.findViewById(R.id.titulo_ruta);
		ImageView im = (ImageView) v.findViewById(R.id.icon);

		if (im != null) {
		    im.setImageResource(ruta.getLocalImage());
		}
		if (tt != null) {
		    tt.setText(ruta.getNombreRuta());
		}
	    }
	    return v;
	}
    }

    private Handler handler = new Handler() {
	@Override
	public void handleMessage(Message msg) {
	    if (msg.what == 0) { // carga valida
		try {
		    setListAdapter(m_adapter);
		    Log.d("Lista Rutas", "Lista Cargada...");
		} catch (NullPointerException e) {
		    mensajeErrorConexion();
		}
	    } else if (msg.what == 1) { // error al cargar
		mensajeErrorConexion();
	    } else if (msg.what == 2) {
		startActivity(mapa);
	    } else if (msg.what == 3) {
		mensajeErrorSinDatos();
	    }
	    /**
	     * TODO: Error cuando se cambia de orientacion la pantalla varias
	     * veces
	     */
	    pd.dismiss();
	}
    };

    public void run() {
	try {
	    /*
	     * Cargar la lista de rutas dependiendo del parametro que se envie
	     */
	    if (isHora) {
		listaRutas = new ConsultarServer().getRutasServer(strTipoRuta,
			strHora);
	    } else {
		listaRutas = new ConsultarServer().getRutasServer(strTipoRuta);
	    }
	    if (listaRutas.size() == 0) {
		// Mensaje de error sin datos
		handler.sendEmptyMessage(3);
	    }
	} catch (SocketException e) {
	    msgNoServerConnection();
	} catch (IOException e1) {
	    msgNoServerConnection();
	}
	try {
	    m_adapter = new IconListViewAdapter(this, R.layout.lista_rutas,
		    listaRutas);
	    handler.sendEmptyMessage(0); // enviar carga valida
	} catch (NullPointerException e) {
	    msgNoServerConnection();
	}
    }

    /**
     * Carga los datos como extras para enviarlos al mapa para que sean
     * dibujados.
     */
    private void cargarDatosParaMapa() {
	pd = ProgressDialog.show(ListaRutasActivity.this, "",
		"Cargando Datos...", true);

	Thread hiloDibujar = new Thread(new Runnable() {

	    public void run() {
		ArrayList<Puntos> listaPuntos;
		ArrayList<Paradas> listaParadas;

		try {
		    mapa = new Intent(ListaRutasActivity.this,
			    ViewMapaActivity.class);
		    listaPuntos = new ConsultarServer().getPuntosRuta(idRuta);
		    listaParadas = new ConsultarServer().getParadasRuta(idRuta,
			    strTipoRuta);
		    mapa.putParcelableArrayListExtra("listaPuntos", listaPuntos);
		    mapa.putParcelableArrayListExtra("listaParadas",
			    listaParadas);

		    handler.sendEmptyMessage(2);

		} catch (SocketException e) {
		    mensajeErrorConexion();
		} catch (IOException e) {
		    mensajeErrorConexion();
		}
	    }
	});

	hiloDibujar.start();
    }

    /**
     * Devuelve el parametro 1 al handler para notificar que no se pudo acceder
     * al servidor
     */
    private void msgNoServerConnection() {
	Log.e("ListaRutas", "No se puede conectar al servidor...");
	handler.sendEmptyMessage(1); // enviar error al cargar
    }

    /**
     * Muestra el mensaje de error cuando no hay conexi�n
     */
    private void mensajeErrorConexion() {
	AlertDialog.Builder builder = new AlertDialog.Builder(this);
	builder.setMessage(R.string.txtErrorNoHayRutas).setCancelable(false)
		.setPositiveButton("OK", new DialogInterface.OnClickListener() {
		    public void onClick(DialogInterface dialog, int id) {
			ListaRutasActivity.this.finish();
		    }
		});
	AlertDialog alert = builder.create();
	alert.show();
    }

    /**
     * Muestra el mensaje de error cuando no hay datos
     */
    private void mensajeErrorSinDatos() {
	AlertDialog.Builder builder = new AlertDialog.Builder(this);
	builder.setMessage(R.string.txtErrorSinDatos).setCancelable(false)
		.setPositiveButton("OK", new DialogInterface.OnClickListener() {
		    public void onClick(DialogInterface dialog, int id) {
			ListaRutasActivity.this.finish();
		    }
		});
	AlertDialog alert = builder.create();
	alert.show();
    }
}
