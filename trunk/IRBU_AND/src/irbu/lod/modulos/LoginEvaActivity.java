package irbu.lod.modulos;

import irbu.lod.R;
import android.app.Activity;
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

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.login_eva);
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
	 * Permite hacer el llamado al view de información del eva y guardar los
	 * datos
	 */
	private void ingresarEva() {
		String usuario = txtUsuario.getText().toString();
		String clave = txtClave.getText().toString();
		if (!usuario.equals("") && !clave.equals("")) {
			Intent datosEva = new Intent(this, InfoEvaActivity.class);
			datosEva.putExtra("usuario", usuario);
			datosEva.putExtra("clave", clave);
			startActivity(datosEva);
		} else {
			// alerta
		}
	}
}
