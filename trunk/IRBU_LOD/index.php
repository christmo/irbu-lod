<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
    <head>
        <meta name="generator" content="HTML Tidy for Linux (vers 6 November 2007), see www.w3.org">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>IRBU</title>
        <link rel="shortcut icon" href="img/taxi.png" type="image/x-icon">
        <!--Maquetacion-->
        <link rel="stylesheet" type="text/css" href="css/style.css">

        <!--Ext-JS-->
        <link rel="stylesheet" type="text/css" href="css/ext-js/resources/css/ext-all.css">

        <!--OpenLayers-->
        <link rel='stylesheet' type='text/css' href='dll/js/openlayers/theme/default/style.css'>
        <link rel="stylesheet" type="text/css" href="css/jquery.lightbox-0.5.css" media="screen">

        <script type='text/javascript' src='dll/js/openlayers/lib/OpenLayers.js'></script>
        <script type='text/javascript' src='dll/js/osm/OpenStreetMap.js'></script>
        <script type='text/javascript' src='dll/js/mapa.js'></script>
        <script type="text/javascript" src="dll/js/ext-js/adapter/ext/ext-base.js"></script>
        <script type="text/javascript" src="dll/js/ext-js/ext-all.js"></script>

        <!-- spinner -->
        <link rel="stylesheet" type="text/css" href="dll/js/ext-js/ux/spinner/Spinner.css">
        <script type="text/javascript" src="dll/js/ext-js/ux/spinner/Spinner.js"></script>
        <script type="text/javascript" src="dll/js/ext-js/ux/spinner/SpinnerStrategy.js"></script>

        <!-- DataView -->    
        <link rel="stylesheet" type="text/css" href="dll/js/ext-js/ux/dataview/data-view.css">
        <script type="text/javascript" src="dll/js/ext-js/ux/dataview/DataView-more.js"></script>

        <!-- FileUpLoad -->    
        <link rel="stylesheet" type="text/css" href="dll/js/ext-js/ux/fileupload/fileuploadfield.css">
        <script type="text/javascript" src="dll/js/ext-js/ux/fileupload/FileUploadField.js"></script>

        <!-- Funciones Comunes -->
        <script type="text/javascript" src="core/js/gui/contenedorPrincipal.js"></script>
        <script type="text/javascript" src="core/js/core/constantes.js"></script>
        <script type="text/javascript" src="core/js/core/FuncionesComunes.js"></script>

        <!--Ventanas-->
        <script type="text/javascript" src="core/js/gui/ventanaBuscarRutas.js"></script>
        <script type="text/javascript" src="core/js/gui/ventanaLocalizarParadaHora.js"></script>
        <script type="text/javascript" src="core/js/gui/RQ1_POPUP.js"></script>

        <!-- RQ 2 -->
        <script type="text/javascript" src="core/js/core/RQ2_TrazarRuta.js"></script>
        <script type="text/javascript" src="core/js/core/LimpiarCapas.js"></script>

        <!--  RQ 3  -->
        <script type="text/javascript" src="dll/js/action_popup_paradas.js"></script>
        <script type="text/javascript" src="core/js/gui/RQ3_busqueda_aprox.js"></script>
        <script type="text/javascript" src="core/js/core/RQ3_AreaBusqueda.js"></script>

        <!--  RQ1 TRATAMIENTO DE IMAGENES  -->
        <script type="text/javascript" src="dll/js/jquery/jquery.js"></script>
        <script type="text/javascript" src="dll/js/jquery/jquery.lightbox-0.5.js"></script>

        <!-- Login -->
        <script type="text/javascript" src="core/js/gui/login/ventanaLogin.js"></script>

        <!-- Nueva Ruta -->
        <script type="text/javascript" src="core/js/gui/ventanaNuevaRuta.js"></script>
        <script type="text/javascript" src="core/js/gui/ventanaHorasRuta.js"></script>
        <script type="text/javascript" src="core/js/gui/ventanaPuntosRuta.js"></script>

        <!-- Nueva Parada -->
        <script type="text/javascript" src="core/js/gui/ventanaNuevaParada.js"></script>

        <script type='text/javascript'>
            $(function() {
                $('.photo').lightBox();
            });
        </script>
        <style type="text/css">
            div.c1 {position: absolute; bottom: 0px; right: 0px;}
            div.c2 {position: absolute; bottom: 0px; }
        </style>
        
           <style type="text/css">
        body {
            padding: 20px;
            margin: 0 auto;
        }
        #container {
            padding: 10px;
            background: #e3e3e3;
            border: 1px solid #d3d3d3;
            margin: 0 auto;
            width: 820px;
        }
        #left {
            float: left;
        }
        #right {
            float: right;
        }
        #right-bottom {
            margin-top: 10px;
        }
        .clear {
            clear: both;
        }
        .details {
            padding: 10px;
            font-family: "Arial";
            font-size: 11px;
        }
        .details-info {
            margin-top: 10px;
        }
        .details-info span {
            display: block;
        }
        .details-info span a {
            color: #0066cc;
        }
        .details-info span a:hover {
            text-decoration: none;
        }
    </style>
    </head>
    <body onload="init()">
        <div id="map"></div>
<!--        <div class="c1"><a href='http://www.kradac.com'><img alt="www.kradac.com" src='img/datap/credits.png'></a></div>-->

        <div class="c2"><a href="http://validator.w3.org/check?uri=referer"><img
                    src="http://www.w3.org/Icons/valid-html401"
                    alt="Valid HTML 4.01 Transitional" height="31" width="88"></a></div>
    </body>
</html>
