package irbu.lod.mapa;

import irbu.lod.R;
import irbu.lod.objetos.Paradas;
import irbu.lod.objetos.Puntos;

import java.util.ArrayList;
import java.util.Iterator;

import org.osmdroid.DefaultResourceProxyImpl;
import org.osmdroid.tileprovider.util.CloudmadeUtil;
import org.osmdroid.util.GeoPoint;
import org.osmdroid.views.MapController;
import org.osmdroid.views.MapView;
import org.osmdroid.views.overlay.ItemizedIconOverlay;
import org.osmdroid.views.overlay.ItemizedOverlay;
import org.osmdroid.views.overlay.MinimapOverlay;
import org.osmdroid.views.overlay.OverlayItem;
import org.osmdroid.views.overlay.PathOverlay;
import org.osmdroid.views.overlay.ScaleBarOverlay;
import org.osmdroid.views.overlay.SimpleLocationOverlay;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup.LayoutParams;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.Toast;

public class ViewMapaActivity extends Activity implements LocationListener {

	// ===========================================================
	// Constants
	// ===========================================================

	private static final int MENU_ZOOMIN_ID = Menu.FIRST;
	private static final int MENU_ZOOMOUT_ID = MENU_ZOOMIN_ID + 1;

	// ===========================================================
	// Fields
	// ===========================================================

	private MapView mOsmv;
	private ItemizedOverlay<OverlayItem> mMyLocationOverlay;
	private SimpleLocationOverlay mMyLocationSimpleOverlay;
	private DefaultResourceProxyImpl mResourceProxy;
	/**
	 * Controller to interact with view
	 */
	private MapController osmViewController;
	/*
	 * Create a static ItemizedOverlay showing a some Markers on some cities.
	 */
	public ArrayList<OverlayItem> items = new ArrayList<OverlayItem>();
	private LocationManager lmgr;
	private PathOverlay pathOverlay;
	private ScaleBarOverlay mScaleBarOverlay;

	// ===========================================================
	// Constructors
	// ===========================================================
	/** Called when the activity is first created. */
	@Override
	public void onCreate(final Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		ArrayList<Puntos> puntosLinea = getIntent()
				.getParcelableArrayListExtra("listaPuntos");
		ArrayList<Paradas> paradas = getIntent().getParcelableArrayListExtra(
				"listaParadas");

		mResourceProxy = new DefaultResourceProxyImpl(getApplicationContext());

		final RelativeLayout rl = new RelativeLayout(this);

		CloudmadeUtil.retrieveCloudmadeKey(getApplicationContext());

		this.mOsmv = new MapView(this, 256);
		rl.addView(this.mOsmv, new RelativeLayout.LayoutParams(
				LayoutParams.FILL_PARENT, LayoutParams.FILL_PARENT));

		osmViewController = mOsmv.getController();

		/* Scale Bar Overlay */
		{
			this.mScaleBarOverlay = new ScaleBarOverlay(this, mResourceProxy);
			this.mOsmv.getOverlays().add(mScaleBarOverlay);
			// Scale bar tries to draw as 1-inch, so to put it in the top
			// center, set x offset to
			// half screen width, minus half an inch.
			this.mScaleBarOverlay.setScaleBarOffset(getResources()
					.getDisplayMetrics().widthPixels
					/ 2
					- getResources().getDisplayMetrics().xdpi / 2, 10);
		}
		/* SingleLocation-Overlay */
		{
			/*
			 * Create a static Overlay showing a single location. (Gets updated
			 * in onLocationChanged(Location loc)!
			 */
			this.mMyLocationSimpleOverlay = new SimpleLocationOverlay(this,
					mResourceProxy);
			this.mOsmv.getOverlays().add(mMyLocationSimpleOverlay);
		}
		/* Dibujar Ruta */
		{
			this.pathOverlay = new PathOverlay(Color.BLUE, mResourceProxy);
			if (puntosLinea != null) {
				for (Puntos p : puntosLinea) {
					pathOverlay.addPoint((int) (p.getLat() * 1e6),
							(int) (p.getLon() * 1e6));
				}
			}
			this.mOsmv.getOverlays().add(pathOverlay);
		}

		/* ZoomControls */
		{
			/* Create a ImageView with a zoomIn-Icon. */
			final ImageView ivZoomIn = new ImageView(this);
			ivZoomIn.setImageResource(R.drawable.zoom_in);
			/*
			 * Create RelativeLayoutParams, that position it in the top right
			 * corner.
			 */
			final RelativeLayout.LayoutParams zoominParams = new RelativeLayout.LayoutParams(
					RelativeLayout.LayoutParams.WRAP_CONTENT,
					RelativeLayout.LayoutParams.WRAP_CONTENT);
			zoominParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
			zoominParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
			rl.addView(ivZoomIn, zoominParams);

			ivZoomIn.setOnClickListener(new OnClickListener() {
				public void onClick(final View v) {
					osmViewController.zoomIn();
				}
			});

			/* Create a ImageView with a zoomOut-Icon. */
			final ImageView ivZoomOut = new ImageView(this);
			ivZoomOut.setImageResource(R.drawable.zoom_out);

			/*
			 * Create RelativeLayoutParams, that position it in the top left
			 * corner.
			 */
			final RelativeLayout.LayoutParams zoomoutParams = new RelativeLayout.LayoutParams(
					RelativeLayout.LayoutParams.WRAP_CONTENT,
					RelativeLayout.LayoutParams.WRAP_CONTENT);
			zoomoutParams.addRule(RelativeLayout.ALIGN_PARENT_LEFT);
			zoomoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
			rl.addView(ivZoomOut, zoomoutParams);

			ivZoomOut.setOnClickListener(new OnClickListener() {

				public void onClick(final View v) {
					osmViewController.zoomOut();
				}
			});
		}
		/* Itemized Overlay */
		{
			double latIni = -3.97733;
			double lonIni = -79.20484;

			osmViewController.setZoom(15);
			osmViewController.setCenter(new GeoPoint(latIni, lonIni));
			if (paradas != null) {
				for (Paradas p : paradas) {
					GeoPoint punto = new GeoPoint(p.getLat(), p.getLon());
					items.add(new OverlayItem(p.getDir(), p.getRef(), punto));
				}
			}
			/* OnTapListener for the Markers, shows a simple Toast. */
			this.mMyLocationOverlay = new ItemizedIconOverlay<OverlayItem>(
					items,
					new ItemizedIconOverlay.OnItemGestureListener<OverlayItem>() {
						public boolean onItemSingleTapUp(final int index,
								final OverlayItem item) {
							Toast.makeText(
									ViewMapaActivity.this,
									"Dir: " + item.mTitle + "\n" + "Ref: "
											+ item.mDescription,
									Toast.LENGTH_LONG).show();
							return true; // We 'handled' this event.
						}

						public boolean onItemLongPress(final int index,
								final OverlayItem item) {
							Toast.makeText(
									ViewMapaActivity.this,
									"Item '" + item.mDescription + "' (index="
											+ index + ") got long pressed",
									Toast.LENGTH_LONG).show();
							return false;
						}
					}, mResourceProxy);
			this.mOsmv.getOverlays().add(this.mMyLocationOverlay);
		}

		/* MiniMap */
		{
			MinimapOverlay miniMapOverlay = new MinimapOverlay(this,
					mOsmv.getTileRequestCompleteHandler());
			this.mOsmv.getOverlays().add(miniMapOverlay);
		}

		this.setContentView(rl);
		// createOverlays();
		activarGPS();
	}

