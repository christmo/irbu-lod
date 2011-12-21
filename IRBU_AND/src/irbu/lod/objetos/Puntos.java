/**
 * 
 */
package irbu.lod.objetos;

/**
 * @author DellXPS_L401X
 * 
 */
public class Puntos {

	private int idPunto;
	private double lon;
	private double lat;
	
	public Puntos(int idPunto, double lon, double lat) {
		super();
		this.idPunto = idPunto;
		this.lon = lon;
		this.lat = lat;
	}

	public int getIdPunto() {
		return idPunto;
	}

	public void setIdPunto(int idPunto) {
		this.idPunto = idPunto;
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

}
