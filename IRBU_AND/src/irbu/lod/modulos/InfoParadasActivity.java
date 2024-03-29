package irbu.lod.modulos;

import irbu.lod.R;
import irbu.lod.constantes.Constantes;
import irbu.lod.modulos.listarrutas.ListaRutasParada;
import irbu.lod.objetos.Paradas;
import irbu.lod.sesion.SesionApplication;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

public class InfoParadasActivity extends Activity implements OnClickListener,
	Runnable {

    private ImageView imView;
    private ProgressBar pbCargarImagen;
    private String urlHostRemoto = Constantes.URL_SERVER
	    + Constantes.NOMBRE_PROYECTO;
    private Bitmap imgParada;
    private Paradas parada;
    private Button btnGuardar;
    private Button btnCancelar;
    private Button btnVerRutasHorarios;

    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
	super.onCreate(savedInstanceState);
	setContentView(R.layout.info_parada);
	if (getIntent().hasExtra("parada")) {
	    parada = (Paradas) getIntent().getExtras().get("parada");
	}
	if (getIntent().hasExtra("paradafrecuente")) {
	    LinearLayout panelBotones = (LinearLayout) findViewById(R.id.panelBotonesGuardarParadaFrecuente);
	    panelBotones.setVisibility(View.GONE);
	}
	TextView txtDireccion = (TextView) findViewById(R.id.txtDireccion);
	TextView txtReferencia = (TextView) findViewById(R.id.txtReferencia);
	TextView txtLatitud = (TextView) findViewById(R.id.txtLatitud);
	TextView txtLongitud = (TextView) findViewById(R.id.txtLongitud);

	btnGuardar = (Button) findViewById(R.id.btnGuardarParada);
	btnCancelar = (Button) findViewById(R.id.btnCancelarGuardadoParada);
	btnVerRutasHorarios = (Button) findViewById(R.id.btnRutasHorariosParada);

	btnGuardar.setOnClickListener(this);
	btnCancelar.setOnClickListener(this);
	btnVerRutasHorarios.setOnClickListener(this);

	try {
	    txtDireccion.setText(parada.getDir());
	} catch (NullPointerException e) {
	    txtDireccion.setText("");
	}
	try {
	    txtReferencia.setText(parada.getRef());
	} catch (NullPointerException e) {
	    txtReferencia.setText("");
	}
	try {
	    txtLatitud.setText("" + parada.getLat());
	} catch (NullPointerException e) {
	    txtLatitud.setText("");
	}
	try {
	    txtLongitud.setText("" + parada.getLon());
	} catch (NullPointerException e) {
	    txtLongitud.setText("");
	}

	imView = (ImageView) findViewById(R.id.imview);
	pbCargarImagen = (ProgressBar)findViewById(R.id.pbCargarImagen);
	Thread thread = new Thread(this);
	thread.start();
    }

    public void run() {
	if (parada.getUrlImg().contains("http")) {
	    downloadFile(parada.getUrlImg());
	} else {
	    downloadFile(urlHostRemoto + parada.getUrlImg());
	}
    }

    private Handler handler = new Handler() {
	@Override
	public void handleMessage(Message msg) {
	    switch (msg.what) {
	    case 0:
		pbCargarImagen.setVisibility(View.GONE);
		imView.setImageBitmap(imgParada);
		break;
	    }
	}
    };

    /**
     * Descarga la imagen de la parada para presentar en la vista
     * 
     * @param fileUrl
     */
    private void downloadFile(String fileUrl) {
	URL myFileUrl = null;
	try {
	    myFileUrl = new URL(fileUrl);
	} catch (MalformedURLException e) {
	    e.printStackTrace();
	}
	try {
	    HttpURLConnection conn = (HttpURLConnection) myFileUrl
		    .openConnection();
	    conn.setDoInput(true);
	    conn.connect();
	    InputStream is = conn.getInputStream();

	    imgParada = BitmapFactory.decodeStream(is);
	    handler.sendEmptyMessage(0);
	} catch (IOException e) {
	    e.printStackTrace();
	}
    }

    public void onClick(View v) {
	switch (v.getId()) {
	case R.id.btnGuardarParada:
	    guardarParadaFavorita();
	    break;
	case R.id.btnCancelarGuardadoParada:
	    InfoParadasActivity.this.finish();
	    break;
	case R.id.btnRutasHorariosParada:
	    Intent listaRutasHorario = new Intent(this, ListaRutasParada.class);
	    listaRutasHorario.putExtra("parada", parada);
	    startActivity(listaRutasHorario);
	    break;
	}
    }

    /*
     * Permite guardar los datos de la parada como parada favorita
     */
    private void guardarParadaFavorita() {
	SesionApplication sesion = (SesionApplication) getApplicationContext();
	Intent login = null;
	if (sesion.isLogin()) {
	    login = new Intent(this, InfoEvaActivity.class);
	} else {
	    login = new Intent(this, LoginEvaActivity.class);
	}
	login.putExtra("parada", parada);
	startActivity(login);
    }

}