# mock配置

一般的我们只是在开发环境使用使用。虽然`vite-plugin-mock`最新3.x版本文档说支持生产模式，但是并不支持。如果需要使用需要降级到2.x版本。

## 安装

```bash
pnpm add vite-plugin-mock -D
```

安装发送请求的库：

```bash
pnpm add axios
```

**配置项**：

```js
{
    mockPath?: string;   //设置模拟数据的存储文件夹，如果watchFiles：true，将监视文件夹中的文件更改。 并实时同步到请求结果，如果 configPath 具有值，则无效
    ignore?: RegExp | ((fileName: string) => boolean); //读取文件时忽略指定格式的文件
    watchFiles?: boolean; //是否监视mockPath文件夹内文件的修改
    enabled?: boolean; //是否启用mock功能
    ignoreFiles?: string[];  //读取文件时忽略的文件
    configPath?: string; //设置模拟读取的数据条目。 当文件存在并且位于项目根目录中时，将首先读取并使用该文件。 配置文件返回一个数组
    logger?:boolean;  //是否在控制台显示请求日志
}

```

在`src`目录下创建`mock`文件夹，并在其中创建`user.ts`文件。后续我们模拟用户登录的接口会在这里面实现。

## 开发环境配置

可以在调试工具中看到请求。

### vite.config.ts 配置

```ts
import { UserConfigExport, ConfigEnv } from 'vite'

import { viteMockServe } from 'vite-plugin-mock'
import vue from '@vitejs/plugin-vue'

export default ({ command }: ConfigEnv): UserConfigExport => {
  return {
    plugins: [
      vue(),
      viteMockServe({
        mockPath: 'src/mock',
        enable: true,
      }),
    ],
  }
}
```

### 开发环境测试

- 在`user.ts`中新增模拟的接口,这里吧后面模拟登录的接口顺便写了

```ts
import type { MockMethod, Recordable } from "vite-plugin-mock"
//用户信息数据
function createUserList() {
    return [
        {
            userId: 1,
            avatar: "https://avatars.githubusercontent.com/u/26324442?v=4",
            username: "admin",
            password: "123456",
            desc: "平台管理员",
            roles: ["平台管理员"],
            buttons: ["cuser.detail"],
            routes: [
                "Home",
                "Acl",
                "User",
                "Role",
                "Permission",
                "Product",
                "Trademark",
                "Attr",
                "Spu",
                "Sku",
            ],
            token: "Admin Token",
        },
        {
            userId: 2,
            avatar: "https://avatars.githubusercontent.com/u/26324442?v=4",
            username: "system",
            password: "123456",
            desc: "系统管理员",
            roles: ["系统管理员"],
            buttons: ["cuser.detail", "cuser.user"],
            routes: ["Home", "Product", "Trademark", "Attr", "Spu", "Sku"],
            token: "System Token",
        },
    ]
}
interface res {
    url: Recordable
    body: Recordable
    query: Recordable
    headers: Recordable
}
export default [
    {
        url: "/api/login",
        method: "post",
        response: ({ body }: res) => {
            //获取请求体携带过来的用户名与密码
            const { username, password } = body
            //调用获取用户信息函数,用于判断是否有此用户
            const checkUser = createUserList().find(
                (item) =>
                    item.username === username && item.password === password,
            )
            //没有用户返回失败信息
            if (!checkUser) {
                return { code: 201, data: { message: "账号或者密码不正确" } }
            }
            //如果有返回成功信息
            const { token } = checkUser
            return { code: 200, data: { token } }
        },
    },

    // 获取用户信息
    {
        url: "/api/user/info",
        method: "get",
        response: (request: res) => {
            //获取请求头携带token
            const token = request.headers.authorization.replace("Bearer ", "")
            console.log("request", token)

            //查看用户信息是否包含有次token用户
            const checkUser = createUserList().find(
                (item) => item.token === token,
            )
            //没有返回失败的信息
            if (!checkUser) {
                return { code: 201, data: { message: "获取用户信息失败" } }
            }
            //如果有返回成功信息
            return { code: 200, data: { ...checkUser } }
        },
    },
] as MockMethod[]
```

- 调用接口

```ts
// app.vue
import axios from 'axios'
onMounted(() => {
    // 发送 POST 请求
    axios({
        method: "post",
        url: "/api/login",
        data: {
            username: "admin",
            password: "123456",
        },
    }).then((res) => {
        console.log(res)
    })
})
```

## 生产环境配置

这个库虽然文档上面说支持生产模式使用，其实并不支持了，如果需要使用就需要降级不能使用3.x版本。

## vite配置抽离

```ts
import { viteMockServe } from "vite-plugin-mock"
export default function useMock() {
    return viteMockServe({
        mockPath: "src/mock",
        enable: true,
        logger: true,
    })
}
```
