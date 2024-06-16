# 渐变三角形
其实在前面的例子中我们已经绘制过渐变的三角形了，本章内容我们来进一步了解它。
渐变三角形就是在顶点与顶点之间进行颜色的渐变过渡，这就要求我们的顶点信息除了包含坐标，还要包含颜色。这样在顶点着色器之后，GPU 根据每个顶点的颜色对顶点与顶点之间的颜色进行插值，自动填补顶点之间像素的颜色，于是形成了渐变三角形。
## 实现渐变三角形
我们需要为每个顶点传递坐标信息和颜色信息，因此需要两个attribute变量，用来接收顶点坐标和颜色信息。
### 顶点着色器
```glsl
//设置浮点数精度为中等精度。
precision mediump float;
//接收顶点坐标 (x, y)
attribute vec2 a_Position;
//接收浏览器窗口尺寸(width, height)
attribute vec2 a_Screen_Size;
//接收 JavaScript 传递的顶点颜色
attribute vec4 a_Color;
//传往片元着色器的颜色。
varying vec4 v_Color;
void main(){
  vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
  position = position * vec2(1.0,-1.0);
  gl_Position = vec4(position, 0, 1);
  v_Color = a_Color;
}

```
### 片元着色器
 varying 变量 v_Color，用来接收插值后的颜色。
```glsl
//设置浮点数精度为中等。
precision mediump float;
//接收 JavaScript 传过来的颜色值（rgba）。
varying vec4 v_Color;
void main(){
  vec4 color = v_Color / vec4(255, 255, 255, 1);
  gl_FragColor = color;
}
```
### JavaScript
用缓冲区传递数据，缓冲区可以使用多个。
如果程序中存在多个buffer的时候，需要切换buffer操作的时候，需要通过调用gl.bindBuffer将要操作的buffer绑定到gl.ARRAY_BUFFER上，这样才能正确的操作buffer。对buffer的操作都是基于最近一次绑定的。
gl.bufferData：传递数据，gl.vertexAttribPointer：设置属性读取 buffer 的方式；这两个方法需要在绑定之后才能执行。具体运行什么根据需求决定，不是说这两个必须都执行。
## 多buffer传递
顶点信息和颜色信息分开存储
```glsl
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>webgl</title>
	</head>

	<body>
		<canvas id="canvas"></canvas>
	</body>
	<!-- 顶点着色器 -->
	<script id="vertexShader" type="x-shader/x-vertex">
		//浮点数设置为中等精度
		precision mediump float;
		//接收 JavaScript 传递过来的点的坐标（X, Y）
		attribute vec2 a_Position;
		// 接收canvas的尺寸。
		attribute vec2 a_Screen_Size;
		//接收 JavaScript 传递过来的点的颜色信息（R, G, B, A）
		attribute vec4 a_Color;
		//将顶点着色器插值后的颜色颜色信息（R, G, B, A）传递给片元着色器。
		varying vec4 v_Color;
		void main(){
			// 将 canvas 的坐标值 转换为 [-1.0, 1.0]的范围。
			vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
			// canvas的 Y 轴坐标方向和 设备坐标系的相反。
			position = position * vec2(1.0, -1.0);
			// 最终的顶点坐标。
			gl_Position = vec4(position, 0.0, 1.0);

			v_Color = a_Color;
		}
	</script>
	<!-- 片元着色器 -->
	<script id="fragmentShader" type="x-shader/x-fragment">
		//浮点数设置为中等精度
		precision mediump float;
		//用来接收顶点着色器传递过来的颜色。
		varying vec4 v_Color;

		void main(){
			// 将颜色处理成 GLSL 允许的范围[0， 1]。
			vec4 color = v_Color / vec4(255, 255, 255, 1);
			// 点的最终颜色。
			gl_FragColor = color;
		}
	</script>
	<script type="module">
		import { initShaders, randomColor } from "../js/utils.js";
		const canvas = document.querySelector("#canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		// 获取着色器文本
		const vsSource = document.querySelector("#vertexShader").innerText;
		const fsSource = document.querySelector("#fragmentShader").innerText;
		//三维画笔
		const gl = canvas.getContext("webgl");
		//初始化着色器
		const program = initShaders(gl, vsSource, fsSource);
		//声明颜色 rgba
		gl.clearColor(0, 0, 0, 1);
		//刷底色
		gl.clear(gl.COLOR_BUFFER_BIT);
		let a_Screen_Size = gl.getAttribLocation(program, "a_Screen_Size");
		gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);
		//顶点坐标数组
		let positions = [];
		//顶点颜色数组
		let colors = [];
		let a_Position = gl.getAttribLocation(program, "a_Position");
		let a_Color = gl.getAttribLocation(program, "a_Color");
		//创建坐标缓冲区
		let positionBuffer = createBuffer(gl, a_Position, {
			size: 2,
		});
		//创建颜色缓冲区
		let colorBuffer = createBuffer(gl, a_Color, {
			size: 4,
		});
		canvas.addEventListener("click", (e) => {
			positions.push(e.pageX, e.pageY);
			let color = randomColor();
			colors.push(color.r, color.g, color.b, color.a);
			// 顶点信息为6个数据即3个顶点时执行绘制操作，因为三角形由三个顶点组成。
			if (positions.length % 6 == 0) {
				//复制坐标信息到缓冲区中
				gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
				gl.bufferData(
					gl.ARRAY_BUFFER,
					new Float32Array(positions),
					gl.STATIC_DRAW
				);
				//复制颜色信息到缓冲区中。
				gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
				gl.bufferData(
					gl.ARRAY_BUFFER,
					new Float32Array(colors),
					gl.STATIC_DRAW
				);
				//重绘
				render(gl);
			}
		});
		function render(gl) {
			gl.clear(gl.COLOR_BUFFER_BIT);
			let primitiveType = gl.TRIANGLES;
			if (positions.length > 0) {
				gl.drawArrays(primitiveType, 0, positions.length / 2);
			}
		}
		render(gl);
		function createBuffer(gl, attribute, vertexAttribPointer) {
			let { size, type, normalize, stride, offset } = vertexAttribPointer;
			gl.enableVertexAttribArray(attribute);
			let buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.vertexAttribPointer(
				attribute,
				size,
				type || gl.FLOAT,
				normalize || false,
				stride || 0,
				offset || 0
			);
			return buffer;
		}
	</script>
</html>

```
## 单buffer传递
顶点信息和颜色信息存储在一起，通过偏移量控制读取。相当于一个顶点信息现在占有6个元素，前面两个是坐标信息，后面四个是颜色信息。只需要在设置属性读取时，区别a_Color 和 a_Position 的设置。

