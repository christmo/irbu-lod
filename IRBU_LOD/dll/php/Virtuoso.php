<?php

/**
 * Esta clase permite interactuar con el servidor Virtuoso, mediante metodos
 * que hacen uso del servicio REST montado para IRBU
 * @author DellXPS_L401X
 */
class Virtuoso {

    public $PARADA = "parada/";
    public $POINT = "point/";
    public $POIG = "poig/";
    public $RUTA = "ruta/";
    public $ORDEN_PARADA = "ordenparada/";
    public $PARADA_FRECUENTE = "paradafrecuente/";
    public $ESTUDIANTE = "estudiante/";
    public $ESTUDIANTE2 = "estudiante2/";
    public $ESTUDIANTE_PARADA = "estd_parada/";
    public $INDIVIDUO = "individuo/";
    public $VIVIENDA = "vivienda/";
    public $FECHA = "fecha/";
    public $PROPIEDAD = "propiedad/";
    public $HORARIO = "horario/";
    var $SL = "/";
    /**
     * Usuario del Endpoint Virtuoso
     */
    public $USER_VIRTUOSO = 'dba';
    public $PASS_VIRTUOSO = 'dba';
    /**
     * Servidor Virtuoso
     */
    public $SERVIDOR_VIRTUOSO = '192.168.236.128';
    /**
     * Servicio a actualizar
     */
    public $SERVICIO = "pois";
    /**
     * URL servicio con autenticacion usuario y clave
     */
    public $URL_AUTH;
    /**
     * URL del servicio
     */
    public $URL_SERVICIO;
    public $rest;
    public $data = array();

    public function __construct() {
        $this->URL_AUTH = $this->USER_VIRTUOSO . $this->SL . $this->PASS_VIRTUOSO . $this->SL;
        $this->URL_SERVICIO = "http://" . $this->SERVIDOR_VIRTUOSO . $this->SL . $this->SERVICIO . $this->SL;
        $this->rest = new Pest($this->URL_SERVICIO);
    }

    /**
     * Crear POINT - POST - Autenticado
     * URL: /point/$user/$pass/$lat/$lon
     * @method POST
     * @param $lat
     * @param $lon
     * @return id del individuo
     */
    private function crear_point($lat, $lon) {
        $url = $this->URL_SERVICIO . $this->POINT . $this->URL_AUTH .
                $lat . $this->SL .
                $lon;
//        echo $url.'<br/>';
        $json = json_decode($this->rest->post($url, $this->data), true);
        return $json["indiv"];
    }

    /**
     * Creación de un punto de interes geografico
     * /poig/$user/$pass/$point/$calle1/$calle2/$barrio
     * @method POST
     * @param string $point
     * @param string $calle1
     * @param string $calle2
     * @param string $barrio
     * @return string id poing 
     */
    private function crear_poig($point, $calle1, $calle2, $barrio) {
        $url = $this->URL_SERVICIO . $this->POIG . $this->URL_AUTH .
                $point . $this->SL .
                urlencode($calle1) . $this->SL .
                urlencode($calle2) . $this->SL .
                urlencode($barrio);
//        echo $url.'<br/>';
        $json = json_decode($this->rest->post($url, $this->data), true);
        return $json["indiv"];
    }

    /**
     * Crea una nueva parada creando un point, poig y parada, las calles 
     * solo se estan guardando con una calle ya que no esta definido el proceso
     * de separacion de las direcciones
     * /parada/$user/$pass/$referencia/$img/$poig
     * @method POST
     * @param string $dir
     * @param string $ref
     * @param string $lon
     * @param string $lat
     * @param string $img
     * @return string id parada
     */
    public function crear_parada($dir, $ref, $lon, $lat, $img) {
        $point = $this->crear_point($lat, $lon);
        $poig = $this->crear_poig($point, $dir, '-', '-');
        $url = $this->URL_SERVICIO . $this->PARADA . $this->URL_AUTH .
                $ref . $this->SL .
                urlencode($img) . $this->SL .
                $poig;
//        echo $url.'<br/>';
        //prd20120202074105
        $json = json_decode($this->rest->post($url, $this->data), true);
        return $json["indiv"];
    }

    /**
     * Le asigna un orden a una parada para este id poder ser enlazado dentro de
     * una ruta
     * /ordenparada/$user/$pass/$numsec/$parada
     * @method POST
     * @param int $orden numero de orden
     * @param string $parada
     * @return string id orden parada 
     */
    public function orden_parada($orden, $parada) {
        $url = $this->URL_SERVICIO . $this->ORDEN_PARADA . $this->URL_AUTH .
                $orden . $this->SL .
                $parada;
        echo $url;
        //ord20120202074941
        $json = json_decode($this->rest->post($url, $this->data), true);
        return $json["indiv"];
    }

    /**
     * Enlaza el id de orden dentro de una ruta
     * /ordenparada/ruta/$user/$pass/$ruta/$ordParada
     * @method POST
     * @param numero $orden
     * @param string $ruta
     */
    public function orden_parada_ruta($id_orden, $ruta) {
        $url = $this->URL_SERVICIO . $this->ORDEN_PARADA . $this->RUTA . $this->URL_AUTH .
                $ruta . $this->SL .
                $id_orden;
        //No hay resultado a parte del OK
        $this->rest->post($url, $this->data);
    }

