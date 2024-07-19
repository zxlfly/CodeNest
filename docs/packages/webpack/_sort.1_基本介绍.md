# webpack

本文档以webpack5为基础版本。如果想查看webpack4，请移步[这里](https://github.com/zxlfly/webpack_share)。

## 基础介绍

本质上是一个JavaScript的静态模块打包器。处理应用程序的时候，会递归的构建依赖关系图，其中包含应用程序需要的每个模块，最后将这些模块打包成一个或多个bundle。是⼯程化、⾃动化思想在前端开发中的体现。

### entry 入口

- **单入口**有多种写法
  - 常见的就像默认配置那样直接是字符串
  - 还可以数组，可以多个文件打包成一个文件
  - 也可以是对象，key就是对应的打包之后的名
  - 上面的方式可以灵活组合使用
- **多入口**
  - 只能是对象形式用法和上面说的一样

### output 输出配置

filename可以使默认那样写死的`main.js`那输出的就是这个，但是如果是多页面入口的就不可以，需要一一对应打包出来，所以这时候需要使用webpack约定好的站位符`[name].js`，会自动识别key或者文件名作为名称，单入口也适用。publicPath可以给全局的资源拼接路径。path输出⽂件的存放路径，必须是绝对路径。
如果是作为库，需要配置output的library属性。
runtime：仅包含运行时，不包含编译器
common：cjs规范，用于webpack1  nodejs 规范加载模块是同步的，只有加载完成，才能执行后面的操作
amd： 允许异步加载模块，并且在加载完成后执行模块的代码。可以按需加载模块，并且在加载模块时并行执行其他任务，从而提升应用的性能。
esm：ES模块，用于webpack2+
umd: universal module defifinition，兼容cjs和amd，用于浏览器

### mode 模式

用来指定当前的构建环境

- **production**会压缩，为模块和chunk启用确定性的混淆名称，开启一些优化
- **development**未压缩的形式，为模块和chunk启用有效的名
- **none**不使用任何默认的优化选项

### loader

默认情况下，我们常用的文件webpack仅仅支持`.js .json`这两种，通过loader，可以让它解析其他类型的文件  
比如处理css文件需要安装`npm install --save-dev css-loader`,然后在配置文件中配置module选项

### plugin 插件

loader只要是让webpack识别更多的文件类型，而plugin是让其可以控制构建流程，从而执行一些特殊任务。webpack的功能补充，比如生成index.html关联打包之后的文件，打包的时候清除上一次的内容

### chunk

指代码块，一个chunk可能由多个模块组合而成，也用于合并代码与分割。和入口对应

### module

模块

### bundle

资源经过webpack流程解析编译之后最终输出的文件  
webpack打包出来的文件里面其实就是一个自执行的函数。参数是一个对象包含了入口和依赖的相关信息

- **一个bundle对应一个chunk**
- **一个chunk对应一个或多个module**

## 关于文件名输出hash的问题

用法`[name]-[hash:6]`名称后面接上即可，数字代表截取前多少位，因为hash很长

- 分三种**hash**、**chunkhash**、**contenthash**
- **hash**是影响整个工程环境
- **chunkhash**只是影响一个chunk下的模块
- **contenthash**只根据自身的内容是否发生改变而改变

## source-map

打包文件和源文件的映射，在webpack的配置文件中添加`devtool:"source-map"`即可（具体配置参数请查看文档）。
主要是为了开发时快速定位问题，线上代码也可以开启前端错误监控，快速定位问题。

## 多页面

需要自动生成entry和HtmlWebpackPlugin
示例中使用了**glob**来获取文件路径
