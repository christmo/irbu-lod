package irbu.lod.objetos;

import android.os.Parcel;
import android.os.Parcelable;

public class Paradas implements Parcelable {

    private int idParada;
    private double lon;
    private double lat;
    private String dir;
    private String ref;
    private String urlImg;

    /**
     * Crea una Parada con la informacion completa
     * 
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

    private Paradas(Parcel in) {
	this.idParada = in.readInt();
	this.lon = in.readDouble();
	this.lat = in.readDouble();
	this.dir = in.readString();
	this.ref = in.readString();
	this.urlImg = in.readString();
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

    public static final Parcelable.Creator<Paradas> CREATOR = new Parcelable.Creator<Paradas>() {
	public Paradas createFromParcel(Parcel in) {
	    return new Paradas(in);
	}

	public Paradas[] newArray(int size) {
	    return new Paradas[size];
	}
    };

    public int describeContents() {
	// TODO Auto-generated method stub
	return 0;
    }

    public void writeToParcel(Parcel dest, int flags) {
	dest.writeInt(idParada);
	dest.writeDouble(lon);
	dest.writeDouble(lat);
	dest.writeString(dir);
	dest.writeString(ref);
	dest.writeString(urlImg);
    }

}
