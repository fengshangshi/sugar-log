/**
 * @file 默认日志级别
 * @author ss.feng
 */
'use strict'

const Level = require('./Level');

module.exports = {
	TRACE: new Level(1000, 'TRACE'),
	DEBUG: new Level(2000, 'DEBUG'),
	INFO: new Level(3000, 'INFO'),
	WARN: new Level(4000, 'WARN'),
	ERROR: new Level(5000, 'ERROR'),
	FATAL: new Level(6000, 'FATAL'),
};
