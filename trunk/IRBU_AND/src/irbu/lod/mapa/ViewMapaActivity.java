package irbu.lod.mapa;

import irbu.lod.IRBUActivity;
import irbu.lod.R;
import irbu.lod.modulos.InfoEvaActivity;
import irbu.lod.modulos.InfoParadasActivity;
import irbu.lod.modulos.LoginEvaActivity;
import irbu.lod.objetos.Casa;
import irbu.lod.objetos.ConsultarServer;
import irbu.lod.objetos.Paradas;
import irbu.lod.objetos.Puntos;
import irbu.lod.sesion.SesionApplication;

import java.io.IOException;
import java.net.SocketException;
import java.util.ArrayList;

import org.osmdroid.DefaultResourceProxyImpl;
import org.osmdroid.tileprovider.util.CloudmadeUtil;
import org.osmdroid.util.GeoPoint;
import org.osmdroid.views.MapController;
import org.osmdroid.views.MapView;
import org.osmdroid.views.overlay.ItemizedIconOverlay;
import org.osmdroid.views.overlay.ItemizedOverlay;
import org.osmdroid.views.overlay.MinimapOverlay;
import org.osmdroid.views.overlay.Overlay;
import org.osmdroid.views.overlay.OverlayItem;
import org.osmdroid.views.overlay.OverlayManager;
import org.osmdroid.views.overlay.PathOverlay;
import org.osmdroid.views.overlay.ScaleBarOverlay;
import org.osmdroid.views.overlay.SimpleLocationOverlay;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.provider.Settings;
import android.view.Menu;
import android.view.MenuItem;
import android.view.SubMenu;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup.LayoutParams;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.Toast;

/**
 * Clase que permite controlar el mapa de open street map, en esta clase se hace
 * el dibujado de los puntos y las rutas
 * 
 * @author christmo
 */
public class ViewMapaActivity extends Activity implements LocationListener {

    // ===========================================================
    // Constants
    // ===========================================================

    private static final int MENU_ZOOMIN_ID = Menu.FIRST;
    private static final int MENU_ZOOMOUT_ID = MENU_ZOOMIN_ID + 1;
    private static final int MENU_COORD_ID = MENU_ZOOMOUT_ID + 1;
    private static final int MENU_LIMPIAR = MENU_COORD_ID + 1;
    private static final int MENU_DATOS = MENU_LIMPIAR + 1;
    private static final int MENU_PARADAS_PROXIMAS = MENU_DATOS + 1;
    private static final int SUBM_100 = MENU_PARADAS_PROXIMAS + 1;
    private static final int SUBM_200 = SUBM_100 + 1;
    private static final int SUBM_400 = SUBM_200 + 1;
    private static final int SUBM_600 = SUBM_400 + 1;
    private static final int SUBM_800 = SUBM_600 + 1;
    private static final int SUBM_1000 = SUBM_800 + 1;

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
    /**
     * Punto actual capturado del GPS
     */
    private Location punto = null;
    /**
     * Almacena la información de la parada frecuente cuando sea envia a
     * graficar
     */
    private Paradas paradaFrecuente = null;
    /**
     * Almacena la información de la casa del estudiante para ser graficada
     */
    private Casa casaEstudiante = null;
    /**
     * Variables de sesion
     */
    private SesionApplication sesion;

