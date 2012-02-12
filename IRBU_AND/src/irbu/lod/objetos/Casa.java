package irbu.lod.objetos;

import android.os.Parcel;
import android.os.Parcelable;

public class Casa implements Parcelable {
    private String strDireccion;
    private double douLat;
    private double douLon;

    public Casa(String strDireccion, double douLat, double douLon) {
	super();
	this.strDireccion = strDireccion;
	this.douLat = douLat;
	this.douLon = douLon;
    }

    private Casa(Parcel in) {
	this.strDireccion = in.readString();
	this.douLat = in.readDouble();
	this.douLon = in.readDouble();
    }

    public String getStrDireccion() {
	return strDireccion;
    }

    public void setStrDireccion(String strDireccion) {
	this.strDireccion = strDireccion;
    }

    public double getDouLat() {
	return douLat;
    }

    public void setDouLat(double douLat) {
	this.douLat = douLat;
    }

    public double getDouLon() {
	return douLon;
    }

    public void setDouLon(double douLon) {
	this.douLon = douLon;
    }

    public static final Parcelable.Creator<Casa> CREATOR = new Parcelable.Creator<Casa>() {
	public Casa createFromParcel(Parcel in) {
	    return new Casa(in);
	}

	public Casa[] newArray(int size) {
	    return new Casa[size];
	}
    };

    public int describeContents() {
	return 0;
    }

    public void writeToParcel(Parcel dest, int flags) {
	dest.writeString(strDireccion);
	dest.writeDouble(douLat);
	dest.writeDouble(douLon);
    }

}
