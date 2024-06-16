# 纹理贴图
前面的例子都是填充颜色，这一节来介绍不一样的方式贴图。就是将像素（texels）以数组方式传给 GPU 的对象.其实也可以传颜色。

- 准备好需要映射到物体上的纹理图像，例如PNG、BMP等
- 给几何图形配置的纹理映射方式
- 加载纹理图像，并进行配置，以在WebGL中使用
- 在片元着色器中将相应的纹素从纹理中抽取出来，并将纹素中的颜色通过片元进行绘制
- 创建纹理对象
```
const texture = gl.createTexture(); 
```

- 绑定到纹理单元
```
gl.bindTexture(gl.TEXTURE_2D, texture); 
```
WebGL 支持设置多个纹理单元，可以将多个图片放到多个单元中，然后进行切换。支持的数量可以通过下面api获取
```
gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)
```
默认使用 0 号纹理单元，可以切换，要在将纹理对象绑定纹理单元之前执行
```
gl.activeTexture(gl.TEXTURE1);
```
纹理采样器选择使用哪个纹理单元，默认会使用 0 号纹理单元。
```
gl.uniform1i(u_Sampler, 0);
```
切换纹理单元是有一定的性能代价的，不建议你在短时间内不断地切换纹理单元。
## 纹理图片格式
WebGL 对图片素材是有严格要求的，图片的宽度和高度必须是 2 的 N 次幂，比如 16 x 16，32 x 32，64 x 64 等。但是实际上不符合这个要求的也能贴，但是这样贴图过程更复杂，从而影响性能。
## 纹理坐标系统
纹理也有一套自己的坐标系统，为了和顶点坐标加以区分，通常把纹理坐标称为 UV，U 代表横轴坐标，V 代表纵轴坐标。

- 图片坐标系统的特点是：
   - 左上角为原点(0, 0)。
   - 向右为横轴正方向，横轴最大值为 1，即横轴坐标范围【1，0】。
   - 向下为纵轴正方向，纵轴最大值为 1，即纵轴坐标范围【0，1】。
- 纹理坐标系统不同于图片坐标系统，它的特点是：
   - 左下角为原点(0, 0)。
   - 向右为横轴正方向，横轴最大值为 1，即横轴坐标范围【1，0】。
   - 向上为纵轴正方向，纵轴最大值为 1，即纵轴坐标范围【0，1】。
