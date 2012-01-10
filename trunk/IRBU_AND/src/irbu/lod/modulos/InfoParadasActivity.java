package irbu.lod.modulos;

import irbu.lod.R;
import irbu.lod.constantes.Constantes;
import irbu.lod.objetos.Paradas;

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
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

public class InfoParadasActivity extends Activity implements OnClickListener {

	private ImageView imView;
	private String urlHostRemoto = Constantes.URL_SERVER
			+ Constantes.NOMBRE_PROYECTO;
	private Bitmap imgParada;
	private Paradas parada;
	private Button btnGuardar;
	private Button btnCancelar;

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.info_parada);

		parada = (Paradas) getIntent().getExtras().get("parada");

		TextView txtDireccion = (TextView) findViewById(R.id.txtDireccion);
		TextView txtReferencia = (TextView) findViewById(R.id.txtReferencia);
		TextView txtLatitud = (TextView) findViewById(R.id.txtLatitud);
		TextView txtLongitud = (TextView) findViewById(R.id.txtLongitud);

		btnGuardar = (Button) findViewById(R.id.btnGuardarParada);
		btnCancelar = (Button) findViewById(R.id.btnCancelarGuardadoParada);

		btnGuardar.setOnClickListener(this);
		btnCancelar.setOnClickListener(this);

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
		String url = urlHostRemoto + parada.getUrlImg();
		downloadFile(url);
	}

	/**
	 * Descarga la imagen de la parada para presentar en la vista
	 * 
	 * @param fileUrl
	 */
	void downloadFile(String fileUrl) {
		URL myFileUrl = null;
		Log.i("URL IMG", fileUrl);
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
			imView.setImageBitmap(imgParada);
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
		}
	}

	/*
	 * Permite guardar los datos de la parada como parada favorita
	 */
	private void guardarParadaFavorita() {
		Intent login = new Intent(this, LoginEvaActivity.class);
		login.putExtra("id_parada", parada.getIdParada());
		startActivity(login);
	}
}