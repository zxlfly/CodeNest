# 贡献指南
你好！我们很高兴你有兴趣参与进来。在提交你的贡献之前，请花点时间阅读以下指南：

## 快速上手
- 点击 GitHub 右上角的 Fork 按钮，将仓库 Fork 仓库到个人空间  
- 点Clone 个人空间项目到本地：``git clone https://github.com/zxlfly/CodeNest.git``  
    - 如果配置过[SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)推荐使用``git clone git@github.com:zxlfly/CodeNest.git``
- 点在 CodeNest 的根目录下运行``npm i``、``yarn``或者``pnpm i``, 安装 node 依赖  
- 点运行 ``npm run dev``、``yarn dev``或者``pnpm dev``，启动组件库网站  
- 使用浏览器访问
```bash
# zxlfly 为用户名，执行前请替换
git clone git@github.com:zxlfly/CodeNest.git
cd CodeNest
pnpm i
pnpm dev
```

## 参与贡献
- 点请确保你已经完成快速上手中的步骤，正常访问，并且本地打包预览正常
- 点创建新分支 ``git checkout -b username/feature1``，分支名字建议为``username/feat-xxx/username/fix-xxx``
- 点本地编码，需遵循 开发规范  遵循 Angular Commit Message Format 进行提交（不符合规范的提交将不会被合并）
- 在提交之前，建议本地配置好[GPG](https://docs.github.com/en/authentication/managing-commit-signature-verification)，可以在提交之前给Commit添加**GPG**签名
- 点提交到远程仓库，也就是 Fork 后的仓库，``git push origin branchName``
(可选) 同步上游仓库dev分支最新代码，``git pull upstream dev``
- 点打开上游仓库提交 PR
- 点仓库 Committer 进行 Code Review，并提出意见
- 点PR 发起人根据意见调整代码（一个分支发起了 PR 后，后续的 commit 会自动同步，不需要重新 PR）
- 点仓库管理员合并PR    
- 点贡献流程结束，感谢你的贡献

## 关于文档编辑
### 添加新的模块
1. 首先需要在``docs/index.md``中新增模块
    - 在features配置项中新增
    - icon使用svg，放在public/img中
2. 然后在``docs/.vitepress/config.js``配置文件中新增对应模块
    1. **nav**配置
        - 如果你需要调整nav中的路由配置，需要调用``getNav``方法，它接受两个参数
            - 生成的路由菜单对象
            - 需要显示在**nav**菜单中的模块，以数组的形式传递，里面的元素为对象形式，有两个key
                - dirName：模块对应的packages下的目录名称
                - menuName: **nav**中展示的名称，需要和**index.md**中的统一
        - ```javascript
            const navModelList = getNav(packagesData,[
                {dirName:'web',menuName:'web前端基础'},
                {dirName:'engineering',menuName:'工程化'},
                {dirName:'vue',menuName:'vue'},
                {dirName:'react',menuName:'react'},
                {dirName:'webgl',menuName:'webgl'},
                {dirName:'algorithm',menuName:'算法'},
            ]) 
            ```
    2. 不需要手动配置**sidebar**，会自动根据**packages**下的目录结构生成目录
3. 最后在packages新增对应模块的目录
    - 目录命名没有约束
    - md文件命名有两种方式
        - 固定格式
            - 以``_sort.1_``这种形式开头，其中数字越小排列的越靠前
            - 页面路由菜单默认过滤了固定格式部分的字符
        - 任意命名方式
            - 这种方式在排序匹配的时候，会默认在固定格式的后面，且以字符串比较的方式排序

### 编辑原有模块
- 如果只是修改原有的文章，可以直接找到对应的md文件修改即可
- 如果是新增内容，在对应的文件夹下新增md文件
<!-- - 如果是新增内容，在对应的文件夹下新增md文件，然后在sidebar配置项中找到对应的模块，在items中新增路由即可 -->

<!-- ### 添加新的模块
1. 首先需要再``docs/index.md``中新增模块，在features配置项中新增，icon使用svg，放在public/img中
2. 然后在``docs/.vitepress/config.js``配置文件中新增对应模块
    1. 在nav配置项中新增模块列表项
    2. 在sidebar配置项中以key:value的形式新增模块路由配置
        - 如果是**web前端基础**分类中的内容，除了上述的操作外，还需要在对应的**web**模块中添加路由
        - 欢迎分享更简单的配置方式
3. 最后在packages新增对应模块的目录

### 编辑原有模块
- 如果只是修改原有的文章，可以直接找到对应的md文件修改即可
- 如果是新增内容，在对应的文件夹下新增md文件，然后在sidebar配置项中找到对应的模块，在items中新增路由即可 -->
