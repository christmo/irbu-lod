CREATE DATABASE  IF NOT EXISTS `irbudata` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `irbudata`;
-- MySQL dump 10.13  Distrib 5.1.40, for Win32 (ia32)
--
-- Host: 172.16.31.13    Database: irbudata
-- ------------------------------------------------------
-- Server version	5.1.51-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `rutas`
--

DROP TABLE IF EXISTS `rutas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rutas` (
  `id_ruta` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(200) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_ruta`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rutas`
--

LOCK TABLES `rutas` WRITE;
/*!40000 ALTER TABLE `rutas` DISABLE KEYS */;
INSERT INTO `rutas` VALUES (1,'R','Daniel Álvarez (Laguna) (PRIMERA PARADA) Calle Emiliano Zapata, Lauro Guerrero, Colón, Av. Universitaria, UTPL'),(2,'R','El Valle, La Paz, Colegio Militar, Gallera, Las Pitas, Redondel Isidro Ayora, puente Juan de Salinas, UTPL'),(3,'R','El Valle, Las Pitas, Terminal Terrestre, Av. Cuxibamba, Av. Manuel Agustín Aguirre, Puente J. Salinas, Av. Universitaria,  UTPL.'),(4,'R','José Picoita, Lauro Guerrero,  Colón, Av. Universitaria, UTPL'),(5,'R','Mercadillo, Lauro Guerreo, Av. Universitaria, Juan de Salinas, UTPL'),(6,'R','Rosales, Pradera Catacocha, Juan José Peña, UTPL.'),(8,'R','Rosales, Tebaida Baja, Lauro Guerrero, Colón, Av. Universitaria,  UTPL'),(11,'R','Primera Etapa Esteban Godoy, calle Gonzalo Montesdeoca (PRIMERA PARADA), Pio Jaramillo, Lauro Guerrero, Colón, Av. Universitaria, UTPL'),(13,'R','Redondel Operadores, Redondel Época, Av. Paltas, Redondel Pedestal,  Av. Occidental, Terminal Terrestre, Av. Cuxibamba, Av. Manuel Agustín Aguirre, Puente Juan de Salinas, Av. Universitaria, UTPL'),(14,'R','Sauces Norte, Av. Cuxibamba, Puente Juan de Salinas, Universitaria, UTPL'),(16,'R','Tebaida Alta, Tebaida Baja, Lauro Guerrero, Colón, Av. Universitaria, UTPL'),(18,'R','Tnt. Maximiliano Rodríguez, San Pedro, Brasil, Lauro Guerrero, Colón, Av. Universitaria, UTPL'),(19,'R','Zamora Huayco (Iglesia), Calle Lourdes, Juan Jose Peña, UTPL'),(20,'B','24 de Mayo, Lourdes y Juan Jose Peña (ULTIMA PARADA)'),(21,'B','Pradera (Bolivar y Cariamanga PRIMERA PARADA)'),(24,'B','Av. Orillas del Zamora, Calle Guayaquil, Av. Salvador Bustamante,  SOLCA, La Paz, Colegio Militar, Cdla. La Banda.'),(25,'B','Cdla. Sauces Norte (La Banda PRIMERA PARADA)'),(27,'B','Av. Orillas del Zamora, El Valle, Solca, La Paz, Las Pitas ( Nueva Granada ULTIMA PARADA )'),(28,'B','Av. Cuxibamba, Terminal, Redondel Pitas  Dos.'),(30,'B','Av. Manuel Agustín Aguirre y  Mercadillo'),(31,'B','Av. Manuel Agustín Aguirre, Cdla. Manuel Estebán Godoy (Calle Chile PRIMERA PARADA)'),(34,'B','Tebaida Alta, Daniel Álvarez,  Pío Jaramillo y Maximiliano Rodríguez ( PRIMERA PARADA ) '),(36,'B','Tebaida Alta, Pío Jaramillo y Maximiliano Rodríguez ( PRIMERA PARADA ) '),(37,'B','Av. Cuxibamba, Terminal Terrestre, Clodoveo Jaramillo'),(38,'B','Av. Cuxibamba, Terminal Terrestre, Las Pitas, La Paz, SOLCA, El Valle'),(41,'B','Av. Cuxibamba, Terminal Terrestre.'),(43,'BR','Av. Orillas del Zamora, Conservatorio, Terminal Terrestre, Av. Cuxibamba, Av. Manuel Agustín Aguirre, Puente Juan de Salinas, Universitaria, UTPL'),(45,'B','Puente del Técnico, Orillas del Zamora, 24 de Mayo,  Lourdes, Zamora Huayco.'),(49,'B','El Bosque Primera Parada, Av. Occidental,   Redondel Pedestal, Av. Paltas, Redondel Época, Redondel Operadores'),(50,'BR','24 de mayo, Lourdes Cariamanga, Lauro Guerrero, Colón, Av. Universitaria, UTPL'),(55,'BR','Av. Manuel Agustín Aguirre, José Picoita, L. Guerrero, Colón, Av. Universitaria, UTPL'),(56,'B','Av. Manuel Agustín Aguirre, Cariamanga'),(57,'R','Pradera Catacocha, Juan José Peña, UTPL.'),(58,'R','Las Pitas, Terminal Terrestre, Av. Cuxibamba, Av. Manuel Agustín Aguirre, Puente J. de Salinas, Av. Universitaria, UTPL. (PRIMERA PARADA COMPLEJO FERIAL)');
/*!40000 ALTER TABLE `rutas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2011-06-23 18:28:26