- 每个元素占4个字节，一个顶点信息包含坐标2个元素和颜色四个元素
   - 元素在这其实就是浮点数
- a_Position：坐标信息占用 2 个元素，故 size 设置为 2。 坐标信息是从第一个元素开始读取，偏移值为 0 ，所以 offset 设置为 0.
- a_Color：由于 color 信息占用 4 个元素，所以 size 设置为 4 。 color 信息是在坐标信息之后，偏移两个元素所占的字节（2 * 4 = 8）。所以，offset 设置为 8。
- stride：代表一个顶点信息所占用的字节数，我们的示例，一个顶点占用 6 个元素，每个元素占用 4 字节，所以，stride = 4 * 6 = 24 个字节。
```glsl
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>webgl</title>
	</head>

	<body>
		<canvas id="canvas"></canvas>
	</body>
	<!-- 顶点着色器 -->
	<script id="vertexShader" type="x-shader/x-vertex">
		//浮点数设置为中等精度
		precision mediump float;
		//接收 JavaScript 传递过来的点的坐标（X, Y）
		attribute vec2 a_Position;
		// 接收canvas的尺寸。
		attribute vec2 a_Screen_Size;
		//接收 JavaScript 传递过来的点的颜色信息（R, G, B, A）
		attribute vec4 a_Color;
		//将顶点着色器插值后的颜色颜色信息（R, G, B, A）传递给片元着色器。
		varying vec4 v_Color;
		void main(){
			// 将 canvas 的坐标值 转换为 [-1.0, 1.0]的范围。
			vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
			// canvas的 Y 轴坐标方向和 设备坐标系的相反。
			position = position * vec2(1.0, -1.0);
			// 最终的顶点坐标。
			gl_Position = vec4(position, 0.0, 1.0);

			v_Color = a_Color;
		}
	</script>
	<!-- 片元着色器 -->
	<script id="fragmentShader" type="x-shader/x-fragment">
		//浮点数设置为中等精度
		precision mediump float;
		//用来接收顶点着色器传递过来的颜色。
		varying vec4 v_Color;

		void main(){
			// 将颜色处理成 GLSL 允许的范围[0， 1]。
			vec4 color = v_Color / vec4(255, 255, 255, 1);
			// 点的最终颜色。
			gl_FragColor = color;
		}
	</script>
	<script type="module">
		import { initShaders, randomColor } from "../js/utils.js";
		import Poly from "../js/Poly.js";
		const canvas = document.querySelector("#canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		// 获取着色器文本
		const vsSource = document.querySelector("#vertexShader").innerText;
		const fsSource = document.querySelector("#fragmentShader").innerText;
		//三维画笔
		const gl = canvas.getContext("webgl");
		//初始化着色器
		const program = initShaders(gl, vsSource, fsSource);
		//声明颜色 rgba
		gl.clearColor(0, 0, 0, 1);
		//刷底色
		gl.clear(gl.COLOR_BUFFER_BIT);
		let a_Screen_Size = gl.getAttribLocation(program, "a_Screen_Size");
		gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);

		let positions = [];

		let a_Position = gl.getAttribLocation(program, "a_Position");
		let a_Color = gl.getAttribLocation(program, "a_Color");
		gl.enableVertexAttribArray(a_Position);
		gl.enableVertexAttribArray(a_Color);

		let buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 24, 0);
		gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 24, 8);

		//设置清屏颜色为黑色。
		gl.clearColor(0, 0, 0, 1);
		canvas.addEventListener("click", (e) => {
			positions.push(e.pageX, e.pageY);
			let color = randomColor();
			positions.push(color.r, color.g, color.b, color.a);
			// 顶点信息为 18 的整数倍即3个顶点时执行绘制操作，因为三角形由三个顶点组成，每个顶点由六个元素组成。
			if (positions.length % 18 == 0) {
				gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
				gl.bufferData(
					gl.ARRAY_BUFFER,
					new Float32Array(positions),
					gl.STATIC_DRAW
				);

				render(gl);
			}
		});
		function render(gl) {
			gl.clear(gl.COLOR_BUFFER_BIT);
			let primitiveType = gl.TRIANGLES;
			if (positions.length > 0) {
				gl.drawArrays(primitiveType, 0, positions.length / 6);
			}
		}
		render(gl);
		function createBuffer(gl, attribute, vertexAttribPointer) {
			let { size, type, normalize, stride, offset } = vertexAttribPointer;
			gl.enableVertexAttribArray(attribute);
			let buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.vertexAttribPointer(
				attribute,
				size,
				type || gl.FLOAT,
				normalize || false,
				stride || 0,
				offset || 0
			);
			return buffer;
		}
	</script>
</html>

```
