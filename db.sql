
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
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

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
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `noti_sent` int DEFAULT NULL,
  PRIMARY KEY (`pool_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `pools_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `video_recordings` (
  `video_id` int NOT NULL AUTO_INCREMENT,
  `video_rec_url` varchar(200) DEFAULT NULL,
  `user_id` int NOT NULL,
  `pool_id` int NOT NULL,
  PRIMARY KEY (`video_id`),
  UNIQUE KEY `video_rec_url_UNIQUE` (`video_rec_url`),
  KEY `fk_user_id_idx` (`user_id`),
  KEY `fk_pool_id_idx` (`pool_id`),
  CONSTRAINT `fk_pool_id` FOREIGN KEY (`pool_id`) REFERENCES `pools` (`pool_id`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

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
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `likes` (
  `user_id` int NOT NULL,
  `video_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`video_id`),
  KEY `fk_likes_video_id_idx` (`video_id`),
  CONSTRAINT `fk_likes_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_likes_video_id` FOREIGN KEY (`video_id`) REFERENCES `video_recordings` (`video_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `dislikes` (
  `user_id` int NOT NULL,
  `video_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`video_id`),
  KEY `fk_dislikes_video_id_idx` (`video_id`),
  CONSTRAINT `fk_dislikes_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_dislikes_video_id` FOREIGN KEY (`video_id`) REFERENCES `video_recordings` (`video_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

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
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci