<?php

include ('../../../../dll/php/conexionBD.php');
extract($_POST);

//$salt = "KOMPRESORKR@D@C";
//$encriptClave = md5(md5(md5($txtClave) . md5($salt)));
$consultaSql = "SELECT USUARIO_USU,CLAVE_USU 
        FROM USUARIOS 
        WHERE USUARIO_USU = '" . $txtUsuario . "'
        AND CLAVE_USU = '" . $txtClave . "'";

consulta($consultaSql);
$registro = unicaFila();

if ($registro["CLAVE_USU"] == $txtClave && $registro["USUARIO_USU"] == $txtUsuario) {
    session_start();
    $_SESSION["usuario"] = $registro["USUARIO_USU"];
    $_SESSION["sesion"] = true;

    /* echo '<script type="text/javascript">';

      //redireccionar a dentro de la aplicación
      echo "window.location='../../indexg.php';";
      echo '</script>'; */
    echo '{"success": true, "login":{"web": "user"}}';
} else {
    /* echo '<script type="text/javascript">';
      echo 'alert ("LO SENTIMOS NO ESTA REGISTRADO");';
      echo "window.location='../../index.php';";
      echo '</script>'; */
    echo '{"success": false, "errors":{"reason": "Usuario o contraseña incorrecta"}}';
}
?>
