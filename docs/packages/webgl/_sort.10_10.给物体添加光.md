# 10.给物体添加光
 我们能看到各种颜色就是因为光，人眼看到的物体是什么颜色，就代表这个物体反射该颜色。在计算机中，我们表示物体的颜色时，其实就是设置该物体能够反射的可见光。
在计算光照时，需要考虑入射光的方向和颜色，以及物体表面的基底色和反射特性。
### 颜色
在计算机中，我们表示物体的颜色时，其实就是设置该物体能够反射的可见光。比如我们为一个物体指定红色，本质就是让该物体吸收除了红色以外的光线，只反射红色光线，这样我们看到的物体就是红色的。
### 光源
当我们在计算机中创建一个光源时，需要给光源设置一个颜色
```javascript
vec3 light = vec3(1, 1, 1);
```
加入光照因素后，会影响进入人眼的颜色，将**光源颜色的各个分量与物体颜色的各个分量相乘**，得到的就是物体所反射的颜色，即该物体在该光源照射下进入人眼的颜色。
在 GLSL 语言中，vec3 与 vec3 相乘的实质是将两个 vec3 的分量分别相乘，得到一个新的 vec3。
```javascript
// 白色光源
vec3 light = vec3(1, 1, 1);
// 红色物体
vec3 color = vec3(1, 0, 0);
// 反射的光为红色
vec3 resultColor = light * color;
// vec3(1 * 1, 1 * 0, 1 * 0) = vec3(1, 0, 0)
// 蓝色光源
vec3 light = vec3(0, 0, 1);
// 红色物体
vec3 color = vec3(1, 0, 0);
// 反射颜色为黑色，或者说是进入人眼的颜色是黑色
vec3 resultColor = light * color;
// resultColor = (0 * 1, 0 * 0, 1 * 0) = (0, 0, 0)
```
### 环境光
在现实生活中，光是会漫反射的，漫反射的光线碰到另一个物体时，还会再次进行漫反射。这也是为什么没有光线照射到某个物体的情况下，我们还能看到它的原因。
在计算机中定义一种环境光的概念，来近似模拟这种效果。不是真正的漫反射。模拟多个物体的漫反射互相作用的光线效果。
#### 环境光的计算
一般我们使用一个**较小的常量乘以光的颜色来模拟环境光**。
假设有一个光源，发出的光线是白色光：
```javascript
vec3 lightColor = vec3(1, 1, 1);
```
定义环境光的常量因子为 0.1
```javascript

float ambientFactor = 0.1;
```
那么环境光的计算如下：
```javascript
vec3 ambientColor = ambientFactor * lightColor;
// ambientColor = (1 * 0.1, 0.1 * 1, 0.1 * 1) = (0.1, 0.1, 0.1)
```
### 给物体增加环境光
前面章节并没有提到光这个概念，实际上默认有一个白色的环境光在里面的，所以我们能够看到各种图形。
不适用默认的就需要定义强度因子和光源颜色
增加了环境光的片元着色器如下：
```glsl
precision mediump float;
varying vec4 v_Color;
//光源颜色
uniform vec3 u_LightColor;
//环境光强度因子
uniform float u_AmbientFactor;
void main(){
  vec3 ambientColor = u_AmbientFactor * u_LightColor;
  gl_FragColor = vec4(ambientColor, 1) * v_Color;
}

```
通过 JavaScript 给片元着色器传递这两个常量：
```javascript
var u_AmbientFactor = gl.getUniformLocation(program, 'u_AmbientFactor');
var u_LightColor = gl.getUniformLocation(program, 'u_LightColor');
gl.uniform1f(u_AmbientFactor, value); 
gl.uniform1f(u_LightColor, value); 
```
#### 完整代码
在前面球体绘制的基础上增加光照，可以手动设置光的颜色和强度因子。
```javascript
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>webgl</title>
		<style>
			html,
			body {
				margin: 0;
				padding: 0;
			}
			.container {
				position: absolute;
				left: 30px;
				top: 30px;
				color: #fff;
			}
			.container > div {
				margin-bottom: 10px;
			}
			.container label {
				width: 30px;
				display: inline-block;
				vertical-align: top;
			}
			.container span {
				width: 150px;
				display: inline-block;
				vertical-align: top;
				text-align: right;
			}
			.range {
				opacity: 0.9;
				width: 180px;
				border-radius: 10px; /*è¿™ä¸ªå±žæ€§è®¾ç½®ä½¿å¡«å……è¿›åº¦æ¡æ—¶çš„å›¾å½¢ä¸ºåœ†è§’*/
				background-color: #fff;
				vertical-align: top;
			}
			input[type="range"]::-webkit-slider-thumb {
				-webkit-appearance: none;
				-moz-appearance: none;
				appearance: none;
				-webkit-box-shadow: 0 0 2px; /*è®¾ç½®æ»‘å—çš„é˜´å½±*/
				width: 2.6rem;
				height: 1.6rem;
			}

			input[type="range"]::-webkit-slider-runnable-track {
				height: 15px;
				border-radius: 10px;
				background: #fff;
			}
			button {
				outline: 0;
				color: #ff4d4f;
				background-color: transparent;
				border-color: #ff4d4f;
				text-shadow: none;
				border-width: 2px;
				height: 32px;
				padding: 0 15px;
				font-size: 14px;
				border-radius: 4px;
				border-style: outset;
				-webkit-appearance: button;
				box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
			}
		</style>
	</head>

	<body>
		<canvas id="canvas"></canvas>
		<div class="container">
			<div>
				环境光强度：
				<input
					id="ambientFactor"
					class="range"
					type="range"
					min="0"
					max="1"
					step="0.01"
					value="0.5"
				/>
				<label id="factor">0.5</label>
			</div>
			<div>
				环境光颜色：
				<input
					id="lightColor"
					class="color"
					type="color"
					value="#FFFFFF"
				/>
				<label id="light" style="width: 230px"
					>r : 255, g : 255, b : 255</label
				>
			</div>
			<button id="switchButton">播放</button>
		</div>
	</body>
	<!-- 顶点着色器 -->
	<script id="vertexShader" type="x-shader/x-vertex">
		//浮点数设置为中等精度
		      precision mediump float;
		      //接收 JavaScript 传递过来的点的坐标（X, Y, Z）
		      attribute vec3 a_Position;
		      // 接收顶点颜色
		      attribute vec4 a_Color;
		      varying vec4 v_Color;
		      uniform mat4 u_Matrix;

		      void main(){
		          gl_Position = u_Matrix * vec4(a_Position, 1);
		          // 将顶点颜色插值处理传递给片元着色器
		          v_Color = a_Color;
		          gl_PointSize = 5.0;
		      }
	</script>
	<!-- 片元着色器 -->
	<script id="fragmentShader" type="x-shader/x-fragment">
		//浮点数设置为中等精度
		precision mediump float;
		varying vec4 v_Color;
		// 接收环境光照颜色
		uniform vec3 u_LightColor;
		// 接收环境光强度因子
		uniform float u_AmbientFactor;
		void main(){
			// 实际求得环境光
			vec3 ambient = u_AmbientFactor * u_LightColor;
			//最终物体反色的颜色，也就是眼睛看到的颜色
		    gl_FragColor = v_Color * vec4(ambient, 1);
		}
	</script>
	<script src="../js/matrix.js"></script>
	<script type="module">
		import { initShaders, randomColor, createSphere } from "../js/utils.js";
		const canvas = document.querySelector("#canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		// 获取着色器文本
		const vsSource = document.querySelector("#vertexShader").innerText;
		const fsSource = document.querySelector("#fragmentShader").innerText;
		//三维画笔
		const gl = canvas.getContext("webgl");
		gl.enable(gl.CULL_FACE); //背面剔除
		//初始化着色器
		const program = initShaders(gl, vsSource, fsSource);
		const { positions, indices: inds } = createSphere(2, 10, 20);
		//正方体 8 个顶点的坐标信息
		// prettier-ignore
		let vertices =  new Float32Array(positions);
		// prettier-ignore
		const indices = new Int8Array(inds);
		// prettier-ignore
		// 数组类型：           占的字节数
		// Int8Array;         // 1
		// Uint8Array;        // 1
		// Uint8ClampedArray; // 1
		// Int16Array;        // 2
		// Uint16Array;       // 2
		// Int32Array;        // 4
		// Uint32Array;       // 4
		// Float32Array;      // 4
		// Float64Array;      // 8
		var SIZE = vertices.BYTES_PER_ELEMENT;
		// 创建缓存对象
		const vertexBuffer = gl.createBuffer();
		const colorBuffer = gl.createBuffer();
		const indexBuffer = gl.createBuffer();
		// 找到着色器中的全局变量 u_Color;
		let u_Matrix = gl.getUniformLocation(program, "u_Matrix");
		let a_Position = gl.getAttribLocation(program, "a_Position");
		let a_Color = gl.getAttribLocation(program, "a_Color");
		var u_AmbientFactor = gl.getUniformLocation(program, "u_AmbientFactor");
		var u_LightColor = gl.getUniformLocation(program, "u_LightColor");
		gl.uniform3f(u_LightColor, 1, 1, 1);
		gl.uniform1f(u_AmbientFactor, 0.5);
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

		gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, SIZE * 7, 0);
		gl.enableVertexAttribArray(a_Position);

		// gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		// gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
		gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, SIZE * 7, SIZE * 3);
		gl.enableVertexAttribArray(a_Color);
		gl.clearColor(0, 0, 0, 1);
		//隐藏背面
		gl.enable(gl.CULL_FACE);

		var aspect = canvas.width / canvas.height;
		//计算正交投影矩阵
		var projectionMatrix = matrix.ortho(
			-aspect * 4,
			aspect * 4,
			-4,
			4,
			100,
			-100
		);
		var deg2radians = window.lib3d.math.deg2radians;
		var dstMatrix = matrix.identity();
		/*渲染*/
		function render() {
			xAngle += 1;
			yAngle += 1;
			//先绕 Y 轴旋转矩阵。
			matrix.rotationY(deg2radians(yAngle), dstMatrix);
			//再绕 X 轴旋转
			matrix.multiply(
				dstMatrix,
				matrix.rotationX(deg2radians(xAngle), tmpMatrix),
				dstMatrix
			);
			//模型投影矩阵。
			matrix.multiply(projectionMatrix, dstMatrix, dstMatrix);

			gl.uniformMatrix4fv(u_Matrix, false, dstMatrix);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
			if (!playing) {
				return;
			}
			requestAnimationFrame(render);
		}

		var playing = false;
		var xAngle = 0;
		var yAngle = 0;
		var dstMatrix = matrix.identity();
		var tmpMatrix = matrix.identity();
		switchButton.addEventListener("click", function () {
			playing = !playing;
			render();
		});
		render();
		// 光颜色
		document.querySelector("#light").innerHTML =
			"r : 255, g : 255, b : 255";
		document
			.querySelector("#lightColor")
			.addEventListener("input", function () {
				var color = getRGBFromColor(this.value);
				document.querySelector("#light").innerHTML =
					"r : " + color.r + ", g : " + color.g + ", b : " + color.b;
				gl.uniform3f(
					u_LightColor,
					color.r / 255,
					color.g / 255,
					color.b / 255
				);
			});
		// 强度
		document.querySelector("#factor").innerHTML =
			document.querySelector("#ambientFactor").value;
		document
			.querySelector("#ambientFactor")
			.addEventListener("input", function () {
				gl.uniform1f(u_AmbientFactor, this.value);
				document.querySelector("#factor").innerHTML = this.value;
			});

		function getRGBFromColor(color) {
			console.log(color);
			color = color.startsWith("#") ? color.substr(1) : color;
			var hex = color.split("");
			var r = parseInt(hex[0], 16) * 16 + parseInt(hex[1], 16);
			var g = parseInt(hex[2], 16) * 16 + parseInt(hex[3], 16);
			var b = parseInt(hex[4], 16) * 16 + parseInt(hex[5], 16);
			return {
				r: r,
				g: g,
				b: b,
			};
		}
	</script>
</html>

```
