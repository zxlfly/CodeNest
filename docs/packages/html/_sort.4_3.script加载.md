# 默认情况

默认情况下script标签是同步执行的，会发生阻塞问题。因为浏览器解析html的时候是由上至下解析，遇到script会暂停dom树的构建，脚本加载并执行完毕才会继续。

# async

异步加载，加载完毕立即执行

```html
<!DOCTYPE html> 
<html lang="en">
<head> 
    <meta charset="UTF-8">
    <title>Async Script Example</title> 
    <script async src="path/to/your/script.js"></script>
</head>
<body> 
    <!-- 页面内容 -->
</body> 
</html>
```

# defer

异步加载，需要等待文档被完全加载和解析完成之后(触发DOMContentLoaded事件前)执行

```html
<!DOCTYPE html> 
<html lang="en">
<head> 
    <meta charset="UTF-8">
    <title>Defer Script Example</title> 
    <script defer src="path/to/your/script.js"></script>
</head>
<body> 
    <!-- 页面内容 -->
</body> 
</html>
```

## DOMContentLoade

```javaScript
document.addEventListener("DOMContentLoaded", function() { 
    // 在这里执行你的代码 
    console.log("DOM fully loaded and parsed");
}); 
```

当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的完全加载。
