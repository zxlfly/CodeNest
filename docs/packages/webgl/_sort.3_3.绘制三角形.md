# 3.绘制三角形
三个点可以确定一个唯一的三角面。
## 三角形图元的分类
WebGL 的基本图元包含点、线段、三角形，而三角形又分为三类

- 基本三角形（TRIANGLES）
   - 基本三角形是一个个独立的三角形，假如我们提供给着色器六个顶点，那么 WebGL 会绘制两个三角形，前三个顶点绘制一个，后三个顶点绘制另一个，互不相干。
   - 绘制三角形的数量 = 顶点数 / 3
- 三角带（TRIANGLE_STRIP）
   - 绘制三角形的数量 = 顶点数 - 2
   - v0>v1>v2>v3>v4>v5 六个顶点，绘制顺序是：
      - v0>v1>v2 
         - 以上一个三角形的第二条边+下一个点为基础，以和第二条边相反的方向绘制三角形
      - v2>v1>v3 
         - 以上一个三角形的第三条边+下一个点为基础，以和第二条边相反的方向绘制三角形
      - v2>v3>v4 
         - 以上一个三角形的第二条边+下一个点为基础，以和第二条边相反的方向绘制三角形
      - v4>v3>v5
   - 规律： 
      - 第一个三角形：v0>v1>v2
      - 第偶数个三角形：以上一个三角形的第二条边+下一个点为基础，以和第二条边相反的方向绘制三角形
      - 第奇数个三角形：以上一个三角形的第三条边+下一个点为基础，以和第二条边相反的方向绘制三角形
- 三角扇（TRIANGLE_FAN）
   - 绘制三角形的数量 = 顶点数 - 2
   - v0>v1>v2 
      - 以上一个三角形的第三条边+下一个点为基础，按照和第三条边相反的顺序，绘制三角形
   - v0>v2>v3 
      - 以上一个三角形的第三条边+下一个点为基础，按照和第三条边相反的顺序，绘制三角形
   - v0>v3>v4 
      - 以上一个三角形的第三条边+下一个点为基础，按照和第三条边相反的顺序，绘制三角形
   - v0>v4>v5
## 绘制基本三角形
### 顶点着色器
```glsl
//设置浮点数据类型为中级精度
precision mediump float;
//接收顶点坐标 (x, y)
attribute vec2 a_Position;

void main(){
  gl_Position = vec4(a_Position, 0, 1);
}

```
### 片元着色器
```glsl
//设置浮点数据类型为中级精度
precision mediump float;
//接收 JavaScript 传过来的颜色值（rgba）。
uniform vec4 u_Color;

void main(){
  vec4 color = u_Color / vec4(255, 255, 255, 1);
  gl_FragColor = color;
}



```
### JavaScript 
html部分照旧没有变化
#### 首先，定义三角形的三个顶点
``var positions = [1,0, 0,1, 0,0]_;``_
#### 给着色器传递顶点数据
和上一节不同，这里需要将三角形的三个顶点数据传递到顶点着色器中。因为要传递多个顶点数据。这里借助一个强大的工具缓冲区，通过缓冲区我们可以向着色器传递多个顶点数据。

- 建立顶点数据
   - 这些数据存储在js中
   - 需要传递给着色器
- webgl 系统建立了一个能翻译双方语言的缓冲区，来处理数据沟通问题 
   - createBuffer：建立缓冲对象
   - bindBuffer(target,buffer) ：绑定缓冲对象，让其和着色器建立连接 
      - target 要把缓冲区放在webgl 系统中的什么位置
      - buffer 缓冲区
   - bufferData(target, data, usage)：往缓冲区对象中写入数据 
      - target 要把缓冲区放在webgl 系统中的什么位置
      - data 数据
      - usage 向缓冲区写入数据的方式，这里先使用 gl.STATIC_DRAW 方式，它是向缓冲区中一次性写入数据，着色器会绘制多次。
   - vertexAttribPointer(local,size,type,normalized,stride,offset)：将缓冲区对象分配给attribute 变量 
      - local：attribute变量
         - 允许哪个属性读取当前缓冲区的数据。
      - size：顶点分量的个数，例如vertices 数组中，两个数据表示一个顶点，就写2
         - 一次取几个数据赋值给 target 指定的目标属性。
      - type：数据类型，比如 gl.FLOAT 浮点型
      - normalized：是否将顶点数据归一
         - 是否需要将非浮点类型数据单位化到【-1, 1】区间。
      - stride：相邻两个顶点间的字节数，我的例子里写的是0，那就是顶点之间是紧挨着的
         - 步长，即每个顶点所包含数据的字节数，默认是 0 ，0 表示每一个属性的数据是连续存放的。
      - offset：从缓冲区的什么位置开始存储变量，我的例子里写的是0，那就是从头开始存储变量
         - 在每个步长的数据里，目标属性需要偏移多少字节开始读取。
   - enableVertexAttribArray(a_Position)：开启顶点数据的批处理功能。 
      - location：attribute变量
   - 绘图 
      - drawArrays(mode,first,count) 
         - mode：绘图模式，比如 gl.POINTS 画点
         - first：从哪个顶点开始绘制
         - count：要画多少个顶点
