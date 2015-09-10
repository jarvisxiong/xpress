/*
Navicat MySQL Data Transfer

Source Server         : locahost
Source Server Version : 50515
Source Host           : localhost:3306
Source Database       : nokia_xpress

Target Server Type    : MYSQL
Target Server Version : 50515
File Encoding         : 65001

Date: 2013-08-06 09:41:07
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `xpress_news`
-- ----------------------------
DROP TABLE IF EXISTS `xpress_news`;
CREATE TABLE `xpress_news` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '新闻的标识id',
  `rss_id` bigint(20) NOT NULL COMMENT '外键关联rss表的rss_id',
  `source_news_id` bigint(20) DEFAULT NULL COMMENT 'rss的url返回新闻数据中的id',
  `title` varchar(128) NOT NULL COMMENT '新闻标题',
  `link` varchar(1024) NOT NULL COMMENT '新闻链接',
  `image` varchar(1024) DEFAULT NULL COMMENT '新闻图片链接',
  `image_width` int(11) DEFAULT NULL COMMENT '图片的宽度',
  `image_height` int(11) DEFAULT NULL COMMENT '图片的高度',
  `summary` text COMMENT '摘要',
  `pub_date` datetime NOT NULL COMMENT '发布日期',
  `create_date` datetime DEFAULT NULL COMMENT '添加的日期',
  `modify_date` datetime DEFAULT NULL COMMENT '最后修改日期',
  `enable` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否可用',
  `description` varchar(128) DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`id`),
  KEY `FK_NEWS_RSS_ID` (`rss_id`) USING BTREE,
  KEY `INDEX_PUB_DATE` (`pub_date`) USING BTREE,
  KEY `INDEX_RSS_ID` (`rss_id`) USING BTREE,
  CONSTRAINT `fk_news_rss_id` FOREIGN KEY (`rss_id`) REFERENCES `xpress_rss` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xpress_news
-- ----------------------------

-- ----------------------------
-- Table structure for `xpress_news_layout`
-- ----------------------------
DROP TABLE IF EXISTS `xpress_news_layout`;
CREATE TABLE `xpress_news_layout` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '页面分类排版的标识id',
  `device_id` bigint(20) NOT NULL COMMENT '外键关联device表的id',
  `position_index` int(11) NOT NULL COMMENT '位置编号',
  `rss_id` bigint(20) NOT NULL COMMENT '外键关联rss表的id',
  `create_date` datetime DEFAULT NULL COMMENT '添加的时间',
  `modify_date` datetime DEFAULT NULL COMMENT '最后修改时间',
  `enable` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否可用',
  `description` varchar(128) DEFAULT NULL COMMENT '描述信息',
  PRIMARY KEY (`id`),
  KEY `fk_news_layout_device` (`device_id`),
  KEY `fk_news_layout_rss_id` (`rss_id`),
  CONSTRAINT `fk_news_layout_device` FOREIGN KEY (`device_id`) REFERENCES `xpress_device` (`id`),
  CONSTRAINT `fk_news_layout_rss_id` FOREIGN KEY (`rss_id`) REFERENCES `xpress_rss` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xpress_news_layout
-- ----------------------------
INSERT INTO `xpress_news_layout` VALUES ('1', '0', '1', '5', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `xpress_news_layout` VALUES ('2', '0', '2', '7', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `xpress_news_layout` VALUES ('3', '1', '1', '5', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `xpress_news_layout` VALUES ('4', '1', '2', '7', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `xpress_news_layout` VALUES ('5', '2', '1', '5', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `xpress_news_layout` VALUES ('6', '2', '2', '7', '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);

-- ----------------------------
-- Table structure for `xpress_rss`
-- ----------------------------
DROP TABLE IF EXISTS `xpress_rss`;
CREATE TABLE `xpress_rss` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'rss的标识id',
  `parent_id` bigint(20) DEFAULT NULL COMMENT '父级rss的id',
  `path` varchar(128) DEFAULT NULL COMMENT 'id的路径，不包括自身id',
  `name` varchar(64) NOT NULL COMMENT 'rss的名称或分类',
  `link` varchar(1024) DEFAULT NULL COMMENT 'rss的链接',
  `all_click_num` bigint NOT NULL DEFAULT 0 COMMENT '该分类下新闻的总点击次数',
  `create_date` datetime DEFAULT NULL COMMENT '添加的时间',
  `modify_date` datetime DEFAULT NULL COMMENT '最后修改时间',
  `enable` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否可用',
  `description` varchar(128) DEFAULT NULL COMMENT '描述信息',
  PRIMARY KEY (`id`),
  KEY `FK_RSS_PARENT_ID` (`parent_id`) USING BTREE,
  KEY `INDEX_PATH` (`path`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xpress_rss
-- ----------------------------
INSERT INTO `xpress_rss` VALUES ('1', null, null, '新浪', null, 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', 'RSS供应商，新浪');
-- INSERT INTO `xpress_rss` VALUES ('2', null, null, '搜狐', null, 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', 'RSS供应商，搜狐');
-- INSERT INTO `xpress_rss` VALUES ('3', null, null, '凤凰', 'http://api.3g.ifeng.com/news/nokia_rss?sid=txjWXjYrZPS2pEBQk1CGxvJRCa3aQl&cate=news&ccid=6432&ch=rj_nkrsszx', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '0', 'RSS供应商，凤凰');
-- INSERT INTO `xpress_rss` VALUES ('4', null, null, '百度', null, 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', 'RSS供应商，百度');

INSERT INTO `xpress_rss` VALUES ('5', '1', '1,', '今日热点', 'http://view.sina.com/api/partner/contents.php?wm=9026_0072&action=sinaview&channel=1006&skey=e8b542', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `xpress_rss` VALUES ('6', '1', '1,', '新闻', 'http://view.sina.com/api/partner/contents.php?wm=9026_0072&action=sinaview&channel=1426&skey=17e480', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `xpress_rss` VALUES ('7', '1', '1,', '财经', 'http://view.sina.com/api/partner/contents.php?wm=9026_0072&action=sinaview&channel=1447&skey=aa609e', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `xpress_rss` VALUES ('8', '1', '1,', '科技', 'http://view.sina.com/api/partner/contents.php?wm=9026_0072&action=sinaview&channel=1448&skey=e2ddeb', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `xpress_rss` VALUES ('9', '1', '1,', '美图', 'http://view.sina.com/api/partner/contents.php?wm=9026_0072&action=sinaview&channel=1632&skey=6a9f6f', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `xpress_rss` VALUES ('10', '1', '1,', '体育', 'http://view.sina.com/api/partner/contents.php?wm=9026_0072&action=sinaview&channel=1417&skey=0b1eee', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `xpress_rss` VALUES ('11', '1', '1,', '娱乐', 'http://view.sina.com/api/partner/contents.php?wm=9026_0072&action=sinaview&channel=60&skey=1b9b7e', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `xpress_rss` VALUES ('12', '1', '1,', '军事', 'http://view.sina.com/api/partner/contents.php?wm=9026_0072&action=sinaview&channel=1636&skey=0b4baf', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `xpress_rss` VALUES ('13', '1', '1,', '读书', 'http://view.sina.com/api/partner/contents.php?wm=9026_0072&action=sinaview&channel=1639&skey=43c094', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `xpress_rss` VALUES ('14', '1', '1,', '汽车', 'http://view.sina.com/api/partner/contents.php?wm=9026_0072&action=sinaview&channel=1640&skey=5c0497', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `xpress_rss` VALUES ('15', '1', '1,', '房产', 'http://view.sina.com/api/partner/contents.php?wm=9026_0072&action=sinaview&channel=1815&skey=a45b6f', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `xpress_rss` VALUES ('16', '1', '1,', '女性', 'http://view.sina.com/api/partner/contents.php?wm=9026_0072&action=sinaview&channel=1641&skey=f06670', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `xpress_rss` VALUES ('17', '1', '1,', '尚品', 'http://view.sina.com/api/partner/contents.php?wm=9026_0072&action=sinaview&channel=1469&skey=61ed60', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `xpress_rss` VALUES ('18', '1', '1,', '旅游', 'http://view.sina.com/api/partner/contents.php?wm=9026_0072&action=sinaview&channel=1590&skey=45c384', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `xpress_rss` VALUES ('19', '1', '1,', '教育', 'http://view.sina.com/api/partner/contents.php?wm=9026_0072&action=sinaview&channel=1814&skey=aa6dfe', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
INSERT INTO `xpress_rss` VALUES ('20', '1', '1,', '生活', 'http://view.sina.com/api/partner/contents.php?wm=9026_0072&action=sinaview&channel=1638&skey=3720ab', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);

-- INSERT INTO `xpress_rss` VALUES ('21', '2', '2,', '狐首', null, 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('22', '2', '2,', '新闻频道', null, 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('23', '2', '2,', '新闻-国内', null, 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '0', null);

-- INSERT INTO `xpress_rss` VALUES ('201', '21', '2,21,', '头条', 'http://api.m.sohu.com/rss/fragment/?ids=15084&count=3&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('202', '21', '2,21,', '焦点图', 'http://api.m.sohu.com/rss/fragment/?ids=1135&count=3&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('203', '21', '2,21,', '次头条', 'http://api.m.sohu.com/rss/fragment/?ids=21620&count=20&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('204', '21', '2,21,', '要闻', 'http://api.m.sohu.com/rss/fragment/?ids=1137&count=20&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('205', '21', '2,21,', '独家', 'http://api.m.sohu.com/rss/fragment/?ids=45324&count=4&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('206', '21', '2,21,', '娱乐', 'http://api.m.sohu.com/rss/fragment/?ids=1142&count=6&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('207', '21', '2,21,', '军事', 'http://api.m.sohu.com/rss/fragment/?ids=1150&count=6&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('208', '21', '2,21,', '女人', 'http://api.m.sohu.com/rss/fragment/?ids=1146&count=6&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('209', '21', '2,21,', 'IT', 'http://api.m.sohu.com/rss/fragment/?ids=1152&count=6&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('210', '21', '2,21,', '汽车', 'http://api.m.sohu.com/rss/fragment/?ids=12618&count=6&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('211', '21', '2,21,', '星座', 'http://api.m.sohu.com/rss/fragment/?ids=1148&count=3&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('212', '21', '2,21,', '笑话', 'http://api.m.sohu.com/rss/fragment/?ids=20818&count=3&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('213', '21', '2,21,', '社会', 'http://api.m.sohu.com/rss/fragment/?ids=1154&count=6&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('214', '21', '2,21,', '原创', 'http://api.m.sohu.com/rss/fragment/?ids=26941&count=6&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);

-- INSERT INTO `xpress_rss` VALUES ('215', '22', '2,22,', '焦点图', 'http://api.m.sohu.com/rss/fragment/?ids=532&count=3&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('216', '22', '2,22,', '头条', 'http://api.m.sohu.com/rss/fragment/?ids=15257&count=3&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('217', '22', '2,22,', '要闻', 'http://api.m.sohu.com/rss/fragment/?ids=1601&count=13&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('218', '22', '2,22,', '国内', 'http://api.m.sohu.com/rss/fragment/?ids=1444&count=6&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('219', '22', '2,22,', '社会', 'http://api.m.sohu.com/rss/fragment/?ids=1154&count=6&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('220', '22', '2,22,', '国际', 'http://api.m.sohu.com/rss/fragment/?ids=1447&count=6&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('221', '22', '2,22,', '军事', 'http://api.m.sohu.com/rss/fragment/?ids=1150&count=6&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('222', '22', '2,22,', '原创', 'http://api.m.sohu.com/rss/fragment/?ids=43582&count=7&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);
-- INSERT INTO `xpress_rss` VALUES ('223', '22', '2,22,', '图片', 'http://api.m.sohu.com/rss/fragment/?ids=24757,1638&count=5&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '1', null);

-- INSERT INTO `xpress_rss` VALUES ('224','23', '2,23,', '热文', 'http://api.m.sohu.com/api/rss/fragment/?ids=1444&count=6&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '0', null);
-- INSERT INTO `xpress_rss` VALUES ('225','23', '2,23,', '时事热点', 'http://api.m.sohu.com/api/rss/fragment/?ids=804&count=10&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '0', null);
-- INSERT INTO `xpress_rss` VALUES ('226','23', '2,23,', '港澳台', 'http://api.m.sohu.com/api/rss/fragment/?ids=808&count=10&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '0', null);
-- INSERT INTO `xpress_rss` VALUES ('227','23', '2,23,', '国内排行', 'http://api.m.sohu.com/api/rss/fragment/?ids=1801&count=10&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '0', null);
-- INSERT INTO `xpress_rss` VALUES ('228','23', '2,23,', '评论', 'http://api.m.sohu.com/api/rss/fragment/?ids=1801&count=10&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '0', null);
-- INSERT INTO `xpress_rss` VALUES ('229','23', '2,23,', '国内图片', 'http://api.m.sohu.com/api/rss/channel/176/?count=15&content_type=2&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '0', null);
-- INSERT INTO `xpress_rss` VALUES ('230','23', '2,23,', '滚动', 'http://api.m.sohu.com/api/rss/channel/175/?count=15&content_type=1&media=1&_trans_=000011_nokia_now', 0, '2013-06-06 18:00:00', '2013-06-06 18:00:00', '0', null);
