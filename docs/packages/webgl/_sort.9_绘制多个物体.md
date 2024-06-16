# 绘制多个物体
到这里webgl基本绘制的编写方式已经熟悉了，但是只是绘制了一个模型。如何绘制多个物体呢？基本过程如下：

- 初始化阶段
   - 创建所有着色器和程序并寻找参数位置
   - 创建缓冲并上传顶点数据
   - 创建纹理并上传纹理数据
- 首次渲染阶段
   - 为 uniforms 变量赋值
   - 处理 attribute 变量
      - 使用 gl.bindBuffer 重新绑定模型的 attribute 变量。
      - 使用 gl.enableVertexAttribArray 启用 attribute 变量。
      - 使用 gl.vertexAttribPointer设置 attribute变量从缓冲区中读取数据的方式。
      - 使用 gl.bufferData 将数据传送到缓冲区中。
   - 使用 gl.drawArrays（或者drawElements，需要顶点索引数据） 执行绘制。
- 后续渲染阶段
   - 清空并设置视图和其他全局状态（开启深度检测，剔除等等）
   - 对于想要绘制的每个物体
   - 调用 gl.useProgram 使用需要的程序
   - 设置物体的属性变量
      - 为每个属性调用 gl.bindBuffer, gl.vertexAttribPointer, gl.enableVertexAttribArray
   - 设置物体的全局变量
      - 为每个全局变量调用 gl.uniformXXX
      - 调用 gl.activeTexture 和 gl.bindTexture 设置纹理到纹理单元
   - 使用 gl.drawArrays （或者drawElements，需要顶点索引数据）执行绘制。
- 需要注意的是，绘制的时候在同一个绘制任务中
   - 就是一个js主线程代码执行周期中，或者说是同一个宏任务中
## 绘制多个矩形
随机计算一个矩形的顶点坐标和颜色，绘制一个就重新计算一个。
```javascript
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
	<!-- vertex shader -->
	<script id="vertexShader" type="x-shader/x-vertex">
				attribute vec2 a_position;

		uniform vec2 u_resolution;

		void main() {
		   // convert the rectangle from pixels to 0.0 to 1.0
		   vec2 zeroToOne = a_position / u_resolution;

		   // convert from 0->1 to 0->2
		   vec2 zeroToTwo = zeroToOne * 2.0;

		   // convert from 0->2 to -1->+1 (clipspace)
		   vec2 clipSpace = zeroToTwo - 1.0;

		   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
		}
	</script>
	<!-- fragment shader -->
	<script id="fragmentShader" type="x-shader/x-fragment">
				precision mediump float;

		uniform vec4 u_color;

		void main() {
		   gl_FragColor = u_color;
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
		// 获取顶点着色器中的属性和片元着色器中的 uniform 变量位置
		var positionAttributeLocation = gl.getAttribLocation(
			program,
			"a_position"
		);
		var resolutionUniformLocation = gl.getUniformLocation(
			program,
			"u_resolution"
		);
		var colorUniformLocation = gl.getUniformLocation(program, "u_color");
		// 创建一个存储顶点坐标的缓冲区对象
		var positionBuffer = gl.createBuffer();

		// 绑定缓冲区对象
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		// Turn on the attribute
		gl.enableVertexAttribArray(positionAttributeLocation);

		// Bind the position buffer.
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

		// 设置顶点属性指针
		var size = 2;
		var type = gl.FLOAT;
		var normalize = false;
		var stride = 0;
		var offset = 0;
		gl.vertexAttribPointer(
			positionAttributeLocation,
			size,
			type,
			normalize,
			stride,
			offset
		);

		// 设置画布分辨率
		gl.uniform2f(
			resolutionUniformLocation,
			gl.canvas.width,
			gl.canvas.height
		);
		// 循环绘制随机彩色矩形
		for (var ii = 0; ii < 50; ++ii) {
			// 设置随机位置和大小的矩形
			setRectangle(
				gl,
				randomInt(300),
				randomInt(300),
				randomInt(300),
				randomInt(300)
			);

			// 设置随机颜色
			gl.uniform4f(
				colorUniformLocation,
				Math.random(),
				Math.random(),
				Math.random(),
				1
			);

			// 绘制矩形
			var primitiveType = gl.TRIANGLES;
			var offset = 0;
			var count = 6;
			gl.drawArrays(primitiveType, offset, count);
		}
		// 随机生成一个整数.
		function randomInt(range) {
			return Math.floor(Math.random() * range);
		}

		// 填充缓冲区以定义一个矩形
		function setRectangle(gl, x, y, width, height) {
			var x1 = x;
			var x2 = x + width;
			var y1 = y;
			var y2 = y + height;
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array([
					x1,
					y1,
					x2,
					y1,
					x1,
					y2,
					x1,
					y2,
					x2,
					y1,
					x2,
					y2,
				]),
				gl.STATIC_DRAW
			);
		}
	</script>
</html>

```
## 绘制多个球体
直接在上一章绘制球体的基础上进行修改，公用球体顶点信息和顶点索引，改变下球体位置即可，关于矩阵部分后面内容会讲解。
由于只有一个程序，所以只调用了一次 gl.useProgram； 也可以使用不同的着色程序，通过调用gl.useProgram来切换。
```javascript
// 使用不同的着色程序的伪代码
objectsToDraw.forEach(function(object) {
  var programInfo = object.programInfo;
  var bufferInfo = object.bufferInfo;
  gl.useProgram(programInfo.program);
 
  // 设置所需的属性
  //...
  // 设置全局变量
  //...
  // 绘制
  gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
});
```
### 完整模型类代码
```javascript
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

		      void main(){
		          // 点的最终颜色。
		          gl_FragColor = v_Color;
		      }
	</script>
	<script src="../js//matrix.js"></script>
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
		//初始化着色器
		const program = initShaders(gl, vsSource, fsSource);
		const { positions, indices: inds } = createSphere(2, 10, 10);
		let vertices = new Float32Array(positions);
		const indices = new Int8Array(inds);
		var SIZE = vertices.BYTES_PER_ELEMENT;
		// 创建缓存对象
		const vertexBuffer = gl.createBuffer();
		const indexBuffer = gl.createBuffer();
		// 找到着色器中的全局变量 u_Color;
		let u_Matrix = gl.getUniformLocation(program, "u_Matrix");
		let a_Position = gl.getAttribLocation(program, "a_Position");
		let a_Color = gl.getAttribLocation(program, "a_Color");

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
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
			gl.clear(gl.COLOR_BUFFER_BIT);
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

			gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);

			var projectionMatrix2 = matrix.ortho(
				-aspect * 1,
				aspect * 7,
				-4,
				4,
				100,
				-100
			);
			matrix.multiply(projectionMatrix2, dstMatrix, dstMatrix);

			gl.uniformMatrix4fv(u_Matrix, false, dstMatrix);
			gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
			var projectionMatrix3 = matrix.ortho(
				-aspect * 7,
				aspect * 1,
				-4,
				4,
				100,
				-100
			);
			matrix.multiply(projectionMatrix3, dstMatrix, dstMatrix);

			gl.uniformMatrix4fv(u_Matrix, false, dstMatrix);
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
		document.body.addEventListener("click", function () {
			playing = !playing;
			render();
		});
		render();
	</script>
</html>

```
## 绘制若干个3D图形
上面的方式比较简单粗暴，但是如果要绘制很多个就得写很多重复代码，可以对绘制若干个的方法进行封装。
### 模型类的封装

