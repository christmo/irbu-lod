package irbu.lod.modulos;

import irbu.lod.IRBUActivity;
import irbu.lod.R;
import irbu.lod.constantes.Constantes;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.RadioButton;

public class BuscarRutaActivity extends Activity implements OnClickListener {

	private Button btnBuscar;
	private Button btnCancelar;
	private RadioButton rbBaja, rbSube, rbBajaSube;
	private String opcionRadio = Constantes.BAJA;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.tipo_recorrido);

		btnBuscar = (Button) findViewById(R.id.btnBuscar_TR);
		btnCancelar = (Button) findViewById(R.id.btnCancelar_TR);

		btnBuscar.setOnClickListener(this);
		btnCancelar.setOnClickListener(this);

		rbBaja = (RadioButton) findViewById(R.id.rbBajaUtpl);
		rbSube = (RadioButton) findViewById(R.id.rbSubeUtpl);
		rbBajaSube = (RadioButton) findViewById(R.id.rbBajaSubeUtpl);

		rbBaja.setOnClickListener(rgTipoRecorridoOnClickListener);
		rbSube.setOnClickListener(rgTipoRecorridoOnClickListener);
		rbBajaSube.setOnClickListener(rgTipoRecorridoOnClickListener);
		rbBaja.setChecked(true);
	}

	/**
	 * Ejecuta cuando se da clic en cada uno de los botones
	 * @param View v
	 */
	public void onClick(View v) {
		switch (v.getId()) {
		case R.id.btnBuscar_TR:
			buscarListaRutas();
			break;
		case R.id.btnCancelar_TR:
			Intent regresar = new Intent(this, IRBUActivity.class);
			startActivity(regresar);
			break;
		}
	}

	/*
	 * Hace el llamado de la lista de rutas dependiendo de la opción
	 * escogida esta se envia como parametro a la otra vista
	 */
	private void buscarListaRutas() {
		Intent regresar = new Intent(this, ListaRutasActivity.class);
		regresar.putExtra("op", opcionRadio);
		startActivity(regresar);
	}

	RadioButton.OnClickListener rgTipoRecorridoOnClickListener = new RadioButton.OnClickListener() {

		public void onClick(View v) {
			if (rbBaja.isChecked()) {
				opcionRadio = Constantes.BAJA;
			} else if (rbSube.isChecked()) {
				opcionRadio = Constantes.RECOGE;
			} else if (rbBajaSube.isChecked()) {
				opcionRadio = Constantes.BAJARECOGE;
			}
		};

	};

}
