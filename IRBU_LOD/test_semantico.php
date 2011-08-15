<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$uri = "http://dbpedia.org/sparql?query=";

$consulta =   "select *
            where {
            <http://dbpedia.org/resource/Zemfira> ?b ?c
            }";

$sparql = $uri.urlencode($consulta);
echo $sparql;

$response = http_get($sparql);

echo "<br/>";
echo "<br/>";
echo "<br/>";

echo $response;

?>
