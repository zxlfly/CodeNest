import { defineConfig } from "vitepress";
import path from "path";
import {
  readPackagesDir,
  handleNestedMenus,
  getNav,
  generateKeywords
} from "./use-init-sidebar.mjs";
const packagesRoot = path.join(__dirname, "../packages");
// 生成路由菜单结构
const packagesData = readPackagesDir(packagesRoot);
// 生成网站关键词，可以新增补充一些一级目录名称外的关键词
const keywords = generateKeywords(packagesData,[
  '八股文','web前端','面试', '学习','图形','轮子','动态大屏','动态表单','低代码平台','工程化','组件库','中后台管理系统','中后台管理系统框架','中后台管理框架'
]);
//   处理需要集中整合在一起的模块，如有多个可以多次调用
handleNestedMenus(packagesData, "web", [
  "html",
  "css",
  "javascript",
  "typescript",
]);
//   生成nav路由
const navModelList = getNav(packagesData, [
  { dirName: "web", menuName: "web前端基础" },
  { dirName: "interview", menuName: "面经分享" },
  { dirName: "engineering", menuName: "工程化" },
  { dirName: "vue", menuName: "vue" },
  { dirName: "react", menuName: "react" },
  { dirName: "webgl", menuName: "webgl" },
  { dirName: "algorithm", menuName: "算法" },
]);
//   console.log(navModelList);
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "累了就休息下吧",
  lang: "zh-cn",
  base: "/CodeNest/", // 项目的根路径
  ignoreDeadLinks: false, // 构建时会忽略md中的外链
  markdown: {
    // theme: 'material-palenight',//md主题
    lineNumbers: true, //md 加行号
  },
  lastUpdated: false, //显示最近更新时间
  appearance: true, //可以选择深浅主题
  head: [
    // 设置 描述 和 关键词
    [
      "meta",
      {
        name: "keywords",
        content:keywords,
      },
    ],
    [
      "meta",
      {
        name: "description",
        content: "一个学习分享的网站",
      },
    ],
    [
      "link",
      {
        rel: "shortcut icon",
        type: "image/x-icon",
        href: "./favicon.ico",
      },
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "https://avatars.githubusercontent.com/u/26324442?s=96&v=4",
    lastUpdatedText: "更新时间",
    outlineTitle: "目录",
    nav: [
      { text: "首页", link: "/" },
      { text: "参与进来", link: "/joinus" },
      {
        text: "模块列表",
        items: navModelList,
      },
    ],
    sidebar: packagesData,
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/zxlfly/CodeNest",
      },
    ],
    footer: {
      message: "创作不易请尊重他人劳动成果，未经允许禁止转载",
      copyright: "Copyright © 2024-present zxlfly",
    },
  },
});