	@Override
	protected void onPause() {
		pathOverlay.clearPath();
		super.onPause();
	}

	// ===========================================================
	// Getter & Setter
	// ===========================================================

	// ===========================================================
	// Methods from SuperClass/Interfaces
	// ===========================================================

	@Override
	public boolean onCreateOptionsMenu(final Menu pMenu) {
		pMenu.add(0, MENU_ZOOMIN_ID, Menu.NONE, "ZoomIn");
		pMenu.add(0, MENU_ZOOMOUT_ID, Menu.NONE, "ZoomOut");

		return true;
	}

	@Override
	public boolean onMenuItemSelected(final int featureId, final MenuItem item) {
		switch (item.getItemId()) {
		case MENU_ZOOMIN_ID:
			double lastLat = -3.97733;
			double lastLon = -79.20484;
			GeoPoint punto = new GeoPoint(lastLat, lastLon);
			items.add(new OverlayItem("Terminal", "Loja", punto));
			this.mOsmv.getController().zoomIn();
			this.mOsmv.invalidate();
			return true;

		case MENU_ZOOMOUT_ID:
			this.mOsmv.getController().zoomOut();
			return true;
		}
		return false;
	}

	public void onLocationChanged(Location location) {
		if (location != null) {
			Log.d("LAT", "" + location.getLatitude());
			Log.d("LON", "" + location.getLongitude());
			GeoPoint punto = new GeoPoint(location);
			this.mMyLocationSimpleOverlay.setLocation(punto);
			osmViewController.animateTo(punto);
			osmViewController.setCenter(punto);
//			dibujarPunto(location.getLatitude(), location.getLongitude());
		}
	}

	public void onProviderDisabled(String provider) {
	}

	public void onProviderEnabled(String provider) {
	}

	public void onStatusChanged(String provider, int status, Bundle extras) {
	}

	// ===========================================================
	// Methods
	// ===========================================================
	public void activarGPS() {
		lmgr = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
		lmgr.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1, 1, this);
	}

//	public void dibujarPunto(double lat, double lon) {
//		pathOverlay.addPoint((int) (lat * 1e6), (int) (lon * 1e6));
//		this.mOsmv.invalidate();
//	}
	// ===========================================================
	// Inner and Anonymous Classes
	// ===========================================================
}
