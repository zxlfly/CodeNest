# 中后台管理系统框架搭建

本系列文章会从0到1的搭建一个中后台管理系统，主要包含以下内容：

- 开发环境搭建
  - 参考vite中的[从0到1构建项目](/packages/vite/_sort.4_从0到1构建项目.html)
- Vue3全家桶安装
- vite配置
  - 抽离配置项
  - 配置别名
  - 自动导入
  - ...
- mock配置
  - 支持发布到线上
- axios封装
  - 请求拦截
  - 全局loading
  - 取消请求
- 配置路由
  - 根据文件生成路由配置对象
- 权限控制
  - 根据用户权限动态生成路由
  - 注册全局自定义指令，根据权限判断是否显示按钮
- 通用组件创建
  - svg-icon
- 页面刷新
- 全屏
- 面包屑导航
- tab页签
- 暗黑模式
- 主题配置
- 国际化

## 完整的示例代码

- github：[https://github.com/zxlfly/z-vue-admin](https://github.com/zxlfly/z-vue-admin)
