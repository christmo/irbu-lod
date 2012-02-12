package irbu.lod.modulos.listarrutas;

public class CamposListaRutasParada {
	String strRuta;
	String strHora;
	String strTipo;

	public CamposListaRutasParada(String strRuta, String strHora, String strTipo) {
		super();
		this.strRuta = strRuta;
		this.strHora = strHora;
		this.strTipo = strTipo;
	}

	public String getStrRuta() {
		return strRuta;
	}

	public void setStrRuta(String strRuta) {
		this.strRuta = strRuta;
	}

	public String getStrHora() {
		return strHora;
	}

	public void setStrHora(String strHora) {
		this.strHora = strHora;
	}

	public String getStrTipo() {
		return strTipo;
	}

	public void setStrTipo(String strTipo) {
		this.strTipo = strTipo;
	}
}
