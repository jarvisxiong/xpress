/*
Navicat MySQL Data Transfer

Source Server         : locahost
Source Server Version : 50515
Source Host           : localhost:3306
Source Database       : nokia_xpress

Target Server Type    : MYSQL
Target Server Version : 50515
File Encoding         : 65001

Date: 2013-08-06 09:36:08
*/

-- DROP DATABASE IF EXISTS `nokia_xpress`;
-- CREATE DATABASE `nokia_xpress` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
-- mysql -uroot -proot nokia_xpress < /usr/local/nokia_xpress.sql

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `acct_authority`
-- ----------------------------
DROP TABLE IF EXISTS `acct_authority`;
CREATE TABLE `acct_authority` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '权限标识id',
  `name` varchar(64) NOT NULL COMMENT '权限名称',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of acct_authority
-- ----------------------------
INSERT INTO `acct_authority` VALUES ('1', 'ViewDevice');
INSERT INTO `acct_authority` VALUES ('2', 'EditDevice');
INSERT INTO `acct_authority` VALUES ('3', 'ViewNews');
INSERT INTO `acct_authority` VALUES ('4', 'EditNews');
INSERT INTO `acct_authority` VALUES ('5', 'ViewReading');
INSERT INTO `acct_authority` VALUES ('6', 'EditReading');
INSERT INTO `acct_authority` VALUES ('7', 'ViewVideo');
INSERT INTO `acct_authority` VALUES ('8', 'EditVideo');
INSERT INTO `acct_authority` VALUES ('9', 'ViewLog');
INSERT INTO `acct_authority` VALUES ('10', 'EditLog');
INSERT INTO `acct_authority` VALUES ('11', 'ViewAccount');
INSERT INTO `acct_authority` VALUES ('12', 'EditAccount');

