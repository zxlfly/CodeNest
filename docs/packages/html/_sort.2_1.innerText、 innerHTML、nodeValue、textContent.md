# 操作 DOM（文档对象模型）节点的不同属性和方法

这个内容会涉及到css、JavaScript和html，因为是DOM相关操作，所以就放在这里了。

## innerText

**innerText** 属性用于获取或设置一个元素内的文本内容，它会考虑 CSS 样式，例如，如果文本被隐藏，则不会被返回。  
它只会返回元素可见的文本内容，不包括任何 HTML 标签。

## innerHTML

**innerHTML** 属性用于获取或设置一个元素内的 HTML 内容。  
它可以返回元素内的所有 HTML 标记和文本内容，也可以用来插入新的 HTML 代码到元素中。
**innerHTML** 是一个非常强大的属性，但它也带来了安全风险，因为它可以**直接执行插入的脚本代码**。

## nodeValue

**nodeValue** 属性用于获取或设置一个节点的值。  
对于文本节点（Text 类型），nodeValue 返回节点中的文本内容。  
对于元素节点（Element 类型），nodeValue 通常返回 null，因为元素节点本身没有值。
nodeValue 适用于更底层的 DOM 操作，通常用于遍历 DOM 树时访问特定节点的值。

## textContent

**textContent** 属性用于获取或设置一个元素内的文本内容，类似于 innerText，但不考虑 CSS 样式。  
它会返回元素内的所有文本内容，包括不可见的文本，也不包括任何 HTML 标签。

## 示例

```HTML
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <!-- 假设我们有以下的 HTML 结构 -->
    <div id="example">
        <style>
            *{
                padding: 0;
                margin: 0;
            }
        </style>
        <p style="display: none;">This is hidden text.</p>
        <p>This is visible text.</p>
    </div>
    <script>
        /*
            使用 innerText
            输出: This is visible text. 
        */
        var exampleDiv = document.getElementById('example');
        console.log(exampleDiv.innerText); 

        /*
            使用 innerHTML
            输出:   
                    <style>
                        *{
                            padding: 0;
                            margin: 0;
                        }
                    </style>
                    <p style="display: none;">This is hidden text.</p>
                    <p>This is visible text.</p>
        */

        console.log(exampleDiv.innerHTML); 

        /*
            使用 nodeValue
            首先获取第一个子节点（文本节点）
            输出: 
                （换行符,因为文本节点包含了空格和换行）
        */
        var firstChild = exampleDiv.firstChild;
        console.log(firstChild.nodeValue); // 

        /*
            使用 textContent
            输出:   
                    *{
                        padding: 0;
                        margin: 0;
                    }
                    
                    This is hidden text.
                    This is visible text.
    
        */
        console.log(exampleDiv.textContent); 
    </script>
</body>

</html>
```

## 总结

- nodeValue
  - 只能获取文本节点的内容，即不包含元素标签。
- innerHTML与innerText
  - 这两个api的功能是获取从起始位置到终止位置的内容, 区别在于是否去除Html标签 。
- textContent
  - 返回指定节点的文本内容，不包含元素标签，包括它的所有后代。
  - 与innerText的区别：
    - 会获取style=“display:none”中的文本
    - 会获取style标签中的文本
    - 不解析html更快捷性能好
