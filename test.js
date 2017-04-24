/**
 * @file 测试代码，单元测试用
 * @author ss.feng
 */
'use strict'

// 引入日志框架
var Logger = require('./index');

// 实例化日志对象，
// 可以不传参数，系统会在当面文件同级目录下生成log.yyyy-MM-dd的日志文件
var log = new Logger();

// 其实等价于下面
// 可以传参数，只是都是默认值
var log1 = new Logger({
    filename: '', // 日志文件，默认为当前目录：path/to/log
    pattern: '', // 默认：yyyy-MM-dd 日期规则 yyyy-fullyear，如2017， yy-17 MM-月 dd-日 hh-小时 mm-分钟 ss-秒 SSS-毫秒
    customLevels: {}, // 自定义级别 {levelName: levelCode, } levelName-String类型，levelCode-Number类型，日志级别比较使用
    level: '', // 默认：1 最小日志级别，大于level的级别才会写入到日志文件中，必须大写字符或数字，对应关系：1-TRACE 2-DEBUG 3-INFO 4-WARN 5-ERROR 6-FATAL
});

// 最小日志级别，可以在实例化之后设置
log1.level = 'WARN'; // 必须大写
// 等价于
log1.level = 4;

log1.trace('trace');
log1.debug('debug');
log1.info('info');
log1.warn('warn');
log1.error('error');
log1.fatal('fatal');


// 下面是具有实际参数的例子，最终的日志保存:/path/to/logs/app_2017-04-21.log中
// 内部日志级别的code映射关系：TRACE: 1000 DEBUG: 2000 INFO: 3000 WARN: 4000 ERROR: 5000 FATAL: 6000
var log2 = new Logger({
    filename: 'logs/app/app',
    pattern: '_yyyy-MM-dd.log',
    customLevels: {
        shangshi: 1200, // 自定义级别, code的关系参考上面的注释，1200介于默认级别TRACE和DEBUG之间
        feng: 3300, // 自定义级别
    },
});

// log2的实例对象的内置日志级别为：['TRACE', 'SHANGSHI', 'DEBUG', 'INFO', 'FENG', 'WARN', 'ERROR', 'FATAL']
// 可以将log2.levels属性打印出来就看到

// 自定义日志级别的使用，跟默认日志级别使用无异，如下：
log2.shangshi('我是尚实， 我是自定义日志级别，你可以知道我怎么用了么');
log2.feng('我姓冯，我是自定义日志级别');
log2.error('[++%s++]', '我最终会被放在error方法的第一个参数里', '我会跟随在后面，但是我没有中括号和加号包裹');
log2.log('abc', '我就任性，我就写abc类型的log');
log2.info('[%s --> %s], [%s, %s]', new Date(), '我是好样的字符串', '我真的不知道要怎么弄这个格式化才好看', '算了，不弄了，让开发者自己弄吧');
log2.info('%j', {
    a: 1,
    b: 2
});
log2.info('%d + %d%%', 2.22, 2.3);
