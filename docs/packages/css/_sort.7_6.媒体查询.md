# CSS3 @media 查询

它允许开发者根据不同的媒体类型和特性（如视口宽度、高度、方向、分辨率等）应用不同的样式规则。

## 语法

```css
@media mediatype and|not|only (media feature) {
    CSS-Code;
}
// 针对不同的媒体使用不同 stylesheets :
<link rel="stylesheet" media="mediatype and|not|only (media feature)" href="mystylesheet.css">

<style media="print">...</style>
```

使用@import可以引入指定设备的样式规则，也可以和@media结合使用，在媒体查询内引入css文件。

```css
@import url('print.css') print;
```

在上面的例子中，print.css 只有在打印文档时才会被导入和应用。

### 媒体类型

- all 用于所有设备
- print 用于打印机和打印预览
- screen 用于电脑屏幕，平板电脑，智能手机等。
- speech 应用于屏幕阅读器等发声设备

### [媒体功能](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Media_Queries/Using_media_queries)

- `aspect-ratio` 定义输出设备中的页面可见区域宽度与高度的比率
- `color` 定义输出设备每一组彩色原件的个数。如果不是彩色设备，则值等于0
- `color-index` 定义在输出设备的彩色查询表中的条目数。如果没有使用彩色查询表，则值等于0
- `device-aspect-ratio` 定义输出设备的屏幕可见宽度与高度的比率。
- `device-height` 定义输出设备的屏幕可见高度。
- `device-width` 定义输出设备的屏幕可见宽度。
- `grid` 用来查询输出设备是否使用栅格或点阵。
- `height` 定义输出设备中的页面可见区域高度。
- `max-aspect-ratio` 定义输出设备的屏幕可见宽度与高度的最大比率。
- `max-color` 定义输出设备每一组彩色原件的最大个数。
- `max-color-index` 定义在输出设备的彩色查询表中的最大条目数。
- `max-device-aspect-ratio` 定义输出设备的屏幕可见宽度与高度的最大比率。
- `max-device-height` 定义输出设备的屏幕可见的最大高度。
- `max-device-width` 定义输出设备的屏幕最大可见宽度。
- `max-height` 定义输出设备中的页面最大可见区域高度。
- `max-monochrome` 定义在一个单色框架缓冲区中每像素包含的最大单色原件个数。
- `max-resolution` 定义设备的最大分辨率。
- `max-width` 定义输出设备中的页面最大可见区域宽度。
- `min-aspect-ratio` 定义输出设备中的页面可见区域宽度与高度的最小比率。
- `min-color` 定义输出设备每一组彩色原件的最小个数。
- `min-color-index` 定义在输出设备的彩色查询表中的最小条目数。
- `min-device-aspect-ratio` 定义输出设备的屏幕可见宽度与高度的最小比率。
- `min-device-width` 定义输出设备的屏幕最小可见宽度。
- `min-device-height` 定义输出设备的屏幕的最小可见高度。
- `min-height` 定义输出设备中的页面最小可见区域高度。
- `min-monochrome` 定义在一个单色框架缓冲区中每像素包含的最小单色原件个数
- `min-resolution` 定义设备的最小分辨率。
- `min-width` 定义输出设备中的页面最小可见区域宽度。
- `monochrome` 定义在一个单色框架缓冲区中每像素包含的单色原件个数。如果不是单色设备，则值等于0
- `orientation` 定义输出设备中的页面可见区域高度是否大于或等于宽度。
  - 使用 `orientation` 属性可以定义设备的方向
  - `orientation: landscape`横屏
  - `orientation: portrait`竖屏
- `resolution` 定义设备的分辨率。如：96dpi, 300dpi, 118dpcm
- `scan` 定义电视类设备的扫描工序。
- `width` 定义输出设备中的页面可见区域宽度
可以用 逗号分隔 同时支持多个媒体设备。

### 设备的划分情况：参考bootstrap

- 小于768的为超小屏幕（手机）
- 768~992之间的为小屏设备（平板）
- 992~1200的中等屏幕（桌面显示器）
- 大于1200的宽屏设备（大桌面显示器）

### 横竖屏匹配

#### js

```javascript
window.addEventListener("resize", ()=>{
    if (window.orientation === 180 || window.orientation === 0) { 
      // 正常方向或屏幕旋转180度
        console.log('竖屏');
    };
    if (window.orientation === 90 || window.orientation === -90 ){ 
       // 屏幕顺时钟旋转90度或屏幕逆时针旋转90度
        console.log('横屏');
    }  
});
```

#### css

```css
@media screen and (orientation: portrait) {
  /*竖屏...*/
} 
@media screen and (orientation: landscape) {
  /*横屏...*/
}
```
