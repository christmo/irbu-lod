package irbu.lod.modulos;

import irbu.lod.R;
import irbu.lod.mapa.ViewMapaActivity;
import irbu.lod.objetos.ConsultarServer;

import java.io.IOException;
import java.net.SocketException;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
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
			String strNombre = txtNombre.getText().toString();
			if (!strNombre.equals("")) {
				String strDir = txtDireccion.getText().toString();
				if (!strDir.equals("")) {
						String strCI = txtCI.getText().toString();
						if (!strCI.equals("")) {
							String strMail = txtMail.getText().toString();
							if (!strMail.equals("")) {
							new ConsultarServer().guardarDatosEstudiante(
									strNombre, strCI, strMail, user);
							new ConsultarServer().guardarDatosCasaEstudiante(
									strDir, strCI, lon, lat, null);
							regresarMapa();
						} else {
							mensaje("Debe ingresar su mail, este campo no puede quedar vacio.");
						}
					} else {
						mensaje("Debe ingresar su cédula, este campo no puede quedar vacio.");
					}
				} else {
					mensaje("Debe ingresar su dirección, este campo no puede quedar vacio.");
				}
			} else {
				mensaje("Debe ingresar su nombre, este campo no puede quedar vacio.");
			}
		} catch (SocketException e) {
			mensajeErrorConexion();
		} catch (IOException e) {
			mensajeErrorConexion();
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

	/**
	 * Mensaje Error de conexión a internet
	 */
	private void mensaje(String txt) {
		AlertDialog.Builder builder1 = new AlertDialog.Builder(
				LlenarDatosEvaActivity.this);
		builder1.setMessage(txt).setCancelable(false)
				.setPositiveButton("OK", new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int id) {
					}
				});
		AlertDialog alert1 = builder1.create();
		alert1.show();
	}

	/**
	 * Mensaje Error de conexión a internet
	 */
	private void mensajeErrorConexion() {
		AlertDialog.Builder builder1 = new AlertDialog.Builder(
				LlenarDatosEvaActivity.this);
		builder1.setMessage(R.string.txtErrorConexionInternet)
				.setCancelable(false)
				.setPositiveButton("OK", new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int id) {
					}
				});
		AlertDialog alert1 = builder1.create();
		alert1.show();
	}
}
