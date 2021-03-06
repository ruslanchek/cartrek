# ************************************************************
# Sequel Pro SQL dump
# Версия 4004
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Адрес: 127.0.0.1 (MySQL 5.5.25)
# Схема: cartrek
# Время создания: 2013-04-16 18:34:26 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Дамп таблицы devices
# ------------------------------------------------------------

DROP TABLE IF EXISTS `devices`;

CREATE TABLE `devices` (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `imei` tinytext NOT NULL,
  `user_id` int(50) NOT NULL,
  `name` tinytext,
  `model` tinytext,
  `make` tinytext,
  `g_id` tinytext,
  `fleet_id` int(50) NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL,
  `color` varchar(6) NOT NULL,
  `hdop` decimal(3,1) DEFAULT NULL,
  `csq` tinyint(2) DEFAULT NULL,
  `journey` decimal(10,0) DEFAULT '0',
  `last_update` datetime DEFAULT NULL,
  `code` varchar(12) NOT NULL,
  `sort` tinyint(3) NOT NULL DEFAULT '0',
  `s_ip` int(10) unsigned DEFAULT '0',
  `d_ip` int(10) unsigned DEFAULT '0',
  `port` int(5) DEFAULT NULL,
  `params` tinytext,
  `current_geozones` tinytext,
  `sat_count` tinyint(2) DEFAULT NULL,
  `online` bit(1) DEFAULT b'0',
  `activated` int(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`,`imei`(2)) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;

INSERT INTO `devices` (`id`, `imei`, `user_id`, `name`, `model`, `make`, `g_id`, `fleet_id`, `active`, `color`, `hdop`, `csq`, `journey`, `last_update`, `code`, `sort`, `s_ip`, `d_ip`, `port`, `params`, `current_geozones`, `sat_count`, `online`, `activated`)
VALUES
	(1,'35923103953675',1,'Meitrack','S40','Volvo','е086ом199',1,1,'black',1.5,16,12595767,'2013-03-21 03:06:05','000000000001',2,NULL,3579284606,33970,'{\"ad\":[\"0000\",\"0000\",\"0000\",\"0000\",\"0000\",\"0000\",\"0000\",\"0000\"],\"state\":\"0000\",\"power_inp\":0}','',0,0,1),
	(2,'868204001577450',1,'Galileo','S40','Volvo','е086ом199',1,1,'green',0.8,16,NULL,'2013-02-07 17:07:04','000000000002',1,NULL,3579284168,58668,'{\"dev_temp\":16,\"power_inp\":0,\"power_bat\":3.303}','',9,0,1),
	(9,'',1,'Газель',NULL,'Газель','ао326199',0,1,'red',5.0,12,12323,'2012-06-28 15:29:04','',6,NULL,NULL,NULL,NULL,NULL,NULL,0,1),
	(10,'',1,'Бэха','M5','BMW','см665к50',1,0,'green',7.0,10,12455654,'2012-07-03 15:31:35','',3,NULL,NULL,NULL,NULL,NULL,NULL,0,1),
	(11,'',1,'Джип','Wrangler','Jeep','002D040199',1,0,'red',8.0,20,154454,'2012-07-15 15:37:29','',5,NULL,NULL,NULL,NULL,NULL,NULL,0,1),
	(12,'',1,'Бэха маленькая','325','BMW','в254сн77',1,0,'кув',2.0,33,121212,'2012-07-05 15:47:59','',4,NULL,NULL,NULL,NULL,NULL,NULL,0,1),
	(13,'',1,'Камаз',NULL,'Камаз','2405ок90',0,1,'purple',1.0,8,1854545,'2012-07-10 20:56:26','',7,NULL,NULL,NULL,NULL,NULL,NULL,0,1),
	(14,'xxxxxxxxxxxxx',1,'sdfdfdfs','wewe','AC','а123аа122',0,1,'',NULL,NULL,0,NULL,'000000000003',0,0,0,NULL,NULL,NULL,NULL,0,1);

/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;


# Дамп таблицы events
# ------------------------------------------------------------

DROP TABLE IF EXISTS `events`;

CREATE TABLE `events` (
  `id` bigint(50) NOT NULL AUTO_INCREMENT,
  `status` tinyint(1) NOT NULL,
  `message` tinytext NOT NULL,
  `user_id` bigint(50) NOT NULL,
  `datetime` datetime NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `type` tinyint(1) NOT NULL,
  `showed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id, active, type, showed` (`user_id`,`active`,`type`,`showed`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Дамп таблицы fleets
# ------------------------------------------------------------

DROP TABLE IF EXISTS `fleets`;

CREATE TABLE `fleets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` tinytext,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `fleets` WRITE;
/*!40000 ALTER TABLE `fleets` DISABLE KEYS */;

INSERT INTO `fleets` (`id`, `name`, `user_id`)
VALUES
	(1,'Легковые',1),
	(21,'32323',1),
	(22,'wewew22',1),
	(23,'23eee',1),
	(24,'sds33345f',1),
	(25,'asdasd',1),
	(26,'ssss',1),
	(27,'ssse2433',1),
	(28,'фывфыв',1);

/*!40000 ALTER TABLE `fleets` ENABLE KEYS */;
UNLOCK TABLES;


# Дамп таблицы geozones
# ------------------------------------------------------------

DROP TABLE IF EXISTS `geozones`;

CREATE TABLE `geozones` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` tinytext,
  `points` mediumtext,
  `user_id` int(11) DEFAULT NULL,
  `active` bit(1) DEFAULT b'0',
  `notify` tinyint(1) DEFAULT '0',
  `color` varchar(6) DEFAULT 'B81616',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `geozones` WRITE;
/*!40000 ALTER TABLE `geozones` DISABLE KEYS */;

INSERT INTO `geozones` (`id`, `name`, `points`, `user_id`, `active`, `notify`, `color`)
VALUES
	(3,'Горки-10','[[55.70757815494801,37.009592056274414],[55.70146033211486,37.00950622558594],[55.69599458952653,37.021908760070794],[55.69531736466462,37.02662944793701],[55.699211247401436,37.03139305114746],[55.7056437690587,37.034010887145996],[55.70789248361014,37.03564167022705],[55.70881127597016,37.021307945251465],[55.71263128621627,37.02019214630127],[55.713211508260954,37.01298236846924],[55.713332386768876,37.01070785522461]]',1,1,3,'b81616'),
	(4,'Рублевка','[[55.72014932919687,36.95972442626953],[55.71879570480289,36.97723388671875],[55.713380738067336,37.00572967529297],[55.71028613431717,37.01774597167969],[55.71318733251447,37.05585479736328],[55.72246971901109,37.085037231445305],[55.72111617504094,37.11559295654297],[55.73116995298137,37.14752197265624],[55.72981671057785,37.19078063964844],[55.743540280106686,37.22888946533203],[55.741414409152725,37.257041931152344],[55.74991719810888,37.276954650878906],[55.75242903116125,37.29755401611328],[55.75687264728658,37.323646545410156],[55.76826917386252,37.354202270507805],[55.777345379415216,37.35557556152344],[55.77753846721038,37.37995147705078],[55.75706583650404,37.41256713867187],[55.73812874442002,37.45445251464844],[55.726723408938405,37.45925903320312],[55.72130954133751,37.44312286376953],[55.73058999769508,37.432136535644524],[55.74296050860491,37.41256713867187],[55.755520295969504,37.37754821777343],[55.753781489660035,37.36106872558594],[55.744313295376024,37.33978271484375],[55.73754889251636,37.298583984375],[55.73580928511603,37.283477783203125],[55.73001003379312,37.274208068847656],[55.727496757324204,37.256011962890625],[55.72769009202728,37.23747253417969],[55.71976258415723,37.215843200683594],[55.71473455012692,37.199363708496094],[55.713960948980805,37.18391418457031],[55.71802218408533,37.15301513671875],[55.7091255947123,37.134132385253906],[55.70719128543102,37.101173400878906],[55.70370928740704,37.07267761230469],[55.696357383733535,37.05310821533203],[55.692293896284056,37.032508850097656],[55.6944224423874,37.01122283935546],[55.70254855244906,37.004356384277344],[55.7058372119569,36.993370056152344],[55.70815845204154,36.973114013671875],[55.709705868823804,36.95732116699219],[55.71164005362048,36.946678161621094]]',1,1,3,'b81616'),
	(6,'Работа','[[55.65940765502017,37.63873100280762],[55.6566477288567,37.63542652130127],[55.65517084634319,37.637529373168945],[55.65807613598871,37.6417350769043]]',1,1,3,'496b33'),
	(7,'Кутузик','[[55.72517666621405,37.43968963623047],[55.71550813595296,37.448272705078125],[55.72130954133751,37.46681213378906],[55.729236735188245,37.51899719238281],[55.73832202647351,37.55607604980469],[55.74044806588769,37.578392028808594],[55.741027874718164,37.58628845214844],[55.74740520331641,37.58628845214844],[55.75069008704379,37.581138610839844],[55.7487578359952,37.56328582763672],[55.7487578359952,37.546119689941406],[55.741414409152725,37.529296875],[55.736002578656034,37.488441467285156],[55.73310307504565,37.47333526611328]]',1,1,3,'b81616'),
	(8,'Лыткарино','[[55.601044657557956,37.88188934326172],[55.60094767700684,37.8947639465332],[55.60472974085067,37.9167366027832],[55.59338245533352,37.926692962646484],[55.56990158550945,37.941627502441406],[55.56621323089931,37.936649322509766],[55.56330112734033,37.9109001159668],[55.57116331152352,37.89459228515625],[55.57553051165722,37.88137435913086],[55.5838753654205,37.87485122680664],[55.58892023052692,37.867984771728516],[55.59503141001477,37.87261962890624],[55.600171823967,37.870731353759766],[55.601917471729415,37.87193298339844]]',1,1,0,'b81616'),
	(9,'Котельники','[[55.66286939254093,37.845325469970696],[55.668097730279555,37.85820007324219],[55.66984035430873,37.86386489868164],[55.664612249397486,37.87605285644531],[55.6596739533915,37.880859375],[55.65066722128281,37.857513427734375],[55.6544444902425,37.84309387207031]]',1,1,0,'b81616'),
	(10,'Мега Белая Дача','[[55.65938344598748,37.84099102020264],[55.66224000849122,37.84669876098633],[55.65914135483722,37.847900390625],[55.65761614616126,37.849016189575195],[55.656163511220726,37.84965991973877],[55.65560665353519,37.8493595123291],[55.6550739996417,37.850046157836914],[55.65175685549509,37.84785747528076],[55.65238640810793,37.84348011016846],[55.65149050326554,37.843008041381836],[55.64921432849796,37.837257385253906],[55.65013450018758,37.83472537994385],[55.65398445774197,37.83833026885986],[55.65546138501023,37.83914566040039],[55.6552676928051,37.84056186676025],[55.65705930913833,37.841506004333496],[55.65797929647423,37.84146308898926],[55.65831823372689,37.84017562866211]]',1,1,0,'9d1b1b'),
	(37,'САО','[[55.89995614406812,37.47161865234375],[55.83214387781303,37.39471435546875],[55.79819333412856,37.650146484375],[55.86144097132762,37.7215576171875],[55.907654593698666,37.6226806640625]]',1,1,0,'b81616');

/*!40000 ALTER TABLE `geozones` ENABLE KEYS */;
UNLOCK TABLES;


# Дамп таблицы geozones_to_devices
# ------------------------------------------------------------

DROP TABLE IF EXISTS `geozones_to_devices`;

CREATE TABLE `geozones_to_devices` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `device_id` int(11) DEFAULT NULL,
  `geozone_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `geozones_to_devices` WRITE;
/*!40000 ALTER TABLE `geozones_to_devices` DISABLE KEYS */;

INSERT INTO `geozones_to_devices` (`id`, `device_id`, `geozone_id`)
VALUES
	(1,1,3),
	(2,1,4),
	(3,1,5),
	(4,1,6),
	(5,1,7),
	(6,1,8),
	(10,2,8),
	(9,2,5),
	(11,2,7),
	(12,2,6),
	(13,2,4),
	(14,2,3);

/*!40000 ALTER TABLE `geozones_to_devices` ENABLE KEYS */;
UNLOCK TABLES;


# Дамп таблицы public_users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `public_users`;

CREATE TABLE `public_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip` int(10) unsigned NOT NULL DEFAULT '0',
  `active` tinyint(1) DEFAULT '0',
  `online` tinyint(1) NOT NULL DEFAULT '0',
  `subscriber` tinyint(1) DEFAULT '0',
  `login` varchar(30) NOT NULL,
  `password` varchar(32) NOT NULL,
  `hash` varchar(32) NOT NULL,
  `email` tinytext,
  `name` tinytext,
  `reg_date` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `last_activity` datetime DEFAULT NULL,
  `last_remember` datetime DEFAULT NULL,
  `remember_code` varchar(32) DEFAULT NULL,
  `vk_id` text,
  `fb_id` text,
  `publish` tinyint(1) DEFAULT NULL,
  `sort` int(11) DEFAULT NULL,
  `last` datetime DEFAULT NULL,
  `balance` decimal(12,2) DEFAULT NULL,
  `tariff_id` int(11) DEFAULT NULL,
  `discount` tinyint(3) DEFAULT NULL,
  `payed` tinyint(1) DEFAULT '0',
  `instant_pay_date` datetime DEFAULT NULL,
  `daily_pay_date` datetime DEFAULT NULL,
  `daily_pay_amount` decimal(12,2) DEFAULT NULL,
  `user_timezone` tinytext,
  `phones` text,
  `notify` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `vk_id` (`vk_id`(8))
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `public_users` WRITE;
/*!40000 ALTER TABLE `public_users` DISABLE KEYS */;

INSERT INTO `public_users` (`id`, `ip`, `active`, `online`, `subscriber`, `login`, `password`, `hash`, `email`, `name`, `reg_date`, `last_login`, `last_activity`, `last_remember`, `remember_code`, `vk_id`, `fb_id`, `publish`, `sort`, `last`, `balance`, `tariff_id`, `discount`, `payed`, `instant_pay_date`, `daily_pay_date`, `daily_pay_amount`, `user_timezone`, `phones`, `notify`)
VALUES
	(1,2130706433,1,1,0,'ruslanchek','1f32aa4c9a1d2ea010adcf2348166a04','81059e6089b62c8de89e1d166999f707','ruslanchek@me.com','ruslanchek','2013-01-03 17:51:23','2013-04-16 16:17:06','2013-04-16 22:34:24','2013-03-21 17:42:05','','865465','1832908562',NULL,NULL,NULL,9500.00,1,10,0,'2013-03-21 03:10:02','2013-03-25 00:00:00',100.00,'Europe/Moscow','[{\"phone\":\"9269604020\",\"confirmed\":true,\"code\":\"111\"}]',2),
	(2,1412659724,0,0,0,'ruslanchek_568084999','a057ba29f040ccaddfc69f5ee5e7005b','','ruslanchek@gmail.com','ruslanchek_568084999','2013-02-07 03:16:25','2013-02-07 03:16:26','2013-02-07 03:17:28','2013-02-07 03:17:46','619d401fa44f91bb2c8e66ff958e254c',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,'[]',1),
	(3,1045311331,0,0,0,'alena_butkeeva','','',NULL,'Alena Butkeeva','2013-03-24 14:02:30','2013-03-24 14:02:30','2013-03-24 14:22:53',NULL,NULL,NULL,'100001586234807',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,1);

/*!40000 ALTER TABLE `public_users` ENABLE KEYS */;
UNLOCK TABLES;


# Дамп таблицы tariffs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tariffs`;

CREATE TABLE `tariffs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `tariffs` WRITE;
/*!40000 ALTER TABLE `tariffs` DISABLE KEYS */;

INSERT INTO `tariffs` (`id`, `name`, `price`)
VALUES
	(1,'Простой',15.00);

/*!40000 ALTER TABLE `tariffs` ENABLE KEYS */;
UNLOCK TABLES;


# Дамп таблицы tracks
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tracks`;

CREATE TABLE `tracks` (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `device_id` mediumint(50) NOT NULL,
  `sat_status` tinyint(1) NOT NULL DEFAULT '1',
  `datetime` datetime NOT NULL,
  `lat` decimal(8,6) NOT NULL,
  `lon` decimal(8,6) NOT NULL,
  `speed` decimal(6,2) NOT NULL,
  `heading` smallint(4) NOT NULL,
  `altitude` smallint(11) NOT NULL,
  `csq` tinyint(2) NOT NULL,
  `hdop` decimal(3,1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `dev_id + datetime` (`device_id`,`datetime`) USING HASH
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `tracks` WRITE;
/*!40000 ALTER TABLE `tracks` DISABLE KEYS */;

INSERT INTO `tracks` (`id`, `device_id`, `sat_status`, `datetime`, `lat`, `lon`, `speed`, `heading`, `altitude`, `csq`, `hdop`)
VALUES
	(3,2,1,'2012-12-04 15:59:46',55.657104,37.639096,0.00,162,165,24,0.8);

/*!40000 ALTER TABLE `tracks` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
