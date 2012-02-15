<?php
include_once '../../../dll/php/Virtuoso.php';
include_once '../../../dll/rest/Pest.php';

extract($_POST);

$rest = new Virtuoso();
echo $rest->getParadasCercaUnPunto($meters, $x, $y);
?>