    // ===========================================================
    // Constructors
    // ===========================================================
    /** Called when the activity is first created. */
    @Override
    public void onCreate(final Bundle savedInstanceState) {
	super.onCreate(savedInstanceState);

	/**
	 * Configuración inicial del mapa
	 */
	mResourceProxy = new DefaultResourceProxyImpl(getApplicationContext());
	final RelativeLayout rl = new RelativeLayout(this);
	CloudmadeUtil.retrieveCloudmadeKey(getApplicationContext());
	this.osmMapa = new MapView(this, 256);
	rl.addView(this.osmMapa, new RelativeLayout.LayoutParams(
		LayoutParams.FILL_PARENT, LayoutParams.FILL_PARENT));
	osmViewController = osmMapa.getController();
	sesion = (SesionApplication) getApplicationContext();
	ArrayList<OverlayItem> listaItemsIconos = new ArrayList<OverlayItem>();
	
	if (getIntent().hasExtra("listaPuntos")) {
	    puntosLinea = getIntent()
		    .getParcelableArrayListExtra("listaPuntos");
	}
	if (getIntent().hasExtra("listaParadas")) {
	    paradas = getIntent().getParcelableArrayListExtra("listaParadas");
	}
	if (getIntent().hasExtra("parada")) {
	    paradaFrecuente = (Paradas) getIntent()
		    .getParcelableExtra("parada");
	    dibujarParadaFrecuenteEstudiante();
	}
	if (getIntent().hasExtra("casa")) {
	    casaEstudiante = (Casa) getIntent().getParcelableExtra("casa");
	    dibujarCasaEstudiante();
	}

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
		int i=0;
		for (Puntos p : puntosLinea) {
		    lineaOverlay.addPoint((int) (p.getLat() * 1e6),
			    (int) (p.getLon() * 1e6));
		    if(i==0){
			//estrella
			OverlayItem overlayDibujo = new OverlayItem(
				"Inicio de la Ruta!!!", 
				"", 
				new GeoPoint(p.getLat(), p.getLon()));
			overlayDibujo.setMarker(this.getResources().getDrawable(R.drawable.star));
			listaItemsIconos.add(overlayDibujo);
			i++;
		    }else if(i==puntosLinea.size()-1){
			//meta
			OverlayItem overlayDibujo = new OverlayItem(
				"Fin de la Ruta!!!", 
				"", 
				new GeoPoint(p.getLat(), p.getLon()));
			overlayDibujo.setMarker(this.getResources().getDrawable(R.drawable.finish));
			listaItemsIconos.add(overlayDibujo);
			i++;
		    }else{
			i++;
		    }
		}
		
	    }
	    this.osmMapa.getOverlays().add(lineaOverlay);
	}
	dibujarIconoMapa(listaItemsIconos);
	/* ZoomControls */
	{
	    /* Create a ImageView with a zoomIn-Icon. */
	    final ImageView ivZoomIn = new ImageView(this);
	    ivZoomIn.setImageResource(irbu.lod.R.drawable.zoom_in);
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
		    GeoPoint geoParada = new GeoPoint(p.getLat(), p.getLon());

		    OverlayItem overlayParada = new OverlayItem(p.getDir(),
			    p.getRef(), geoParada);
		    overlayParada.setMarker(this.getResources().getDrawable(
			    R.drawable.bus_stop));
		    puntosParadasItems.add(overlayParada);
		    // GeoPoint punto = new GeoPoint(p.getLat(), p.getLon());
		    // puntosParadasItems.add(new OverlayItem(p.getDir(), p
		    // .getRef(), punto));
		}
	    }
	    /* OnTapListener for the Markers, shows a simple Toast. */
	    this.listaIconosParadasOverlay = new ItemizedIconOverlay<OverlayItem>(
		    puntosParadasItems,
		    new ItemizedIconOverlay.OnItemGestureListener<OverlayItem>() {
			public boolean onItemSingleTapUp(final int index,
				final OverlayItem item) {
			    try {
				Intent infoParada = new Intent(
					ViewMapaActivity.this,
					InfoParadasActivity.class);
				infoParada.putExtra("parada",
					paradas.get(index));
				startActivity(infoParada);
			    } catch (IndexOutOfBoundsException e) {
			    }
			    return true; // We 'handled' this event.
			}

			public boolean onItemLongPress(final int index,
				final OverlayItem item) {
			    // cuando se presiona un largo tiempo ejecutar algo
			    // aqui
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
	pMenu.add(0, MENU_ZOOMOUT_ID, Menu.NONE, "Reducir").setIcon(
		R.drawable.zoom_out);
	pMenu.add(0, MENU_ZOOMIN_ID, Menu.NONE, "Ampliar").setIcon(
		R.drawable.zoom_in);
	pMenu.add(0, MENU_LIMPIAR, Menu.NONE, "Limpiar Mapa").setIcon(
		R.drawable.limpiar);
	pMenu.add(0, MENU_COORD_ID, Menu.NONE, "Guardar Casa").setIcon(
		R.drawable.casa);
	pMenu.add(0, MENU_DATOS, Menu.NONE, "Mis Datos").setIcon(
		R.drawable.mis_datos);

	int menuPos = 0;
	String m = " Metros";
	{ // Layer-Item
	    final SubMenu subMenu = pMenu.addSubMenu(menuPos,
		    MENU_PARADAS_PROXIMAS, Menu.NONE,
		    R.string.txtTituloParadasAproximadas).setIcon(
		    R.drawable.radar);
	    {
		subMenu.add(menuPos, SUBM_100, Menu.NONE, "100" + m).setIcon(
			R.drawable.casa);
		subMenu.add(menuPos, SUBM_200, Menu.NONE, "200" + m).setIcon(
			R.drawable.casa);
		subMenu.add(menuPos, SUBM_400, Menu.NONE, "400" + m).setIcon(
			R.drawable.casa);
		subMenu.add(menuPos, SUBM_600, Menu.NONE, "600" + m).setIcon(
			R.drawable.casa);
		subMenu.add(menuPos, SUBM_800, Menu.NONE, "800" + m).setIcon(
			R.drawable.casa);
		subMenu.add(menuPos, SUBM_1000, Menu.NONE, "1000" + m).setIcon(
			R.drawable.casa);
	    }
	}
	return super.onCreateOptionsMenu(pMenu);
    }

    @Override
    protected void onResume() {
	super.onResume();
	onLocationChanged(lmgr.getLastKnownLocation(LOCATION_SERVICE));
    }

    /**
     * Ejecutar cuando se presione la tecla de menu
     * 
     * @param featureId
     * @param item
     * @return boolean
     */
    @Override
    public boolean onMenuItemSelected(final int featureId, final MenuItem item) {
	switch (item.getItemId()) {
	case MENU_ZOOMIN_ID:
	    this.osmMapa.getController().zoomIn();
	    return true;
	case MENU_ZOOMOUT_ID:
	    this.osmMapa.getController().zoomOut();
	    return true;
	case MENU_COORD_ID:
	    guardarCoordenadasVivienda();
	    return true;
	case MENU_LIMPIAR:
	    limpiarMapa();
	    return true;
	case MENU_DATOS:
	    mostrarDatosEstudiante();
	    return true;
	case SUBM_100:
	    buscarParadasAproximadas(100);
	    return true;
	case SUBM_200:
	    buscarParadasAproximadas(200);
	    return true;
	case SUBM_400:
	    buscarParadasAproximadas(400);
	    return true;
	case SUBM_600:
	    buscarParadasAproximadas(600);
	    return true;
	case SUBM_800:
	    buscarParadasAproximadas(800);
	    return true;
	case SUBM_1000:
	    buscarParadasAproximadas(1000);
	    return true;
	}
	return false;
    }

    /**
     * Cuando se presione la tecla de retroceso
     */
    @Override
    public void onBackPressed() {
	// Parar capturas de GPS
	// lmgr.removeUpdates(this);
	// lmgr = null;

	Intent principal = new Intent(this, IRBUActivity.class);
	startActivity(principal);
	super.onBackPressed();
    }

    /**
     * Se ejcuta cuando se captura una nueva posicion de GPS
     */
    public void onLocationChanged(Location location) {
	if (location != null) {
	    punto = location;
	    GeoPoint puntoCap = new GeoPoint(location);
	    this.posicionActualOverlay.setLocation(puntoCap);
	    osmViewController.animateTo(puntoCap);
	    osmViewController.setCenter(puntoCap);
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
    /**
     * Activa el GPS para que comience a recibir las tramas para poner la
     * posicion actual del usuario
     */
    public void activarGPS() {
	lmgr = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
	if (!lmgr
		.isProviderEnabled(android.location.LocationManager.GPS_PROVIDER)) {
	    Intent myIntent = new Intent(Settings.ACTION_SECURITY_SETTINGS);
	    startActivity(myIntent);
	}

	/* Para trabajar con el emulador y telefono para obtener por gps */
	lmgr.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 1, this);
	/* Para obtener el el movil dentro de edificios por red e internet */
	lmgr.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 1000, 1,
		this);
    }

    /**
     * guardar las coordenadas del domicilio
     */
    private void guardarCoordenadasVivienda() {
	if (punto != null) {
	    SesionApplication sesion = (SesionApplication) getApplicationContext();
	    Intent login = null;
	    if (sesion.isLogin()) {
		login = new Intent(this, InfoEvaActivity.class);
	    } else {
		login = new Intent(this, LoginEvaActivity.class);
	    }
	    login.putExtra("lat", punto.getLatitude());
	    login.putExtra("lon", punto.getLongitude());
	    startActivity(login);
	} else {
	    mensajeErrorGPS();
	}
    }

    /**
     * Buscar las paradas que se encuentran más cerda al punto de GPS capturado
     */
    private void buscarParadasAproximadas(int distancia) {
	try {
	    paradas = new ConsultarServer().getParadasAproximacion(
		    punto.getLatitude(), punto.getLongitude(), distancia,this);
	    if (paradas != null) {
		Intent mapa = new Intent(this, ViewMapaActivity.class);
		mapa.putParcelableArrayListExtra("listaParadas", paradas);
		startActivity(mapa);
	    } else {
		mensajeNoHayParadas();
	    }
	} catch (NullPointerException e) {
	    mensajeErrorGPS();
	} catch (SocketException e) {
	    mensajeErrorConexion();
	} catch (IOException e) {
	    mensajeErrorConexion();
	}
    }

    /**
     * Mensaje Error de coordenadas de GPS
     */
    private void mensajeErrorGPS() {
	AlertDialog.Builder builder1 = new AlertDialog.Builder(
		ViewMapaActivity.this);
	builder1.setMessage(R.string.txtErrorGPS).setCancelable(false)
		.setPositiveButton("OK", new DialogInterface.OnClickListener() {
		    public void onClick(DialogInterface dialog, int id) {
		    }
		});
	AlertDialog alert1 = builder1.create();
	alert1.show();

    }

    /**
     * Mensaje Error de coordenadas de GPS
     */
    private void mensajeNoHayParadas() {
	AlertDialog.Builder builder1 = new AlertDialog.Builder(
		ViewMapaActivity.this);
	builder1.setMessage(R.string.txtErrorNoHayParadas).setCancelable(false)
		.setPositiveButton("OK", new DialogInterface.OnClickListener() {
		    public void onClick(DialogInterface dialog, int id) {
		    }
		});
	AlertDialog alert1 = builder1.create();
	alert1.show();

    }

    /**
     * Mensaje Error de conexión a internet
     */
    private void mensajeErrorConexion() {
	AlertDialog.Builder builder1 = new AlertDialog.Builder(
		ViewMapaActivity.this);
	builder1.setMessage(R.string.txtErrorConexionInternet)
		.setCancelable(false)
		.setPositiveButton("OK", new DialogInterface.OnClickListener() {
		    public void onClick(DialogInterface dialog, int id) {
		    }
		});
	AlertDialog alert1 = builder1.create();
	alert1.show();

    }

    /**
     * Permite dibujar la parada frecuente del estudiante
     */
    private void dibujarParadaFrecuenteEstudiante() {
	// GeoPoint geoParada = new GeoPoint(paradaFrecuente.getLat(),
	// paradaFrecuente.getLon());
	//
	ArrayList<OverlayItem> paradaFrecDibujar = new ArrayList<OverlayItem>();
	// paradaFrecDibujar.add(new OverlayItem(paradaFrecuente.getDir(),
	// paradaFrecuente.getRef(), geoParada));
	GeoPoint geoParada = new GeoPoint(paradaFrecuente.getLat(),
		paradaFrecuente.getLon());

	OverlayItem overlayParada = new OverlayItem(paradaFrecuente.getDir(),
		paradaFrecuente.getRef(), geoParada);
	overlayParada.setMarker(this.getResources().getDrawable(
		R.drawable.bus_stop));
	paradaFrecDibujar.add(overlayParada);
	dibujarIconoMapa(paradaFrecDibujar);
    }

    /**
     * Prmite dibujar la casa del estudiante sobre el mapa
     */
    private void dibujarCasaEstudiante() {
	GeoPoint geoCasa = new GeoPoint(casaEstudiante.getDouLat(),
		casaEstudiante.getDouLon());

	ArrayList<OverlayItem> listaItemsCasa = new ArrayList<OverlayItem>();
	OverlayItem overlayCasa = new OverlayItem(
		casaEstudiante.getStrDireccion(), "Dirección", geoCasa);
	overlayCasa.setMarker(this.getResources().getDrawable(
		R.drawable.casa_icon));
	listaItemsCasa.add(overlayCasa);
	dibujarIconoMapa(listaItemsCasa);
    }

    
    /**
     * Prmite dibujar la casa del estudiante sobre el mapa
     */
    private void dibujarIconoMapa(ArrayList<OverlayItem> listaItemsIconos) {
	this.listaIconosParadasOverlay = new ItemizedIconOverlay<OverlayItem>(
		listaItemsIconos,
		new ItemizedIconOverlay.OnItemGestureListener<OverlayItem>() {
		    public boolean onItemSingleTapUp(final int index,
			    final OverlayItem item) {
			try {
			    Toast t = Toast.makeText(
				    ViewMapaActivity.this,
				    item.getTitle(),
				    Toast.LENGTH_LONG);
			    t.show();
			} catch (IndexOutOfBoundsException e) {
			}
			return true; // We 'handled' this event.
		    }

		    public boolean onItemLongPress(final int index,
			    final OverlayItem item) {
			// cuando se presiona un largo tiempo ejecutar algo
			// aqui
			return false;
		    }
		}, mResourceProxy);
	this.osmMapa.getOverlays().add(this.listaIconosParadasOverlay);
    }
    
    
    /**
     * Dibuja los datos del estudiante parada frecuente y casa
     */
    private void mostrarDatosEstudiante() {
	if (sesion.isLogin()) {
	    Intent mapa = new Intent(this, ViewMapaActivity.class);
	    if (sesion.getParadaFrecuente() != null) {
		mapa.putExtra("parada", sesion.getParadaFrecuente());
	    }
	    if (sesion.getCasaEstudiante() != null) {
		mapa.putExtra("casa", sesion.getCasaEstudiante());
	    }
	    startActivity(mapa);
	} else {
	    Toast t = Toast.makeText(this, "No ha iniciado sesión...",
		    Toast.LENGTH_LONG);
	    t.show();
	    Intent info = new Intent(this, LoginEvaActivity.class);
	    info.putExtra("informacion", true);
	    startActivity(info);
	}

    }

    /**
     * Elimina todos los Overlay del mapa, solo iconos de paradas, casa y rutas
     */
    private void limpiarMapa() {
	OverlayManager overMng = osmMapa.getOverlayManager();

	ArrayList<Overlay> listaOverlayBorrar = new ArrayList<Overlay>();
	for (Overlay o : overMng) {
	    if (o instanceof ItemizedOverlay<?>) {
		listaOverlayBorrar.add(o);
	    }
	    if (o instanceof PathOverlay) {
		listaOverlayBorrar.add(o);
	    }
	}
	overMng.removeAll(listaOverlayBorrar);
	osmMapa.postInvalidate();
	listaOverlayBorrar.clear();
    }

    // ===========================================================
    // Inner and Anonymous Classes
    // ===========================================================

}
