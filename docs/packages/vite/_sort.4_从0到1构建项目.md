# 前端项目搭建流程

本示例只完成基础骨架搭建，[想查看完整搭建过程请参考本站中其他部分](/packages/engineering/%E5%BC%80%E5%A7%8B.html)

## 初始化

本示例使用`vue3 + ts`搭建。

- 执行`pnpm create vite`
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

- 进入项目根目录，执行`pnpm install`
- 执行`pnpm run dev`启动项目，访问`http://localhost:5173/`即可看到效果。

## 源的设置

在安装初始化过程中，可能由于网络原因导致失败或者很慢，可以使用下镜像源。  
手动的管理源比较麻烦，在某些镜像源到期时也能更方便的切换管理。

### 源管理工具 nrm

- 安装 nrm：`npm install -g nrm`
- 查看可用源：`nrm ls`
- 切换源：`nrm use 源`
- 添加新的源：`nrm add 源`
- 删除源：`nrm del 源`

## 开发代码规范配置：前言

如果没有很强的自定义要求，一般搭建项目可以使用第三方封装配置好的规则，然后针对自己项目需求调整下即可。例如：

- 官方推荐的: [create-vue](https://github.com/vuejs/create-vue)
- 第三方社区方案: [antfu/eslint-config](https://github.com/antfu/eslint-config)

## 开发代码规范配置：[ESLint](https://eslint.org/)

ESLint 是一种用于识别和报告 ECMAScript/JavaScript 代码中发现的模式的工具，目的是使代码更加一致并避免错误。

- eslint9 版本更新，不再支持 v18.18.0 以下版本的 node，本文章使用的版本是 v23.11.0
- 安装以及初始化配置：`npx eslint --init`
- 命令行选择项

```BASH
√ What do you want to lint? · javascript
√ How would you like to use ESLint? · problems
√ What type of modules does your project use? · esm
√ Which framework does your project use? · vue
√ Does your project use TypeScript? · No / Yes
√ Where does your code run? · browser, node
√ Which language do you want your configuration file be written in? · js
The config that you've selected requires the following dependencies:

eslint, @eslint/js, globals, typescript-eslint, eslint-plugin-vue
√ Would you like to install them now? · No / Yes
√ Which package manager do you want to use? · pnpm
```

目前 eslint 版本通过上面的初始化之后，会自动生成一个配置文件，且根据我们选择的`vue、ts`生成好对应的配置。  
我们只需要在`package.json`中添加运行脚本：

```js
  "scripts": {
    "lint:eslint": "eslint src/**/*.{js,ts,vue,html} --cache --quiet --fix",
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

在此示例中，配置数组仅包含一个配置对象。配置对象启用两个规则：semi 和 prefer-const。这些规则适用于使用此配置文件的 ESLint 处理的所有文件。  
如果你的项目没有"type":"module"在其 package.json 文件中指定，那么 eslint.config.js 必须采用 CommonJS 格式，例如：

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
- `"warn"`（`1`）：运行规则，但不会根据其违规情况以非零状态代码退出（不包括[--max-warnings 标志](https://eslint.org/docs/latest/use/command-line-interface#--max-warnings)）
- `"error"`( `2`)：运行规则，如果产生任何违规行为，则以非零状态代码退出

有关配置规则的文档，请参阅[配置规则](https://eslint.org/docs/latest/use/configure/rules)。

#### 临时适配方案

官方提供了一个 **@eslint/eslintrc**包，用于将现有的插件和预设转换为符合新版本规范的代码。本示例中不会使用这个方案。

### 最终的配置对象

这个配置对象主体是自动生成的，如果我们想针对`VUE`代码增加自定义配置，可以直接在最后一个`VUE`的配置对象中添加`rules`对象，如果是想针对全局所有校验文件添加自定义配置，则可以在这个数组末尾添加一个新的对象，里面添加`rules`对象即可。

```JS
import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import pluginVue from "eslint-plugin-vue"
import { defineConfig } from "eslint/config"
// 这个配置在后面的prettier中会讲到，这里先放一个完整版的
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
        },
    },
    tseslint.configs.recommended,
    pluginVue.configs["flat/essential"],
    {
        files: ["**/*.vue"],
        languageOptions: { parserOptions: { parser: tseslint.parser } },
    },
    eslintPluginPrettierRecommended,
])


