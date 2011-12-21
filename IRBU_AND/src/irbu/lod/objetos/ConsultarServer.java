package irbu.lod.objetos;

import irbu.lod.R;
import irbu.lod.constantes.Constantes;

import java.io.IOException;
import java.net.SocketException;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.params.HttpParams;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

public class ConsultarServer {

	private HttpClient httpclient;
	private HttpPost httppost;

	public ConsultarServer() {
		super();
		HttpParams httpparametros = new BasicHttpParams();
		HttpConnectionParams.setConnectionTimeout(httpparametros, 8000);

		httpclient = new DefaultHttpClient(httpparametros);
	}

	/**
	 * obtiene las rutas desde el servidor a partir de los parametros que se
	 * envien
	 * 
	 * @param strTipoRuta
	 * @return ArrayList<Ruta>
	 * @throws IOException
	 */
	public ArrayList<Ruta> getRutasServer(String strTipoRuta)
			throws IOException, SocketException {
		ArrayList<Ruta> listaRutas = new ArrayList<Ruta>();
		final String url = Constantes.URL_RUTAS + "?op=" + strTipoRuta;

		httppost = new HttpPost(url);

		Log.d("respuesta", url);

		// Execute HTTP Post Request
		HttpResponse response = httpclient.execute(httppost);
		HttpEntity resEntity = response.getEntity();

		JSONObject jObject = null;
		JSONArray rutas = null;
		try {
			String txtJson = EntityUtils.toString(resEntity);

			jObject = new JSONObject(txtJson);
			rutas = jObject.getJSONArray("rutas");

			Log.i("rutas", rutas.toString());

			JSONObject gp;
			for (int i = 0; i < rutas.length(); i++) {
				gp = rutas.getJSONObject(i);
				int id = gp.getInt("id");
				String name = gp.optString("name");

				Ruta infoRuta = new Ruta(id, name, R.drawable.item_icon);
				listaRutas.add(infoRuta);

				// Log.i("ID", " " + id);
				// Log.i("NOMBRE", " " + name);
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}

		return listaRutas;
	}

	/**
	 * Trae las rutas desde el servidor pero filtradas por hora y por tipo de
	 * recorrido
	 * 
	 * @param strTipoRuta
	 * @param strHora
	 * @return ArrayList<Ruta>
	 * @throws IOException
	 * @throws SocketException
	 */
	public ArrayList<Ruta> getRutasServer(String strTipoRuta, String strHora)
			throws IOException, SocketException {
		ArrayList<Ruta> listaRutas = new ArrayList<Ruta>();
		final String url = Constantes.URL_RUTAS_HORA + "?op=" + strTipoRuta
				+ "&hora=" + strHora;

		httppost = new HttpPost(url);

		Log.d("respuesta", url);

		// Execute HTTP Post Request
		HttpResponse response = httpclient.execute(httppost);
		HttpEntity resEntity = response.getEntity();

		JSONObject jObject = null;
		JSONArray rutas = null;
		try {
			String txtJson = EntityUtils.toString(resEntity);

			jObject = new JSONObject(txtJson);
			rutas = jObject.getJSONArray("rutas");

			Log.i("rutas", rutas.toString());

			JSONObject gp;
			for (int i = 0; i < rutas.length(); i++) {
				gp = rutas.getJSONObject(i);
				int id = gp.getInt("id");
				String name = gp.optString("name");

				Ruta infoRuta = new Ruta(id, name, R.drawable.item_icon);
				listaRutas.add(infoRuta);

				// Log.i("ID", " " + id);
				// Log.i("NOMBRE", " " + name);
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}

		return listaRutas;
	}

	/**
	 * Consulta los puntos para el trazado de la linea de la ruta en el mapa
	 * 
	 * @param idRuta
	 * @return ArrayList<Puntos>
	 * @throws IOException
	 * @throws SocketException
	 */
	public ArrayList<Puntos> getPuntosRuta(int idRuta) throws IOException,
			SocketException {
		ArrayList<Puntos> puntosRutas = new ArrayList<Puntos>();
		final String url = Constantes.URL_PUNTOS_RUTAS + "?id_ruta=" + idRuta;

		httppost = new HttpPost(url);

		Log.d("respuesta", url);

		// Execute HTTP Post Request
		HttpResponse response = httpclient.execute(httppost);
		HttpEntity resEntity = response.getEntity();

		JSONObject jObject = null;
		JSONObject datos = null;
		try {
			String txtJson = EntityUtils.toString(resEntity);
			jObject = new JSONObject(txtJson);
			datos = jObject.getJSONObject("datos");
			String dato = datos.getString("coordenadas");

			double lon = 0, lat = 0;
			String[] fila = dato.split("#");
			for (int i = 0; i < fila.length; i++) {
				String[] col = fila[i].split("%");
				lon = Double.parseDouble(col[0]);
				lat = Double.parseDouble(col[1]);
				Puntos p = new Puntos((i + 1), lon, lat);
				puntosRutas.add(p);
			}

		} catch (JSONException e) {
			e.printStackTrace();
		}

		return puntosRutas;
	}

	/**
	 * Obtiene la informacion de las paradas pertenecientes a una ruta
	 * @param idRuta
	 * @return ArrayList<Paradas> 
	 * @throws IOException
	 * @throws SocketException
	 */
	public ArrayList<Paradas> getParadasRuta(int idRuta,String strTipoRuta) throws IOException,
			SocketException {
		ArrayList<Paradas> paradasRuta = new ArrayList<Paradas>();
		final String url = Constantes.URL_PARADAS_RUTAS;

		httppost = new HttpPost(url);
		
		 // Poner prametros a la consulta POST
	    List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(2);
	    nameValuePairs.add(new BasicNameValuePair("id_ruta", ""+idRuta));
	    nameValuePairs.add(new BasicNameValuePair("tipo", strTipoRuta));
	    httppost.setEntity(new UrlEncodedFormEntity(nameValuePairs));

		Log.d("respuesta", url);

		// Execute HTTP Post Request
		HttpResponse response = httpclient.execute(httppost);
		HttpEntity resEntity = response.getEntity();

		JSONObject jObject = null;
		JSONObject datos = null;
		try {
			String txtJson = EntityUtils.toString(resEntity);
			jObject = new JSONObject(txtJson);
			datos = jObject.getJSONObject("datos");
			String dato = datos.getString("coordenadas");

			int idParada=0;
			double lon = 0, lat = 0;
			String dir="",ref="",urlImg="";
			
			String[] fila = dato.split("#");
			for (int i = 0; i < fila.length; i++) {
				String[] col = fila[i].split("%");
				idParada = Integer.parseInt(col[0]);
				lon = Double.parseDouble(col[1]);
				lat = Double.parseDouble(col[2]);
				dir = col[3];
				ref = col[4];
				urlImg = col[5];
				Paradas p = new Paradas(
						idParada, 
						lon, 
						lat,
						dir,
						ref,
						urlImg
						);
				paradasRuta.add(p);
			}

		} catch (JSONException e) {
			e.printStackTrace();
		}

		return paradasRuta;
	}
}