```javascript
var positions = [1,0, 0,1, 0,0];
var a_Position = gl.getAttribLocation(program, 'a_Position')
// 创建一个缓冲区
var buffer = gl.createBuffer();
// 绑定该缓冲区为 WebGL 当前缓冲区 gl.ARRAY_BUFFER，绑定之后，对缓冲区绑定点的的任何操作都会基于该缓冲区（即buffer） 进行
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// 往当前缓冲区（即上一步通过 bindBuffer 绑定的缓冲区）中写入数据
//gl.STATIC_DRAW 提示 WebGL 我们不会频繁改变缓冲区中的数据，WebGL 会根据这个参数做一些优化处理。
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
// 启用对应属性 a_Position
gl.enableVertexAttribArray(a_Position);
// 设置从缓冲区中取数据的方式
//每次取两个数据
var size = 2;
//每个数据的类型是32位浮点型
var type = gl.FLOAT;  
//不需要归一化数据
var normalize = false; 
// 每次迭代运行需要移动数据数 * 每个数据所占内存 到下一个数据开始点。
var stride = 0;   
// 从缓冲起始位置开始读取     
var offset = 0; 
// 将 a_Position 变量获取数据的缓冲区指向当前绑定的 buffer。
gl.vertexAttribPointer(
   a_Position, size, type, normalize, stride, offset)
// 绘制代码
//绘制图元设置为三角形
var primitiveType = gl.TRIANGLES;
//从顶点数组的开始位置取顶点数据
var offset = 0;
//因为我们要绘制三个点，所以执行三次顶点绘制操作。
var count = 3;
gl.drawArrays(primitiveType, offset, count);

```
### 完整代码
```javascript
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>webgl</title>
		<style>
			* {
				padding: 0;
				margin: 0;
			}
		</style>
	</head>

	<body>
		<canvas id="canvas"></canvas>
	</body>
	<!-- 顶点着色器 -->
	<script id="vertexShader" type="x-shader-x-vertex">
		//设置浮点数据类型为中级精度
			precision mediump float;
			//接收顶点坐标 (x, y)
			attribute vec2 a_Position;

			void main(){
			  gl_Position = vec4(a_Position, 0, 1);
			}
	</script>
	<!-- 片元着色器 -->
	<script id="fragmentShader" type="x-shader-x-fragment">
		//设置浮点数据类型为中级精度
		precision mediump float;
		//接收 JavaScript 传过来的颜色值（rgba）。
		uniform vec4 u_Color;

		void main(){
		  vec4 color = u_Color / vec4(255, 255, 255, 1);
		  gl_FragColor = color;
		}
	</script>
	<script type="module">
		import { initShaders } from "../js/utils.js";
		var canvas = document.getElementById("canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		// 获取着色器代码
		const vsSource = document.getElementById("vertexShader").innerText;
		const fsSource = document.getElementById("fragmentShader").innerText;
		var gl =
			canvas.getContext("webgl") ||
			canvas.getContext("experimental-webgl");
		var program = initShaders(gl, vsSource, fsSource);
		var positions = [1, 0, 0, 1, 0, 0];
		var a_Position = gl.getAttribLocation(program, "a_Position");
		// 创建一个缓冲区
		var buffer = gl.createBuffer();
		// 绑定该缓冲区为 WebGL 当前缓冲区 gl.ARRAY_BUFFER，绑定之后，对缓冲区绑定点的的任何操作都会基于该缓冲区（即buffer） 进行
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		// 往当前缓冲区（即上一步通过 bindBuffer 绑定的缓冲区）中写入数据
		//gl.STATIC_DRAW 提示 WebGL 我们不会频繁改变缓冲区中的数据，WebGL 会根据这个参数做一些优化处理。
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(positions),
			gl.STATIC_DRAW
		);
		// 启用对应属性 a_Position
		gl.enableVertexAttribArray(a_Position);
		// 设置从缓冲区中取数据的方式
		//每次取两个数据
		var size = 2;
		//每个数据的类型是32位浮点型
		var type = gl.FLOAT;
		//不需要归一化数据
		var normalize = false;
		// 每次迭代运行需要移动数据数 * 每个数据所占内存 到下一个数据开始点。
		var stride = 0;
		// 从缓冲起始位置开始读取
		var offset = 0;
		// 将 a_Position 变量获取数据的缓冲区指向当前绑定的 buffer。
		gl.vertexAttribPointer(
			a_Position,
			size,
			type,
			normalize,
			stride,
			offset
		);
		// 绘制代码
		//绘制图元设置为三角形
		var primitiveType = gl.TRIANGLES;
		//从顶点数组的开始位置取顶点数据
		var offset = 0;
		//因为我们要绘制三个点，所以执行三次顶点绘制操作。
		var count = 3;
		//设置清空画布颜色为黑色。
		gl.clearColor(0.0, 0.0, 0.0, 1.0);

		//用上一步设置的清空画布颜色清空画布。
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(primitiveType, offset, count);
	</script>
</html>
```
## 动态绘制三角形
### 着色器部分
顶点着色器增加一个变量用来接收 canvas 的尺寸，将 canvas 坐标转化为 NDC 坐标。
片元着色器部分没有改动。
```glsl
//设置浮点数精度为中等精度
precision mediump float;
// 接收顶点坐标 (x, y)
attribute vec2 a_Position;
// 接收 canvas 的尺寸(width, height)
attribute vec2 a_Screen_Size;
void main(){
  vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
  position = position * vec2(1.0,-1.0);
  gl_Position = vec4(position, 0, 1);
}


```
### JavaScript 部分

