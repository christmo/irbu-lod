package irbu.lod.mapa;

import irbu.lod.R;
import irbu.lod.modulos.InfoParadasActivity;
import irbu.lod.objetos.Paradas;
import irbu.lod.objetos.Puntos;

import java.util.ArrayList;

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
import android.content.Intent;
import android.graphics.Color;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup.LayoutParams;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.Toast;

public class ViewMapaActivity extends Activity implements LocationListener  {

	// ===========================================================
	// Constants
	// ===========================================================

	private static final int MENU_ZOOMIN_ID = Menu.FIRST;
	private static final int MENU_ZOOMOUT_ID = MENU_ZOOMIN_ID + 1;

	// ===========================================================
	// Fields
	// ===========================================================
	/**
	 * Vista del mapa de OSM
	 */
	private MapView osmMapa;
	private DefaultResourceProxyImpl mResourceProxy;
	/**
	 * Manejador de Localizacion permite activar el gps y comprobar su estado
	 */
	private LocationManager lmgr;
	/**
	 * Lista de iconos de las paradas para colocarlas sobre el mapa
	 */
	private ItemizedOverlay<OverlayItem> listaIconosParadasOverlay;
	/**
	 * Dibujo de la posicion actual del gps sobre el mapa
	 */
	private SimpleLocationOverlay posicionActualOverlay;
	/**
	 * Control sobre las acciones en el mapa
	 */
	private MapController osmViewController;
	/*
	 * Lista de puntos de las paradas como Markers sobre el mapa
	 */
	public ArrayList<OverlayItem> puntosParadasItems = new ArrayList<OverlayItem>();
	/**
	 * Une los puntos con una linea para mostrar la ruta del recorrido
	 */
	private PathOverlay lineaOverlay;
	/**
	 * Muestra la barra de escala sobre el mapa
	 */
	private ScaleBarOverlay mScaleBarOverlay;
	/**
	 * Lista de paradas del sercorrido seleccionado a dibujar
	 */
	private ArrayList<Paradas> paradas;
	/**
	 * Lista de puntos que conforman la linea a dibujar
	 */
	private ArrayList<Puntos> puntosLinea;

	// ===========================================================
	// Constructors
	// ===========================================================
	/** Called when the activity is first created. */
	@Override
	public void onCreate(final Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

	
		
		puntosLinea = getIntent().getParcelableArrayListExtra("listaPuntos");
		paradas = getIntent().getParcelableArrayListExtra("listaParadas");

		mResourceProxy = new DefaultResourceProxyImpl(getApplicationContext());

		final RelativeLayout rl = new RelativeLayout(this);

		CloudmadeUtil.retrieveCloudmadeKey(getApplicationContext());

		this.osmMapa = new MapView(this, 256);
		rl.addView(this.osmMapa, new RelativeLayout.LayoutParams(
				LayoutParams.FILL_PARENT, LayoutParams.FILL_PARENT));

		osmViewController = osmMapa.getController();

		/* Configuracion Inicial Mapa Loja */
		{
			double latIni = -3.997368;
			double lonIni = -79.200975;

			osmViewController.setZoom(14);
			osmViewController.setCenter(new GeoPoint(latIni, lonIni));
		}

		/* Scale Bar Overlay */
		{
			this.mScaleBarOverlay = new ScaleBarOverlay(this, mResourceProxy);
			this.osmMapa.getOverlays().add(mScaleBarOverlay);
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
			this.posicionActualOverlay = new SimpleLocationOverlay(this,
					mResourceProxy);
			this.osmMapa.getOverlays().add(posicionActualOverlay);
		}
		/* Dibujar Ruta */
		{
			this.lineaOverlay = new PathOverlay(Color.BLUE, mResourceProxy);
			if (puntosLinea != null) {
				for (Puntos p : puntosLinea) {
					lineaOverlay.addPoint((int) (p.getLat() * 1e6),
							(int) (p.getLon() * 1e6));
				}
			}
			this.osmMapa.getOverlays().add(lineaOverlay);
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
		/* Dibujar paradas en el mapa */
		{
			if (paradas != null) {
				for (Paradas p : paradas) {
					GeoPoint punto = new GeoPoint(p.getLat(), p.getLon());
					puntosParadasItems.add(new OverlayItem(p.getDir(), p
							.getRef(), punto));
				}
			}
			/* OnTapListener for the Markers, shows a simple Toast. */
			this.listaIconosParadasOverlay = new ItemizedIconOverlay<OverlayItem>(
					puntosParadasItems,
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
							Intent infoParada = new Intent(
									ViewMapaActivity.this,
									InfoParadasActivity.class);
							infoParada.putExtra("parada", paradas.get(index));
							startActivity(infoParada);
							return false;
						}
					}, mResourceProxy);
			this.osmMapa.getOverlays().add(this.listaIconosParadasOverlay);
		}

		/* MiniMap */
		{
			MinimapOverlay miniMapOverlay = new MinimapOverlay(this,
					osmMapa.getTileRequestCompleteHandler());
			this.osmMapa.getOverlays().add(miniMapOverlay);
		}

		this.setContentView(rl);
		activarGPS();
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
			puntosParadasItems.add(new OverlayItem("Terminal", "Loja", punto));
			this.osmMapa.getController().zoomIn();
			this.osmMapa.invalidate();
			return true;

		case MENU_ZOOMOUT_ID:
			this.osmMapa.getController().zoomOut();
			return true;
		}
		return false;
	}

	/**
	 * Se ejcuta cuando se captura una nueva posicion de GPS
	 */
	public void onLocationChanged(Location location) {
		if (location != null) {
			GeoPoint punto = new GeoPoint(location);
			this.posicionActualOverlay.setLocation(punto);
			osmViewController.animateTo(punto);
			osmViewController.setCenter(punto);
		}
	}

	public void onProviderDisabled(String provider) {
	}

	public void onProviderEnabled(String provider) {
	}

	public void onStatusChanged(String provider, int status, Bundle extras) {
	}

	public void run() {
		
	}
	
	// ===========================================================
	// Methods
	// ===========================================================
	/**
	 * Activa el GPS para que comience a recibir las tramas para poner la posicion
	 * actual del usuario
	 */
	public void activarGPS() {
		lmgr = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
		lmgr.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1, 1, this);
	}

	// ===========================================================
	// Inner and Anonymous Classes
	// ===========================================================
}
