# unocss

我们项目中已经安装了`scss`，一般是不推荐混合使用`unocs`的。这里我们还是安装[`unocss`](https://unocss.dev/)。

## 安装

`pnpm add -D unocss`

## vite.config.ts 配置

```TS
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
export default defineConfig({
  plugins: [
    UnoCSS(),
  ],
})
```

## 创建 uno.config.ts 文件

```TS
import { defineConfig } from 'unocss'
export default defineConfig({
  // ...UnoCSS options
})
```

## 将 virtual:uno.css 添加到你的主入口中

**main.ts**
`import 'virtual:uno.css'`

## 使用

默认我们可以将预设的样式类直接写在`class`中，也可以通过插件，将这些写在`style`中,以元素属性的实行设置。

安装插件：`pnpm add @unocss/transformer-directives @unocss/preset-attributify @unocss/preset-wind3 -D`

```TS
import { defineConfig } from "unocss"
import presetAttributify from "@unocss/preset-attributify"
import transformerDirectives from "@unocss/transformer-directives"
import presetWind3 from "@unocss/preset-wind3"
export default defineConfig({
    presets: [presetAttributify(), presetWind3()],
    transformers: [transformerDirectives()],
})
```

```VUE
<template>
<!-- style下面全是unocss样式，以属性的形式 -->
<p
    v-for="item in 200"
    :key="item"
    style="height: 40px; line-height: 40px; text-align: center"
    bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600"
    text="sm white"
    font="mono light"
    p="y-2 x-4"
    border="2 rounded blue-200"
    class="ttt"
>
    {{ item }}
</p>
</template>
<style>

.ttt {
    /* 以class属性的形式引入unocss样式 */
    @apply text-white;
}
</style>
```

## vscode 插件

可以搜索 unocss 插件安装，优化开发体验。
![vscode 设置](/md-images/unocss.png)

## 重构布局样式

到此我们可以使用 unocss 样式重构布局样式。
