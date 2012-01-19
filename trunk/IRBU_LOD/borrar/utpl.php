<?php
//$iterator = new DirectoryIterator(dirname(__FILE__));
echo realpath('./img/datap/');
//echo $iterator->getPath()."<br/>";
echo DIRECTORY_SEPARATOR;
?>
<html>
    <header>
        <script type="text/javascript" src="crypt.js"></script>
        <script type="text/javascript">

            function encriptar(src){
                //                var c = document.getElementById('password').value;
                //var clave = crypt(c);
                //                document.getElementById('password').value = c;
                src.submit();
            } 
        </script>

    </header>
    <body>
        <form action="http://rsa.utpl.edu.ec/eva/login/index.php" method="post" 
              id="ingreso-eva">
            <label for="username">Usuario</label>
            <input type="text" name="username" id ="username"  value="cfmora"  />
            <label for="password" >Contraseña</label>
            <input type="password" name="password" id ="password" value="79493" />
<!--            <input type="hidden" name="entrada" value="utpl"/>-->
            <input type="button" onclick="encriptar(this.form)" 
                   name="submitButtonName" tabindex="5" value="Ingresar" accesskey="i"/>

        </form>

    </body>
</html>