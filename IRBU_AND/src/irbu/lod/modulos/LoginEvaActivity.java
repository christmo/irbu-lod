package irbu.lod.modulos;

import irbu.lod.R;
import irbu.lod.objetos.Paradas;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;

public class LoginEvaActivity extends Activity implements OnClickListener {

    private EditText txtUsuario;
    private EditText txtClave;
    private Button btnIngresar;
    private double lon;
    private double lat;
//    private int idParada;
    private Paradas parada;
    private boolean irInformacion = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
	super.onCreate(savedInstanceState);
	setContentView(R.layout.login_eva);

	if (getIntent().hasExtra("informacion")) {
	    irInformacion = true;
	} else {
	    if (getIntent().hasExtra("lat") && getIntent().hasExtra("lon")) {
		lat = getIntent().getExtras().getDouble("lat");
		lon = getIntent().getExtras().getDouble("lon");
	    }
//	    if (getIntent().hasExtra("id_parada")) {
//		idParada = getIntent().getExtras().getInt("id_parada");
//	    }
	    if (getIntent().hasExtra("parada")) {
		parada = getIntent().getParcelableExtra("parada");
	    }
	}

	txtUsuario = (EditText) findViewById(R.id.txtUsuario);
	txtClave = (EditText) findViewById(R.id.txtClave);
	btnIngresar = (Button) findViewById(R.id.btnIngresar);

	btnIngresar.setOnClickListener(this);
    }

    public void onClick(View v) {
	switch (v.getId()) {
	case R.id.btnIngresar:
	    ingresarEva();
	    break;
	}
    }

    /**
     * Permite hacer el llamado al view de informaci�n del eva y guardar los
     * datos
     */
    private void ingresarEva() {
	String usuario = txtUsuario.getText().toString();
	String clave = txtClave.getText().toString();
	if (!usuario.equals("") && !clave.equals("")) {
	    Intent datosEva = new Intent(this, InfoEvaActivity.class);
	    datosEva.putExtra("usuario", usuario);
	    datosEva.putExtra("clave", clave);
	    if (irInformacion) {
		datosEva.putExtra("informacion", true);
	    } else {
		if (getIntent().hasExtra("lat") && getIntent().hasExtra("lon")) {
		    datosEva.putExtra("lon", lon);
		    datosEva.putExtra("lat", lat);
		}
//		if (getIntent().hasExtra("id_parada")) {
//		    datosEva.putExtra("id_parada", idParada);
//		}
		if (getIntent().hasExtra("parada")) {
		    datosEva.putExtra("parada", parada);
		}
	    }
	    startActivity(datosEva);
	} else {
	    AlertDialog.Builder builder = new AlertDialog.Builder(this);
	    builder.setMessage(
		    "No se pudo acceder al EVA, revice su usuario y su clave y vuelva a intentar...")
		    .setCancelable(false)
		    .setPositiveButton("OK",
			    new DialogInterface.OnClickListener() {
				public void onClick(DialogInterface dialog,
					int id) {
				    txtClave.setText("");
				}
			    });
	    AlertDialog alert = builder.create();
	    alert.show();
	}
    }
}