## 贴如纹理
### 着色器
顶点着色器接收顶点的 UV 坐标，并将UV坐标传递给片元着色器。片元着色器要能够接收顶点插值后的UV坐标，同时能够在纹理资源找到对应坐标的颜色值。
### 顶点着色器
增加名为 v_Uv 的 attribute 变量，接收 JavaScript 传递过来的 UV 坐标。
增加一个 varying 变量 v_Uv，将 UV 坐标插值化，并传递给片元着色器。
```javascript
    precision mediump float;
   // 接收顶点坐标 (x, y)
   attribute vec2 a_Position;
   // 接收 canvas 尺寸(width, height)
   attribute vec2 a_Screen_Size;
   // 接收JavaScript传递过来的顶点 uv 坐标。
   attribute vec2 a_Uv;
   // 将接收的uv坐标传递给片元着色器
   varying vec2 v_Uv;
   void main(){
     vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
     position = position * vec2(1.0,-1.0);
     gl_Position = vec4(position, 0, 1);
     // 将接收到的uv坐标传递给片元着色器
     v_Uv = a_Uv;
   }

```
### 片元着色器
增加一个 varying 变量 v_Uv，接收顶点着色器插值过来的 UV 坐标。
增加一个 sampler2D 类型的全局变量 texture，用来接收 JavaScript 传递过来的纹理资源（图片数据）
```javascript
	precision mediump float;
	// 接收顶点着色器传递过来的 uv 值。
	varying vec2 v_Uv;
	// 接收 JavaScript 传递过来的纹理
	uniform sampler2D texture;
	void main(){
		// 提取纹理对应uv坐标上的颜色，赋值给当前片元（像素）。
  		gl_FragColor = texture2D(texture, vec2(v_Uv.x, v_Uv.y));
	}

```
### JavaScript 部分
将纹理图片加载到内存中
```javascript
    var img = new Image();
    img.onload = textureLoadedCallback;
    img.src = "";

```
需要注意在通过canvas读取图片信息的时候，会受到浏览器跨域的限制
图片加载完成之后才能执行纹理的操作，通过textureLoadedCallback回调方法
### 完整代码
```html
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
        attribute vec2 a_Position;
        uniform vec2 u_Screen_Size;
        varying vec2 v_Uv;
        attribute vec2 a_Uv;

        void main(){
            vec2 position = (a_Position / u_Screen_Size) * 2.0 - 1.0;
            position = position * vec2(1.0, -1.0);
            gl_Position = vec4(position, 0, 1);
            v_Uv = a_Uv;
        }
    </script>
    <!-- 片元着色器 -->
    <script id="fragmentShader" type="x-shader/x-fragment">
        //浮点数设置为中等精度
           precision mediump float;
           varying vec2 v_Uv;
           uniform sampler2D u_Texture;
           void main(){
               // 点的最终颜色。
               gl_FragColor = texture2D(u_Texture, vec2(v_Uv.x, v_Uv.y));
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
        let positions = [
            30, 30, 0, 0, 30, 300, 0, 1, 300, 300, 1, 1, 30, 30, 0, 0, 300, 300,
            1, 1, 300, 30, 1, 0,
        ];

        // 找到着色器中的全局变量 u_Texture;
        var u_Texture = gl.getUniformLocation(program, "u_Texture");
        var u_Screen_Size = gl.getUniformLocation(program, "u_Screen_Size");
        gl.uniform2f(u_Screen_Size, canvas.width, canvas.height);
        var a_Position = gl.getAttribLocation(program, "a_Position");
        var a_Uv = gl.getAttribLocation(program, "a_Uv");

        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Uv);
        // 创建缓冲区
        var buffer = gl.createBuffer();
        // 绑定缓冲区为当前缓冲
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        // 设置 a_Position 属性从缓冲区读取数据方式
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 16, 0);
        // 设置 a_Uv 属性从缓冲区读取数据方式
        gl.vertexAttribPointer(a_Uv, 2, gl.FLOAT, false, 16, 8);
        // 向缓冲区传递数据
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(positions),
            gl.STATIC_DRAW
        );

        function render() {
            gl.clear(gl.COLOR_BUFFER_BIT);
            if (positions.length <= 0) {
                return;
            }
            gl.drawArrays(gl.TRIANGLES, 0, positions.length / 4);
        }

        loadTexture(
            gl,
            "../img/441be01fdf47ec0352a3c6cbf7c524bd.jpg",
            u_Texture,
            function () {
                render();
            }
        );
        function loadTexture(gl, src, attribute, callback) {
            let img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = function () {
                gl.activeTexture(gl.TEXTURE0);
                let texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    gl.RGBA,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    img
                );
                gl.texParameterf(
                    gl.TEXTURE_2D,
                    gl.TEXTURE_MAG_FILTER,
                    gl.LINEAR
                );
                gl.texParameterf(
                    gl.TEXTURE_2D,
                    gl.TEXTURE_MIN_FILTER,
                    gl.LINEAR
                );
                gl.uniform1i(attribute, 0);
                callback && callback();
            };
            img.src = src;
        }
    </script>
</html>
```

## 纯色纹理

