package irbu.lod.sesion;

import irbu.lod.objetos.Estudiante;
import android.app.Application;

public class SesionApplication extends Application {

	private Estudiante estudiante;
	private boolean isLogin = false;

	public Estudiante getEstudiante() {
		return estudiante;
	}

	public void setEstudiante(Estudiante infoEstudiante) {
		this.estudiante = infoEstudiante;
	}

	public boolean isLogin() {
		return isLogin;
	}

	public void setLogin(boolean isLogin) {
		this.isLogin = isLogin;
	}

}
