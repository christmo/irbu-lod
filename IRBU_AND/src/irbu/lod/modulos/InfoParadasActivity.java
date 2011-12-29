package irbu.lod.modulos;

import irbu.lod.R;
import irbu.lod.constantes.Constantes;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Random;

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
	private String imageUrl = Constantes.URL_SERVER + "/irbu/img/datap/";
	private Random r = new Random();
	private Bitmap bmImg;

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle icicle) {
		super.onCreate(icicle);
		setContentView(R.layout.info_parada);

		Button bt3 = (Button) findViewById(R.id.get_imagebt);
		bt3.setOnClickListener(getImgListener);
		imView = (ImageView) findViewById(R.id.imview);
	}

	View.OnClickListener getImgListener = new View.OnClickListener() {

		public void onClick(View view) {
			// TODO Auto-generated method stub

			// i tried to randomize the file download, in my server i put 4
			// files with name like
			// png0.png, png1.png, png2.png so different file is downloaded in
			// button press
			int i = r.nextInt(4);
			downloadFile(imageUrl + i + ".jpg");
			Log.i("im url", imageUrl + "png" + i + ".png");
		}

	};

	void downloadFile(String fileUrl) {
		URL myFileUrl = null;
		try {
			myFileUrl = new URL(fileUrl);
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			HttpURLConnection conn = (HttpURLConnection) myFileUrl
					.openConnection();
			conn.setDoInput(true);
			conn.connect();
			InputStream is = conn.getInputStream();

			bmImg = BitmapFactory.decodeStream(is);
			imView.setImageBitmap(bmImg);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}