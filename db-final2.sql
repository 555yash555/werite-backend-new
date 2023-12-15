-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: werite
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookmarks`
--

DROP TABLE IF EXISTS `bookmarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookmarks` (
  `user_id` int NOT NULL,
  `post_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`post_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `bookmarks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `bookmarks_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookmarks`
--

LOCK TABLES `bookmarks` WRITE;
/*!40000 ALTER TABLE `bookmarks` DISABLE KEYS */;
/*!40000 ALTER TABLE `bookmarks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chats`
--

DROP TABLE IF EXISTS `chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chats` (
  `chat_id` int NOT NULL AUTO_INCREMENT,
  `user_first` int NOT NULL,
  `user_second` int NOT NULL,
  `latest_message_id` int DEFAULT NULL,
  PRIMARY KEY (`chat_id`),
  KEY `user_first` (`user_first`),
  KEY `user_second` (`user_second`),
  KEY `latest_message_id` (`latest_message_id`),
  CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`user_first`) REFERENCES `users` (`user_id`),
  CONSTRAINT `chats_ibfk_2` FOREIGN KEY (`user_second`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chats`
--

LOCK TABLES `chats` WRITE;
/*!40000 ALTER TABLE `chats` DISABLE KEYS */;
INSERT INTO `chats` VALUES (78,24,26,56);
/*!40000 ALTER TABLE `chats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `video_id` int NOT NULL,
  `reply_of_comment_id` int NOT NULL DEFAULT '0',
  `user_id` int NOT NULL,
  `comment` varchar(6000) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `fk_comments_user_id_idx` (`user_id`),
  KEY `fk_comments_video_id_idx` (`video_id`),
  CONSTRAINT `fk_comments_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_comments_video_id` FOREIGN KEY (`video_id`) REFERENCES `video_recordings` (`video_id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dislikes`
--

DROP TABLE IF EXISTS `dislikes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dislikes` (
  `user_id` int NOT NULL,
  `video_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`video_id`),
  KEY `fk_dislikes_video_id_idx` (`video_id`),
  CONSTRAINT `fk_dislikes_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_dislikes_video_id` FOREIGN KEY (`video_id`) REFERENCES `video_recordings` (`video_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dislikes`
--

LOCK TABLES `dislikes` WRITE;
/*!40000 ALTER TABLE `dislikes` DISABLE KEYS */;
/*!40000 ALTER TABLE `dislikes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `downvotes`
--

DROP TABLE IF EXISTS `downvotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `downvotes` (
  `user_id` int NOT NULL,
  `post_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`post_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `downvotes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `downvotes_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `downvotes`
--

LOCK TABLES `downvotes` WRITE;
/*!40000 ALTER TABLE `downvotes` DISABLE KEYS */;
/*!40000 ALTER TABLE `downvotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `user_id` int NOT NULL,
  `video_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`video_id`),
  KEY `fk_likes_video_id_idx` (`video_id`),
  CONSTRAINT `fk_likes_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_likes_video_id` FOREIGN KEY (`video_id`) REFERENCES `video_recordings` (`video_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `chat_id` int NOT NULL,
  `message` text NOT NULL,
  `read` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`message_id`),
  KEY `sender_id` (`sender_id`),
  KEY `chat_id` (`chat_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`chat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (54,24,78,'This is a first message',0,'2023-11-17 21:10:08','2023-11-17 21:10:08'),(55,26,78,'This is a first message',0,'2023-11-17 21:10:26','2023-11-17 21:10:26'),(56,26,78,'This is a first message',0,'2023-11-17 21:10:39','2023-11-17 21:10:39');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `message` varchar(200) NOT NULL,
  `viewed` tinyint NOT NULL,
  `created_at` date NOT NULL,
  `user_id` int NOT NULL,
  `type` varchar(40) DEFAULT NULL,
  `link` varchar(49) DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (55,'saqibshah sent you a Request for the pool Covaxin vs Covishield',1,'2023-08-13',12,'normal',''),(56,'saqibshah sent you a Request for the pool Covaxin vs Covishield',1,'2023-08-13',12,'normal',''),(57,'saqibshah sent you a Request for the pool Covaxin vs Covishield',1,'2023-08-13',12,'normal',''),(58,'saqibshah sent you a Request for the pool Covaxin vs Covishield',1,'2023-08-13',12,'normal',''),(59,'saqibshah sent you a Request for the pool Covaxin vs Covishield',1,'2023-08-13',12,'normal',''),(60,'saqibshah sent you a Request for the pool Covaxin vs Covishield',1,'2023-08-13',12,'normal',''),(61,'saqibshah sent you a Request for the pool Covaxin vs Covishield',1,'2023-08-13',12,'normal',''),(62,'saqibshah sent you a Request for the pool Covaxin vs Covishield',1,'2023-08-13',12,'normal',''),(63,'saqibshah sent you a Request for the pool Covaxin vs Covishield',1,'2023-08-13',12,'normal',''),(64,'saqibshah sent you a Request for the pool Covaxin vs Covishield',1,'2023-08-13',12,'normal',''),(65,'saqibshah sent you a Request for the pool Covaxin vs Covishield',1,'2023-08-13',12,'normal',''),(66,'saqibshah sent you a Request for the pool Covaxin vs Covishield',1,'2023-08-13',12,'normal',''),(67,'saqibshah sent you a Request for the pool Covaxin vs Covishield',1,'2023-08-13',12,'normal',''),(68,'undefined sent you a Request for the pool Movie talk',1,'2023-08-29',21,'normal',''),(69,'hshsha accepted your Request for the pool Movie talk',1,'2023-08-29',12,'normal',''),(70,'hshsha sent you a Request for the pool Final POOL',0,'2023-08-29',19,'normal',''),(71,'undefined sent you a Request for the pool yo this is a new pool',0,'2023-08-29',19,'normal',''),(72,'undefined sent you a Request for the pool Final POOL',0,'2023-08-29',19,'normal',''),(73,'saqibshah1 sent you a Request for the pool ggg',1,'2023-08-29',24,'normal',''),(74,'adminsaqib has Started the pool ggg',1,'2023-08-29',23,'pool start','http://localhost:8080/join/57'),(75,'undefined sent you a Request for the pool ggg',1,'2023-08-29',24,'normal',''),(76,'hshsha sent you a Request for the pool Movie talk',0,'2023-08-30',21,'normal',''),(77,'adminsaqib sent you a Request for the pool asa',0,'2023-11-13',21,'normal',''),(78,'hshsha has Started the pool asa',0,'2023-11-13',24,'pool start','http://localhost:8080/join/62');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pools`
--

DROP TABLE IF EXISTS `pools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pools` (
  `pool_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `category` varchar(50) NOT NULL,
  `merit_required` int NOT NULL,
  `discussion_type` varchar(20) NOT NULL,
  `spectators_allowed` tinyint NOT NULL,
  `stance` varchar(100) DEFAULT NULL,
  `guts` varchar(10) DEFAULT NULL,
  `source` varchar(100) DEFAULT NULL,
  `talktime` varchar(10) DEFAULT NULL,
  `duration` varchar(10) DEFAULT NULL,
  `thumbnail` varchar(100) DEFAULT NULL,
  `is_active` tinyint NOT NULL,
  `user_id` int NOT NULL,
  `people_allowed` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `noti_sent` int DEFAULT NULL,
  PRIMARY KEY (`pool_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `pools_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pools`
--

LOCK TABLES `pools` WRITE;
/*!40000 ALTER TABLE `pools` DISABLE KEYS */;
INSERT INTO `pools` VALUES (65,'Final POOL BY me ','Health',10,'one on one',0,'If you plan to travel abroad soon, you may want to take Covishield.','85','https://www.sbigeneral.in/portal/blog-details/which-is-better-between-covaxin-and-covishield',NULL,'30',NULL,1,26,5,'2023-11-19 17:21:34',NULL,NULL),(66,'Final POOL BY me ','Health',10,'one on one',0,'If you plan to travel abroad soon, you may want to take Covishield.','85','https://www.sbigeneral.in/portal/blog-details/which-is-better-between-covaxin-and-covishield',NULL,'30',NULL,1,26,5,'2024-09-19 17:38:20','2023-11-19 17:50:01',NULL),(67,'a Final POOL BY me','Health',10,'one on one',0,'If you plan to travel abroad soon, you may want to take Covishield.','85','https://www.sbigeneral.in/portal/blog-details/which-is-better-between-covaxin-and-covishield',NULL,'30',NULL,1,26,5,'2023-11-19 17:50:45',NULL,NULL),(68,'a Final POOL BY me','Health',10,'one on one',0,'If you plan to travel abroad soon, you may want to take Covishield.','85','https://www.sbigeneral.in/portal/blog-details/which-is-better-between-covaxin-and-covishield',NULL,'30',NULL,1,26,5,'2023-11-19 17:50:50',NULL,NULL),(69,'a Final POOL BY me','Health',10,'one on one',0,'If you plan to travel abroad soon, you may want to take Covishield.','85','https://www.sbigeneral.in/portal/blog-details/which-is-better-between-covaxin-and-covishield',NULL,'30',NULL,0,26,5,'2023-11-19 17:53:39',NULL,NULL);
/*!40000 ALTER TABLE `pools` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pools_requests`
--

DROP TABLE IF EXISTS `pools_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pools_requests` (
  `pool_id` int NOT NULL,
  `user_id` int NOT NULL,
  `stance` varchar(100) NOT NULL,
  `guts` varchar(10) NOT NULL,
  `status` varchar(10) NOT NULL,
  PRIMARY KEY (`pool_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `pools_requests_ibfk_1` FOREIGN KEY (`pool_id`) REFERENCES `pools` (`pool_id`),
  CONSTRAINT `pools_requests_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pools_requests`
--

LOCK TABLES `pools_requests` WRITE;
/*!40000 ALTER TABLE `pools_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `pools_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_audios`
--

DROP TABLE IF EXISTS `post_audios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_audios` (
  `post_audio_id` int NOT NULL AUTO_INCREMENT,
  `audio_url` text,
  `post_id` int DEFAULT NULL,
  PRIMARY KEY (`post_audio_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `post_audios_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_audios`
--

LOCK TABLES `post_audios` WRITE;
/*!40000 ALTER TABLE `post_audios` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_audios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_comments`
--

DROP TABLE IF EXISTS `post_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `reply_of_comment_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `post_id` (`post_id`),
  KEY `reply_of_comment_id` (`reply_of_comment_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `post_comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`),
  CONSTRAINT `post_comments_ibfk_2` FOREIGN KEY (`reply_of_comment_id`) REFERENCES `post_comments` (`comment_id`) ON DELETE CASCADE,
  CONSTRAINT `post_comments_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_comments`
--

LOCK TABLES `post_comments` WRITE;
/*!40000 ALTER TABLE `post_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_images`
--

DROP TABLE IF EXISTS `post_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_images` (
  `post_image_id` int NOT NULL AUTO_INCREMENT,
  `image_url` text,
  `post_id` int DEFAULT NULL,
  PRIMARY KEY (`post_image_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `post_images_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_images`
--

LOCK TABLES `post_images` WRITE;
/*!40000 ALTER TABLE `post_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_videos`
--

DROP TABLE IF EXISTS `post_videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_videos` (
  `post_video_id` int NOT NULL AUTO_INCREMENT,
  `video_url` text,
  `post_id` int DEFAULT NULL,
  `pool_id` int DEFAULT NULL,
  PRIMARY KEY (`post_video_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `post_videos_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_videos`
--

LOCK TABLES `post_videos` WRITE;
/*!40000 ALTER TABLE `post_videos` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_videos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `user_id` int DEFAULT NULL,
  `source_link` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=175 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (172,'azzzzzz','this is the discription',26,'this is the source_link','2023-11-19 17:31:44'),(173,'asjkdajksbdabs','this is the discription',26,'this is the source_link','2021-11-19 17:32:29'),(174,'asjkdajksbdabs','this is the discription',26,'this is the source_link','2023-11-19 17:36:41');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prompts`
--

DROP TABLE IF EXISTS `prompts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prompts` (
  `prompt_id` int NOT NULL AUTO_INCREMENT,
  `text` varchar(255) NOT NULL,
  `pool_id` int NOT NULL,
  `timeMinutes` int NOT NULL,
  PRIMARY KEY (`prompt_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prompts`
--

LOCK TABLES `prompts` WRITE;
/*!40000 ALTER TABLE `prompts` DISABLE KEYS */;
INSERT INTO `prompts` VALUES (1,'This is a prompt',60,5),(2,'This is a prompt',61,5),(3,'This is a  2',63,5),(4,'This is a  2',64,5),(5,'This is a  2',65,5),(6,'This is a  2',66,5),(7,'This is a  2',67,5),(8,'This is a  2',68,5),(9,'This is a  2',69,5);
/*!40000 ALTER TABLE `prompts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `upvotes`
--

DROP TABLE IF EXISTS `upvotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `upvotes` (
  `user_id` int NOT NULL,
  `post_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`post_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `upvotes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `upvotes_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `upvotes`
--

LOCK TABLES `upvotes` WRITE;
/*!40000 ALTER TABLE `upvotes` DISABLE KEYS */;
/*!40000 ALTER TABLE `upvotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(50) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `created_at` date NOT NULL,
  `merit` int NOT NULL,
  `is_active` tinyint(1) DEFAULT '0',
  `inCall` int DEFAULT NULL,
  `profile_pic` varchar(15000) DEFAULT NULL,
  `bio` varchar(500) DEFAULT NULL,
  `type` varchar(255) DEFAULT 'user',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (12,'undefined','yo3@gmail.com','sahil','password','undefined','male','2023-08-07',100,0,0,NULL,NULL,'user'),(18,'saqibshah','saqib123@gmail.com','sa','yo','undefined','female','2023-08-13',10,0,0,NULL,NULL,'user'),(19,'asaqibshah','saqib13@gmail.com','sa','yo','undefined','male','2023-08-13',50,0,0,NULL,NULL,'user'),(21,'hshsha','saqib14@gmail.com','sa','yo','undefined','undefined','2023-08-16',84,0,0,NULL,NULL,'user'),(23,'saqibshah1','saqibshah@gmail.com','Mohammad Saqib Shah','password','undefined','male','2023-08-29',50,0,0,NULL,NULL,'user'),(24,'adminsaqib','msaqibshah@gmail.com','Mohammad Saqib Shah','password','undefined','male','2023-08-29',50,0,0,NULL,NULL,'user'),(26,'hasshsha','saqib16@gmail.com','sa','yo','undefined','undefined','2023-09-01',50,0,0,NULL,NULL,'user'),(27,'haassshsha','saqib17@gmail.com','sa','yo','undefined','undefined','2023-09-01',50,0,0,NULL,NULL,'admin'),(31,'11111sas','saqib18@gmail.com','sa','yo','undefined','undefined','2023-10-30',50,1,0,NULL,NULL,'admin'),(32,'1111as1sas','saqib19@gmail.com','sa','yo','null','female','2023-11-19',50,1,0,NULL,NULL,'admin');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `video_recordings`
--

DROP TABLE IF EXISTS `video_recordings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `video_recordings` (
  `video_id` int NOT NULL AUTO_INCREMENT,
  `video_rec_url` varchar(200) DEFAULT NULL,
  `user_id` int NOT NULL,
  `pool_id` int NOT NULL,
  `source_link` text,
  PRIMARY KEY (`video_id`),
  UNIQUE KEY `video_rec_url_UNIQUE` (`video_rec_url`),
  KEY `fk_user_id_idx` (`user_id`),
  KEY `fk_pool_id_idx` (`pool_id`),
  CONSTRAINT `fk_pool_id` FOREIGN KEY (`pool_id`) REFERENCES `pools` (`pool_id`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `video_recordings`
--

LOCK TABLES `video_recordings` WRITE;
/*!40000 ALTER TABLE `video_recordings` DISABLE KEYS */;
/*!40000 ALTER TABLE `video_recordings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-19 17:58:04
