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
-- Table structure for table `ruta_hora`
--

DROP TABLE IF EXISTS `ruta_hora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ruta_hora` (
  `id_ruta` int(11) NOT NULL,
  `hora` time NOT NULL,
  PRIMARY KEY (`hora`,`id_ruta`),
  KEY `FK_ruta_hora_id_ruta` (`id_ruta`),
  CONSTRAINT `FK_ruta_hora_id_ruta` FOREIGN KEY (`id_ruta`) REFERENCES `rutas` (`id_ruta`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=FIXED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ruta_hora`
--

LOCK TABLES `ruta_hora` WRITE;
/*!40000 ALTER TABLE `ruta_hora` DISABLE KEYS */;
INSERT INTO `ruta_hora` VALUES (1,'14:35:00'),(2,'07:00:00'),(2,'15:00:00'),(3,'06:35:00'),(3,'07:35:00'),(3,'08:05:00'),(3,'13:35:00'),(3,'14:05:00'),(3,'14:35:00'),(4,'18:35:00'),(5,'14:35:00'),(6,'06:50:00'),(8,'07:05:00'),(8,'15:05:00'),(11,'07:35:00'),(11,'08:35:00'),(11,'14:35:00'),(13,'07:00:00'),(13,'14:30:00'),(14,'14:30:00'),(16,'06:35:00'),(16,'07:05:00'),(16,'08:05:00'),(16,'13:35:00'),(16,'14:05:00'),(16,'14:35:00'),(16,'15:05:00'),(16,'15:35:00'),(18,'07:35:00'),(18,'14:35:00'),(19,'06:35:00'),(19,'07:05:00'),(19,'07:35:00'),(19,'08:05:00'),(19,'14:35:00'),(19,'15:05:00'),(20,'12:05:00'),(20,'12:35:00'),(20,'18:05:00'),(20,'18:40:00'),(21,'12:05:00'),(21,'12:35:00'),(21,'13:10:00'),(21,'18:05:00'),(21,'19:10:00'),(21,'20:10:10'),(24,'12:35:00'),(24,'18:40:00'),(25,'21:10:00'),(27,'13:10:00'),(27,'19:10:00'),(27,'20:10:00'),(28,'12:35:00'),(28,'18:40:00'),(28,'21:10:00'),(30,'12:05:00'),(30,'12:35:00'),(30,'13:10:00'),(30,'18:05:00'),(30,'18:35:00'),(30,'20:10:00'),(31,'21:10:00'),(34,'21:10:00'),(36,'12:05:00'),(36,'12:35:00'),(36,'13:05:00'),(36,'13:10:00'),(36,'18:05:00'),(36,'18:35:00'),(36,'19:10:00'),(36,'20:10:00'),(37,'19:10:00'),(37,'21:10:00'),(38,'12:05:00'),(38,'18:05:00'),(41,'13:10:00'),(43,'08:35:00'),(43,'09:05:00'),(43,'09:35:00'),(43,'10:35:00'),(43,'11:05:00'),(43,'11:35:00'),(43,'15:35:00'),(43,'16:05:00'),(43,'16:35:00'),(43,'17:05:00'),(43,'17:35:00'),(45,'19:10:00'),(45,'20:10:00'),(45,'21:10:00'),(49,'12:35:00'),(49,'18:35:00'),(49,'21:10:00'),(50,'08:30:00'),(50,'09:05:00'),(50,'09:35:00'),(50,'10:35:00'),(50,'11:05:00'),(50,'11:35:00'),(50,'16:05:00'),(50,'16:35:00'),(50,'17:05:00'),(50,'17:35:00'),(55,'08:35:00'),(55,'10:35:00'),(55,'11:05:00'),(55,'11:35:00'),(55,'16:05:00'),(55,'16:35:00'),(55,'17:05:00'),(55,'17:35:00'),(56,'21:05:00'),(57,'06:35:00'),(57,'07:35:00'),(57,'08:05:00'),(57,'08:35:00'),(57,'13:35:00'),(57,'14:05:00'),(57,'14:35:00'),(57,'15:35:00'),(58,'08:35:00');
/*!40000 ALTER TABLE `ruta_hora` ENABLE KEYS */;
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
