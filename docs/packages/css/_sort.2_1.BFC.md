# [BFC](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)(Block formatting context) 块级格式化上下文

Web页面可视CSS渲染的一部分，**是块盒子布局过程发生的区域，也是浮动元素与其他元素交互的区域。**
**它规定了内部的块级元素如何布局。与区域外部毫不相干, 外部元素不会影响BFC渲染区域内的元素。**
默认，内部的块元素会在垂直方向，一个接一个地放置。每个块元素独占一行
块元素垂直方向的总距离由margin决定。属于同一个BFC的两个相邻块元素在垂直方向上的**margin会发生重叠/合并**。但水平方向的margin不会。
**BFC渲染区域不会与float浮动定义的元素区域重叠**。

## 定义

- 根元素（）
- 浮动元素（元素的 float 不是 none）
- 绝对定位元素（元素的 position 为 absolute 或 fixed）
- 行内块元素（元素的 display 为 inline-block）
- 表格单元格（元素的 display 为 table-cell，HTML表格单元格默认为该值）
- 表格标题（元素的 display 为 table-caption，HTML表格标题默认为该值）
- 匿名表格单元格元素（元素的 display 为 table、table-row、 table-row-group、table-header-group、table-footer-group（分别是HTML table、row、tbody、thead、tfoot 的默认属性）或 inline-table）
- overflow 值不为 visible 的块元素
- display 值为 flow-root 的元素
- contain 值为 layout、content 或 paint 的元素
- 弹性元素（display 为 flex 或 inline-flex 元素的直接子元素）
- 网格元素（display 为 grid 或 inline-grid 元素的直接子元素）
- 多列容器（元素的 column-count 或 column-width (en-US) 不为 auto，包括 column-count 为 1）
- column-span 为 all 的元素始终会创建一个新的BFC，即使该元素没有包裹在一个多列容器中（标准变更，Chrome bug）。

## 解决垂直方向margin合并

问题: 垂直方向上，两个元素上下margin相遇，两元素的间的距离并不等于两个margin的和。而是等于最大的margin。小的margin会被大的margin吞并。
解决方法：

- 用一个外围元素包裹住下方元素，将外围元素变成一个bfc方式的渲染区域
  - 例如：`overflow:hidden`

## 垂直方向margin溢出问题

问题：子元素设置margin-top，会超出父元素上边的范围，变成父元素的margin-top。而实际上，子元素与父元素之间，依然是没有margin-top的——效果不是想要的。
解决方法：

- 用父元素的`padding-top`代替
- 为父元素加上边框
- 用平级BFC渲染区域阻隔下方元素的margin-top
  - 在父元素内第一个子元素之前添加一个空的`<table></table>`
  - `父元素::before{ content:""; display:table; }`

## 自适应两栏布局 左固定，右自适应

解决方法：

- `.left{ float:left; width:固定宽 }`
- `.right{overflow:hidden; ...}`
  - 变成bfc就不会与左侧的浮动重叠了。
这里只是一个例子，实现方式很多。

## 防止高度坍塌

这个问题是使用浮动布局常见问题。父元素不写高度时，子元素写了浮动后，父元素会发生高度塌陷（造成父元素高度为 0）
解决方法：

- 给父元素添加`overflow：hidden`
  - 问题：如果希望有使用定位方式且超出父元素范围的子元素也能正常显示就不行了
- 在浮动元素下方添加空div，并给元素声明 `clear：both`，保险起见，再加`height:0`。清除个别块元素可能自带的height:16px;
  - 问题：需要添加多余的空标签并添加属性
- 父元素也浮动
  - 问题：会继续产生浮动的问题
- 会用伪元素的方式

```css
box::after{
  content: "";
  display: block;
    clear: both;
   height: 0; /*为了清楚个别块元素自带的16px高度*/
 }
```
