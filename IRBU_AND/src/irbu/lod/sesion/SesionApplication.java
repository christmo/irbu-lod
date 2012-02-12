package irbu.lod.sesion;

import irbu.lod.objetos.Estudiante;
import irbu.lod.objetos.Paradas;
import irbu.lod.objetos.Casa;
import android.app.Application;

/**
 * Almacena informacion de la sesion del estudiante logueado
 * 
 * @author christmo
 */
public class SesionApplication extends Application {

    private Estudiante estudiante;
    private Paradas paradaFrecuente;
    private Casa casaEstudiante;
    private boolean isLogin = false;

    /**
     * Devuelve la instancia del estudiante, este alamcena los datos del
     * estudiante logueado
     * 
     * @return Estudiante
     */
    public Estudiante getEstudiante() {
	return estudiante;
    }

    public void setEstudiante(Estudiante infoEstudiante) {
	this.estudiante = infoEstudiante;
    }

    public Paradas getParadaFrecuente() {
	return paradaFrecuente;
    }

    public void setParadaFrecuente(Paradas paradaFrecuente) {
	this.paradaFrecuente = paradaFrecuente;
    }

    public Casa getCasaEstudiante() {
	return casaEstudiante;
    }

    public void setCasaEstudiante(Casa casaEstudiante) {
	this.casaEstudiante = casaEstudiante;
    }

    public boolean isLogin() {
	return isLogin;
    }

    public void setLogin(boolean isLogin) {
	this.isLogin = isLogin;
    }

    /**
     * Cierra la sesion y anula toda la información almacenada alli
     */
    public void cerrarSesion() {
	setEstudiante(null);
	setParadaFrecuente(null);
	setCasaEstudiante(null);
	setLogin(false);
    }

}
