# webpack基本流程

- 准备阶段：主要创建`Compiler`和`Compilation`对象
  - `Compiler`：代表完整的配置环境。启动的时候被一次性建立，并配置好所有可操作性的设置，包括options，loader和plugin。插件将会接受到此对象的引用来访问配置环境。调用它的run方法可以开始一次完整的编译过程。
    - 常用的钩子
    - run：AsyncSeriesHook类型，在编译器开始读取记录之前执行
    - compile：SyncHook类型，在一次新的compilation创建之前执行
    - compilation：SyncHook类型，再一次compilation创建之后执行
    - make：AsyncSeriesHook类型，完成一次编译之前执行
    - emit：AsyncSeriesHook类型，在生成文件到output目录之前执行，回调参数：`Compilation`
    - afterEmit：AsyncSeriesHook类型，再生成文件到output目录之后执行
    - assetEmitted：AsyncSeriesHook类型，在生成文件的时候执行，提供访问产出文件信息的入口，回调函数参数：file   info
    - done：AsyncSeriesHook类型，一次编译完成之后执行，回电参数：stats
  - `Compilation`：代表了一次资源版本构建产物。代表当前的模块资源、编译生成资源、变化的文件、以及被跟踪的依赖的状态信息。插件注册的事件会接受它作为参数。如果多个插件协同工作需要注意配置的顺序。
- 编译阶段：完成modules解析，并生成chunks
- module解析：创建实例、loaders应用和依赖收集
- chunks生成：找到每个chunk所需要的modules
- 产出阶段：根据chunks生成最终的文件
  - 模板hash更新、模板渲染chunk、生成文件

## webpack打包bundle原理

bundle文件就是一个自执行的函数，参数是一个对象，入口模块为key，value就是一个函数有两个参数module和exports，内部为对应被处理过后的代码（被eval执行解析）。
自执行的函数部分通过modules形参接受参数

## 实现一个简版webpack

- 接受一份配置（webpack.config.js）
- 分析出入口模块位置
  - 读取入口模块的内容，解析内容
    - 区分源码和依赖
    - 递归调用处理依赖
- 拿到对象形式的数据结构
  - 模块路径
  - 处理好的内容
- 创建bundle.js
  - 启动器函数，来补充代码里有可能出现的的module exports require，让浏览器能够顺利的执⾏

## [简单的实现](https://github.com/zxlfly/webpack_share/tree/main/my-webpack)