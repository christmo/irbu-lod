package irbu.lod.constantes;

public class Constantes {

	/*
	 * Constantes para el tipo de recorrido, estos son los parametros que se envia
	 * al servidor
	 */
	public static final String BAJA = "B";
	public static final String RECOGE = "R";
	public static final String BAJARECOGE = "BR";
	
	/*
	 * Informacion del servidor al que se debe conectar el cliente para hacer consultas
	 */
	public static final String IP_SERVER = "10.0.2.2";
	public static final String PUERTO_SERVER = "8080";
	public static final String URL_SERVER = "http://"+IP_SERVER+":"+PUERTO_SERVER;
	
	/**
	 * URL para buscar las paradas solo con el tipo de recorrido
	 * @params op = Tipo de Recorrido (B,R,BR)
	 */
	public static final String URL_RUTAS = URL_SERVER+"/irbu/core/php/gui/comboRutas.php";
	/**
	 * URL para buscar las rutas filtradas por hora
	 * @params op = Tipo de Recorrido (B,R,BR)
	 * @params hora = Hora de la ruta
	 */
	public static final String URL_RUTAS_HORA = URL_SERVER+"/irbu/core/php/gui/comboRutasHora.php";

	/**
	 * URL para obtener los puntos de la ruta para el dibujado en el mapa
	 * @params id_ruta
	 */
	public static final String URL_PUNTOS_RUTAS = URL_SERVER+"/irbu/core/php/core/RQ2_TrazadoRutas.php";
	
	/**
	 * URL para obtener la informacion de las paradas de un ruta determinada
	 * @params id_ruta
	 */
	public static final String URL_PARADAS_RUTAS = URL_SERVER+"/irbu/core/php/core/RQ4_ParadasRuta.php";
	
	
	
}
