package irbu.lod.objetos;

public class Paradas {

	private int idParada;
	private double lon;
	private double lat;
	private String dir;
	private String ref;
	private String urlImg;
	
	
	/**
	 * Crea una Parada con la informacion completa
	 * @param idParada
	 * @param lon
	 * @param lat
	 * @param dir
	 * @param ref
	 * @param urlImg
	 */
	public Paradas(int idParada, double lon, double lat, String dir,
			String ref, String urlImg) {
		super();
		this.idParada = idParada;
		this.lon = lon;
		this.lat = lat;
		this.dir = dir;
		this.ref = ref;
		this.urlImg = urlImg;
	}

	public int getIdParada() {
		return idParada;
	}

	public void setIdParada(int idParada) {
		this.idParada = idParada;
	}

	public double getLon() {
		return lon;
	}

	public void setLon(double lon) {
		this.lon = lon;
	}

	public double getLat() {
		return lat;
	}

	public void setLat(double lat) {
		this.lat = lat;
	}

	public String getDir() {
		return dir;
	}

	public void setDir(String dir) {
		this.dir = dir;
	}

	public String getRef() {
		return ref;
	}

	public void setRef(String ref) {
		this.ref = ref;
	}

	public String getUrlImg() {
		return urlImg;
	}

	public void setUrlImg(String urlImg) {
		this.urlImg = urlImg;
	}

}
