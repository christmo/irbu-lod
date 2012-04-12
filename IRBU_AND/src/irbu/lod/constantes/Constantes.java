package irbu.lod.constantes;

import irbu.lod.IRBUActivity;

public class Constantes {

    /*
     * Constantes para el tipo de recorrido, estos son los parametros que se
     * envia al servidor
     */
    public static final String BAJA = "B";
    public static final String RECOGE = "R";
    public static final String BAJARECOGE = "BR";

    /*
     * Informacion del servidor al que se debe conectar el cliente para hacer
     * consultas
     */
    public static String IP_SERVER = IRBUActivity.sesion.getServer();
    public static String PUERTO_SERVER = IRBUActivity.sesion.getPuerto();

    /**
     * URL del servidor uniendo la ip y el puerto del host remoto
     */
    public static String URL_SERVER;

    /**
     * Nombre del proyecto en el host remoto o servidor
     */
    public static String NOMBRE_PROYECTO;

    /**
     * URL para buscar las paradas solo con el tipo de recorrido
     * 
     * @params op = Tipo de Recorrido (B,R,BR)
     */
    public static String URL_RUTAS;

    /**
     * URL para buscar las rutas filtradas por hora
     * 
     * @params op = Tipo de Recorrido (B,R,BR)
     * @params hora = Hora de la ruta
     */
    public static String URL_RUTAS_HORA;

    /**
     * URL para obtener los puntos de la ruta para el dibujado en el mapa
     * 
     * @params id_ruta
     */
    public static String URL_PUNTOS_RUTAS;

    /**
     * URL para obtener las paradas aproximadas a un punto o coordenadas GPS
     * desde el servidor IRBU
     * 
     * @params x
     * @params y
     * @params meters
     */
    public static String URL_PARADAS_APROX;

    /**
     * URL para obtener las paradas aproximadas a un punto o coordenadas GPS
     * desde el servidor VIRTUOSO
     * 
     * @params x
     * @params y
     * @params meters
     */
    public static String URL_PARADAS_APROX_VIRTUOSO;

    /**
     * URL para obtener la informacion de las paradas de un ruta determinada
     * 
     * @params id_ruta
     */
    public static String URL_PARADAS_RUTAS;

    /**
     * URL para obtener la lista de rutas, horarios y tipo de recorrido de una
     * determinada parada
     * 
     * @params id_parada
     */
    public static String URL_RUTAS_PARADA;

    /**
     * URL para enviar los datos del estudiante para que se guarde en el
     * registro
     */
    public static String URL_GUARDAR_ESTUDIANTE;

    /**
     * URL para enviar los datos de la casa del estudiante
     */
    public static String URL_GUARDAR_CASA_ESTUDIANTE;

    /**
     * URL para enviar los datos de la parada del estudiante
     */
    public static String URL_GUARDAR_PARADA_ESTUDIANTE;

    /**
     * URL para recuperar la informacion del estudiante
     */
    public static String URL_ESTUDIANTE;

    /**
     * URL para recuperar la información de parada frecuente y casa del
     * estudiante
     */
    public static String URL_DATOS_ALMACENADAOS_ESTUDIANTE;

    /**
     * Actualizador de variables
     */
    public static void refrescarVariables(){
	URL_SERVER = "http://"
		    + IRBUActivity.sesion.getServer() + ":"
		    + IRBUActivity.sesion.getPuerto() + "/";
	NOMBRE_PROYECTO = IRBUActivity.sesion.getProyecto()+ "/";
	URL_RUTAS = URL_SERVER + NOMBRE_PROYECTO + "core/php/gui/comboRutas.php";
	URL_RUTAS_HORA = URL_SERVER + NOMBRE_PROYECTO + "core/php/gui/comboRutasHora.php";
	URL_PUNTOS_RUTAS = URL_SERVER + NOMBRE_PROYECTO + "core/php/core/RQ2_TrazadoRutas.php";
	URL_PARADAS_APROX = URL_SERVER + NOMBRE_PROYECTO + "core/php/core/RQ3_paradas_cercanas.php";
	URL_PARADAS_APROX_VIRTUOSO = URL_SERVER + NOMBRE_PROYECTO + "core/php/gui/getParadasAproxVirtuoso.php";
	URL_PARADAS_RUTAS = URL_SERVER + NOMBRE_PROYECTO+ "core/php/core/RQ4_ParadasRuta.php";
	URL_RUTAS_PARADA = URL_SERVER + NOMBRE_PROYECTO + "core/php/core/RQ1_infoParada.php";
	URL_GUARDAR_ESTUDIANTE = URL_SERVER + NOMBRE_PROYECTO+ "core/php/core/guardarEstudiante.php";
	URL_GUARDAR_CASA_ESTUDIANTE = URL_SERVER + NOMBRE_PROYECTO + "core/php/core/guardarCasaEstudiante.php";
	URL_GUARDAR_PARADA_ESTUDIANTE = URL_SERVER + NOMBRE_PROYECTO + "core/php/core/guardarParadaEstudiante.php";
	URL_ESTUDIANTE = URL_SERVER + NOMBRE_PROYECTO + "core/php/gui/getEstudiante.php";
	URL_DATOS_ALMACENADAOS_ESTUDIANTE = URL_SERVER + NOMBRE_PROYECTO + "core/php/gui/getDatosParadaCasaEstudiante.php";
    }
}
