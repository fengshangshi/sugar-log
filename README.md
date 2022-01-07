# sugar-log
sugar2.0框架的日志组件。

## 如何使用
### 初始化

```
var Logger = require('sugar-log');
var logger = new Logger({
	level: "WARN",
	filename: 'logs/app',
	pattern: '_yyyy-DD-mm.log',
	customLevels: {
		sugar: 1200,
	},
});
```
实例化也可以这样：

```
var logger = new Logger(); // 不传任何参数，默认值见下方进阶部分
```
### 使用，记录日志
```
logger.sugar('自定义日志记录');
logger.sugar('我是另外的一条日志记录，我也是通过sugar方法打印的');
```
日志记录如下：

```
[2017-04-21 15:13:03.210]	[f47a1d96f03fdd3ce5e4de262d5e49153a545257]	[SUGAR] - 自定义日志记录
[2017-04-21 15:13:03.210]	[f47a1d96f03fdd3ce5e4de262d5e49153a545257]	[SUGAR] - 我是另外的一条日志记录，我也是通过sugar方法打印的
```

## 进阶
### Logger实例化参数说明
* level - 默认：TRACE，最低日志级别，低于该级别的日志不会被记录
* customLevels - 自定义的日志级别对象，和默认日志级别会最终merge
* category - 默认：file 日志输出类别，file-输出到文件 terminal-输出到终端，设定为terminal，会忽略：filename、pattern等设置
* filename - 默认：/path/to/log 设置日志文件，包含路径，category为file时生效
* pattern - 默认: .yyyy-MM-dd，模式设置，和filename配合生成完整文件路径，category为file时生效

### logger可以用来记录日志的方法
推荐大家使用6个默认的日志记录方法：

```
logger.trace('我是trace'); // [2017-04-21 15:12:59.769]	[f47a1d96f03fdd3ce5e4de262d5e49153a545257]	[TRACE] 我是trace
logger.debug('我是debug'); // [2017-04-21 15:12:59.769]	[f47a1d96f03fdd3ce5e4de262d5e49153a545257]	[DEBUG] 我是debug
logger.info('我是info'); // [2017-04-21 15:12:59.769]	[f47a1d96f03fdd3ce5e4de262d5e49153a545257]	[INFO] 我是info
logger.warn('我是warn'); // [2017-04-21 15:12:59.769]	[f47a1d96f03fdd3ce5e4de262d5e49153a545257]	[WARN] 我是warn
logger.error('我是error'); // [2017-04-21 15:12:59.769]	[f47a1d96f03fdd3ce5e4de262d5e49153a545257]	[ERROR] 我是error
logger.fatal('我是fatal'); // [2017-04-21 15:12:59.769]	[f47a1d96f03fdd3ce5e4de262d5e49153a545257]	[FATAL] 我是fatal
```

### 日志格式
[日志打印的时间]\t[日志ID]\t[日志级别]\t-\t具体日志内容

具体日志内容，由开发者自己控制

### log(logLevel, logData)
如果不满足，还有个压箱底的方法log()，如下：

```
logger.log('error', '我是通过logger.log方法写入的日志'); // [2017-04-21 15:12:59.769]	[f47a1d96f03fdd3ce5e4de262d5e49153a545257]	[ERROR] 我是通过logger.log方法写入的日志
```
你可能会问：*我给log方法传入一个不存在的logLevel可不可以？*

答案是：可以的，但是level会被转化成**INFO**。你可以试试：

```
logger.log('hahahaha', '我希望可以打印出HAHAHAHA的日志');
// 日志如：[2017-04-21 15:12:59.769]	[f47a1d96f03fdd3ce5e4de262d5e49153a545257]	[INFO] 我希望可以打印出HAHAHAHA的日志
```

因为记录每条日志是最重要的，尽管你写错了日志级别。


## 再进阶


### 默认日志级别
级别从低到高排序如下：

