# 常见的居中方式

## 水平居中

前提父元素必须是块级元素，一些不能嵌套的特殊元素除外，例如`h1`和`p`

### 1.子元素为块级元素宽度没有设定

这种情况下不存在水平居中一说，默认会占满父元素宽度。

### 2.子元素为行内块，且宽度已设定

- 设置`margin:0 auto;`
- 给父元素和子元素都设定了`box-sizing:border-box`
  - 通过计算指定父元素的`padding-left`或`padding-right`
  - 计算得到子元素的`margin-left`或`margin-right`
  - (父宽-子宽)/2
- 通过子元素相对父元素绝对定位
  - `子：left:50%; margin-left: -子宽一半`
  - `子: left:50%; transform:translateX(-50%)`
- 弹性布局

```css
父元素设置：
display:flex;
flex-direction: row;
justify-content:center;
```

## 垂直居中

前提父元素是盒子容器

### 1.子元素是行内元素，高度由内容撑起来

- 单行
  - 设定父元素的line-height为其高度来使得子元素垂直居中
- 多行
  - 通过给父元素设定`display:inline/inline-block/table-cell;vertical-align:middle`来解决

### 2.子元素是块级元素但是子元素高度没有设定

- 通过给父元素设定`display:inline/inline-block/table-cell; vertical-align:middle`来解决
- 使用flexbox

```css
父元素设置：
display: flex;
flex-direction: column;
justify-content: center;
```

### 3.子元素是块级元素且高度已经设定

- 给父元素和子元素都设定了`box-sizing:border-box`
  - 计算子元素的`margin-top`或`margin-bottom`
  - 计算父元素的`padding-top`或`padding-bottom`
- 利用绝对定位，让子元素相对于父元素绝对定位
  - 子元素宽已知
    - 子：top:50%; margin-top: -子高一半
  - 子元素宽未知
    - 子: top:50%; transform:translateY(-50%)
- 利用flexbox

```css
父元素设置：
display: flex;
flex-direction: column;
justify-content: center;
```

## 垂直和水平方向同时居中

- 父元素相对定位，子元素绝对定位
  - 已知子元素宽高
    - top:50%; left:50%; margin-left:-子宽一半; margin-top:-子高一半
  - 未知子元素宽高
    - top:50%; left:50%; transform:translate(-50%, -50%)
- 弹性布局

```css
父元素设置：
display: flex;
justify-content: center;
align-items: center;
```

## tips

### 使用百分比时参考的目标

- 父节点一半：
  - margin-left、left、padding-left
- 子节点自身一半：
  - transform:translateX
