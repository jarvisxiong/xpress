/*
Navicat MySQL Data Transfer

Source Server         : locahost
Source Server Version : 50515
Source Host           : localhost:3306
Source Database       : nokia_xpress

Target Server Type    : MYSQL
Target Server Version : 50515
File Encoding         : 65001

Date: 2013-08-06 10:09:10
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `qidian_book`
-- ----------------------------
DROP TABLE IF EXISTS `qidian_book`;
CREATE TABLE `qidian_book` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '对象唯一标识id',
  `type` int(11) NOT NULL COMMENT '资源供应商',
  `book_id` bigint(20) NOT NULL COMMENT '书籍的id，对应KEY',
  `cid` bigint(20) NOT NULL DEFAULT '0' COMMENT '分类cid',
  `name` varchar(128) NOT NULL COMMENT '书籍标题，对应TITLE',
  `book_url` varchar(1024) NOT NULL COMMENT '书的url，对应SHOWURL',
  `category_id` bigint(20) NOT NULL DEFAULT '0' COMMENT '月票榜请求的分类cid',
  `author_id` bigint(20) NOT NULL COMMENT '作者id，对应AUTHORID',
  `author_name` varchar(64) NOT NULL COMMENT '作者名称，对应AUTHORNAME',
  `author_url` varchar(1024) DEFAULT NULL COMMENT '作者空间页地址URL，对应AUTHORURL',
  `cover` varchar(1024) DEFAULT NULL COMMENT '封面图片的url，对应FACEURL',
  `image_width` int(11) DEFAULT NULL COMMENT '图片的宽度',
  `image_height` int(11) DEFAULT NULL COMMENT '图片的高度',
  `last_update_chapter_id` bigint(20) DEFAULT NULL COMMENT '最新章节id，对应LASTUPDATECHAPTERID',
  `last_update_chapter_name` varchar(128) DEFAULT NULL COMMENT '最新章节名称，对应LASTUPDATECHAPTERNAME',
  `vote_month` bigint(20) DEFAULT NULL COMMENT '月投票数，对应VOTEMONTH',
  `recommend`  bigint NOT NULL DEFAULT 0 COMMENT '书籍的推荐度',
  `act_status` text COMMENT '小说状态，连载中或已完结',
  `description` text COMMENT '小说简介，对应DESCRIPTION',
  `create_date` datetime DEFAULT NULL COMMENT '添加的时间',
  `modify_date` datetime DEFAULT NULL COMMENT '最后修改时间',
  `enable` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否可用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `INDEX_BOOKID_TYPE` (`book_id`,`type`) USING BTREE,
  KEY `INDEX_VOTE_MONTH` (`vote_month`),
  KEY `INDEX_MODIFY_DATE` (`modify_date`),
  KEY `FK_CID` (`cid`),
  CONSTRAINT `FK_CID` FOREIGN KEY (`cid`) REFERENCES `qidian_category` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of qidian_book
-- ----------------------------

-- ----------------------------
-- Table structure for `qidian_book_chapter`
-- ----------------------------
DROP TABLE IF EXISTS `qidian_book_chapter`;
CREATE TABLE `qidian_book_chapter` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '章节id',
  `type` int(11) NOT NULL COMMENT '章节的供应商',
  `book_id` bigint(20) NOT NULL COMMENT '书籍的id，对应KEY',
  `chapter_id` bigint(20) NOT NULL COMMENT '书籍章节的id，对应CHAPTERID',
  `name` varchar(128) NOT NULL COMMENT '章节标题，对应CHAPTERNAME',
  `url` varchar(1024) DEFAULT NULL COMMENT '章节阅读地址url，对应CHAPTERREADERURL',
  `bid` bigint(20) DEFAULT NULL COMMENT '书的id',
  `volume_id` bigint(20) DEFAULT NULL COMMENT '卷id，对应VOLUMEID',
  `volume_name` varchar(128) DEFAULT NULL COMMENT '卷名称，对应VOLUMENAME',
  `free` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否免费，对应FREE',
  `price` float NOT NULL DEFAULT '0' COMMENT '章节价格，对应PRICE',
  `content` mediumtext COMMENT '章节的内容',
  `create_date` datetime DEFAULT NULL COMMENT '添加的时间',
  `modify_date` datetime DEFAULT NULL COMMENT '最后修改时间',
  `enable` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否可用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `INDEX_CHAPTERID_TYPE` (`chapter_id`,`type`) USING BTREE,
  KEY `FK_BOOK_ID` (`bid`),
  CONSTRAINT `FK_BOOK_ID` FOREIGN KEY (`bid`) REFERENCES `qidian_book` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of qidian_book_chapter
-- ----------------------------

-- ----------------------------
-- Table structure for `qidian_category`
-- ----------------------------
DROP TABLE IF EXISTS `qidian_category`;
CREATE TABLE `qidian_category` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '对象唯一标识id',
  `type` int(11) NOT NULL COMMENT '资源供应商',
  `category_id` bigint(20) NOT NULL COMMENT '分类id',
  `name` varchar(255) NOT NULL COMMENT '书籍分类name',
  `description` text COMMENT '分类简介',
  `create_date` datetime DEFAULT NULL COMMENT '添加的时间',
  `modify_date` datetime DEFAULT NULL COMMENT '最后修改时间',
  `enable` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否可用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `INDEX_CATEGORYID_TYPE` (`category_id`,`type`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of qidian_category
-- ----------------------------
INSERT INTO `qidian_category` VALUES ('1', '1', '1', '玄幻奇幻', null, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1');
INSERT INTO `qidian_category` VALUES ('2', '1', '2', '武侠仙侠', null, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1');
INSERT INTO `qidian_category` VALUES ('3', '1', '3', '都市青春', null, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1');
INSERT INTO `qidian_category` VALUES ('4', '1', '4', '历史军事', null, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1');
INSERT INTO `qidian_category` VALUES ('5', '1', '5', '游戏竞技', null, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1');
INSERT INTO `qidian_category` VALUES ('6', '1', '6', '科幻灵异', null, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1');
INSERT INTO `qidian_category` VALUES ('7', '2', '1', '言情', null, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1');
INSERT INTO `qidian_category` VALUES ('8', '2', '12', '青春', null, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1');
INSERT INTO `qidian_category` VALUES ('9', '2', '13', '都市', null, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1');
INSERT INTO `qidian_category` VALUES ('10', '2', '14', '玄幻', null, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1');
INSERT INTO `qidian_category` VALUES ('11', '2', '15', '穿越', null, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1');
INSERT INTO `qidian_category` VALUES ('12', '2', '16', '官场', null, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1');
-- INSERT INTO `qidian_category` VALUES ('13', '2', '17', '视频', null, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1');

-- ----------------------------
-- Table structure for `qidian_last_read`
-- ----------------------------
DROP TABLE IF EXISTS `qidian_last_read`;
CREATE TABLE `qidian_last_read` (
  `id` varchar(32) NOT NULL COMMENT '用户唯一标识ID',
  `bid` bigint(20) NOT NULL COMMENT '书籍的ID',
  `chid` bigint(20) NOT NULL COMMENT '章节的ID',
  `create_date` datetime DEFAULT NULL COMMENT '添加的日期',
  `modify_date` datetime DEFAULT NULL COMMENT '最后更新日期',
  `enable` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否可用',
  PRIMARY KEY (`id`),
  KEY `INDEX_CHAPTERID` (`chid`),
  KEY `FK_LAST_READING_BOOK_ID` (`bid`),
  CONSTRAINT `FK_LAST_READING_BOOK_ID` FOREIGN KEY (`bid`) REFERENCES `qidian_book` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of qidian_last_read
-- ----------------------------

-- ----------------------------
-- Table structure for `qidian_layout`
-- ----------------------------
DROP TABLE IF EXISTS `qidian_layout`;
CREATE TABLE `qidian_layout` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '页面分类排版的标识id',
  `device_id` bigint(20) NOT NULL COMMENT '外键关联device表的id',
  `position_index` int(11) NOT NULL COMMENT '位置编号',
  `category_id` bigint(20) NOT NULL COMMENT '外键关联category表的id',
  `create_date` datetime DEFAULT NULL COMMENT '添加的时间',
  `modify_date` datetime DEFAULT NULL COMMENT '最后修改时间',
  `enable` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否可用',
  `description` varchar(128) DEFAULT NULL COMMENT '描述信息',
  PRIMARY KEY (`id`),
  KEY `fk_qidian_layout_device` (`device_id`),
  KEY `fk_qidian_layout_category_id` (`category_id`),
  CONSTRAINT `fk_qidian_layout_device` FOREIGN KEY (`device_id`) REFERENCES `xpress_device` (`id`),
  CONSTRAINT `fk_qidian_layout_category_id` FOREIGN KEY (`category_id`) REFERENCES `qidian_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of qidian_layout
-- ----------------------------
INSERT INTO `qidian_layout` VALUES ('1', '0', '1', '1', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `qidian_layout` VALUES ('2', '0', '2', '2', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `qidian_layout` VALUES ('3', '0', '3', '3', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `qidian_layout` VALUES ('4', '0', '4', '4', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `qidian_layout` VALUES ('5', '0', '5', '5', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `qidian_layout` VALUES ('6', '0', '6', '6', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `qidian_layout` VALUES ('7', '1', '1', '1', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `qidian_layout` VALUES ('8', '1', '2', '2', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `qidian_layout` VALUES ('9', '1', '3', '3', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `qidian_layout` VALUES ('10', '1', '4', '4', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `qidian_layout` VALUES ('11', '1', '5', '5', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `qidian_layout` VALUES ('12', '1', '6', '6', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `qidian_layout` VALUES ('13', '2', '1', '1', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `qidian_layout` VALUES ('14', '2', '2', '2', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `qidian_layout` VALUES ('15', '2', '3', '3', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `qidian_layout` VALUES ('16', '2', '4', '4', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `qidian_layout` VALUES ('17', '2', '5', '5', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `qidian_layout` VALUES ('18', '2', '6', '6', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
