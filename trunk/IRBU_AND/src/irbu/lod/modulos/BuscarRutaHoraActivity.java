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
import android.widget.TimePicker;

public class BuscarRutaHoraActivity extends Activity implements OnClickListener {

    private Button btnBuscar;
    private Button btnCancelar;
    private RadioButton rbBaja, rbSube, rbBajaSube;
    private String opcionRadio = Constantes.BAJA;
    private TimePicker hora;
    private TimePicker pn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
	super.onCreate(savedInstanceState);
	setContentView(R.layout.tipo_recorrido_hora);

	btnBuscar = (Button) findViewById(R.id.btnBuscarRutaHora);
	btnCancelar = (Button) findViewById(R.id.btnCancelarRutaHora);

	btnBuscar.setOnClickListener(this);
	btnCancelar.setOnClickListener(this);

	rbBaja = (RadioButton) findViewById(R.id.rbBajaUtpl);
	rbSube = (RadioButton) findViewById(R.id.rbSubeUtpl);
	rbBajaSube = (RadioButton) findViewById(R.id.rbBajaSubeUtpl);

	rbBaja.setOnClickListener(rgTipoRecorridoOnClickListener);
	rbSube.setOnClickListener(rgTipoRecorridoOnClickListener);
	rbBajaSube.setOnClickListener(rgTipoRecorridoOnClickListener);
	rbBaja.setChecked(true);

	pn = (TimePicker) findViewById(R.id.tpHora);

	hora = (TimePicker) findViewById(R.id.tpHora);
	hora.setIs24HourView(true);
    }

    @Override
    protected void onResume() {
	super.onResume();
	pn.setCurrentMinute(0);
	pn.setDescendantFocusability(TimePicker.FOCUS_BLOCK_DESCENDANTS);
	pn.setOnTimeChangedListener(StartTimeChangedListener);
	pn.setIs24HourView(true);
    }

    /**
     * Ejecuta cuando se da clic en cada uno de los botones
     * 
     * @param View
     *            v
     */
    public void onClick(View v) {
	switch (v.getId()) {
	case R.id.btnBuscarRutaHora:
	    buscarListaRutas();
	    break;
	case R.id.btnCancelarRutaHora:
	    Intent regresar = new Intent(this, IRBUActivity.class);
	    startActivity(regresar);
	    break;
	}
    }

    /*
     * Hace el llamado de la lista de rutas dependiendo de la opci�n escogida
     * esta se envia como parametro a la otra vista
     */
    private void buscarListaRutas() {
	Intent regresar = new Intent(this, ListaRutasActivity.class);
	regresar.putExtra("op", opcionRadio);
	regresar.putExtra("hora",
		hora.getCurrentHour() + ":" + hora.getCurrentMinute());
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

    private TimePicker.OnTimeChangedListener StartTimeChangedListener = new TimePicker.OnTimeChangedListener() {

	public void onTimeChanged(TimePicker view, int hourOfDay, int minute) {
	    updateDisplay(view, hourOfDay, minute);
	}
    };

    private TimePicker.OnTimeChangedListener NullTimeChangedListener = new TimePicker.OnTimeChangedListener() {

	public void onTimeChanged(TimePicker view, int hourOfDay, int minute) {

	}
    };

    private void updateDisplay(TimePicker timePicker, int hourOfDay, int minute) {
	// do calculation of next time
	int nextHour = 6;
	int nextMinute = 0;

	if (minute > 30 || minute == 29) {
	    nextMinute = 0;
	} else if (minute > 0) {
	    nextMinute = 30;
	}

	if (hourOfDay < 6) {
	    nextHour = 21;
	    nextMinute = 00;
	} else if (hourOfDay > 21) {
	    nextHour = 6;
	    nextMinute = 30;
	} else {
	    nextHour = hourOfDay;
	}

	// remove ontimechangedlistener to prevent stackoverflow/infinite loop
	timePicker.setOnTimeChangedListener(NullTimeChangedListener);

	// set minute
	timePicker.setCurrentMinute(nextMinute);

	// set hour
	timePicker.setCurrentHour(nextHour);

	// hook up ontimechangedlistener again
	timePicker.setOnTimeChangedListener(StartTimeChangedListener);

    }

}
