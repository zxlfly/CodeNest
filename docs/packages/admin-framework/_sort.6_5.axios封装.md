# axios

**安装：**

```bash
pnpm add axios
```

在 `src` 下创建 `axios`文件夹，并在文件夹下创建 `index.ts` 文件，封装`axios`的代码写在这。在 `src/axios` 下创建 `composables`文件夹，一些功能性的函数可以写在这里。在项目中我一般会使用单例的模式。

## 创建axios实例

```typescript
import axios, {
    type AxiosRequestConfig,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from "axios"
// 类型扩展文件件types目录
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASEURL,
    headers: {
        "Content-Type": "application/json;charset=utf-8",
    },
    // timeout: 10000,
})
```

## 请求拦截

## 响应拦截

## 全局loading

在 `src/axios/composables` 下创建 `use-request-loading.ts`文件。

```typescript
const loadingInstance = ElLoading.service
// 记录请求数量 默认开启全局loading，可以在请求头中配置是否开启
let requestCount = 0
const showLoading = () => {
    requestCount++
    if (requestCount === 1) loadingInstance()
}
const closeLoading = () => {
    requestCount--
    if (requestCount === 0) loadingInstance().close()
}

export { closeLoading, showLoading }
```

## 取消相同请求

在 `src/axios/composables` 下创建 `use-cancel-duplicate-request.ts`文件。

```typescript
import type { InternalAxiosRequestConfig } from "axios"

const requestMap = new Map()
// 处理json序列化时可能出现的转义符
const removeEscapeCharacters = (jsonString: string) => {
    try {
        if (typeof jsonString != "string") return jsonString
        // 将JSON字符串解析为JavaScript对象
        const obj = JSON.parse(jsonString)
        // 再次将对象转换为JSON字符串，此时转义字符会被去除
        const unescapedJsonString = JSON.stringify(obj)
        return unescapedJsonString
    } catch (error) {
        console.error("Error parsing JSON string:", error)
        return jsonString // 返回原始字符串
    }
}
// 生成请求对应的key
const getReqKey = (config: InternalAxiosRequestConfig<any>) => {
    let data, params
    if (typeof config.data != "string") {
        data = removeEscapeCharacters(JSON.stringify(config.data))
    }
    if (typeof config.params != "string") {
        params = removeEscapeCharacters(JSON.stringify(config.params))
    }
    console.log("getReqKey", "" + config.method + config.url + data + params)
    return "" + config.method + config.url + data + params
}

const setRequestToMap = (config: InternalAxiosRequestConfig<any>) => {
    const key = getReqKey(config)
    if (requestMap.has(key)) {
        requestMap
            .get(key)
            .controller.abort("请求已被取消，因为有相同的请求正在进行中")
    }
    const controller = new AbortController()
    config.signal = controller.signal
    requestMap.set(key, { controller })
}
const delRequestToMap = (config: InternalAxiosRequestConfig<any>) => {
    const key = getReqKey(config)
    requestMap.delete(key)
}

export { setRequestToMap, delRequestToMap }
```
