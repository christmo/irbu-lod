package irbu.lod;

import irbu.lod.modulos.BuscarRutaActivity;
import irbu.lod.modulos.BuscarRutaHoraActivity;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.ImageButton;

public class IRBUActivity extends Activity implements OnClickListener {

	private ImageButton btnMapa;
	private ImageButton btnBuscarRuta;
	private ImageButton btnBuscarRutaHora;
	private ImageButton btnAyuda;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);

		btnMapa = (ImageButton) findViewById(R.id.btnMapa);
		btnBuscarRuta = (ImageButton) findViewById(R.id.btnBuscarRuta);
		btnBuscarRutaHora = (ImageButton) findViewById(R.id.btnBuscarRutaHora);
		btnAyuda = (ImageButton) findViewById(R.id.btnAyuda);

		btnMapa.setOnClickListener(this);
		btnBuscarRuta.setOnClickListener(this);
		btnBuscarRutaHora.setOnClickListener(this);
		btnAyuda.setOnClickListener(this);
	}

	public void onClick(View v) {
		switch (v.getId()) {
		case R.id.btnMapa:
//			Intent mapa = new Intent(Mapa.class);
			break;
		case R.id.btnBuscarRuta:
			Intent buscarRuta = new Intent(this,BuscarRutaActivity.class);
			startActivity(buscarRuta);
			break;
		case R.id.btnBuscarRutaHora:
			Intent buscarRutaHora = new Intent(this,BuscarRutaHoraActivity.class);
			startActivity(buscarRutaHora);
			break;
		case R.id.btnAyuda:

			break;
		default:
			break;
		}
	}
}