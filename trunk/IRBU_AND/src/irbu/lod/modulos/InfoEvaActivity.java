package irbu.lod.modulos;

import irbu.lod.R;
import irbu.lod.mapa.ViewMapaActivity;
import irbu.lod.objetos.ConsultarServer;
import irbu.lod.objetos.LoginEvaUTPL;

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

		user = getIntent().getExtras().getString("usuario");
		pass = getIntent().getExtras().getString("clave");

		if (getIntent().hasExtra("lat") && getIntent().hasExtra("lon")) {
			lat = getIntent().getExtras().getDouble("lat");
			lon = getIntent().getExtras().getDouble("lon");
		}
		if (getIntent().hasExtra("id_parada")) {
			idParada = getIntent().getExtras().getInt("id_parada");
		}

		pd = ProgressDialog
				.show(InfoEvaActivity.this,
						"",
						"Obteniendo sus datos del EVA, esto puede tardar un momento por favor espere... :-)",
						true);
		Thread thread = new Thread(this);
		thread.start();
	}

	public void run() {
		LoginEvaUTPL eva = new LoginEvaUTPL();
		try {
			eva.loginFormUTPL(user, pass);
			infoUsuario = eva.getInforUsuario();
			handler.sendEmptyMessage(0);
		} catch (IllegalArgumentException e) {
			handler.sendEmptyMessage(2);
		} catch (UnsupportedOperationException e) {
			handler.sendEmptyMessage(3);
		} catch (IOException e) {
			handler.sendEmptyMessage(1);
		}
	}

	private Handler handler = new Handler() {
		@Override
		public void handleMessage(Message msg) {
			switch (msg.what) {
			case 0:
				txtNombre.setText(infoUsuario.get("nombre"));
				txtDireccion.setText(infoUsuario.get("direccion"));
				txtCI.setText(infoUsuario.get("ci"));
				txtMail.setText(infoUsuario.get("mail"));
				txtPeriodoAcademico.setText(infoUsuario.get("periodo"));
				break;
			case 1:
				mensajeErrorConexion();
				break;
			case 2:
				mensajeErrorUsuarioClave();
				break;
			case 3:
				// try {
				// infoUsuario = new ConsultarServer().getInforEstudiante(user);
				// txtNombre.setText(infoUsuario.get("nombre"));
				// txtCI.setText(infoUsuario.get("ci"));
				// txtMail.setText(infoUsuario.get("mail"));
				// } catch (SocketException e) {
				// e.printStackTrace();
				// } catch (IOException e) {
				// e.printStackTrace();
				// }catch (NullPointerException e) {
				// mensajeErrorUsuario();
				// }
				mensajeErrorUsuario();
				break;
			}
			/**
			 * TODO: Error cuando se cambia de orientacion la pantalla varias
			 * veces
			 */
			pd.dismiss();
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
			new ConsultarServer().guardarDatosEstudiante(txtNombre.getText()
					.toString(), txtCI.getText().toString(), txtMail.getText()
					.toString(), user);
			if (getIntent().hasExtra("lat") && getIntent().hasExtra("lon")) {
				new ConsultarServer().guardarDatosCasaEstudiante(txtDireccion
						.getText().toString(), txtCI.getText().toString(), lon,
						lat, txtPeriodoAcademico.getText().toString());
			} 
			if (getIntent().hasExtra("id_parada")) {
				new ConsultarServer().guardarDatosParadaEstudiante(txtCI
						.getText().toString(), idParada, txtPeriodoAcademico
						.getText().toString());
			}
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

	/**
	 * Muestra el mensaje de error cuando no hay conexión
	 */
	private void mensajeErrorConexion() {
		AlertDialog.Builder builder = new AlertDialog.Builder(this);
		builder.setMessage(
				"No se pudo obtener los datos del EVA por favor vuelva a intentar mas tarde...")
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
	 * Muestra el mensaje de error cuando usuario o clave incorrectos
	 */
	private void mensajeErrorUsuarioClave() {
		AlertDialog.Builder builder = new AlertDialog.Builder(
				InfoEvaActivity.this);
		builder.setMessage(
				"El nombre de usuario o la clave son incorrectas, por favor vuelva a intentar nuevamente...")
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
	 * Muestra el mensaje de error cuando no se han podido obtener los datos del
	 * usuario
	 */
	private void mensajeErrorUsuario() {
		AlertDialog.Builder builder1 = new AlertDialog.Builder(
				InfoEvaActivity.this);
		builder1.setMessage(
				"No hay datos de este usuario ingresarlos manualmente...")
				.setCancelable(false)
				.setPositiveButton("OK", new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int id) {
						Intent llenarDatos = new Intent(InfoEvaActivity.this,
								LlenarDatosEvaActivity.class);
						llenarDatos.putExtra("usuario", user);
						if (getIntent().hasExtra("lat") && getIntent().hasExtra("lon")) {
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
}
