# min-vite

## 思路

- 由koa提供基础静态服务功能index.js
  - 处理浏览器各种加载请求
- 第一步实现支持es6模块
  - ``type module``
- 第二步实现支持第三方库
  - 需要将``import { createApp,h } from "vue"``中的``vue``改成``/@modules/vue``
  - 让浏览器发送正确请求获取资源
- 针对vue让其支持单文件模式
  - 针对sfc处理的时候js和template是分开处理的
  - 先处理js
- 对css文件的支持
  - 获取文件内容
  - 转换为js
    - 添加一个style标签

## [简单的实现](https://github.com/zxlfly/min-vite/blob/main/README.md)
