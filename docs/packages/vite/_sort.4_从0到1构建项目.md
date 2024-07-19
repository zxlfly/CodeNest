# 前端项目搭建流程

本示例只完成基础骨架搭建，[想查看完整搭建过程请参考本站中其他部分](/packages/engineering/%E5%BC%80%E5%A7%8B.html)  

## 初始化

本示例使用``vue3 + ts``搭建。

- 执行``pnpm create vite``  
- 命令行选择项：

```bash
PS C:\code> pnpm create vite  
√ Project name: ... demo
√ Select a framework: » Vue
√ Select a variant: » TypeScript

Scaffolding project in C:\code\05github\z-vue-admin\demo...

Done. Now run:

  cd demo
  pnpm install
  pnpm run dev
```

- 进入项目根目录，执行``pnpm install``
- 执行``pnpm run dev``启动项目，访问``http://localhost:5173/``即可看到效果。

## 源的设置

在安装初始化过程中，可能由于网络原因导致失败或者很慢，可以使用下镜像源。  
手动的管理源比较麻烦，在某些镜像源到期时也能更方便的切换管理。

### 源管理工具nrm

- 安装nrm：``npm install -g nrm``
- 查看可用源：``nrm ls``
- 切换源：``nrm use 源``
- 添加新的源：``nrm add 源``
- 删除源：``nrm del 源``

## 开发代码规范配置：[ESLint](https://eslint.org/)

