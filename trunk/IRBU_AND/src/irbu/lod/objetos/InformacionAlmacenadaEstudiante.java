package irbu.lod.objetos;

public class InformacionAlmacenadaEstudiante {

    private String strCI;
    private Paradas parada;
    private Casa casa;

    public InformacionAlmacenadaEstudiante(String strCI) {
	super();
	this.strCI = strCI;
    }

    public String getStrCI() {
	return strCI;
    }

    public Paradas getParada() {
	return parada;
    }

    public void setParada(Paradas parada) {
	this.parada = parada;
    }

    public Casa getCasa() {
	return casa;
    }

    public void setCasa(Casa casa) {
	this.casa = casa;
    }

}
