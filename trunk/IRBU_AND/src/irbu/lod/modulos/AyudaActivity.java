package irbu.lod.modulos;

import irbu.lod.R;
import irbu.lod.sesion.SesionApplication;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;

public class AyudaActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
	super.onCreate(savedInstanceState);
	setContentView(R.layout.ayuda);

	SesionApplication sesion = (SesionApplication) getApplicationContext();
	if (sesion.isLogin()) {
	    sesion.cerrarSesion();
	}

	Button btnProblemas = (Button) findViewById(R.id.btnProblemas);
	btnProblemas.setOnClickListener(new OnClickListener() {
	    public void onClick(View v) {
		/* Create the Intent */
		final Intent emailIntent = new Intent(
			android.content.Intent.ACTION_SEND);

		/* Fill it with Data */
		emailIntent.setType("plain/text");
		emailIntent.putExtra(android.content.Intent.EXTRA_EMAIL,
			new String[] { "cfmora@utpl.edu.ec" });
		emailIntent.putExtra(android.content.Intent.EXTRA_SUBJECT,
			"Problemas IRBU Android");
		emailIntent.putExtra(android.content.Intent.EXTRA_TEXT,
			"Hola tengo un problema cuando!!!\n");

		/* Send it off to the Activity-Chooser */
		startActivity(Intent.createChooser(emailIntent,
			"Enviar mail..."));
	    }
	});

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
	menu.add(0, 0, Menu.NONE, R.string.txtConfiguracion).setIcon(
		android.R.drawable.ic_menu_preferences);
	return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onMenuItemSelected(int featureId, MenuItem item) {
	switch (item.getItemId()) {
	case 0:
	    Intent config = new Intent(this, ConfiguracionActivity.class);
	    startActivity(config);
	    return true;
	}
	return false;
    }
}