- 鼠标点击 canvas，存储点击位置的坐标。
- 每点击三次时，再执行绘制命令。保证点的个数是3的倍数。
```javascript
canvas.addEventListener('mouseup', e => {
  var x = e.pageX;
  var y = e.pageY;
  positions.push(x, y);
  if (positions.length % 3 == 0) {
    //向缓冲区中复制新的顶点数据。
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);
    //重新渲染
    render(gl);
  }
})

//渲染函数
function render(gl) {
  gl.clearColor(0, 0, 0, 1.0);
  //用上一步设置的清空画布颜色清空画布。
  gl.clear(gl.COLOR_BUFFER_BIT);
  //从顶点数组的开始位置取顶点数据
  var drawOffset = 0;
  //因为我们要绘制 N 个点，所以执行 N 次顶点绘制操作。
  gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);
}

```
### 完整的代码
```javascript
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>webgl</title>
		<style>
			* {
				padding: 0;
				margin: 0;
			}
		</style>
	</head>

	<body>
		<canvas id="canvas"></canvas>
	</body>
	<!-- 顶点着色器 -->
	<script id="vertexShader" type="x-shader-x-vertex">
		//设置浮点数精度为中等精度
		precision mediump float;
		// 接收顶点坐标 (x, y)
		attribute vec2 a_Position;
		// 接收 canvas 的尺寸(width, height)
		attribute vec2 a_Screen_Size;
		varying vec3 v_color;
		void main(){
		  vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
		  position = position * vec2(1.0,-1.0);
		  gl_Position = vec4(position, 0, 1);
		  float r = position[0] > 0.0 ? position[0] : 0.0;
		  float g = position[1] > 0.0 ? position[1] : 1.0;
		  v_color = vec3(r,g, 0.5);
		}
	</script>
	<!-- 片元着色器 -->
	<script id="fragmentShader" type="x-shader-x-fragment">
		//设置浮点数据类型为中级精度
		precision mediump float;
		//接收 JavaScript 传过来的颜色值（rgba）。
		varying vec3 v_color;
		void main(){
		  gl_FragColor = vec4(v_color,1.0);
		}
	</script>
	<script type="module">
		import { initShaders } from "../js/utils.js";
		var canvas = document.getElementById("canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		// 获取着色器代码
		const vsSource = document.getElementById("vertexShader").innerText;
		const fsSource = document.getElementById("fragmentShader").innerText;
		var gl =
			canvas.getContext("webgl") ||
			canvas.getContext("experimental-webgl");
		var program = initShaders(gl, vsSource, fsSource);
		var positions = [];
		var a_Position = gl.getAttribLocation(program, "a_Position");
		var a_Screen_Size = gl.getAttribLocation(program, "a_Screen_Size");
		gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);
		// 创建一个缓冲区
		var buffer = gl.createBuffer();
		// 绑定该缓冲区为 WebGL 当前缓冲区 gl.ARRAY_BUFFER，绑定之后，对缓冲区绑定点的的任何操作都会基于该缓冲区（即buffer） 进行
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		// 往当前缓冲区（即上一步通过 bindBuffer 绑定的缓冲区）中写入数据
		//gl.STATIC_DRAW 提示 WebGL 我们不会频繁改变缓冲区中的数据，WebGL 会根据这个参数做一些优化处理。
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(positions),
			gl.STATIC_DRAW
		);
		// 启用对应属性 a_Position
		gl.enableVertexAttribArray(a_Position);
		// 设置从缓冲区中取数据的方式
		//每次取两个数据
		var size = 2;
		//每个数据的类型是32位浮点型
		var type = gl.FLOAT;
		//不需要归一化数据
		var normalize = false;
		// 每次迭代运行需要移动数据数 * 每个数据所占内存 到下一个数据开始点。
		var stride = 0;
		// 从缓冲起始位置开始读取
		var offset = 0;
		// 将 a_Position 变量获取数据的缓冲区指向当前绑定的 buffer。
		gl.vertexAttribPointer(
			a_Position,
			size,
			type,
			normalize,
			stride,
			offset
		);
		// 绘制代码
		//绘制图元设置为三角形
		var primitiveType = gl.TRIANGLES;
		//从顶点数组的开始位置取顶点数据
		var offset = 0;
		//因为我们要绘制三个点，所以执行三次顶点绘制操作。
		var count = 3;
		//设置清空画布颜色为黑色。
		gl.clearColor(0.0, 0.0, 0.0, 1.0);

		//用上一步设置的清空画布颜色清空画布。
		gl.clear(gl.COLOR_BUFFER_BIT);
		canvas.addEventListener("mouseup", (e) => {
			var x = e.pageX;
			var y = e.pageY;
			positions.push(x, y);
			if (positions.length % 3 == 0) {
				//向缓冲区中复制新的顶点数据。
				gl.bufferData(
					gl.ARRAY_BUFFER,
					new Float32Array(positions),
					gl.DYNAMIC_DRAW
				);
				//重新渲染
				render(gl);
			}
		});

		//渲染函数
		function render(gl) {
			gl.clearColor(0, 0, 0, 1.0);
			//用上一步设置的清空画布颜色清空画布。
			gl.clear(gl.COLOR_BUFFER_BIT);
			//从顶点数组的开始位置取顶点数据
			var drawOffset = 0;
			//因为我们要绘制 N 个点，所以执行 N 次顶点绘制操作。
			gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);
		}
	</script>
</html>


```

## 总结

- 三角形图元分类
   - gl.TRIANGLES：基本三角形。
   - gl.TRIANGLE_STRIP：三角带。
   - gl.TRIANGLE_FAN：三角扇。
- 类型化数组的作用。
   - Float32Array：32位浮点数组。
   - 这种会常用
- 使用缓冲区传递数据。
   - gl.createBuffer：创建buffer。
      - 可以创建多个buffer
   - gl.bindBuffer：绑定某个缓冲区对象为当前缓冲区。
      - 可以用来切换
      - 切换之后通过gl.bufferData传递数据
      - 如果在创建buffer的时候已经设置过enableVertexAttribArray和vertexAttribPointer
         - 那么这里可以不再重复设置，直接切换往缓冲区中复制数据
   - gl.bufferData：往缓冲区中复制数据。
   - gl.enableVertexAttribArray：启用对应的属性。
   - gl.vertexAttribPointer：设置对应的属性从缓冲区中读取数据的方式。
- 动态绘制三角形。
   - 改变顶点信息，然后通过缓冲区将改变后的顶点信息传递到着色器，重新绘制三角形。