```html
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
        attribute vec4 a_Position;
        attribute vec2 a_TexCoord;
        varying vec2 v_TexCoord;
        void main() {
        gl_Position = a_Position;
        v_TexCoord = a_TexCoord;
        }
    </script>
    <!-- 片元着色器 -->
    <script id="fragmentShader" type="x-shader/x-fragment">
        precision highp float;
        uniform sampler2D u_Sampler;
        varying vec2 v_TexCoord;
        void main() {
          gl_FragColor = texture2D(u_Sampler, v_TexCoord);
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
        // 顶点坐标，纹理坐标
        const verticesTexCoords = new Float32Array([
            // 左上点。
            -0.5, 0.5, 0.0, 1,
            // 左下
            -0.5, -0.5, 0.0, 0.0,
            // 右上
            0.5, 0.5, 1, 1,
            // 右下
            0.5, -0.5, 1, 0.0,
        ]);
      	//获取每个数组元素占用的字节数。
        const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

        // 创建缓存对象
        const verticesTexBuffer = gl.createBuffer();
        // 绑定缓存对象到上下文
        gl.bindBuffer(gl.ARRAY_BUFFER, verticesTexBuffer);
        // 向缓存区写入数据
        gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

        // 获取 a_Position 变量地址
        const a_Position = gl.getAttribLocation(gl.program, "a_Position");
        // 将缓冲区对象分配给 a_Position 变量
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
        // 允许访问缓存区
        gl.enableVertexAttribArray(a_Position);

        // 传入纹理坐标位置信息
        const a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");
        gl.vertexAttribPointer(
            a_TexCoord,
            2,
            gl.FLOAT,
            false,
            FSIZE * 4,
            FSIZE * 2
        );
        gl.enableVertexAttribArray(a_TexCoord);
        // 创建纹理对象
        const texture = gl.createTexture();
        // 获取 u_Sampler 地址
        const u_Sampler = gl.getUniformLocation(gl.program, "u_Sampler");
        // 记载图片
        // 翻转纹路图像的 y 轴
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        // 开启 0 号纹理单元
        gl.activeTexture(gl.TEXTURE0);
        // 将我们的纹理对象绑定上去
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // 配置纹理参数
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        const data = new Uint8Array([
            255, 0, 0, 0, 255, 255, 0, 255, 0, 0, 255, 0,
        ]);
        gl.texImage2D(
            gl.TEXTURE_2D, // 纹理目标
            0, // 细节级别
            gl.RGB, // 纹理内部格式
            1,//纹理宽度
            1,//纹理高度
            0,//边框
            gl.RGB, // 源图像数据格式
            gl.UNSIGNED_BYTE, // 纹素数据类型
            data // 数据
        );

        gl.uniform1i(u_Sampler, 0); // 开启 0 号纹理对象

        // 绘制矩形，这里提供了 4 个点
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    </script>
</html>
```
## 通过切换纹理单元渲染不同的图片
```html
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
		attribute vec2 a_position;
		    attribute vec2 a_texCoord;
		    varying vec2 v_texCoord;

		    void main() {
		      gl_Position = vec4(a_position, 0, 1);
		      v_texCoord = a_texCoord;
		    }
	</script>
	<!-- 片元着色器 -->
	<script id="fragmentShader" type="x-shader/x-fragment">
		precision mediump float;
		    varying vec2 v_texCoord;
		    uniform sampler2D u_texture;

		    void main() {
		      gl_FragColor = texture2D(u_texture, v_texCoord);
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

		var positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
			gl.STATIC_DRAW
		);

		var texCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
			gl.STATIC_DRAW
		);

		var positionLocation = gl.getAttribLocation(program, "a_position");
		var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
		gl.enableVertexAttribArray(positionLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(texCoordLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
		gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

		var texture1 = gl.createTexture();
		var texture2 = gl.createTexture();

		function loadTexture(url, texture, unit) {
			var image = new Image();
			image.onload = function () {
				gl.activeTexture(gl.TEXTURE0 + unit);
				gl.bindTexture(gl.TEXTURE_2D, texture);
				gl.texImage2D(
					gl.TEXTURE_2D,
					0,
					gl.RGBA,
					gl.RGBA,
					gl.UNSIGNED_BYTE,
					image
				);
				gl.texParameteri(
					gl.TEXTURE_2D,
					gl.TEXTURE_MAG_FILTER,
					gl.LINEAR
				);
				gl.texParameteri(
					gl.TEXTURE_2D,
					gl.TEXTURE_MIN_FILTER,
					gl.LINEAR
				);
			};
			image.src = url;
		}

		loadTexture("../img/1.jpeg", texture1, 0);
		loadTexture("../img/2.png", texture2, 1);

		var uniformLocation = gl.getUniformLocation(program, "u_texture");

		function render(unit) {
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.activeTexture(gl.TEXTURE0 + unit);
			// 与激活纹理时的通道值保持一致。
			gl.uniform1i(uniformLocation, unit);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		}

		var currentTexture = 0;

		function switchTexture() {
			if (currentTexture === 0) {
				currentTexture = 1;
			} else {
				currentTexture = 0;
			}
			// 查询当前绑定的纹理单元
			// const activeTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
			// console.log("当前的纹理单元为：" + activeTexture);
		}

		setInterval(switchTexture, 1000);

		function animate() {
			render(currentTexture);
			requestAnimationFrame(animate);
		}

		animate();
	</script>
</html>

```
## 通过切换纹理对象渲染不同的图片
切换纹理对象，绑定到纹理单元上面
```html
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
        attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;

            void main() {
              gl_Position = vec4(a_position, 0, 1);
              v_texCoord = a_texCoord;
            }
    </script>
    <!-- 片元着色器 -->
    <script id="fragmentShader" type="x-shader/x-fragment">
        precision mediump float;
            varying vec2 v_texCoord;
            uniform sampler2D u_texture;

            void main() {
              gl_FragColor = texture2D(u_texture, v_texCoord);
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

        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
            gl.STATIC_DRAW
        );

        var texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
            gl.STATIC_DRAW
        );

        var positionLocation = gl.getAttribLocation(program, "a_position");
        var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(texCoordLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        var texture1 = gl.createTexture();
        var texture2 = gl.createTexture();

        function loadTexture(url, texture, num) {
            var image = new Image();
            image.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    gl.RGBA,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    image
                );
                gl.texParameteri(
                    gl.TEXTURE_2D,
                    gl.TEXTURE_MAG_FILTER,
                    gl.LINEAR
                );
                gl.texParameteri(
                    gl.TEXTURE_2D,
                    gl.TEXTURE_MIN_FILTER,
                    gl.LINEAR
                );
            };
            image.src = url;
        }

        loadTexture("../img/1.jpeg", texture1);
        loadTexture("../img/2.png", texture2);
      	//即使在JavaScript中没有直接为u_texture变量赋值，只要纹理图片数据被正确地上传到GPU内存中，并且在着色器程序中正确地引用了这个纹理对象，那么这段代码仍然可以正常工作，并且能够实现纹理贴图的效果。
      	//WebGL 会默认将纹理对象绑定到纹理单元0，并且 u_texture 变量默认与纹理单元0关联  
      	//需要注意的是，尽管可能产生预期的纹理贴图效果，但这种做法是依赖于默认行为的，可能在不同的 WebGL 实现中表现不一致。为了代码的可靠性和可移植性，建议始终显式地为 u_texture 变量赋值，并进行正确的纹理单元绑定和纹理坐标采样设置。这样可以确保代码在各种环境中正常工作。
				//var uniformLocation = gl.getUniformLocation(program, "u_texture");

        function render(texture) {
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }

        var currentTexture = texture1;

        function switchTexture() {
            if (currentTexture === texture1) {
                currentTexture = texture2;
            } else {
                currentTexture = texture1;
            }
            // 查询当前绑定的纹理单元
            // const activeTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
            // console.log("当前的纹理单元为：" + activeTexture);
        }

        setInterval(switchTexture, 1000);

        function animate() {
            render(currentTexture);
            requestAnimationFrame(animate);
        }

        animate();
    </script>
</html>
```
## 总结
到这离我们已经掌握了绘制平面的方法，下面是对之前的知识点总结：