1. TRACE - 追踪，程序执行一行，可以记录一行，相对来说日志会非常多
2. DEBUG - 调试，调试代码使用，帮助发现问题
3. INFO - 信息，输出你感兴趣或者重要的信息
4. WARN - 警告，不会影响程序崩溃或者异常的时候，可以用来提醒开发者
5. ERROR - 错误，比如接口异常，参数校验不通过等，但不至于让系统崩溃，但需要引起足够重视
6. FATAL - 致命错误，比如监听到进程被杀掉，足够导致系统崩溃时候，可以标记这类日志

### 自定义日志级别
```
{
	customLevels: {
		sugar: 1200,
		custom: 3333,
	}
}
```
sugar和custom叫做"level name", 1200和3333叫做"level code"，最终会被Logger内部生成Level {level: 'name', code: 'code'}的实例对象。

当然，我们希望可以使用更加有意义的名称。

### 实例化后，设置最低日志级别
例如：

```
var logger = new Logger(); // 这时候最低level为：TRACE
logger.level = "WARN"; // 将默认的最低level修改为：WARN，级别提高
// 或者也可以这样去设置
// logger.level = 4; // 通过数字也可以设置对应的日志级别，此处4对应WARN
```
你肯定会问：数字和字符串常量怎么表示对应的日志级别呢？如下：

* 1 - TRACE
* 2 - DEBUG
* 3 - INFO
* 4 - WARN
* 5 - ERROR
* 6 - FATAL

你可能还会问：那自定义的level会怎么样呢？自定义的会按照level.code排序的。



## 继续探索

### Level.code
默认定义的日志级别的code如下：

* TRACE: 1000
* DEBUG: 2000
* INFO: 3000
* WARN: 4000
* ERROR: 5000
* FATAL: 6000

所以自定义的level.code可以参考默认的进行调整，这样就会影响日志级别的数字化排序了。

### 格式化日志
我不知道日志是否可以格式化展示呢？还是需要我在logData里各种自己拼？

```
logger.info('[%s --> %s], [%s, %s]', new Date().getTime(), '我是好样的字符串', '我真的不知道要怎么弄这个格式化才好看'， '算了，不弄了，让开发者自己弄吧');
// 日志如下展示：
// [2017-04-21 17:44:41.245]	[f47a1d96f03fdd3ce5e4de262d5e49153a545257]	[INFO] - [Fri Apr 21 2017 17:44:41 GMT+0800 (CST) --> 我是好样的字符串], [我真的不知道要怎么弄这个格式化才好看, 算了，不弄了，让开发者自己弄吧]
```

你还可以：

```
logger.info('%j', {a: 1, b: 2}); //[2017-04-21 17:46:17.163]	[f47a1d96f03fdd3ce5e4de262d5e49153a545257]	[INFO] - {"a":1,"b":2}
```
你还可以：

```
logger.info('%d + %d%%', 2.22, 2.3); //[2017-04-21 17:49:28.153]	[f47a1d96f03fdd3ce5e4de262d5e49153a545257]	[INFO] - 2.22 + 2.3%
```
你还可以：

```
logger.info(new Error('throw error')); //[2022-01-07 15:13:05.385]	[f47a1d96f03fdd3ce5e4de262d5e49153a545257]	[INFO]	-	 Error: throw error^_^    at Object.<anonymous> (/Users/fengshangshi/Documents/Workspace/sugar/sugar-log/test.js:78:11)^_^    at Module._compile (internal/modules/cjs/loader.js:956:30)^_^    at Object.Module._extensions..js (internal/modules/cjs/loader.js:973:10)^_^    at Module.load (internal/modules/cjs/loader.js:812:32)^_^    at Function.Module._load (internal/modules/cjs/loader.js:724:14)^_^    at Function.Module.runMain (internal/modules/cjs/loader.js:1025:10)^_^    at internal/main/run_main_module.js:17:11
```

### 格式化总结

* %s - 字符串的占位符
* %d - 数字，整数或者浮点数
* %% - 百分号
* %j - JSON的字符串化

### 小秘密
* Error对象也可以直接传给logger[xxx]方法的，logger内部会做帮你字符串化。
* 其实格式化的功能是基于util.format，哈哈
