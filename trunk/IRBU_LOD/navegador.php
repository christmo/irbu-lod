<?php
require_once('core/php/core/navegadores.php');

$navegador = validarNavegador();

if ($navegador) {
    echo "<script>location.href='index.php'</script>";
}

?>
<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <link rel="stylesheet" type="text/css" href="css/style.css"/>
    </head>
    <body background="img/ahorcado.jpg">
        <table width="100%" height="80%">
            <tr valign="middle">
                <td align="center" colspan="4">
                    <div class="texto_navegador">
                        Lamentamos informarle que su navegador no est&aacute; soportado,
                        le recomendamos actualizarlo por las opciones que se presentan acontinuaci&oacute;n
                        para hacer uso de esta aplicaci&oacute;n...
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <br/>
                </td>
            </tr>
            <tr valign="middle">
                <td align="center">
                    <a href="http://www.google.com/chrome">
                        <img alt="chrome" src="img/Chrome.png" width="150" height="150"/>
                    </a>
                    <br/>
                    <a href="http://www.google.com/chrome">
                        Google Chrome 10
                    </a>
                </td>
                <td align="center">
                    <a href="http://www.apple.com/es/safari/">
                        <img alt="safari" src="img/Safari.png" width="150" height="150"/>
                    </a>
                    <br/>
                    <a href="http://www.apple.com/es/safari/">
                        Safari 5
                    </a>
                </td>
                <td align="center">
                    <a href="http://www.opera.com/browser/download/">
                        <img alt="opera" src="img/Opera.png" width="150" height="150"/>
                    </a>
                    <br/>
                    <a href="http://www.opera.com/browser/download/">
                        Opera 11
                    </a>
                </td>
                <td align="center">
                    <a href="http://windows.microsoft.com/es-ES/internet-explorer/products/ie/home">
                        <img alt="IE9" src="img/IE.png" width="150" height="150"/>
                    </a>
                    <br/>
                    <a href="http://windows.microsoft.com/es-ES/internet-explorer/products/ie/home">
                        Internet Explorer 9
                    </a>
                </td>
            </tr>
        </table>
    </body>
</html>