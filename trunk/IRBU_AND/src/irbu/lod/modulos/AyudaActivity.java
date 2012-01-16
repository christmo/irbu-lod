package irbu.lod.modulos;

import irbu.lod.R;
import irbu.lod.sesion.SesionApplication;
import android.app.Activity;
import android.os.Bundle;
import android.util.Log;

public class AyudaActivity extends Activity{

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.ayuda);
				
		SesionApplication sesion = (SesionApplication) getApplicationContext();
		if (sesion.isLogin()) {
			sesion.setLogin(false);
			sesion.setEstudiante(null);
			Log.d("SESION","CERRAR SESION");
		} 
	}
	
}