ESLint 是一种用于识别和报告 ECMAScript/JavaScript 代码中发现的模式的工具，目的是使代码更加一致并避免错误。  
这里要说明下，在准备这篇文章的时候eslint刚好是迎来的大版本的更新，出现了比较多的变化，[eslint9以前版本的配置可以参考这个](https://github.com/zxlfly/Custom-project-configuration)。  
目前很多插件都还没有适配eslint9，这里的配置后续会不断的完善调整。

- 由于eslint的大版本更新，不再支持v18.18.0以下版本的node，本文章使用的版本是22.0.0
- 安装：``pnpm add eslint -D``
- 初始化配置：``npx eslint --init``
- 命令行选择项

```BASH
√ How would you like to use ESLint? · problems
√ What type of modules does your project use? · esm
√ Which framework does your project use? · vue
√ Does your project use TypeScript? · typescript
√ Where does your code run? · browser
The config that you've selected requires the following dependencies:

eslint@9.x, globals, @eslint/js, typescript-eslint, eslint-plugin-vue
√ Would you like to install them now? · No / Yes
√ Which package manager do you want to use? · pnpm
```

- 接着安装些vue3环境代码校验插件(可以参考vue官网文档搭建)
- 让所有与prettier规则存在冲突的Eslint rules失效，并使用prettier进行代码检查
  - ``eslint-config-prettier``
  - ``eslint-plugin-import``
  - ``eslint-plugin-node``
- 运行更漂亮的Eslint，使prettier规则优先级更高，Eslint优先级低
  - ``eslint-plugin-prettier``
  - vue.js的Eslint插件（查找vue语法错误，发现错误指令，查找违规风格指南
  - ``eslint-plugin-vue``
- 该解析器允许使用Eslint校验所有babel code
  - ``@babel/eslint-parser``
- ``pnpm install -D eslint-plugin-import eslint-plugin-vue eslint-plugin-prettier eslint-config-prettier eslint-plugin-node @babel/eslint-parser``
- ``package.json``中添加运行脚本：

```js
  "scripts": {
    "lint:eslint": "eslint src/**/*.{ts,vue} --cache --fix"
  },
```

### 配置文件

ESLint 配置文件可以采用以下任意一种命名：

- eslint.config.js
- eslint.config.mjs
- eslint.config.cjs

配置文件应该放在项目的根目录下，并且导出一个配置对象数组：

```JS
// eslint.config.js
export default [
    {
        rules: {
            semi: "error",
            "prefer-const": "error"
        }
    }
];
```

在此示例中，配置数组仅包含一个配置对象。配置对象启用两个规则：semi和prefer-const。这些规则适用于使用此配置文件的 ESLint 处理的所有文件。  
如果你的项目没有"type":"module"在其package.json文件中指定，那么eslint.config.js必须采用 CommonJS 格式，例如：

```JS
// eslint.config.js
module.exports = [
    {
        rules: {
            semi: "error",
            "prefer-const": "error"
        }
    }
];
```

### 配置对象

- `name`- 配置对象的名称。这用于错误消息和配置检查器，以帮助识别正在使用的配置对象。（[命名约定](https://eslint.org/docs/latest/use/configure/configuration-files#configuration-naming-conventions)）
- `files`- 指示配置对象应应用到的文件的 glob 模式数组。如果未指定，则配置对象将应用于与任何其他配置对象匹配的所有文件。
- `ignores`- 一个 glob 模式数组，指示配置对象不应应用到的文件。如果未指定，则配置对象将应用于 匹配的所有文件`files`。如果`ignores`在配置对象中使用 而没有任何其他键，则模式将充当[全局忽略](https://eslint.org/docs/latest/use/configure/configuration-files#globally-ignoring-files-with-ignores)。
- `languageOptions`- 包含与如何配置 JavaScript 进行 linting 相关的设置的对象。
  - `ecmaVersion`- 支持的 ECMAScript 版本。可以是任意年份（即`2022`）或版本（即`5`）。设置`"latest"`为 以获得最新支持的版本。（默认值：`"latest"`）
  - `sourceType`- JavaScript 源代码的类型。可能的值包括`"script"`传统脚本文件、`"module"`ECMAScript 模块 (ESM) 和`"commonjs"`CommonJS 文件。（默认值：`"module"`for`.js`和`.mjs`files；`"commonjs"`for `.cjs`files）
  - `globals`- 指定在 linting 期间应添加到全局范围的附加对象的对象。
  - `parser` - 包含 `parse()` 方法或 `parseForESLint()` 方法的对象。（默认值[espree](https://github.com/eslint/espree)）
  - `parserOptions` - 指定直接传递到解析器上的 `parse()` 或 `parseForESLint()` 方法的附加选项的对象。可用选项取决于解析器。
- `linterOptions`- 包含与 linting 过程相关的设置的对象。
  - `noInlineConfig`- 一个布尔值，指示是否允许内联配置。
  - `reportUnusedDisableDirectives`- 严重性字符串，指示是否以及如何跟踪和报告未使用的禁用和启用指令。为了与旧版本兼容，`true`相当于`"warn"`，`false`相当于`"off"`。（默认值：`"warn"`）。
- `processor` - 包含 `preprocess()` 和 `postprocess()` 方法的对象或指示插件内部处理器名称的字符串（即 `"pluginName/processorName"` ).
- `plugins`- 包含插件名称到插件对象的名称-值映射的对象。`files`指定后，这些插件仅适用于匹配的文件。
- `rules`- 包含已配置规则的对象。当指定`files`或`ignores`时，这些规则配置仅适用于匹配的文件。
- `settings`- 包含所有规则都应可用的信息的名称-值对的对象。

#### 严重程度

规则配置为运行什么级别的报告（如果有）。
ESLint 支持三种严重程度：

- `"off"`（`0`）：不运行该规则。
- `"warn"`（`1`）：运行规则，但不会根据其违规情况以非零状态代码退出（不包括[--max-warnings标志](https://eslint.org/docs/latest/use/command-line-interface#--max-warnings)）
- `"error"`( `2`)：运行规则，如果产生任何违规行为，则以非零状态代码退出

有关配置规则的文档，请参阅[配置规则](https://eslint.org/docs/latest/use/configure/rules)。

#### 临时适配方案

官方提供了一个 **@eslint/eslintrc**包，用于将现有的插件和预设转换为符合新版本规范的代码。本示例中不会使用这个方案。

### 最终的配置对象

```JS
import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"
import pluginVue from "eslint-plugin-vue"
import { includeIgnoreFile } from "@eslint/compat"
import path from "node:path"
import { fileURLToPath } from "node:url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, ".gitignore")
import configPrettier from "eslint-config-prettier"
import pluginPrettier from "eslint-plugin-prettier"
import eslintPluginImport from "eslint-plugin-import"
import eslintPluginNode from "eslint-plugin-node"
// import babelEslintParse from "@babel/eslint-parse"
// 不支持ESM
import pkg from "vue-eslint-parser"
const { parser: vueEslintparser } = pkg

export default [
    // 关联gitignore里面的配置
    includeIgnoreFile(gitignorePath),
    {
        ignores: ["build/**/*", "cache/**/*", "node_modules/**/*"],
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,vue}"],
        languageOptions: {
            globals: {
                ...globals.commonjs,
                ...globals.browser,
                ...globals.es2025,
                ...globals.node,
            },
            parser: vueEslintparser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                parser: "@typescript-eslint/parser",
                jsxPragma: "React",
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            prettier: pluginPrettier,
            import: eslintPluginImport,
            node: eslintPluginNode,
        },
        rules: {
            ...configPrettier.rules,
            ...pluginPrettier.configs.recommended.rules,
            /*
             * "off" 或 0    ==>  关闭规则
             * "warn" 或 1   ==>  打开的规则作为警告（不影响代码执行）
             * "error" 或 2  ==>  规则作为一个错误（代码不能执行，界面报错）
             */
            "prettier/prettier": "warn",
            // eslint（https://eslint.bootcss.com/docs/rules/）
            "no-var": "error", // 要求使用 let 或 const 而不是 var
            "no-multiple-empty-lines": ["warn", { max: 1 }], // 不允许多个空行
            "no-console":
                process.env.NODE_ENV === "production" ? "error" : "off",
            "no-debugger":
                process.env.NODE_ENV === "production" ? "error" : "off",
            "no-unexpected-multiline": "error", // 禁止空余的多行
            "no-useless-escape": "off", // 禁止不必要的转义字符

            // typeScript (https://typescript-eslint.io/rules)
            "@typescript-eslint/no-unused-vars": "error", // 禁止定义未使用的变量
            "@typescript-eslint/prefer-ts-expect-error": "error", // 禁止使用 @ts-ignore
            "@typescript-eslint/no-explicit-any": "off", // 禁止使用 any 类型
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-namespace": "off", // 禁止使用自定义 TypeScript 模块和命名空间。
            "@typescript-eslint/semi": "off",

            // eslint-plugin-vue (https://eslint.vuejs.org/rules/)
            "vue/multi-word-component-names": "off", // 要求组件名称始终为 “-” 链接的单词
            "vue/script-setup-uses-vars": "error", // 防止<script setup>使用的变量<template>被标记为未使用
            "vue/no-mutating-props": "off", // 不允许组件 prop的改变
            "vue/attribute-hyphenation": "off", // 对模板中的自定义组件强制执行属性命名样式
            // "vue/v-on-event-hyphenation": [
            //     "error",
            //     "never",
            //     { ignore: ["custom-event"] },
            // ],
            // "vue/v-on-event-hyphenation": "off",
            indent: [
                "error",
                4,
                {
                    ignoredNodes: ["ConditionalExpression", "SwitchCase"],
                },
            ],
            semi: "off",
        },
    },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs["flat/essential"],
    {
        files: ["**/*.vue"],
        languageOptions: { parserOptions: { parser: tseslint.parser } },
    },
]
```

## 开发代码规范配置：[prettier](https://prettier.io/docs/en/install.html)

Prettier 是一款功能强大的代码格式化程序。

- 安装：``pnpm install -D eslint-plugin-prettier prettier eslint-config-prettier``
- 创建配置文件.prettierrc.json

```json
{
    "singleQuote": false,
    "semi": false,
    "bracketSpacing": true,
    "htmlWhitespaceSensitivity": "ignore",
    "endOfLine": "auto",
    "trailingComma": "all",
    "tabWidth": 4,
    "useTabs": false
}
```

- 添加.prettierignore忽略文件

```bash
/dist/*
/html/*
.local
/node_modules/**
**/*.svg
**/*.sh
/public/*
```

- ``package.json``中添加运行脚本：

```js
  "scripts": {
    "format": "prettier --write \"./**/*.{html,vue,ts,js,json,md}\"",
  },
```

## 开发代码规范配置：[stylelint](https://stylelint.io/user-guide/get-started/)

用于检查 CSS 代码风格和错误的工具，也可以安装 vscode 插件配合使用

- 由于eslint的大版本更新，不再支持v18.18.0以下版本的node，本文章使用的版本是22.0.0
- 安装：``pnpm add  stylelint -D``
- 增加scss支持``pnpm add stylelint-scss stylelint-config-standard stylelint-config-standard-scss stylelint-config-recommended-vue -D``
- 如果需要也可以安装一些``postcss``相关插件，本示例中没有使用。
``pnpm add sass sass-loader stylelint postcss postcss-scss postcss-html stylelint-config-prettier stylelint-config-recess-order stylelint-config-recommended-scss stylelint-config-standard stylelint-config-standard-vue stylelint-scss stylelint-order stylelint-config-standard-scss -D``
- 如果项目中使用的原子化css的方案，不写css，stylelint就没有必要安装。
- 添加.stylelintrc.cjs配置文件

```js
// @see https://stylelint.bootcss.com/

module.exports = {
    extends: [
        "stylelint-config-standard", // 配置stylelint拓展插件
        // "stylelint-config-html/vue", // 配置 vue 中 template 样式格式化
        "stylelint-config-standard-scss", // 配置stylelint scss插件
        "stylelint-config-recommended-vue/scss", // 配置 vue 中 scss 样式格式化
        // "stylelint-config-recess-order", // 配置stylelint css属性书写顺序插件,
        // "stylelint-config-prettier", // 配置stylelint和prettier兼容
    ],
    plugins: ["stylelint-scss"],
    // overrides: [
    //     {
    //         files: ["**/*.(scss|css|vue|html)"],
    //         customSyntax: "postcss-scss",
    //     },
    //     {
    //         files: ["**/*.(html|vue)"],
    //         customSyntax: "postcss-html",
    //     },
    // ],
    ignoreFiles: [
        "**/*.js",
        "**/*.jsx",
        "**/*.tsx",
        "**/*.ts",
        "**/*.json",
        "**/*.md",
        "**/*.yaml",
        "index.html",
    ],
    /**
     * null  => 关闭该规则
     * always => 必须
     */
    rules: {
        "value-keyword-case": null, // 在 css 中使用 v-bind，不报错
        "no-descending-specificity": null, // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器
        "function-url-quotes": "always", // 要求或禁止 URL 的引号 "always(必须加上引号)"|"never(没有引号)"
        "no-empty-source": null, // 关闭禁止空源码
        "selector-class-pattern": null, // 关闭强制选择器类名的格式
        "property-no-unknown": null, // 禁止未知的属性(true 为不允许)
        //'block-opening-brace-space-before': 'always', //大括号之前必须有一个空格或不能有空白符
        "value-no-vendor-prefix": null, // 关闭 属性值前缀 --webkit-box
        "property-no-vendor-prefix": null, // 关闭 属性前缀 -webkit-mask
        "selector-pseudo-class-no-unknown": [
            // 不允许未知的选择器
            true,
            {
                ignorePseudoClasses: ["global", "v-deep", "deep"], // 忽略属性，修改element默认样式的时候能使用到
            },
        ],
        "scss/operator-no-newline-after": null,
    },
}
```

- 添加.stylelintignore忽略文件

```bash
/node_modules/*
/dist/*
/html/*
/public/*
```

- ``package.json``中添加运行脚本：

```js
"script":{
    "lint:css": "stylelint src/**/*.{vue,css,sass,scss} --cache --fix"
}
```

## 开发工具 vscode 配置

### .vscode/extensions.json插件相关

没有会提示现下载,根据自己实际使用情况配置。

```JSON
{
  "recommendations": [
  "Vue.volar",
  "Vue.vscode-typescript-vue-plugin",
  "dbaeumer.vscode-eslint",
  "stylelint.vscode-stylelint",
  "EditorConfig.EditorConfig"
  ]
}
```

### .vscode/settings.json

除了安装 npm 包以外，还需要安装 vscode 对应的两个插件(eslint、prettier)，这样开发的时候配合使用更 方便！主要是针对于 eslint、stylelint、prettier 这些配置的统一。

```JSON
{
    "editor.codeActionsOnSave": {
        "source.fixAll": "explicit",
        "source.fixAll.eslint": "explicit",
        "source.fixAll.stylelint": "explicit"
    },
    "stylelint.validate": ["css", "less", "scss", "vue"],
    "eslint.probe": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact",
        "html",
        "vue",
        "markdown",
        "jsonc"
    ],
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact",
        "html",
        "vue",
        "markdown",
        "jsonc"
    ],
    "[markdown]": {
        "editor.formatOnSave": true
    },
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[vue]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[ts]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[less]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[scss]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "editor.fontSize": 16,
    "editor.cursorBlinking": "expand",
    "editor.mouseWheelZoom": true,
    "editor.formatOnPaste": true,
    "editor.formatOnType": true,
    "editor.guides.bracketPairs": true,
    "editor.acceptSuggestionOnEnter": "smart",
    "editor.suggestSelection": "first",
    "debug.showBreakpointsInOverviewRuler": true,
    "editor.formatOnSave": true,
    "prettier.useTabs": false,
    "window.zoomLevel": 1,
    "prettier.tabWidth": 4,
    "markdown.preview.breaks": true,
    "explorer.compactFolders": false,
    "liveServer.settings.donotShowInfoMsg": true,
    "diffEditor.ignoreTrimWhitespace": false
}
```

## 配置 [husky](https://typicode.github.io/husky/#/?id=manual)

在提交或推送时，自动化 检查提交信息、检查代码 和 运行测试。相关操作配置在对应的钩子中。

- 安装：``pnpm add --save-dev husky``
- 初始化husky设置``pnpm exec husky init``
- 执行成功后，会在项目根目录下生成一个.husky文件夹，里面有一个pre-commit文件。``package.json script``中添加如下``"prepare": "husky"``脚本
- 接着可以通过脚本``echo "npm test" > .husky/pre-commit``或者手动的方式添加钩子。配合``commitlint、lint-staged``自动完成一些我们设置在钩子中的操作。

### 钩子

- ``commit-msg``: 提交信息钩子
- ``pre-commit``: 提交前钩子
- ``pre-push`` : 推送前钩子 
 
### 如果执行钩子的时候出现了如下报错：

```bash
.husky/commit-msg: .husky/commit-msg: cannot execute binary file
husky - commit-msg script failed (code 126)
```

- 先检查下钩子文件的编码格式是不是``UTF-8``，如果不是的需要改成``UTF-8``。  
- 如果不行，那可能因为是``window``系统下，需要在``git bash``中执行``echo``命令。或者手动创建文件。  
- 如果手动创建也不行，那就复制一份husky初始化时自动创建的pre-commit文件，然后将其重命名为其他钩子的名称再使用。

## 配置 [commitlint](https://commitlint.js.org/#/)

- 安装：``pnpm add --save-dev @commitlint/{cli,config-conventional}``
  - 这个命令在``window``下可能会报错，需要分开安装``@commitlint/cli``和``@commitlint/config-conventional``
- 配置husky
  - 通过脚本``echo "pnpm dlx commitlint --edit \$1" > .husky/commit-msg``或者手动创建配置钩子
- 添加配置文件``commitlint.config.js``
  - 可以通过脚本创建``echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js``
  - 需要注意的是如果 package.json 中设置"type": "module"，那么需要将后缀改为 cjs

```JS
// feat: 一项新功能
// fix: 一个错误修复
// docs: 仅文档更改
// style: 不影响代码含义的更改（空白，格式，缺少分号等）
// refactor: 既不修正错误也不增加功能的代码更改（重构）
// perf: 改进性能的代码更改
// test: 添加缺失或更正现有测试
// build: 影响构建系统或外部依赖项的更改（gulp，npm 等）
// ci: 对 CI 配置文件和脚本的更改
// release：发布
// chore: 更改构建过程或辅助工具和库，例如文档生成
// revert: 回滚到上一个版本
const types = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'release', 'chore', 'revert'];

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-empty': [2, 'never'],
    'type-enum': [2, 'always', types],
    'scope-case': [0, 'always'],
    'subject-empty': [2, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [2, 'always', 88],
  },
};
```

### husky的commit-msg钩子

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

## 配置 [lint-staged](https://commitlint.js.org/#/)

针对暂存的 git 文件运行 linters，不要让 💩 进入你的代码库！ 最后在husky的commit-msg钩子中添加npx --no -- commitlint --edit $1即可，也可以在scripts中增加commitlint的命令，这里使用pnpm run commitlint

- 安装：``pnpm add -D lint-staged``
- 配置husky
  - 通过脚本``npx husky add .husky/pre-commit "npx lint-staged"``或者手动创建配置钩子
- ``package.json``中添加运行脚本：

```JS
// package.json中添加配置
"lint-staged": {
  "src/**/{*.vue,*.js,*.ts,*.jsx,*.tsx}": "eslint --fix",
  "src/**/{*.scss,*.css}": "stylelint --fix"
}
```

### husky的pre-commit钩子

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# npx --no-install lint-staged
```

## 关于打包兼容性的问题

vite相对来说需要手动配置的内容很少，如果有需求参考前面的[常见配置](/packages/vite/_sort.2_常见配置.html)，以及[官网](https://cn.vitejs.dev/)。  

### 简单例子

例如配置打包后js支持的版本,在vite.config.ts中添加如下配置：
vite默认可以支持到es2015，如果需要支持到更低版本，需要添加额外配置。

```bash
  build: {
    target: "es2015", 
  },
```
