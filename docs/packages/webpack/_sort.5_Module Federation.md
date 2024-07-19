# Module Federation

使JavaScript应用得以在客户端或服务器上动态运行另一个 bundle的代码。而这个功能在一个叫ModuleFederationPlugin 插件实现的。  
多个独立的构建可以形成一个应用程序。这些独立的构建不会相互依赖，因此可以单独开发和部署它们。 这通常被称为微前端，但并不仅限于此。

## Remote 提供模块共享服务

被其他应用所使用的应用

## Host 获取共享的模块

引用了其他应用的应用

```js
new ModuleFederationPlugin({
  name: "app1",
  remotes: {
    app2: "app2@[app2Url]/remoteEntry.js",
  },
  shared: {react: {singleton: true}, "react-dom": {singleton: true}},
}),
const RemoteApp = React.lazy(() => import("app2/App"));

new ModuleFederationPlugin({
  name: 'app2',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App',
  },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
}),
```

配置属性：

- name，必须，唯一 ID，作为输出的模块名，使用的时通过 ${name}/${expose} 的方式使用；
- library，必须，其中这里的 name 为作为 umd 的 name；
- remotes，可选，表示作为 Host 时，去消费哪些 Remote；
- exposes，可选，表示作为 Remote 时，export 哪些属性被消费；
- shared，可选，优先用 Host 的依赖，如果 Host 没有，再用自己的;

## 示例:[跨应用模块共享](https://github.com/zxlfly/webpack_share/blob/main/ModuleFederation/README.md)

多个独立的构建可以组成一个应用程序，这些独立的构建之间不应该存在依赖关系，因此可以单独开发和部署它们。

### 底层概念

我们区分**本地模块**和**远程模块**。**本地模块**即为普通模块，是当前构建的一部分。**远程模块**不属于当前构建，并在运行时从所谓的容器加载。

- app1
  - 本地模块
- app2
  - 远程模块
