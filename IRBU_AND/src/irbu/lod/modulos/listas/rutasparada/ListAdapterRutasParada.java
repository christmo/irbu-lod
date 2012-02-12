package irbu.lod.modulos.listas.rutasparada;

import irbu.lod.R;

import java.util.ArrayList;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

public class ListAdapterRutasParada extends BaseAdapter {
	 private Context context;
	ArrayList<CamposListaRutasParada> filas = new ArrayList<CamposListaRutasParada>();
	
	public ListAdapterRutasParada(Context ctx, ArrayList<CamposListaRutasParada> lista) {
		this.filas = lista;
		this.context = ctx;
	}
	
	public int getCount() {
		return filas.size();
	}

	public CamposListaRutasParada getItem(int idx) {
		return filas.get(idx);
	}

	public long getItemId(int position) {
		return position;
	}

	public View getView(int position, View convertView, ViewGroup parent) {
		if (convertView == null) {
            LayoutInflater inflater = (LayoutInflater) context
                    .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            convertView = inflater.inflate(R.layout.fila_rutas_parada, null);
        }
		
		TextView txtRuta = (TextView)convertView.findViewById(R.id.txtRuta);
		txtRuta.setText(filas.get(position).getStrRuta());
		TextView txtTipoR = (TextView)convertView.findViewById(R.id.txtTipoR);
		txtTipoR.setText(filas.get(position).getStrTipo());
		TextView txtHora = (TextView)convertView.findViewById(R.id.txtHora);
		txtHora.setText(filas.get(position).getStrHora());
		
		return convertView;
	}

}
