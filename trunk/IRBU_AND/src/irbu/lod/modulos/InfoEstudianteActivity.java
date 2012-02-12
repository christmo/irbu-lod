package irbu.lod.modulos;

import irbu.lod.R;
import irbu.lod.constantes.Constantes;
import irbu.lod.mapa.ViewMapaActivity;
import irbu.lod.objetos.Casa;
import irbu.lod.objetos.ConsultarServer;
import irbu.lod.objetos.InformacionAlmacenadaEstudiante;
import irbu.lod.objetos.Paradas;
import irbu.lod.sesion.SesionApplication;

import java.io.InputStream;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

public class InfoEstudianteActivity extends Activity implements OnClickListener {

    private final int INVISIBLE = View.GONE; // 1 invisible, 0 visible, 2
					     // completamente oculto
    private final int VISIBLE = View.VISIBLE;
    private Paradas parada;
    private Casa casa;
    private String urlHostRemoto = Constantes.URL_SERVER
	    + Constantes.NOMBRE_PROYECTO;
    private Bitmap imgParada;
    private ImageView imView;
    private SesionApplication sesion;
    private ConsultarServer consultar = new ConsultarServer();
    private LinearLayout infoParada;
    private LinearLayout infoCasa;

    private boolean hasParada = false;
    private boolean hasCasa = false;

    /**
     * @see android.app.Activity#onCreate(Bundle)
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
	super.onCreate(savedInstanceState);
	setContentView(R.layout.info_estudiante);

	sesion = (SesionApplication) getApplicationContext();
	infoParada = (LinearLayout) findViewById(R.id.contenedorParada);
	infoCasa = (LinearLayout) findViewById(R.id.contenedorCasa);
    }

    @Override
    protected void onResume() {
	super.onResume();
	mostarPanelesParadaCasa();
	inicializarComponentesGraficos();
    }

    /**
     * Inicializa la interfaz grafica asignando a las variables y los campos los
     * valores recuperados desde el servidor
     */
    private void inicializarComponentesGraficos() {
	String strCI = sesion.getEstudiante().getStrCI();
	InformacionAlmacenadaEstudiante info = consultar
		.getInformacionAlmacenadaEstudiante(strCI);
	TextView txtDirParada = (TextView) findViewById(R.id.txtDireccionInfoUsuario);
	TextView txtRefParada = (TextView) findViewById(R.id.txtReferenciaInfoUsuario);
	TextView txtLatParada = (TextView) findViewById(R.id.txtLatitudInfoUsuario);
	TextView txtLonParada = (TextView) findViewById(R.id.txtLongitudInfoUsuario);
	Button btnGraficarParada = (Button) findViewById(R.id.btnGraficarParada);
	try {
	    parada = info.getParada();
	    Log.d("ID PARADA", "" + parada.getIdParada());
	    try {
		txtDirParada.setText(parada.getDir());
	    } catch (NullPointerException e) {
		txtDirParada.setText("");
	    }
	    try {
		txtRefParada.setText(parada.getRef());
	    } catch (NullPointerException e) {
		txtRefParada.setText("");
	    }
	    try {
		txtLatParada.setText("" + parada.getLat());
	    } catch (NullPointerException e) {
		txtLatParada.setText("");
	    }
	    try {
		txtLonParada.setText("" + parada.getLon());
	    } catch (NullPointerException e) {
		txtLonParada.setText("");
	    }
	    try {
		imView = (ImageView) findViewById(R.id.imview);
		String url = urlHostRemoto + parada.getUrlImg();
		obtenerImagenParada(url);
	    } catch (NullPointerException e) {
	    }

	    btnGraficarParada.setOnClickListener(this);
	    hasParada = true;
	} catch (NullPointerException e) {
	    ocultarCamposParada();
	}
	TextView txtDirCasa = (TextView) findViewById(R.id.txtDireccionCasaUsuario);
	TextView txtLatCasa = (TextView) findViewById(R.id.txtLatitudCasaUsuario);
	TextView txtLonCasa = (TextView) findViewById(R.id.txtLongitudCasaUsuario);
	Button btnGraficarCasa = (Button) findViewById(R.id.btnGraficarCasa);
	try {
	    casa = info.getCasa();

	    try {
		txtDirCasa.setText(casa.getStrDireccion());
	    } catch (NullPointerException e) {
		txtDirCasa.setText("");
	    }

	    txtLatCasa.setText("" + casa.getDouLat());
	    txtLonCasa.setText("" + casa.getDouLon());

	    btnGraficarCasa.setOnClickListener(this);
	    hasCasa = true;
	} catch (NullPointerException e) {
	    ocultarCamposCasa();
	}
    }

    /**
     * Ocultar todos los campos de parada para no dejar en blanco alli el view
     */
    private void ocultarCamposParada() {
	Toast msg = Toast.makeText(this,
		"No se pudo cargar los datos de la parada frecuente...",
		Toast.LENGTH_LONG);
	msg.show();

	infoParada.setVisibility(INVISIBLE);
    }

    /**
     * Oculta los campos de la casa para no dejar en blaco...
     */
    private void ocultarCamposCasa() {
	Toast msg = Toast.makeText(this,
		"No se pudo cargar los datos de la casa...", Toast.LENGTH_LONG);
	msg.show();

	infoCasa.setVisibility(INVISIBLE);
    }

    /**
     * Hace visible los dos paneles donde se visualiza la información de la
     * parada y de la casa
     */
    private void mostarPanelesParadaCasa() {
	infoParada.setVisibility(VISIBLE);
	infoCasa.setVisibility(VISIBLE);
    }

    public void onClick(View v) {
	switch (v.getId()) {
	case R.id.btnGraficarParada:
	    graficarParada();
	    break;
	case R.id.btnGraficarCasa:
	    break;
	}
    }

    /**
     * Envia al mapa a graficar la parada y la casa...
     */
    private void graficarParada() {
	Intent mapa = new Intent(this, ViewMapaActivity.class);
	if (hasParada) {
	    mapa.putExtra("parada", parada);
	}
	if (hasCasa) {
	    mapa.putExtra("casa", casa);
	}
	startActivity(mapa);
    }

    /**
     * Descarga la imagen de la parada desde el servidor
     */
    private void obtenerImagenParada(String url) {
	InputStream is = consultar.getImagenParada(url);
	imgParada = BitmapFactory.decodeStream(is);
	imView.setImageBitmap(imgParada);
    }

}
