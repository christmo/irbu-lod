package irbu.lod.objetos;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;


/**
 *
 * @author DellXPS_L401X
 */
public class LoginFormPost {

    private DefaultHttpClient httpclient = new DefaultHttpClient();
    private HashMap<String, String> inforUsuario = new HashMap<String, String>();

    public LoginFormPost() {
    }

    /**
     * Conecta a un sitio sin parametros extrae todo el contenido
     * @param url
     * @return HttpEntity
     */
    private HttpEntity conectarSitio(String url) {
        try {
            HttpPost httpost = new HttpPost(url);
            HttpResponse response = httpclient.execute(httpost);
            return response.getEntity();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        return null;
    }

    /**
     * Conecta a un sitio con un POST con parametros
     * @param url
     * @param parametros
     * @return HttpEntity
     */
    private HttpEntity conectarSitio(String url, List<NameValuePair> parametros) {
        try {
            HttpPost httpost = new HttpPost(url);
            httpost.setEntity(new UrlEncodedFormEntity(parametros, HTTP.UTF_8));
            HttpResponse response = httpclient.execute(httpost);
            return response.getEntity();
        } catch (IOException ex) {
        	 ex.printStackTrace();
        }
        return null;
    }

    public void loginFormUTPL(String user, String pass) {
        String url = "http://rsa.utpl.edu.ec/eva/login/index.php";
        try {
            List<NameValuePair> nvps = new ArrayList<NameValuePair>();
            nvps.add(new BasicNameValuePair("username", user));
            nvps.add(new BasicNameValuePair("password", pass));
            HttpEntity entity = conectarSitio(url, nvps);
            procesarIndex(entity);

        } finally {
            // When HttpClient instance is no longer needed,
            // shut down the connection manager to ensure
            // immediate deallocation of all system resources
            httpclient.getConnectionManager().shutdown();
        }
    }

    /**
     * Procesa la pagina Index de bienvenida para obtener el nombre, periodo
     * academico y la url de consulta de notas y saldos...
     * @param entity 
     */
    private void procesarIndex(HttpEntity entity) {
        String url = null;
        if (entity != null) {
            InputStream instream = null;
            try {
                instream = entity.getContent();
                BufferedReader in = new BufferedReader(new InputStreamReader(instream));
                String line = "";
                while ((line = in.readLine()) != null) {
                    if (line.contains("&#9658;")) {
                        System.out.println(line.split("&#9658; ")[1].split("<")[0]);
                        getInforUsuario().put("peracademico", line.split("&#9658; ")[1].split("<")[0]);
                    }
                    if (line.contains("Consultar notas y saldos")) {
                        url = line.split("href=")[1].split("\"")[1];
                        break;
                    }
                }
                in.close();
//                EntityUtils.consume(entity);
                entity.consumeContent();
                procesarPagina2(conectarSitio(url));
            } catch (IOException ex) {
            	 ex.printStackTrace();
            } catch (IllegalStateException ex) {
            	 ex.printStackTrace();
            } finally {
                try {
                    instream.close();
                } catch (IOException ex) {
                	 ex.printStackTrace();
                }
            }
        }

    }

    private void procesarPagina2(HttpEntity entity) throws IOException {
        String url = null;
        if (entity != null) {
            InputStream instream = entity.getContent();
            BufferedReader in = new BufferedReader(new InputStreamReader(instream));
            String line = "";
            while ((line = in.readLine()) != null) {
                if (line.contains("document.location.replace")) {
                    url = line.split("'")[1];
                    break;
                }
            }
            in.close();
        }
        conectarSitio(url).consumeContent();
//        EntityUtils.consume();
        procesarPagina3();
    }

    private void procesarPagina3() throws IOException {
        String url = "https://wsutpl.utpl.edu.ec/sgcolestudiante/InformacionPersonal/Main.aspx";
        HttpEntity entity = conectarSitio(url);

        if (entity != null) {
            InputStream instream = entity.getContent();
            BufferedReader in = new BufferedReader(new InputStreamReader(instream));
            String line = "";
            String txt = "";
            while ((line = in.readLine()) != null) {
                if (line.contains("NOMBRES")) {
                    String[] datos = line.split("<td class=tit-grid");
                    for (int i = 1; i < datos.length; i++) {
                        txt = datos[i].split("text-grid2>")[1].split("</td>")[0];
                        switch (i) {
                            case 1:
                                getInforUsuario().put("mombre", txt);
                                System.out.println(txt);
                                break;
                            case 2:
                                getInforUsuario().put("ci", txt);
                                System.out.println(txt);
                                break;
                            case 4:
                                procesarDireccion(datos[i], txt);
                                break;
                            case 5:
                                procesarDireccion(datos[i], txt);
                                break;
                            case 7:
                                String [] mails = txt.split("&nbsp; - &nbsp;"); 
                                for (String mail : mails) {
                                    if(mail.contains("@utpl.edu.ec")){
                                        getInforUsuario().put("mail", mail);
                                        System.out.println(mail);
                                    }
                                }
                                break;
                        }

                    }
                    break;
                }
            }
            in.close();
        }
        entity.consumeContent();
//        EntityUtils.consume(entity);
        
    }

    private void procesarDireccion(String linea, String txt) {
        String dir = txt.split("Calles: ")[1];
        if (linea.contains("Domicilio")) {
            getInforUsuario().put("direccion", dir);
            System.out.println(dir);
        }
    }

    /**
     * @return the inforUsuario
     */
    public HashMap<String, String> getInforUsuario() {
        return inforUsuario;
    }
}
