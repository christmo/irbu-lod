package irbu.lod.modulos;

import irbu.lod.R;
import irbu.lod.constantes.Constantes;
import irbu.lod.sesion.SesionApplication;
import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class ConfiguracionActivity extends Activity {

    private EditText txtProyecto;
    private EditText txtServer;
    private EditText txtPuerto;
    private SesionApplication sesion;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
	super.onCreate(savedInstanceState);
	setContentView(R.layout.configuracion);

	sesion = (SesionApplication) getApplicationContext();

	txtProyecto = (EditText) findViewById(R.id.txtProyecto);
	txtServer = (EditText) findViewById(R.id.txtServidor);
	txtPuerto = (EditText) findViewById(R.id.txtPuerto);

	txtProyecto.setText(sesion.getProyecto());
	txtServer.setText(sesion.getServer());
	txtPuerto.setText(sesion.getPuerto());

	Button btnGuardar = (Button) findViewById(R.id.btnGuardar);
	btnGuardar.setOnClickListener(new OnClickListener() {

	    public void onClick(View v) {
		if (!txtProyecto.getText().equals("")) {
		    if (!txtServer.getText().equals("")) {
			if (!txtPuerto.getText().equals("")) {
			    actualizarNuevoServidor();
			} else {
			    Toast t = Toast.makeText(
				    ConfiguracionActivity.this,
				    "Ingresar puerto del servidor!!!",
				    Toast.LENGTH_SHORT);
			    t.show();
			}
		    } else {
			Toast t = Toast.makeText(ConfiguracionActivity.this,
				"Ingresar servidor web!!!", Toast.LENGTH_SHORT);
			t.show();
		    }
		} else {
		    Toast t = Toast.makeText(ConfiguracionActivity.this,
			    "Ingresar nombre del proyecto web!!!",
			    Toast.LENGTH_SHORT);
		    t.show();
		}
	    }
	});

    }

    /**
     * Actualiza los datos del nuevo servidor en la base de datos;
     */
    private void actualizarNuevoServidor() {
	sesion.setServer(txtServer.getText().toString().trim());
	sesion.setPuerto(txtPuerto.getText().toString().trim());
	sesion.setProyecto(txtProyecto.getText().toString().trim());

	Constantes.refrescarVariables();

	Toast t = Toast.makeText(ConfiguracionActivity.this,
		"Configuración Guardada!!!", Toast.LENGTH_SHORT);
	t.show();
	ConfiguracionActivity.this.finish();
    }

}