- GLSL：着色器
   - 数据类型
      - vec2：2 维向量容器。
      - vec4：4 维向量容器。
      - 运算法则：向量与向量、向量与浮点数的运算法则。
   - 修饰符
      - attribute：属性修饰符。
      - uniform：全局变量修饰符。
      - varying：顶点着色器传递给片元着色器的属性修饰符。
   - precision：设置精度
      - highp：高精度。
      - mediump：中等精度。
      - lowp：低精度。
   - 内置变量
      - gl_Position：顶点坐标。
      - gl_FragColor：片元颜色。
      - gl_PointSize：顶点大小。
   - 屏幕坐标系到设备坐标系的转换。
      - 屏幕坐标系左上角为原点，X 轴坐标向右为正，Y 轴坐标向下为正。
      - 坐标范围：
         - X轴：【0, canvas.width】
         - Y轴：【0, canvas.height】
      - 设备坐标系以屏幕中心为原点，X 轴坐标向右为正，Y 轴向上为正。
      - 坐标范围是
         - X轴：【-1, 1】。
         - Y轴：【-1, 1】。
- WebGL API
   - shader：着色器对象
      - gl.createShader：创建着色器。
      - gl.shaderSource：指定着色器源码。
      - gl.compileShader：编译着色器。
   - program：着色器程序
      - gl.createProgram：创建着色器程序。
      - gl.attachShader：链接着色器对象。
      - gl.linkProgram：链接着色器程序。
      - gl.useProgram：使用着色器程序。
   - attribute：着色器属性
      - gl.getAttribLocation：获取顶点着色器中的属性位置。
      - gl.enableVertexAttribArray：启用着色器属性。
      - gl.vertexAttribPointer：设置着色器属性读取 buffer 的方式。
      - gl.vertexAttrib2f：给着色器属性赋值，值为两个浮点数。
      - gl.vertexAttrib3f：给着色器属性赋值，值为三个浮点数。
   - uniform：着色器全局属性
      - gl.getUniformLocation：获取全局变量位置。
      - gl.uniform4f：给全局变量赋值 4 个浮点数。
      - gl.uniform1i：给全局变量赋值 1 个整数。
   - buffer：缓冲区
      - gl.createBuffer：创建缓冲区对象。
      - gl.bindBuffer：将缓冲区对象设置为当前缓冲。
      - gl.bufferData：向当前缓冲对象复制数据。
   - clear：清屏
      - gl.clearColor：设置清除屏幕的背景色。
      - gl.clear：清除屏幕。
   - draw：绘制
      - gl.drawArrays：数组绘制方式。
      - gl.drawElements：索引绘制方式。
   - 图元
      - gl.POINTS：点。
      - gl.LINE：基本线段。
      - gl.LINE_STRIP：连续线段。
      - gl.LINE_LOOP：闭合线段。
      - gl.TRIANGLES：基本三角形。
      - gl.TRIANGLE_STRIP：三角带。
      - gl.TRIANGLE_FAN：三角扇。
   - 纹理
      - gl.createTexture：创建纹理对象。
      - gl.activeTexture：激活纹理单元。
      - gl.bindTexture：绑定纹理对象到当前纹理。
      - gl.texImage2D：将图像或像素数据加载到 WebGL 纹理（纹理对象）中，将图片数据传递给 GPU。指定了二维纹理图像。
         - target：表示要绑定的纹理类型，可以是以下之一：
            - gl.TEXTURE_2D：二维纹理
            - gl.TEXTURE_CUBE_MAP_POSITIVE_X：立方体贴图的正 x 面
            - gl.TEXTURE_CUBE_MAP_NEGATIVE_X：立方体贴图的负 x 面
            - gl.TEXTURE_CUBE_MAP_POSITIVE_Y：立方体贴图的正 y 面
            - gl.TEXTURE_CUBE_MAP_NEGATIVE_Y：立方体贴图的负 y 面
            - gl.TEXTURE_CUBE_MAP_POSITIVE_Z：立方体贴图的正 z 面
            - gl.TEXTURE_CUBE_MAP_NEGATIVE_Z：立方体贴图的负 z 面
            - gl.texParameterf：设置图片放大缩小时的过滤算法。
         - level：表示加载图像的细节级别，一般为 0。
            - 表示多级分辨率的纹理图像的级数，若只有一种分辨率，则 level 设为 0，通常我们使用一种分辨率
         - components：纹理通道数，通常我们使用 RGBA 和 RGB 两种通道
         - internalFormat：表示纹理的内部格式，可以是以下之一：
            - gl.RGBA：每个像素由红、绿、蓝、透明度四个分量组成
            - gl.RGB：每个像素由红、绿、蓝三个分量组成
            - gl.LUMINANCE_ALPHA：每个像素由亮度和透明度两个分量组成
            - gl.LUMINANCE：每个像素只有亮度分量
         - format：表示数据源的格式，一般与 internalFormat 相同。
         - type：表示数据的类型，可以是以下之一：
            - gl.UNSIGNED_BYTE：无符号字节
            - gl.FLOAT：浮点数
         - source：表示图像数据的来源，可以是以下之一：
            - HTMLImageElement 或 HTMLCanvasElement 对象
            - ImageData 对象
            - Video 对象
            - ArrayBufferView（例如 Uint8Array）对象
      - texture2D函数用于在片元着色器（fragment shader）中从纹理中获取特定坐标处的像素颜色。它接受两个参数：纹理对象和纹理坐标。
         - 纹理对象 (u_Texture)：这是一个从顶点着色器传递到片元着色器的纹理对象。它通常通过 uniform 变量传递给片元着色器。
         - 纹理坐标 (vec2(v_Uv.x, v_Uv.y))：这是一个二维向量，表示纹理上的坐标。它通常通过顶点着色器传递给片元着色器，并在顶点着色器中进行插值以获取片元着色器中的实际值。
         - 函数返回一个包含纹理坐标处像素颜色的四维向量。你可以通过 .r、.g、.b 和 .a 成员变量来访问该像素颜色的红、绿、蓝和透明度分量。

