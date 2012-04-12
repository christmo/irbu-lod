package irbu.lod;

import irbu.lod.constantes.Constantes;
import irbu.lod.mapa.ViewMapaActivity;
import irbu.lod.modulos.AyudaActivity;
import irbu.lod.modulos.BuscarRutaActivity;
import irbu.lod.modulos.BuscarRutaHoraActivity;
import irbu.lod.modulos.InfoEstudianteActivity;
import irbu.lod.modulos.LoginEvaActivity;
import irbu.lod.sesion.SesionApplication;
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
    private ImageButton btnInformacion;
    public static SesionApplication sesion;

    @Override
    public void onCreate(Bundle savedInstanceState) {
	super.onCreate(savedInstanceState);
	setContentView(R.layout.main);

	btnMapa = (ImageButton) findViewById(R.id.btnMapa);
	btnBuscarRuta = (ImageButton) findViewById(R.id.btnBuscarRuta);
	btnBuscarRutaHora = (ImageButton) findViewById(R.id.btnBuscarRutaHora);
	btnAyuda = (ImageButton) findViewById(R.id.btnAyuda);
	btnInformacion = (ImageButton) findViewById(R.id.btnInformacion);

	btnMapa.setOnClickListener(this);
	btnBuscarRuta.setOnClickListener(this);
	btnBuscarRutaHora.setOnClickListener(this);
	btnInformacion.setOnClickListener(this);
	btnAyuda.setOnClickListener(this);

	sesion = (SesionApplication) getApplicationContext();
	try {
	    
	    if (sesion.getServer().equals("")) {
		sesion.setServer("carbono.utpl.edu.ec");
		sesion.setPuerto("80");
		sesion.setProyecto("IRBU_LOD");
	    }
	} catch (NullPointerException e) {
	    sesion.setServer("carbono.utpl.edu.ec");
	    sesion.setPuerto("80");
	    sesion.setProyecto("IRBU_LOD");
	}
	Constantes.refrescarVariables();
    }

    public void onClick(View v) {
	switch (v.getId()) {
	case R.id.btnMapa:
	    Intent mapa = new Intent(this, ViewMapaActivity.class);
	    startActivity(mapa);
	    break;
	case R.id.btnBuscarRuta:
	    Intent buscarRuta = new Intent(this, BuscarRutaActivity.class);
	    startActivity(buscarRuta);
	    break;
	case R.id.btnBuscarRutaHora:
	    Intent buscarRutaHora = new Intent(this,
		    BuscarRutaHoraActivity.class);
	    startActivity(buscarRutaHora);
	    break;
	case R.id.btnInformacion:
	    if (!sesion.isLogin()) {
		Intent info = new Intent(this, LoginEvaActivity.class);
		info.putExtra("informacion", true);
		startActivity(info);
	    } else {
		Intent infoEstudiante = new Intent(this,
			InfoEstudianteActivity.class);
		startActivity(infoEstudiante);
	    }
	    break;
	case R.id.btnAyuda:
	    Intent ayuda = new Intent(this, AyudaActivity.class);
	    startActivity(ayuda);
	    break;
	}
    }
}