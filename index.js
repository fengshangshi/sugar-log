/**
 * @file 日志类
 * @author ss.feng
 */
'use strict'

const stream = require('streamroller');
const moment = require('moment');
const util = require('util');
const os = require('os');

// 日志级别类
const Level = require('./libs/Level');

const type = require('./libs/type');
const defaultLevels = require('./libs/levels');

// 换行符
const EOL = os.EOL || '\n';

class Logger {
    // 构造函数
    constructor(options) {
        options = options || {};

        // 记录日志的文件路径
        let filename = options.filename || 'log';

        // 日期模式，会跟filename搭配
        // 日期采用date-format
        // yyyy-年 MM-月 dd-日 hh-时 mm-分 ss-秒 SSS-毫秒
        let pattern = options.pattern || '.yyyy-MM-dd';

        // 创建日志文件流对象
        this.roller = new stream.DateRollingFileStream(filename, pattern, {
            alwaysIncludePattern: true,
        });

        // merge自定义和默认日志级别
        let customLevels = options.customLevels || {};
        Object.keys(customLevels).forEach((level) => {
            defaultLevels[level.toUpperCase()] = new Level(
                customLevels[level], level.toUpperCase()
            );
        });

        this.levels = Object.keys(defaultLevels).sort((a, b) => {
            return defaultLevels[a].code - defaultLevels[b].code;
        });

        this.levels.forEach(this.__addLevelMethods);

        this.level = options.level || 'TRACE';
    }

    // 添加实例方法
    __addLevelMethods(level) {
        Logger.prototype[level.toLowerCase()] = function() {
            // 调用写入日志方法
            this.__log(level, Array.from(arguments));
        };
    }

    // 日志写入，Logger类的核心
    __log(level, data) {
        if (this.__isLevelEnabled(level)) {
            this.roller.write(this.__formatLogData(level, data) + EOL, 'utf8');
        }
    }

    // 是否为有效的日志级别
    __isLevelEnabled(level) {
        return this.level.isLessThanOrEqualTo(defaultLevels[level]);
    }

    // 格式化日志数据
    __formatLogData(level, data) {
        let template = '[%s] [%s] -';
        let logDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        let logData = util.format.apply(util, this.__wrapErrorsWithInspect(data));

        // 格式化数据
        return util.format(template, logDate, level, logData);
    }

    // 错误日志包装
    __wrapErrorsWithInspect(items) {
        return items.map((item) => {
            // 错误对象特殊处理
            if (type.isError(item) && item.stack) {
                let regex = new RegExp(EOL, 'g');
                return util.format(item.stack.replace(regex, ' '));
            }

            return item;
        });
    }

    log() {
        let args = Array.from(arguments);
        let levelAsString = args[0].toUpperCase();
        let level = defaultLevels[levelAsString] || defaultLevels.INFO;

        this.__log(level, args.slice(1));
    }

    set level(newValue) {
        let tempValue = newValue;

        if (type.isNumber(newValue)) {
            newValue = this.levels[newValue - 1];
        }

        if (defaultLevels[newValue]) {
            return this._level = defaultLevels[newValue];
        }

        // 异常设置提醒
        throw new Error('Log level ' + tempValue.toString() + ' is illegal');
    }

    get level() {
        return this._level;
    }

    set levels(newValue) {
        let tempValue = newValue;

        let passed = type.isArray(newValue) && newValue.every((value) => {
            return type.isString(value) && defaultLevels[value.toUpperCase()];
        });

        if (passed) {
            return this._levels = newValue;
        }

        // 异常设置提醒
        throw new Error('Log levels ' + tempValue.toString() + ' is illegal');
    }

    get levels() {
        return this._levels;
    }

}

module.exports = Logger;