```

### vscode eslint 插件配置

可以通过 vscode 的插件 eslint 插件来辅佐检查错误。这样就可以在编辑时，直观的看到问题。
![eslint 插件](/md-images/eslint.png)

## 开发代码规范配置：[prettier](https://prettier.io/docs/en/install.html)

Prettier 是一款功能强大的代码格式化程序。

- 安装：`pnpm install -D eslint-plugin-prettier prettier eslint-config-prettier`
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

- 添加.prettierignore 忽略文件

```bash
/dist/*
/html/*
.local
/node_modules/**
**/*.svg
**/*.sh
/public/*
```

- 处理 eslint 冲突问题
  当 eslint 和 prettier 冲突时，可以`eslint-plugin-prettier`插件来处理，让`eslint` 使用 `prettier` 的代码格式。需要调整 eslint 的配置文件,在数组末尾加入`prettier`配置。

```JS
import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import pluginVue from "eslint-plugin-vue"
import { defineConfig } from "eslint/config"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
        },
    },
    tseslint.configs.recommended,
    pluginVue.configs["flat/essential"],
    {
        files: ["**/*.vue"],
        languageOptions: { parserOptions: { parser: tseslint.parser } },
    },
    eslintPluginPrettierRecommended,
])

```

- `package.json`中添加运行脚本：
  根据你的项目需求，添加对应的文件类型！

```js
  "scripts": {
    "format": "prettier --write \"./**/*.{html,vue,ts,js,json}\""
  },