-- ----------------------------
-- Table structure for `acct_role`
-- ----------------------------
DROP TABLE IF EXISTS `acct_role`;
CREATE TABLE `acct_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '角色标识id',
  `name` varchar(64) NOT NULL COMMENT '角色名称',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of acct_role
-- ----------------------------
INSERT INTO `acct_role` VALUES ('1', 'root');
INSERT INTO `acct_role` VALUES ('2', 'admin');
INSERT INTO `acct_role` VALUES ('3', 'Viewer');
INSERT INTO `acct_role` VALUES ('4', 'News Operator');
INSERT INTO `acct_role` VALUES ('5', 'Reading Operator');
INSERT INTO `acct_role` VALUES ('6', 'Video Operator');

-- ----------------------------
-- Table structure for `acct_role_authority`
-- ----------------------------
DROP TABLE IF EXISTS `acct_role_authority`;
CREATE TABLE `acct_role_authority` (
  `role_id` bigint(20) NOT NULL COMMENT '外键关联role表的id',
  `authority_id` bigint(20) NOT NULL COMMENT '外键关联authority表的id',
  KEY `fk_ra_role_id` (`role_id`),
  KEY `fk_ra_authority_id` (`authority_id`) USING BTREE,
  CONSTRAINT `fk_ra_role_id` FOREIGN KEY (`role_id`) REFERENCES `acct_role` (`id`),
  CONSTRAINT `fk_ra_authority_id` FOREIGN KEY (`authority_id`) REFERENCES `acct_authority` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of acct_role_authority
-- ----------------------------
INSERT INTO `acct_role_authority` VALUES ('1', '1');
INSERT INTO `acct_role_authority` VALUES ('1', '2');
INSERT INTO `acct_role_authority` VALUES ('1', '3');
INSERT INTO `acct_role_authority` VALUES ('1', '4');
INSERT INTO `acct_role_authority` VALUES ('1', '5');
INSERT INTO `acct_role_authority` VALUES ('1', '6');
INSERT INTO `acct_role_authority` VALUES ('1', '7');
INSERT INTO `acct_role_authority` VALUES ('1', '8');
INSERT INTO `acct_role_authority` VALUES ('1', '9');
INSERT INTO `acct_role_authority` VALUES ('1', '10');
INSERT INTO `acct_role_authority` VALUES ('1', '11');
INSERT INTO `acct_role_authority` VALUES ('1', '12');
INSERT INTO `acct_role_authority` VALUES ('2', '1');
INSERT INTO `acct_role_authority` VALUES ('2', '2');
INSERT INTO `acct_role_authority` VALUES ('2', '3');
INSERT INTO `acct_role_authority` VALUES ('2', '4');
INSERT INTO `acct_role_authority` VALUES ('2', '5');
INSERT INTO `acct_role_authority` VALUES ('2', '6');
-- INSERT INTO `acct_role_authority` VALUES ('2', '7');
-- INSERT INTO `acct_role_authority` VALUES ('2', '8');
INSERT INTO `acct_role_authority` VALUES ('2', '9');
INSERT INTO `acct_role_authority` VALUES ('2', '10');
INSERT INTO `acct_role_authority` VALUES ('2', '11');
INSERT INTO `acct_role_authority` VALUES ('2', '12');
INSERT INTO `acct_role_authority` VALUES ('3', '1');
INSERT INTO `acct_role_authority` VALUES ('3', '3');
INSERT INTO `acct_role_authority` VALUES ('3', '5');
-- INSERT INTO `acct_role_authority` VALUES ('3', '7');
INSERT INTO `acct_role_authority` VALUES ('3', '9');
INSERT INTO `acct_role_authority` VALUES ('3', '11');
INSERT INTO `acct_role_authority` VALUES ('4', '1');
INSERT INTO `acct_role_authority` VALUES ('4', '2');
INSERT INTO `acct_role_authority` VALUES ('4', '3');
INSERT INTO `acct_role_authority` VALUES ('4', '4');
INSERT INTO `acct_role_authority` VALUES ('4', '11');
INSERT INTO `acct_role_authority` VALUES ('5', '1');
INSERT INTO `acct_role_authority` VALUES ('5', '2');
INSERT INTO `acct_role_authority` VALUES ('5', '5');
INSERT INTO `acct_role_authority` VALUES ('5', '6');
INSERT INTO `acct_role_authority` VALUES ('5', '11');
INSERT INTO `acct_role_authority` VALUES ('6', '1');
-- INSERT INTO `acct_role_authority` VALUES ('6', '2');
INSERT INTO `acct_role_authority` VALUES ('6', '7');
INSERT INTO `acct_role_authority` VALUES ('6', '8');
INSERT INTO `acct_role_authority` VALUES ('6', '11');

-- ----------------------------
-- Table structure for `acct_user`
-- ----------------------------
DROP TABLE IF EXISTS `acct_user`;
CREATE TABLE `acct_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '用户标识id',
  `login_name` varchar(32) NOT NULL COMMENT '登录名',
  `password` varchar(32) NOT NULL COMMENT '登陆密码',
  `name` varchar(32) DEFAULT NULL COMMENT '姓名',
  `email` varchar(128) DEFAULT NULL COMMENT '邮箱',
  `create_date` datetime DEFAULT NULL COMMENT '创建的时间',
  `modify_date` datetime DEFAULT NULL COMMENT '最后修改时间',
  `enable` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否可用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `login_name` (`login_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of acct_user
-- ----------------------------
INSERT INTO `acct_user` VALUES ('1', 'root', 'root', 'super administrator', '', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1');
INSERT INTO `acct_user` VALUES ('2', 'admin', 'admin', 'administrator', '', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1');
INSERT INTO `acct_user` VALUES ('3', 'viewer', 'viewer', 'viewer', '', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1');
INSERT INTO `acct_user` VALUES ('4', 'news', 'news', '新闻', '', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1');
INSERT INTO `acct_user` VALUES ('5', 'reading', 'reading', '阅读', '', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1');
INSERT INTO `acct_user` VALUES ('6', 'video', 'video', '视频', '', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1');

-- ----------------------------
-- Table structure for `acct_user_role`
-- ----------------------------
DROP TABLE IF EXISTS `acct_user_role`;
CREATE TABLE `acct_user_role` (
  `user_id` bigint(20) NOT NULL COMMENT '外键关联user表的id',
  `role_id` bigint(20) NOT NULL COMMENT '外键关联role表的id',
  KEY `fk_ur_role_id` (`role_id`) USING BTREE,
  KEY `fk_ur_user_id` (`user_id`) USING BTREE,
  CONSTRAINT `fk_ur_user_id` FOREIGN KEY (`user_id`) REFERENCES `acct_user` (`id`),
  CONSTRAINT `fk_ur_role_id` FOREIGN KEY (`role_id`) REFERENCES `acct_role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of acct_user_role
-- ----------------------------
INSERT INTO `acct_user_role` VALUES ('1', '1');
INSERT INTO `acct_user_role` VALUES ('2', '2');
INSERT INTO `acct_user_role` VALUES ('3', '3');
INSERT INTO `acct_user_role` VALUES ('4', '4');
INSERT INTO `acct_user_role` VALUES ('5', '5');
INSERT INTO `acct_user_role` VALUES ('6', '6');

-- ----------------------------
-- Table structure for `xpress_device`
-- ----------------------------
DROP TABLE IF EXISTS `xpress_device`;
CREATE TABLE `xpress_device` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '设备的标识id',
  `ua` varchar(128) NOT NULL,
  `device_name` varchar(128) NOT NULL COMMENT '设备名称',
  `screen_width` int(11) NOT NULL COMMENT '屏幕分辨率宽度',
  `screen_height` int(11) NOT NULL COMMENT '屏幕分辨率高度',
  `show_setting` tinyint(1) DEFAULT '1' COMMENT '是否显示设置菜单',
  `setting_link` varchar(1024) DEFAULT NULL COMMENT '如果不显示设置菜单，设定跳转链接',
  `enable` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否可用',
  `create_date` datetime DEFAULT NULL COMMENT '添加的时间',
  `modify_date` datetime DEFAULT NULL COMMENT '最后修改时间',
  `description` varchar(128) DEFAULT NULL COMMENT '描述信息',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ua` (`ua`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xpress_device
-- ----------------------------
INSERT INTO `xpress_device` VALUES ('0', 'default', 'Default Model', '240', '320', '1', null, '1', '2013-06-06 18:00:00', '2013-06-06 18:00:00', null);
INSERT INTO `xpress_device` VALUES ('1', '501', 'Nokia Series40 501', '240', '320', '1', null, '1', '2013-06-06 18:00:00', '2013-06-06 18:00:00', null);
INSERT INTO `xpress_device` VALUES ('2', '501s', 'Nokia Series40 501s', '240', '320', '1', null, '1', '2013-06-06 18:00:00', '2013-06-06 18:00:00', null);

-- ----------------------------
-- Table structure for `xpress_keyword`
-- ----------------------------
DROP TABLE IF EXISTS `xpress_keyword`;
CREATE TABLE `xpress_keyword` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '关键字表的标识id',
  `type` int(11) NOT NULL COMMENT '分类，指定是新闻还是阅读的关键词',
  `keyword` varchar(64) NOT NULL COMMENT '关键词',
  `enable` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否可用',
  `create_date` datetime DEFAULT NULL COMMENT '添加的时间',
  `modify_date` datetime DEFAULT NULL COMMENT '最后修改时间',
  PRIMARY KEY (`id`),
  KEY `keyword_index` (`keyword`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xpress_keyword
-- ----------------------------

-- ----------------------------
-- Table structure for `xpress_advertisement`
-- ----------------------------
DROP TABLE IF EXISTS `xpress_advertisement`;
CREATE TABLE `xpress_advertisement` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '唯一标识id',
  `type` int(11) NOT NULL COMMENT '分类，指定是新闻还是阅读的关键词',
  `value` varchar(1024) NOT NULL COMMENT '具体的值',
  `link` varchar(1024) DEFAULT NULL COMMENT '链接',
  `enable` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否可用',
  `create_date` datetime DEFAULT NULL COMMENT '添加的日期',
  `modify_date` datetime DEFAULT NULL COMMENT '最后修改日期',
  `description` varchar(1024) DEFAULT NULL COMMENT '描述信息',
  PRIMARY KEY (`id`),
  KEY `INDEX_AD_TYPE` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xpress_advertisement
-- ----------------------------
INSERT INTO `xpress_advertisement` VALUES ('1', '1', '炫彩501 全新发布', 'http://wapgame.tom.com/portal/pb/news/news3.html', '1', '2013-06-06 18:00:00', '2013-06-06 18:00:00', 'Advertisement with link in webapp.');
INSERT INTO `xpress_advertisement` VALUES ('2', '1', '炫彩501 全新发布', 'http://wapgame.tom.com/portal/pb/news/news3.html', '1', '2013-06-06 18:00:00', '2013-06-06 18:00:00', 'Advertisement with link in webapp.');
INSERT INTO `xpress_advertisement` VALUES ('3', '1', '炫彩501 全新发布', 'http://wapgame.tom.com/portal/pb/news/news3.html', '1', '2013-06-06 18:00:00', '2013-06-06 18:00:00', 'Advertisement with link in webapp.');
INSERT INTO `xpress_advertisement` VALUES ('4', '2', '炫彩501 全新发布', 'http://wapgame.tom.com/portal/pb/news/news3.html', '1', '2013-06-06 18:00:00', '2013-06-06 18:00:00', 'Advertisement with link in webapp.');
INSERT INTO `xpress_advertisement` VALUES ('5', '2', '炫彩501 全新发布', 'http://wapgame.tom.com/portal/pb/news/news3.html', '1', '2013-06-06 18:00:00', '2013-06-06 18:00:00', 'Advertisement with link in webapp.');
INSERT INTO `xpress_advertisement` VALUES ('6', '2', '炫彩501 全新发布', 'http://wapgame.tom.com/portal/pb/news/news3.html', '1', '2013-06-06 18:00:00', '2013-06-06 18:00:00', 'Advertisement with link in webapp.');


-- ----------------------------
-- Table structure for `xpress_provider_config`
-- ----------------------------
DROP TABLE IF EXISTS `xpress_provider_config`;
CREATE TABLE `xpress_provider_config` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '唯一标识id',
  `type` int(11) NOT NULL COMMENT '分类，指定是新闻还是阅读的关键词',
  `device_id` bigint(20) NOT NULL COMMENT '外键关联device表的id',
  `value` varchar(1024) NOT NULL COMMENT '具体的值',
  `link` varchar(1024) DEFAULT NULL COMMENT '链接',
  `enable` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否可用',
  `create_date` datetime DEFAULT NULL COMMENT '添加的日期',
  `modify_date` datetime DEFAULT NULL COMMENT '最后修改日期',
  `description` varchar(1024) DEFAULT NULL COMMENT '描述信息',
  PRIMARY KEY (`id`),
  KEY `INDEX_AD_TYPE` (`type`),
  KEY `FK_PROVIDER_DEVICE` (`device_id`),
  CONSTRAINT `FK_PROVIDER_DEVICE` FOREIGN KEY (`device_id`) REFERENCES `xpress_device` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xpress_provider_config
-- ----------------------------
INSERT INTO `xpress_provider_config` VALUES ('1', '1', '1', '今日热点由新浪倾情提供', null, '1', '2013-06-06 18:00:00', '2013-06-06 18:00:00', null);
INSERT INTO `xpress_provider_config` VALUES ('2', '1', '2', '今日热点由新浪倾情提供', null, '1', '2013-06-06 18:00:00', '2013-06-06 18:00:00', null);
INSERT INTO `xpress_provider_config` VALUES ('3', '2', '1', '本应用所有内容由起点和书随行提供', null, '1', '2013-06-06 18:00:00', '2013-06-06 18:00:00', null);
INSERT INTO `xpress_provider_config` VALUES ('4', '2', '2', '本应用所有内容由起点和书随行提供', null, '1', '2013-06-06 18:00:00', '2013-06-06 18:00:00', null);


-- ----------------------------
-- Table structure for `xpress_log`
-- ----------------------------
DROP TABLE IF EXISTS `xpress_log`;
CREATE TABLE `xpress_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志对象唯一标识id',
  `user_id` bigint(20) NOT NULL COMMENT '操作者的用户id',
  `oper_date` datetime NOT NULL COMMENT '操作日期',
  `description` text COMMENT '操作描述信息',
  PRIMARY KEY (`id`),
  KEY `FK_USER_ID` (`user_id`),
  KEY `INDEX_OPER_DATE` (`oper_date`),
  CONSTRAINT `FK_USER_ID` FOREIGN KEY (`user_id`) REFERENCES `acct_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xpress_log
-- ----------------------------
