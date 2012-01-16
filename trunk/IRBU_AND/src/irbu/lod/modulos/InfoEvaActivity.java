package irbu.lod.modulos;

import irbu.lod.R;
import irbu.lod.mapa.ViewMapaActivity;
import irbu.lod.objetos.ConsultarServer;
import irbu.lod.objetos.Estudiante;
import irbu.lod.objetos.LoginEvaUTPL;
import irbu.lod.sesion.SesionApplication;

import java.io.IOException;
import java.net.SocketException;
import java.util.HashMap;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class InfoEvaActivity extends Activity implements Runnable,
		OnClickListener {

	private TextView txtNombre;
	private EditText txtDireccion;
	private TextView txtCI;
	private TextView txtMail;
	private TextView txtPeriodoAcademico;
	private Button btnGuardar;
	private Button btnCancelar;

	private String user;
	private String pass;
	private double lon;
	private double lat;
	private int idParada;
	private ProgressDialog pd;
	private HashMap<String, String> infoUsuario;
	private SesionApplication sesion;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.info_eva);

		txtNombre = (TextView) findViewById(R.id.txtNombreUsuario);
		txtDireccion = (EditText) findViewById(R.id.txtDireccionUsuario);
		txtCI = (TextView) findViewById(R.id.txtCIUsuario);
		txtMail = (TextView) findViewById(R.id.txtMailUsuario);
		txtPeriodoAcademico = (TextView) findViewById(R.id.txtPeriodoAcademico);
		btnGuardar = (Button) findViewById(R.id.btnGuardar);
		btnCancelar = (Button) findViewById(R.id.btnCancelarGuardado);

		btnGuardar.setOnClickListener(this);
		btnCancelar.setOnClickListener(this);

		sesion = (SesionApplication) getApplicationContext();

		if (getIntent().hasExtra("lat") && getIntent().hasExtra("lon")) {
			lat = getIntent().getExtras().getDouble("lat");
			lon = getIntent().getExtras().getDouble("lon");
		}
		if (getIntent().hasExtra("id_parada")) {
			idParada = getIntent().getExtras().getInt("id_parada");
		}

		if (sesion.isLogin()) {
			infoUsuario = new HashMap<String, String>();
			infoUsuario.put("nombre", sesion.getEstudiante().getStrNombre());
			infoUsuario.put("ci", sesion.getEstudiante().getStrCI());
			infoUsuario.put("direccion", sesion.getEstudiante()
					.getStrDireccion());
			infoUsuario.put("mail", sesion.getEstudiante().getStrMail());
			infoUsuario.put("periodo", sesion.getEstudiante().getStrPeriodo());
			handler.sendEmptyMessage(0);
		} else {
			user = getIntent().getExtras().getString("usuario");
			pass = getIntent().getExtras().getString("clave");
			pd = ProgressDialog.show(InfoEvaActivity.this, "", getResources()
					.getText(R.string.txtMensajeEVA), true);
			Thread thread = new Thread(this);
			thread.start();
		}
	}

	public void run() {
		LoginEvaUTPL eva = new LoginEvaUTPL();
		try {
			eva.loginFormUTPL(user, pass);
			infoUsuario = eva.getInforUsuario();
			if (infoUsuario != null) {
				handler.sendEmptyMessage(0);
			} else {
				handler.sendEmptyMessage(4);
			}
		} catch (IllegalArgumentException e) {
			// Error de Usuario y clave
			handler.sendEmptyMessage(2);
		} catch (UnsupportedOperationException e) {
			// Error de usuario, no hay datos ingresar manualmente
			handler.sendEmptyMessage(3);
		} catch (IOException e) {
			// Error de conexion
			handler.sendEmptyMessage(1);
		}
	}

	private Handler handler = new Handler() {
		@Override
		public void handleMessage(Message msg) {
			if (!sesion.isLogin()) {
				/**
				 * TODO: Error cuando se cambia de orientacion la pantalla
				 * varias veces
				 */
				pd.dismiss();
			}
			switch (msg.what) {
			case 0:
				String strNombre = infoUsuario.get("nombre");
				String strDir = infoUsuario.get("direccion");
				String strCI = infoUsuario.get("ci");
				String strMail = infoUsuario.get("mail");
				String strPeriodo = infoUsuario.get("periodo");

				txtNombre.setText(strNombre);
				txtDireccion.setText(strDir);
				txtCI.setText(strCI);
				txtMail.setText(strMail);
				txtPeriodoAcademico.setText(strPeriodo);

				if (!sesion.isLogin()) {
					Estudiante estudiante = new Estudiante();
					estudiante.setStrCI(strCI);
					estudiante.setStrNombre(strNombre);
					estudiante.setStrDireccion(strDir);
					estudiante.setStrMail(strMail);
					estudiante.setStrPeriodo(strPeriodo);

					sesion.setEstudiante(estudiante);
					sesion.setLogin(true);
					Log.d("SeSiOn", "LOGIN");
				}

				break;
			case 1:
				mensajeErrorConexionEVA();
				break;
			case 2:
				mensajeErrorUsuarioClave();
				break;
			case 3:
				mensajeErrorUsuarioSinDatos();
				break;
			case 4:
				mensajeErrorUsuarioNoRegistrado();
			}
		}
	};

	public void onClick(View v) {
		switch (v.getId()) {
		case R.id.btnGuardar:
			guardarCoordenadasCasaParada();
			break;
		case R.id.btnCancelarGuardado:
			regresarMapa();
			break;
		}
	}

	/**
	 * Guardar coordenadas de la casa del estudiante, prime crea el estudiante
	 * en la base de datos del IRBU
	 */
	private void guardarCoordenadasCasaParada() {
		try {
			if (!txtDireccion.getText().toString().equals("")) {
				new ConsultarServer().guardarDatosEstudiante(txtNombre
						.getText().toString(), txtCI.getText().toString(),
						txtMail.getText().toString(), user);
				if (getIntent().hasExtra("lat") && getIntent().hasExtra("lon")) {
					new ConsultarServer().guardarDatosCasaEstudiante(
							txtDireccion.getText().toString(), txtCI.getText()
									.toString(), lon, lat, txtPeriodoAcademico
									.getText().toString());
				}
				if (getIntent().hasExtra("id_parada")) {
					new ConsultarServer().guardarDatosParadaEstudiante(txtCI
							.getText().toString(), idParada,
							txtPeriodoAcademico.getText().toString());
				}
				regresarMapa();
			} else {
				mensaje("Se debe ingresar una dirección, no se puede dejar este campo en blanco.");
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
	 * Muestra el mensaje de error cuando no hay conexion
	 */
	private void mensajeErrorConexionEVA() {
		AlertDialog.Builder builder = new AlertDialog.Builder(this);
		builder.setMessage(R.string.txtErrorConexionEVA).setCancelable(false)
				.setPositiveButton("OK", new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int id) {
						InfoEvaActivity.this.finish();
					}
				});
		AlertDialog alert = builder.create();
		alert.show();
	}

	/**
	 * Muestra el mensaje de error cuando usuario o clave incorrectos
	 */
	private void mensajeErrorUsuarioClave() {
		AlertDialog.Builder builder = new AlertDialog.Builder(
				InfoEvaActivity.this);
		builder.setMessage(R.string.txtErrorUsuarioClave).setCancelable(false)
				.setPositiveButton("OK", new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int id) {
						InfoEvaActivity.this.finish();
					}
				});
		AlertDialog alert = builder.create();
		alert.show();
	}

	/**
	 * Muestra el mensaje de error cuando no se han podido obtener los datos del
	 * usuario
	 */
	private void mensajeErrorUsuarioSinDatos() {
		AlertDialog.Builder builder1 = new AlertDialog.Builder(
				InfoEvaActivity.this);
		builder1.setMessage(R.string.txtErrorUsuarioSinDatos)
				.setCancelable(false)
				.setPositiveButton("OK", new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int id) {
						Intent llenarDatos = new Intent(InfoEvaActivity.this,
								LlenarDatosEvaActivity.class);
						llenarDatos.putExtra("usuario", user);
						if (getIntent().hasExtra("lat")
								&& getIntent().hasExtra("lon")) {
							llenarDatos.putExtra("lon", lon);
							llenarDatos.putExtra("lat", lat);
						}
						if (getIntent().hasExtra("id_parada")) {
							llenarDatos.putExtra("id_parada", idParada);
						}
						startActivity(llenarDatos);
					}
				});
		AlertDialog alert1 = builder1.create();
		alert1.show();
	}

	/**
	 * Usuario no registrado ingresar los datos manualmente
	 */
	private void mensajeErrorUsuarioNoRegistrado() {
		AlertDialog.Builder builder = new AlertDialog.Builder(
				InfoEvaActivity.this);
		builder.setMessage(R.string.txtErrorUsuarioNoRegistrado)
				.setCancelable(false)
				.setPositiveButton("OK", new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int id) {
						InfoEvaActivity.this.finish();
					}
				});
		AlertDialog alert = builder.create();
		alert.show();
	}

	/**
	 * Mensaje
	 */
	private void mensaje(String txt) {
		AlertDialog.Builder builder = new AlertDialog.Builder(
				InfoEvaActivity.this);
		builder.setMessage(txt).setCancelable(false)
				.setPositiveButton("OK", new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int id) {
					}
				});
		AlertDialog alert = builder.create();
		alert.show();
	}

	/**
	 * Mensaje Error de conexión a internet
	 */
	private void mensajeErrorConexion() {
		AlertDialog.Builder builder1 = new AlertDialog.Builder(
				InfoEvaActivity.this);
		builder1.setMessage(R.string.txtErrorConexionInternet)
				.setCancelable(false)
				.setPositiveButton("OK", new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int id) {
						InfoEvaActivity.this.finish();
					}
				});
		AlertDialog alert1 = builder1.create();
		alert1.show();
	}
}
