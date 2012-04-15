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
import android.app.ProgressDialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

public class InfoEstudianteActivity extends Activity implements
	OnClickListener, Runnable {

    private final int INVISIBLE = View.GONE; // 1 invisible, 0 visible, 2
					     // completamente oculto
    private final int VISIBLE = View.VISIBLE;
    private Paradas parada;
    private Casa casa;
    private String urlHostRemoto = Constantes.URL_SERVER
	    + Constantes.NOMBRE_PROYECTO;
    private Bitmap imgParada;
    private ImageView imView;
    private ProgressBar pbCargarImagen;
    private SesionApplication sesion;
    private ConsultarServer consultar = new ConsultarServer();
    private LinearLayout infoParada;
    private LinearLayout infoCasa;

    private boolean hasParada = false;
    private boolean hasCasa = false;

    private ProgressDialog pd;
    private InformacionAlmacenadaEstudiante info;

    /**
     * Componentes graficos parada
     */
    private TextView txtDirParada;
    private TextView txtRefParada;
    private TextView txtLatParada;
    private TextView txtLonParada;
    private Button btnGraficarParada;
    /**
     * Componentes Graficos Casa
     */
    private TextView txtDirCasa;
    private TextView txtLatCasa;
    private TextView txtLonCasa;
    private Button btnGraficarCasa;

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

	txtDirParada = (TextView) findViewById(R.id.txtDireccionInfoUsuario);
	txtRefParada = (TextView) findViewById(R.id.txtReferenciaInfoUsuario);
	txtLatParada = (TextView) findViewById(R.id.txtLatitudInfoUsuario);
	txtLonParada = (TextView) findViewById(R.id.txtLongitudInfoUsuario);
	btnGraficarParada = (Button) findViewById(R.id.btnGraficarParada);
	txtDirCasa = (TextView) findViewById(R.id.txtDireccionCasaUsuario);
	txtLatCasa = (TextView) findViewById(R.id.txtLatitudCasaUsuario);
	txtLonCasa = (TextView) findViewById(R.id.txtLongitudCasaUsuario);
	btnGraficarCasa = (Button) findViewById(R.id.btnGraficarCasa);

	imView = (ImageView) findViewById(R.id.imview);
	pbCargarImagen = (ProgressBar) findViewById(R.id.pbCargarImagen);
	pd = ProgressDialog.show(InfoEstudianteActivity.this, "",
		getResources().getText(R.string.txtMensajeServidor), true);

	Thread thread = new Thread(this);
	thread.start();
    }

    @Override
    protected void onResume() {
	super.onResume();
	mostarPanelesParadaCasa();
    }

    public void run() {
	getInformacionEstudiante();
    }

    private Handler handler = new Handler() {
	@Override
	public void handleMessage(Message msg) {
	    pd.dismiss();
	    switch (msg.what) {
	    case 0:
		pbCargarImagen.setVisibility(INVISIBLE);
		imView.setImageBitmap(imgParada);
		break;
	    case 1:
		inicializarComponentesGraficos();
		break;
	    }
	}
    };

    private void getInformacionEstudiante() {
	String strCI = sesion.getEstudiante().getStrCI();
	info = consultar.getInformacionAlmacenadaEstudiante(strCI);
	handler.sendEmptyMessage(1);
    }

    /**
     * Inicializa la interfaz grafica asignando a las variables y los campos los
     * valores recuperados desde el servidor
     */
    private void inicializarComponentesGraficos() {
	try {
	    parada = info.getParada();
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

	    if (parada.getUrlImg() != null) {
		imView = (ImageView) findViewById(R.id.imview);
		Thread getImagen = new Thread(new Runnable() {
		    public void run() {
			obtenerImagenParada(urlHostRemoto + parada.getUrlImg());
		    }
		});
		getImagen.start();
	    }

	    btnGraficarParada.setOnClickListener(this);
	    hasParada = true;
	    sesion.setParadaFrecuente(parada);
	} catch (NullPointerException e) {
	    ocultarCamposParada();
	}

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
	    sesion.setCasaEstudiante(casa);
	} catch (NullPointerException e) {
	    ocultarCamposCasa();
	}
    }

    /**
     * Ocultar todos los campos de parada para no dejar en blanco alli el view
     */
    private void ocultarCamposParada() {
	Toast msg = Toast.makeText(this,
		"No se pudo cargar los datos de la parada frecuente...\nPosiblemente no se los haya ingresado...",
		Toast.LENGTH_LONG);
	msg.show();

	infoParada.setVisibility(INVISIBLE);
    }

    /**
     * Oculta los campos de la casa para no dejar en blaco...
     */
    private void ocultarCamposCasa() {
	Toast msg = Toast.makeText(this,
		"No se pudo cargar los datos de la casa...\nPosiblemente no se los haya ingresado...", Toast.LENGTH_LONG);
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
	    graficarParadaCasa(true);
	    break;
	case R.id.btnGraficarCasa:
	    graficarParadaCasa(false);
	    break;
	}
    }

    /**
     * Envia al mapa a graficar la parada y la casa...
     * 
     * @param boolean true para graficar la parada y false la casa
     */
    private void graficarParadaCasa(boolean showParada) {
	Intent mapa = new Intent(this, ViewMapaActivity.class);
	if (showParada) {
	    if (hasParada) {
		mapa.putExtra("parada", parada);
	    }
	} else {
	    if (hasCasa) {
		mapa.putExtra("casa", casa);
	    }
	}
	startActivity(mapa);
    }

    /**
     * Descarga la imagen de la parada desde el servidor
     */
    private void obtenerImagenParada(String url) {
	Log.d("Imagen", url);
	InputStream is = consultar.getImagenParada(url);
	imgParada = BitmapFactory.decodeStream(is);
	handler.sendEmptyMessage(0);
    }

}
