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
-- Table structure for table `ruta_parada`
--

DROP TABLE IF EXISTS `ruta_parada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ruta_parada` (
  `id_ruta` int(11) NOT NULL,
  `id_parada` int(11) NOT NULL,
  `orden` int(11) NOT NULL,
  PRIMARY KEY (`id_ruta`,`id_parada`,`orden`),
  KEY `FK_ruta_parada_id_parada` (`id_parada`),
  CONSTRAINT `FK_ruta_parada_id_parada` FOREIGN KEY (`id_parada`) REFERENCES `paradas` (`id_parada`),
  CONSTRAINT `FK_ruta_parada_id_ruta` FOREIGN KEY (`id_ruta`) REFERENCES `rutas` (`id_ruta`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=FIXED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ruta_parada`
--

LOCK TABLES `ruta_parada` WRITE;
/*!40000 ALTER TABLE `ruta_parada` DISABLE KEYS */;
INSERT INTO `ruta_parada` VALUES (20,1,1),(45,1,3),(50,1,1),(20,2,2),(45,2,4),(50,2,2),(19,3,4),(20,3,3),(50,3,3),(21,4,1),(50,4,4),(21,6,2),(21,7,3),(21,8,4),(21,9,5),(21,10,6),(28,11,1),(37,11,1),(38,11,1),(41,11,1),(28,12,2),(37,12,2),(38,12,2),(41,12,2),(28,13,3),(37,13,3),(38,13,3),(41,13,3),(28,14,4),(37,14,4),(38,14,4),(41,14,4),(28,15,5),(37,15,5),(38,15,5),(41,15,5),(28,16,6),(38,16,6),(28,17,7),(38,17,7),(38,18,8),(3,19,4),(27,19,5),(38,19,9),(58,19,2),(38,20,10),(38,21,11),(38,22,12),(37,23,6),(37,24,7),(24,25,1),(27,25,1),(43,25,1),(24,26,2),(27,26,2),(43,26,2),(24,27,3),(27,27,3),(43,27,3),(2,29,3),(3,29,3),(24,29,5),(27,29,4),(58,29,1),(24,31,8),(2,34,10),(14,34,5),(24,34,9),(25,38,4),(25,39,6),(25,41,7),(28,42,8),(28,43,9),(30,44,1),(55,44,1),(56,44,1),(30,45,2),(55,45,2),(56,45,2),(30,46,3),(55,46,3),(56,46,3),(31,48,1),(31,49,2),(31,50,3),(31,51,4),(11,52,1),(31,52,5),(16,53,1),(18,53,1),(34,53,1),(36,53,1),(16,54,2),(18,54,2),(34,54,2),(36,54,2),(16,55,3),(34,55,3),(36,55,3),(34,56,4),(36,56,4),(34,57,5),(34,58,6),(34,59,7),(43,60,4),(2,61,16),(3,61,9),(13,61,11),(14,61,11),(43,61,5),(58,61,7),(1,63,9),(2,63,19),(3,63,12),(4,63,5),(5,63,4),(8,63,9),(11,63,9),(13,63,14),(14,63,14),(16,63,9),(18,63,7),(43,63,8),(50,63,10),(55,63,8),(58,63,10),(1,64,10),(2,64,20),(3,64,13),(4,64,6),(5,64,5),(6,64,10),(8,64,10),(11,64,10),(13,64,15),(14,64,15),(16,64,10),(18,64,8),(19,64,7),(43,64,9),(50,64,11),(55,64,9),(57,64,7),(58,64,11),(45,65,1),(45,66,2),(45,67,5),(45,68,6),(45,69,7),(19,70,1),(45,70,8),(49,71,1),(49,75,2),(49,76,3),(49,77,4),(49,79,5),(49,80,6),(49,81,7),(49,82,8),(49,85,10),(50,86,5),(4,87,1),(50,87,6),(55,87,4),(1,88,6),(4,88,2),(5,88,1),(8,88,6),(11,88,6),(16,88,6),(18,88,4),(50,88,7),(55,88,5),(1,89,7),(4,89,3),(5,89,2),(8,89,7),(11,89,7),(16,89,7),(18,89,5),(50,89,8),(55,89,6),(1,90,8),(4,90,4),(5,90,3),(8,90,8),(11,90,8),(16,90,8),(18,90,6),(50,90,9),(55,90,7),(1,91,4),(8,91,4),(11,91,4),(16,91,4),(1,92,5),(8,92,5),(11,92,5),(16,92,5),(18,92,3),(2,93,2),(3,93,2),(2,94,5),(24,94,7),(2,95,6),(2,96,7),(2,97,8),(14,97,3),(2,98,11),(14,98,6),(24,98,10),(2,99,15),(3,99,8),(14,99,10),(58,99,6),(2,100,18),(3,100,11),(13,100,13),(14,100,13),(43,100,7),(58,100,9),(2,101,13),(3,101,6),(14,101,8),(27,101,7),(58,101,4),(2,102,14),(3,102,7),(14,102,9),(27,102,8),(58,102,5),(6,103,5),(57,103,2),(6,104,6),(57,104,3),(6,105,7),(57,105,4),(6,106,8),(19,106,5),(57,106,5),(6,107,9),(19,107,6),(57,107,6),(8,108,3),(11,109,2),(11,111,3),(13,112,1),(13,113,2),(13,114,3),(13,115,4),(13,116,5),(13,117,6),(13,118,7),(13,119,8),(13,120,9),(13,121,10),(14,122,1),(14,123,2),(19,124,2),(19,125,3),(24,126,4),(2,128,4),(24,128,6),(2,129,17),(3,129,10),(13,129,12),(14,129,12),(43,129,6),(58,129,8),(2,130,12),(14,130,7),(24,130,11),(25,131,1),(6,133,2),(8,133,2),(56,135,4),(6,136,1),(8,136,1),(6,137,3),(2,138,1),(3,138,1),(3,139,5),(27,139,6),(58,139,3),(25,140,5),(25,141,2),(2,142,9),(14,142,4),(25,143,3),(49,144,9),(6,145,4),(57,145,1),(1,146,1),(1,147,2),(1,148,3);
/*!40000 ALTER TABLE `ruta_parada` ENABLE KEYS */;
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
