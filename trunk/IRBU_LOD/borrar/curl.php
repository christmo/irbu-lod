<?php
 
//$url = 'http://localhost:8080/irbu/core/php/gui/getPuntosRuta.php';
//$body = 'id_ruta=5';
//$c = curl_init($url);
//curl_setopt($c, CURLOPT_POST, true);
//curl_setopt($c, CURLOPT_POSTFIELDS, $body);
//curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
//$page = curl_exec($c);
//curl_close($c);
//echo $page;

//$c = curl_init('http://localhost:8080/irbu/core/php/gui/listaParadas.php');
//curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
//$page = curl_exec($c);
//curl_close($c);
//echo $page;

$c = curl_init('http://localhost:8080/irbu/core/php/gui/getParadasTodas.php');
curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
$page = curl_exec($c);
curl_close($c);
echo $page;




/**
 * Send a POST requst using cURL 
 * @param string $url to request 
 * @param array $post values to send 
 * @param array $options for cURL 
 * @return string 
 */
function curl_post($url, array $post = NULL, array $options = array()) {
    $defaults = array(
        CURLOPT_POST => 1,
        CURLOPT_HEADER => 0,
        CURLOPT_URL => $url,
        CURLOPT_FRESH_CONNECT => 1,
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_FORBID_REUSE => 1,
        CURLOPT_TIMEOUT => 4,
        CURLOPT_POSTFIELDS => http_build_query($post)
    );

    $ch = curl_init();
    curl_setopt_array($ch, ($options + $defaults));
    if (!$result = curl_exec($ch)) {
        trigger_error(curl_error($ch));
    }
    curl_close($ch);
    return $result;
}

/**
 * Send a GET requst using cURL 
 * @param string $url to request 
 * @param array $get values to send 
 * @param array $options for cURL 
 * @return string 
 */
function curl_get($url, array $get = NULL, array $options = array()) {
    $defaults = array(
        CURLOPT_URL => $url . (strpos($url, '?') === FALSE ? '?' : '') . http_build_query($get),
        CURLOPT_HEADER => 0,
        CURLOPT_RETURNTRANSFER => TRUE,
        CURLOPT_TIMEOUT => 4
    );

    $ch = curl_init();
    curl_setopt_array($ch, ($options + $defaults));
    if (!$result = curl_exec($ch)) {
        trigger_error(curl_error($ch));
    }
    curl_close($ch);
    return $result;
}

?>