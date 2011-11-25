<?php

//$vfile = "http://blog.unijimpe.net/rss/";
extract($_GET);

$vfile = "http://routes.cloudmade.com/c5b4096bd18140ab8c2b9aa58071d3f9/api/0.3/$lat_ini,$lon_ini,$lat_fin,$lon_fin/car/shortest.js";

header("Content-type: text/html");
readfile($vfile);

?>