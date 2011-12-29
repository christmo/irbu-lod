package irbu.lod.modulos;

import irbu.lod.R;
import irbu.lod.constantes.Constantes;
import irbu.lod.objetos.Paradas;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;

public class InfoParadasActivity extends Activity {

	private ImageView imView;
	private String urlHostRemoto = Constantes.URL_SERVER
			+ Constantes.NOMBRE_PROYECTO;
	private Bitmap imgParada;

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.info_parada);

		Button bt3 = (Button) findViewById(R.id.get_imagebt);
		bt3.setOnClickListener(getImgListener);
		imView = (ImageView) findViewById(R.id.imview);
	}

	View.OnClickListener getImgListener = new View.OnClickListener() {

		public void onClick(View view) {
			Paradas parada = (Paradas) getIntent().getExtras().get("parada");
			// int i = r.nextInt(4);
			String url = urlHostRemoto + parada.getUrlImg();
			downloadFile(url);
			// downloadFile(urlHostRemoto + i + ".jpg");
			Log.i("URL IMG", url);
		}

	};

	void downloadFile(String fileUrl) {
		URL myFileUrl = null;
		try {
			myFileUrl = new URL(fileUrl);
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
		try {
			HttpURLConnection conn = (HttpURLConnection) myFileUrl
					.openConnection();
			conn.setDoInput(true);
			conn.connect();
			InputStream is = conn.getInputStream();

			imgParada = BitmapFactory.decodeStream(is);
			imView.setImageBitmap(imgParada);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}