```

### vscode prettier 插件配置

配置 vscode prettier 插件，这样当保存文件时，就会自动格式化代码。
![prettier 插件](/md-images/prettier.png)

插件安装完成之后，还需要配置下 vscode，打开`首选项-设置样式`:
![vscode 设置](/md-images/vscode-prettier.png)

## 开发代码规范配置：[stylelint](https://stylelint.io/user-guide/get-started/)

用于检查 CSS 代码风格和错误的工具，也可以安装 vscode 插件配合使用。
如果项目中只是想要有格式化样式的需求，`prettier`就能满足覆盖。如果项目中使用的原子化 css 的方案，不写 css，`stylelint` 就没有必要安装。
这里默认使用 sass + vue

- 安装：`pnpm add sass stylelint-config-standard-scss postcss-html stylelint-config-recommended-vue stylelint-order -D`
  - `stylelint-config-standard-scss`
    - 插件继承与`stylelint-config-standard`
      - 如果不使用`scss`，则安装`stylelint-config-standard`
  - `stylelint-order` 样式顺序
  - `stylelint-config-recommended-vue`
    - 捆绑`postcss-html`
- 如果需要也可以安装一些`postcss`相关插件，本示例中没有使用。
- 添加 stylelint.config.mjs 配置文件

```js
/** @type {import("stylelint").Config} */
export default {
  extends: [
    "stylelint-config-standard-scss",
    "stylelint-config-recommended-vue",
  ],
  plugins: ["stylelint-order"],
  overrides: [
    {
      files: ["**/*.html"],
      customSyntax: "postcss-html", // 处理 HTML 内嵌 <style> 标签
    },
  ],
  rules: {
    "order/properties-alphabetical-order": true,
    "value-keyword-case": null, // 在 css 中使用 v-bind，不报错
    "no-descending-specificity": null, // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器
    "function-url-quotes": "always", // 要求或禁止 URL 的引号 "always(必须加上引号)"|"never(没有引号)"
    "no-empty-source": null, // 关闭禁止空源码
    "selector-class-pattern": null, // 关闭强制选择器类名的格式
    // "property-no-unknown": null, // 禁止未知的属性(true 为不允许)
    //'block-opening-brace-space-before': 'always', //大括号之前必须有一个空格或不能有空白符
    "value-no-vendor-prefix": null, // 关闭 属性值前缀 --webkit-box
    "property-no-vendor-prefix": null, // 关闭 属性前缀 -webkit-mask
    "selector-pseudo-class-no-unknown": [
      // 不允许未知的选择器
      true,
      {
        ignorePseudoClasses: ["global", "v-deep", "deep"], // 忽略属性，修改UI库默认样式的时候能使用到
      },
    ],
    "scss/operator-no-newline-after": true,
  },
};
```

- 添加.stylelintignore 忽略文件

```bash
/node_modules/*
/dist/*
/html/*
/public/*
```

- `package.json`中添加运行脚本：

```js
"script":{
    "lint:css": "stylelint src/**/*.{vue,css,scss,html} --cache --quiet --fix",
}
```

## 配置 [husky](https://typicode.github.io/husky/#/?id=manual)

在提交或推送时，自动化 检查提交信息、检查代码 和 运行测试。相关操作配置在对应的钩子中。

- 安装：`pnpm add --save-dev husky`
- 初始化 husky 设置`pnpm exec husky init`
- 执行成功后，会在项目根目录下生成一个.husky 文件夹，里面有一个 pre-commit 文件。`package.json script`中添加如下`"prepare": "husky"`脚本
- 接着可以通过脚本或者手动的方式添加钩子。配合`commitlint、lint-staged`自动完成一些我们设置在钩子中的操作。

```
@"
#!/usr/bin/env sh
pnpm dlx commitlint --edit $1
"@ > .husky/commit-msg
```

### 钩子

- `commit-msg`: 提交信息钩子
- `pre-commit`: 提交前钩子
- `pre-push` : 推送前钩子

### 如果执行钩子的时候出现了如下报错：

```bash
.husky/commit-msg: .husky/commit-msg: cannot execute binary file
husky - commit-msg script failed (code 126)
```

- 先检查下钩子文件的编码格式是不是`UTF-8`，如果不是的需要改成`UTF-8`。
- 如果不行，那可能因为是`window`系统下，需要在`git bash`中执行`echo`命令。或者手动创建文件。
  - **建议手动创建，命令的方式出现格式不正确的概率高**
- 如果手动创建也不行，那就复制一份 husky 初始化时自动创建的 pre-commit 文件，然后将其重命名为其他钩子的名称再使用。

## 配置 [commitlint](https://commitlint.js.org/#/)

- 安装：`pnpm add --save-dev @commitlint/{cli,config-conventional}`
  - 这个命令在`window`下可能会报错，需要分开安装`@commitlint/cli`和`@commitlint/config-conventional`
- 配置 husky
  - 通过脚本`echo "pnpm dlx commitlint --edit \$1" > .husky/commit-msg`或者手动创建配置钩子
- 添加配置文件`commitlint.config.js`
  - 可以通过脚本创建`echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js`
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

### husky 的 commit-msg 钩子

```bash
#!/usr/bin/env sh
pnpm dlx commitlint --edit $1
```

## 配置 [lint-staged](https://github.com/lint-staged/lint-staged/)

针对暂存的 git 文件运行 linters，不要让 💩 进入你的代码库！ 最后在 husky 的 commit-msg 钩子中添加 npx --no -- commitlint --edit $1 即可，也可以在 scripts 中增加 commitlint 的命令，这里使用 pnpm run commitlint

- 安装：`pnpm add -D lint-staged`
- 配置 husky
  - 通过脚本或者手动创建配置钩子

```
@"
#!/usr/bin/env sh
pnpm dlx lint-staged
"@ > .husky/pre-commit
```

- `package.json`中添加运行脚本：

```JS
// package.json中添加配置
"lint-staged": {
    "src/**/*.{vue,js,ts,html}": "pnpm lint:eslint",
    "src/**/*.{scss,css,html,vue}": "pnpm lint:css",
    "src/**/*.{js,ts,vue,html}": "pnpm format"
}
```

### husky 的 pre-commit 钩子

```bash
#!/usr/bin/env sh
pnpm dlx lint-staged
```

## 关于打包兼容性的问题

vite 相对来说需要手动配置的内容很少，如果有需求参考前面的[常见配置](/packages/vite/_sort.2_常见配置.html)，以及[官网](https://cn.vitejs.dev/)。

### 简单例子

例如配置打包后 js 支持的版本,在 vite.config.ts 中添加如下配置：
vite 默认可以支持到 es2015，如果需要支持到更低版本，需要添加额外配置。

```bash
  build: {
    target: "es2015",
  },
```

## 开发代码规范配置：vscode 配置

### 统一工作区工作区设置

下载安装`EditorConfig for VS Code`插件，用于统一工作区工作区设置，例如编码格式、缩进等等。
添加`.editorconfig`文件到项目根目录，并添加如下内容：

```ini
[workspace]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
```

### .vscode/extensions.json 插件相关

打开项目时编辑器会检查是否有安装这里面配置的插件，没有会提示现下载,根据自己实际使用情况配置。

```JSON
{
    "recommendations": [
        "Vue.volar",
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "editorconfig.editorconfig",
        "stylelint.vscode-stylelint"
    ]
}

```
