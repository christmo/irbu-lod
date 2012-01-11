package irbu.lod.modulos;

import irbu.lod.R;
import irbu.lod.mapa.ViewMapaActivity;
import irbu.lod.objetos.ConsultarServer;

import java.io.IOException;
import java.net.SocketException;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;

public class LlenarDatosEvaActivity extends Activity implements OnClickListener {

	private EditText txtNombre;
	private EditText txtDireccion;
	private EditText txtCI;
	private EditText txtMail;
	private Button btnGuardar;
	private Button btnCancelar;

	private String user;
//	private String pass;
	private double lon;
	private double lat;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.llenar_info_eva);

		txtNombre = (EditText) findViewById(R.id.tfNombreUsuario);
		txtDireccion = (EditText) findViewById(R.id.tfDireccionUsuario);
		txtCI = (EditText) findViewById(R.id.tfCI);
		txtMail = (EditText) findViewById(R.id.tfMail);

		user = getIntent().getExtras().getString("usuario");
//		pass = getIntent().getExtras().getString("clave");
		lat = getIntent().getExtras().getDouble("lat") * 1e6;
		lon = getIntent().getExtras().getDouble("lon") * 1e6;

		btnGuardar = (Button) findViewById(R.id.btnGuardarDatos);
		btnCancelar = (Button) findViewById(R.id.btnCancelarGuardadoDatos);

		btnGuardar.setOnClickListener(this);
		btnCancelar.setOnClickListener(this);
	}

	public void onClick(View v) {
		switch (v.getId()) {
		case R.id.btnGuardarDatos:
			guardarDatos();
			break;
		case R.id.btnCancelarGuardadoDatos:
			regresarMapa();
			break;
		}
	}

	/**
	 * Envia los datos al servidor
	 */
	private void guardarDatos() {
		try {
			new ConsultarServer().guardarDatosEstudiante(txtNombre.getText()
					.toString(), txtCI.getText().toString(), txtMail.getText()
					.toString(), user);
			new ConsultarServer().guardarDatosCasaEstudiante(txtDireccion
					.getText().toString(), txtCI.getText().toString(), lon,
					lat, null);
			regresarMapa();
		} catch (SocketException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * permite regresar al mapa cuando ya se ha hecho el guardado o cancelar la
	 * operacion
	 */
	private void regresarMapa() {
		Intent mapa = new Intent(this, ViewMapaActivity.class);
		startActivity(mapa);
	}
}
