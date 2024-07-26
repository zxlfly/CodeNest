# Layout

在`src`目录下，新增`layout`文件夹，并在其中新增`index.vue`文件和`components`文件夹。  
然后再`app.vue`页面引入`layout`组件，并在模版中使用，这只是一个临时的展示方式，后续配置路由的时候会重新调整layout的使用方式。有利于新人上手。

## 布局风格

常见的布局风格有：

- 上下
- 上下，下里面分左右
- 左右，右里面分上下

我可以通过全局配置项预设初始默认值，并且后期可以通过页面配置项进行配置。  
**我们这里采用`上下，下里面分左右`的布局风格。不实现多种风格切换。**  
如果想实现也是比较容易得，需要结合css变量和全局配置对象控制即可。

## 页面布局

这里我们需要考虑到以后暗黑模式适配，以及左侧菜单的展开收起功能，所以需要使用**css变量**。  
我们可以先定义一些**css变量**，在全局配置对象中设置对应功能的默认值，用户可以在页面配置项中设置调整。  

### 页面主题代码

这里我们可以使用`div+css`的形式布局，也可以使用UI框架中自带的布局组件,这样在配置暗黑模式的时候就可以使用UI框架自带的暗黑模式。  
我们这里使用前者的方式。实际项目中更推荐后者，方便省事！

### css变量

在`src/assets`目录下，新增`style/common`文件夹，并在其中创建一个`reset.css`文件，里面是全局的重置样式。  
然后在`src/assets/style/common/variables.scss`文件中定义一些**css变量**，比如：

```bash
:root {
    --z-admin-layout-body-bg: #f5f5f5; // body背景颜色
    --z-admin-layout-page-bg: #f5f5f5; // layout背景颜色
    --z-admin-layout-header-height: 60px; // 顶部header高度
    --z-admin-layout-header-bg: #fff; // 顶部header背景颜色
    --z-admin-layout-header-box-shadow-color: #ccc; // 顶部header盒子阴影颜色
    --z-admin-layout-container-bg: #f5f5f5; // 顶部header背景颜色
    --z-admin-layout-slider-width: 260px; // 左侧菜单栏宽度
    --z-admin-layout-slider-bg: #fff; // 左侧菜单栏背景颜色
    --z-admin-layout-main-bg: #fff; // 中间内容展示区域背景颜色
    --z-admin-layout-footer-height: 40px; // 底部footer高度
    --z-admin-layout-footer-bg: #f5f5f5; // 底部footer背景颜色
    --z-admin-module-margin: 10px; // 模块边距
    --z-admin-content-margin: 5px; // 内容块边距
    --z-admin-element-margin: 2px; // 元素边距
}

```

### 主体代码

基础的布局代码，不涉及暗黑模式等功能。

```vue
<template>
    <div class="layout-page">
        <!-- 顶部导航 -->
        <div class="layout-header">header</div>
        <!-- 主体容器 -->
        <div class="layout-container">
            <!-- 左侧菜单 -->
            <div class="layout-slider">menu</div>
            <div class="layout-body">
                <!-- 内容展示区域 -->
                <el-scrollbar class="layout-main">
                    <div>
                        <p
                            v-for="item in 200"
                            :key="item"
                            style="
                                height: 40px;
                                line-height: 40px;
                                text-align: center;
                            "
                        >
                            {{ item }}
                        </p>
                    </div>
                </el-scrollbar>
                <!-- 底部 -->
                <div class="layout-footer">footer</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.layout-page {
    width: 100vw;
    height: 100vh;
    background: var(--z-admin-layout-page-bg);

    .layout-header {
        height: var(--z-admin-layout-header-height);
        background: var(--z-admin-layout-header-bg);
        box-shadow: 0 0 4px 2px #ccc;
        z-index: 1;
        position: sticky;
    }

    .layout-container {
        width: 100%;
        height: calc(100vh - var(--z-admin-layout-header-height));
        background: var(--z-admin-layout-container-bg);
        display: flex;

        .layout-slider {
            width: var(--z-admin-layout-slider-width);
            background: var(--z-admin-layout-slider-bg);
            flex-shrink: 0;
        }

        .layout-body {
            flex: 1;

            .layout-main {
                width: calc(100% - var(--z-admin-module-margin) * 2);
                height: calc(
                    100vh - var(--z-admin-layout-header-height) - var(
                            --z-admin-layout-footer-height
                        ) - var(--z-admin-module-margin) * 2
                );
                background: var(--z-admin-layout-main-bg);
                margin: var(--z-admin-module-margin);
            }

            .layout-footer {
                background: var(--z-admin-layout-footer-bg);
                height: var(--z-admin-layout-footer-height);
            }
        }
    }
}
</style>

```