# svg-icon

我们项目中使用`unocss`，他官方提供了图标预设的能力，我们可以基于这个能力来实现。

## unocss 方案

**安装插件**：`pnpm add -D @unocss/preset-icons @iconify-json/[the-collection-you-want]`  
我们使用 Iconify 作为图标的数据源。你需要按照 @iconify-json/\* 模式在 devDependencies 中安装相应的图标集。  
例如，@iconify-json/mdi 对应 Material 设计图标，@iconify-json/tabler 对应 Tabler。你可以参考 [Icônes](https://icones.js.org/) 或 [Iconify](https://iconify.design/) 了解所有可用的集合。  
这里我们可以选择安装 element-plus 的图标集：`pnpm add -D @unocss/preset-icons @iconify-json/ep`

`uno.config.ts`

```TS
import presetIcons from '@unocss/preset-icons'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [
    // 会查找安装的图标依赖
    presetIcons({ /* options */ }),
    // ...other presets
  ],
})
```

**使用**

```HTML
<div style="width: 20px; height: 20px" i-ep:chrome-filled></div>
```

`i-`是默认的前缀，后面跟的是对应的图标。此时图标是以 URL 编码（URL-encoded） 的 内嵌 SVG 数据（Data URI）的形式渲染的。  
这种方式不够灵活，如果需要使用其他的图标库们，还需有手动下载。  
我们可以借助`@iconify/vue`来实现动态加载的方案，我们只需要知道需要的图标名，库帮我们自动加载。

## 自动加载

**安装** `pnpm add @iconify/vue -D`
这个库已经给我们封装好了 icon 组件，我们在这个组件的基础上封装一个 svg-icon 组件。需要注意，如果你在离线环境下开发，需要你手动下载对应的 icon。  
这个方案和`unocss` 的方案没有关联，可以两者都保留不冲突。

```vue
<template>
  <Icon
    :icon="name"
    :customClass="mergeClass"
    :style="customStyle"
    :animate="animate"
  />
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** 图标名（需带对应的前缀，如 "ep:home"） */
    name: string;
    /** 尺寸（支持数字/字符串，如 24、"24px"） */
    size?: number | string;
    /** 颜色（如 "#f00"、"text-red-500"） */
    color?: string;
    /** 额外类名 ,优先级低*/
    customClass?: string;
    /** 提示文本 */
    title?: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 图标动画 */
    animate?: "spin" | "pulse" | "bounce" | "flip" | "";
  }>(),
  {
    size: "",
    color: "",
    customClass: "",
    disabled: false,
    animate: "",
  }
);

// 合并类名：处理尺寸、禁用状态
const mergeClass = computed(() =>
  [
    // 尺寸类（若为数字，转成固定尺寸；若为字符串，直接使用）
    typeof props.size === "number" ? `w-${props.size} h-${props.size}` : "",
    // 禁用状态类
    props.disabled ? "opacity-50 cursor-not-allowed" : "",
    // 额外自定义类
    props.customClass,
  ]
    .filter(Boolean)
    .join(" ")
);

// 处理颜色样式
const customStyle = computed(() => ({
  color: props.color,
  // 若尺寸是字符串（如 "1.5em"），通过 style 控制（避免类名不生效）
  ...(typeof props.size === "string"
    ? { width: props.size, height: props.size }
    : {}),
}));
</script>
<style scoped lang="scss"></style>
```

## 本地 svg 资源兼容

我们平时开发中可能本地也有会相应的 `svg` 资源，也希望使用 `svg-icon` 组件进行展示。  
可以使用 `vite-plugin-svg-icons` 插件来实现。

**安装**：`pnpm add vite-plugin-svg-icons -D`  
**vite.config.ts 配置**

```ts
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";

export default () => {
  return {
    plugins: [
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        // 指定symbolId格式
        symbolId: "icon-[dir]-[name]",
        /**
         * 自定义插入位置
         * @default: body-last
         */
        inject: "body-first",
      }),
    ],
  };
};
```

**在 src/main.ts 内引入注册脚本**  
`import 'virtual:svg-icons-register'`  
在 types 文件夹下创建`vite-plugin-svg-icons.d.ts`文件用来声明类型,然后添加到`tsconfig.app.json`下的`include`属性中。

```ts
// Type declarations for vite-plugin-svg-icons virtual modules
declare module "virtual:svg-icons-register" {
  const content: string;
  export default content;
}
```

```JSON
{
    "extends": "@vue/tsconfig/tsconfig.dom.json",
    "compilerOptions": {
        "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
        "types": ["vite/client", "./types/autoImport/auto-imports.d.ts", "./types/components/components.d.ts", "element-plus/global"],

        /* Linting */
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "erasableSyntaxOnly": true,
        "noFallthroughCasesInSwitch": true,
        "noUncheckedSideEffectImports": true
    },
    "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue", "src/types/**/*.d.ts", "types/vite-plugin-svg-icons.d.ts"]
}
```

**完整组件代码**

```vue
<template>
  <Icon
    v-if="type === 'network'"
    :icon="name"
    :class="mergeClass"
    :style="customStyle"
    :animate="animate"
  />
  <svg
    v-else
    :class="['svg-icon', mergeClass]"
    :style="customStyle"
    aria-hidden="true"
  >
    <use :href="`#icon-${name}`" />
  </svg>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** 图标名（需带对应的前缀，如 "ep:home"） */
    name: string;
    /** 尺寸（支持数字/字符串，如 24、"24px"） */
    size?: number | string;
    /** 颜色（如 "#f00"、"text-red-500"） */
    color?: string;
    /** 额外类名 ,优先级低*/
    customClass?: string;
    /** 提示文本 */
    title?: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 图标动画 type:network 下有效 */
    animate?: "spin" | "pulse" | "bounce" | "flip" | "";
    /** network：使用的@iconify/vue组件   local：使用本地svg图标,该模式下除了size color 外其他的样式属性不生效 */
    type?: "local" | "network";
  }>(),
  {
    size: "",
    color: "",
    customClass: "",
    disabled: false,
    animate: "",
    type: "network",
  }
);

// 合并类名：禁用状态
const mergeClass = computed(() =>
  [
    // 尺寸类（若为数字，转成固定尺寸；若为字符串，直接使用）
    // typeof props.size === "number" ? `w-${props.size} h-${props.size}` : "",
    // 禁用状态类
    props.disabled ? "opacity-50 cursor-not-allowed" : "",
    // 额外自定义类
    props.customClass,
  ]
    .filter(Boolean)
    .join(" ")
);
// 处理尺寸样式
const sizeStyle = computed(() => {
  if (!props.size) return {};
  return typeof props.size === "number"
    ? { width: `${props.size}px`, height: `${props.size}px` }
    : { width: props.size, height: props.size };
});
// 处理颜色样式
const customStyle = computed(() => ({
  // 如果你想优先用 props.color 就填 props.color，否则 undefined 让外部 class 生效
  color: props.color || undefined,
  ...sizeStyle.value,
}));
</script>
<style scoped lang="scss">
/* 强制让内部路径使用 currentColor（覆盖掉很多硬编码） */
.svg-icon,
.svg-icon * {
  fill: currentColor !important;
  stroke: currentColor !important;
}
</style>
```

## 总结

根据实际需求选择对应的方案即可，尤其是你需要在离线环境开发的需要注意上面的问题。
