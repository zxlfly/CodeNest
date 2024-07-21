---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Code Nest"
  text: "一个学习分享的网站"
  # tagline: 模块列表：
  actions:
    - theme: brand
      text: 参与进来
      link: /joinus
    - theme: alt
      text: markdown示例
      link: /markdown-examples

features:
  - icon: { src:  /img/web-icon.svg  }
    title: web前端基本功
    details: 包含HTML、CSS、JavaScript、typescript、http等。
    link : /packages/web/
  - icon: { src:  /img/interview-icon.svg  }
    title: 面经分享
    details: 面经分享
    link: /packages/interview/
  - icon: { src:  /img/engineering.svg  }
    title: 工程化
    details: 通过使用各种工具和流程，对前端开发进行标准化、自动化和优化，以提高团队协作、代码质量和项目交付效率。
    link: /packages/engineering/开始.md
  - icon: { src:  /img/Vue.svg  }
    title: vue
    details: web前端主流的开发框架之一，由尤雨溪个人主导开发。
    link : /packages/vue/
  - icon: { src:  /img/react.svg  }
    title: react
    details: web前端主流的开发框架之一，由Facebook开发。
    link: /packages/react/
  - icon: { src:  /img/webgl.svg  }
    title: Webgl
    details: 基于JavaScript的图形库，用于在Web浏览器中实现3D图形渲染。
    link : /packages/webgl/_sort.1_基本介绍
  - icon: { src:  /img/suanfa.svg  }
    title: 算法
    details: 加深对编程语言和数据结构的理解，培养逻辑思维。
    link: /packages/algorithm/
  - icon: { src:  /img/dynamic-large-screen.svg  }
    title: 动态大屏
    details: 拖拉拽生成数据可视化页面，基于vue3打造。
    link: /packages/dynamic-large-screen/
  - icon: { src:  /img/low-code.svg  }
    title: 低代码平台
    details: 拖拉拽生成前端页面，基于react打造。
    link: /packages/low-code/
  - icon: { src:  /img/admin-framework.svg  }
    title: 中后台管理系统框架
    details: 从0到1搭建一个中后台框架，基于Vue3。
    link: /packages/admin-framework/_sort.1_基本介绍
  - icon: { src:  /img/mini-ui.svg  }
    title: 组件库搭建
    details: 从0到1搭建一个UI库。
    link: /packages/mini-ui/
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/26324442?s=96&v=4',
    name: 'zxlfly',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/zxlfly' },
    ]
  },
]
</script>
&nbsp;
# 参与的伙伴
<VPTeamMembers size="small" :members="members" />