    /**
     * Crear ruta
     * /ruta/$user/$pass/$nombre/$horario/$tipo
     * @method POST
     * @param string $nombre
     * @param string $horario
     * @param string $tipo
     * @return string 
     */
    public function crear_ruta($nombre, $horario, $tipo) {
        switch ($tipo) {
            case 'B':
                $tipo = 'BAJA';
                break;
            case 'R':
                $tipo = 'RECOGE';
                break;
            default:
                $tipo = 'BAJA-RECOGE';
        }
        //ruta20120202021656
        $url = $this->URL_SERVICIO . $this->RUTA . $this->URL_AUTH .
                urlencode($nombre) . $this->SL .
                urldecode($horario) . $this->SL .
                urldecode($tipo);
        echo $url;
        $json = json_decode($this->rest->post($url, $this->data), true);
        return $json["indiv"];
    }

    /**
     * Crea un estudiante en el servidor solo con CI
     * /estudiante/$user/$pass/$cedula
     * @method POST
     * @param String $ci
     * @return string id del estudiante 
     */
    public function crear_estudiante($ci) {
        $url = $this->URL_SERVICIO . $this->ESTUDIANTE . $this->URL_AUTH .
                $ci;
//        echo $url;
        //estd20120202024808
        try {
            $json = json_decode($this->rest->post($url, $this->data), true);
            return $json->indiv;
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Crear un individuo parada frecuente para enlazarlo con un estudiante
     * @method POST
     * @param string $id_parada
     * @return string id de la parada frecuente creada
     */
    private function crear_parada_frecuente($id_parada) {
        $url = $this->URL_SERVICIO . $this->PARADA_FRECUENTE . $this->URL_AUTH . $id_parada;
        try {
            $json = json_decode($this->rest->post($url, $this->data), true);
            return $json->indiv;
        } catch (Exception $e) {
            return null;
        }
    }

    public function add_parada_frecuente_estudiante($id_parada, $ci) {
        $url = $this->URL_SERVICIO . $this->ESTUDIANTE2 . $this->URL_AUTH .
                $ci . $this->SL .
                $id_parada;
        try {
            $json = json_decode($this->rest->post($url, $this->data), true);
            return $json->indiv;
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Agrega parada frecuente a un estudiante
     * /estd_parada/$user/$pass/$estudiante/$prdfrc
     * @method POST
     * @param string $estudiante
     * @param string $parada
     */
    public function add_parada_estudiante($estudiante, $parada) {
        $url = $this->URL_SERVICIO . $this->ESTUDIANTE_PARADA . $this->URL_AUTH .
                $estudiante . $this->SL . $parada;
        //No hay resultado a parte del OK
        $this->rest->post($url, $this->data);
    }

    /**
     *
     * @param type $hora
     * @param type $id_ruta 
     */
    public function add_hora_ruta($hora, $id_ruta) {
        $url = $this->URL_SERVICIO . $this->RUTA . $this->HORARIO . $this->URL_AUTH .
                $id_ruta . $this->SL .
                $hora;
        echo $url;
        $this->rest->put($url, $this->data);
    }

    /**
     * Asocia un estudiante con las coordenadas de la casa de este
     * /estudiante/vivienda/$user/$pass/$estudiante/$poig
     * @method POST
     * @param string $estudiante
     * @param string $poig 
     */
    public function add_vivienda_estudiante($estudiante, $poig) {
        $url = $this->URL_SERVICIO . $this->ESTUDIANTE . $this->VIVIENDA . $this->URL_AUTH .
                $estudiante . $this->SL . $poig;
        //No hay resultado a parte del OK
        $this->rest->post($url, $this->data);
    }

    /**
     * Obtiene las Rutas que pasan por una parada
     * @method GET
     * @param string $id_parada
     * @return json todas las rutas 
     */
    public function get_rutas_horarios_parada($id_parada) {
        $datos = array();
        $campos = array();
        $url = $this->URL_SERVICIO . $this->PARADA . $this->RUTA . $id_parada;
        $json = json_decode($this->rest->get($url), true);
        $vars = $json["head"]["vars"];
        for ($i = 0; $i < count($json["results"]["bindings"]); $i++) {
            for ($j = 0; $j < count($vars); $j++) {
                $key = $vars[$j];
                $campos[$key] = $json["results"]["bindings"][$i][$key]["value"];
            }
            $datos[$i] = $campos;
        }
        return json_encode($datos);
    }

    /**
     * Buscar el ID de un individuo dependiendo de las condiciones que se envie
     * como parametro 
     * /individuo/$tipo/$propiedad/$valor/$tipoValor/$operador
     * /individuo/$tipo/$propiedad/$valor/$operador
     * @method GET
     * @param string $individuo usar $this->NOMBREDELINDIVIDUO
     * @param string $campo son la propiedades se deben conocer del API
     * @param string $buscar
     * @param string $tipo -> enviar: string/ cuando necesite o "" cuando no
     * @return string retorna el id del individuo a buscar
     */
    public function buscar_individuo_campo_igual($individuo, $campo, $buscar, $tipo = "") {
        $url = $this->URL_SERVICIO . $this->INDIVIDUO . strtoupper($individuo) .
                $campo . $this->SL .
                $buscar . $this->SL .
                $tipo .
                '=';
//        echo $url . '<br/>';
        $json = json_decode($this->rest->get($url));
//        return $json->results->bindings->value;
        $datos = array();
        $datos["individuo"] = substr($individuo, count($individuo) - 1, -1);
        foreach ($json->results->bindings as $name => $value) {
            $id = explode('#', $value->obj->value);
            //$datos["value"][$name]=$id[1];//todos los valores
            $datos["value"] = $id[1]; //el ultimo
        }
        return json_encode($datos);
    }

    /**
     * Consulta todos los datos de un individuo
     * @method GET
     * @param string $individuo debe ser el ID
     * @return type 
     */
    public function get_info_individuo($individuo) {
        $url = $this->URL_SERVICIO . $this->INDIVIDUO .
                'propiedad' . $this->SL .
                $individuo;
        return $this->rest->get($url);
    }

    public function paradas() {
        $url = $this->URL_SERVICIO . $this->PARADA;
        $json = json_decode($this->rest->get($url));
//        return $json->results->bindings->value;
        $datos = array();
        foreach ($json->results->bindings as $name => $value) {
            $id = explode('#', $value->parada->value);
//            $datos["value"][$name]=$id[1];//todos los valores
            $lat = $value->lat->value;
            $lon = $value->lon->value;
            $datos[$name] = array('parada' => $id[1], 'lat' => $lat, 'lon' => $lon); //todos los valores
//            $datos["value"] = $id[1]; //el ultimo
        }
        return json_encode($datos);
    }

    public function getParadasCercaUnPunto($meters, $x, $y) {

        $factorLAT = $meters / (1852 * 60);
        $factorLON = (($meters * 0.00001) / 0.000111 ) / 10000;

        $lat1 = $y - $factorLAT;
        $lat2 = $y + $factorLAT;
        $lon1 = $x - $factorLON;
        $lon2 = $x + $factorLON;

        $paradas = json_decode($this->paradas(), true);
        $datos = array();
        $c = 0;
        for ($i = 0; $i < count($paradas); $i++) {
            $lat = $paradas[$i]["lat"];
            $lon = $paradas[$i]["lon"];
            if ($lat >= $lat1 && $lat <= $lat2 && $lon >= $lon1 && $lon <= $lon2) {
                $info = json_decode($this->getInfoParada($paradas[$i]["parada"]), true);
                $dir = array("dir" => $info["calle1"] . " y " . $info["calle2"],
                    "referencia" => $info["referencia"],
//                    "barrio" => $info["barrio"],
                    "imagen" => $info["imagen"]);
                $paradas[$i]["parada"] = $dir;
                $datos[$c] = $paradas[$i];
                $c++;
            }
        }

        return json_encode($datos);
    }

    public function getInfoParada($id_parada) {
        $info = json_decode($this->get_info_individuo($id_parada), true);
        $parada = $info["results"]["bindings"];
        $datos = array();
        for ($i = 0; $i < count($parada); $i++) {
            $value = explode('#', $parada[$i]["prop"]["value"]);
            if ($value[1] == "referencia") {
                $datos[$value[1]] = $parada[$i]["valor"]["value"];
            }
            if ($value[1] == "imagen") {
                $datos[$value[1]] = $parada[$i]["valor"]["value"];
            }
            if ($value[1] == "LocalizadaEn") {
                $pg = explode('#', $parada[$i]["valor"]["value"]);
                $datos[$value[1]] = $pg[1];
                /* Info de la parada */
                $p = json_decode($this->getInfoPoig($pg[1]), true);
                $datos["calle1"] = $p["calle1"];
                $datos["calle2"] = $p["calle2"];
                $datos["barrio"] = $p["barrio"];
//                $datos["sector"]=$p["sector"];
            }
        }
        return json_encode($datos);
    }

    public function getInfoPoig($id_pg) {
        /* Info de la parada */
        $info = json_decode($this->get_info_individuo($id_pg), true);
        $parada = $info["results"]["bindings"];
        $datos = array();
        for ($i = 0; $i < count($parada); $i++) {
            $value = explode('#', $parada[$i]["prop"]["value"]);
            if ($value[1] == "calle1") {
                $datos[$value[1]] = $parada[$i]["valor"]["value"];
            }
            if ($value[1] == "calle2") {
                $datos[$value[1]] = $parada[$i]["valor"]["value"];
            }
            if ($value[1] == "barrio") {
                $datos[$value[1]] = $parada[$i]["valor"]["value"];
            }
            if ($value[1] == "sector") {
                $datos[$value[1]] = $parada[$i]["valor"]["value"];
            }
            if ($value[1] == "CoordenadaGeo") {
                $pg = explode('#', $parada[$i]["valor"]["value"]);
                $datos[$value[1]] = $pg[1];
            }
        }
        return json_encode($datos);
    }

}

?>
