/**
 * @file 日志级别类
 * @author ss.feng
 */
'use strict'

class Level {
	constructor(code, level) {
		this.code = code;
		this.level = level;
	}

	toString() {
		return this.level;
	}

	toValue() {
		return this.code;
	}

	isEqualTo(level) {
		return this.code === level.code;
	}

	isGreaterThanOrEqualTo(level) {
		return this.code >= level.code;
	}

	isLessThanOrEqualTo(level) {
		return this.code <= level.code;
	}
}

module.exports = Level;