- 初始化的时候接受两个参数：
   - 顶点相关数据**bufferInfo**
      - 顶点位置、颜色、法向量、纹理坐标等。
      - 根据类型分类，attribute相关的就放到bufferInfo.attribute中
      - 顶点索引就放到bufferInfo.indices中
      - 绘制顶点的数量放到bufferInfo.elementsCount中
      - 提供修改bufferInfo的方法
         - 除了初始化以外，还需要能对其操作
         - setBufferInfo
      - 需要注意的是最初得到的顶点模型数据不一定符合我们分封装的要求，所以需要转换
   - 非顶点相关数据**uniforms**
      - 矩阵相关、光照、uniforms 变量等
- 设置模型状态
   - 位移
   - 缩放
   - 旋转
   - 预处理
   - 封装顶点数据的操作
   - 封装 uniforms 变量操作

目前到现在学习的内容还不足以完成功能的封装，矩阵数学相关知识点会在后面介绍。
```javascript
class Model {
	/**
	 *
	 * @param {object} bufferInfo 顶点相关信息，顶点位置、颜色、法向量、纹理坐标等
	 * @param {object} uniforms 顶点以外的信息，矩阵相关、光照等
	 */
	constructor(bufferInfo, uniforms) {
		this.uniforms = uniforms || {};
		this.u_Matrix = matrix.identity();
		this.bufferInfo = bufferInfo || {};

		// 偏移
		this.translation = [0, 0, 0];
		// 旋转角度
		this.rotation = [0, 0, 0];
		// 缩放
		this.scalation = [1, 1, 1];
	}
	// 修改设置顶点相关信息
	setBufferInfo(bufferInfo) {
		this.bufferInfo = bufferInfo || {};
	}
	/**
	 *
	 * @param {object} params 设置模型位移
	 * @param {string} params.type 设置类型all，x，y，z,默认值为all
	 * @param {Array} params.value 位移的值[x,y,z]，默认值为[0,0,0]
	 */
	translate(params) {
		let { type, value } = params || { type: all, value: [0, 0, 0] };
		switch (type) {
			case "all":
				this.translation[0](value[0]);
				this.translation[1](value[1]);
				this.translation[2](value[2]);
				break;
			case "x":
				this.translation[0](value[0]);
				break;
			case "y":
				this.translation[1](value[1]);
				break;
			case "z":
				this.translation[2](value[2]);
				break;
		}
	}
}
```
