# 冯氏光照模型
冯氏光照模型（Phong lighting model）是计算机图形学中常用的一种光照模型，用于模拟物体表面的光照效果。冯氏光照模型可以通过调整环境光、漫反射光和镜面反射光的强度和颜色，来实现不同的光照效果和材质效果。

- 环境光（Ambient）。生活中，即使是黑暗的环境，依旧存在着一些光照（如月光），环境光就是模拟这个的。有环境光时，物体几乎是不会黑暗的。
   - 来自于所有方向的均匀光照，没有明确的光源方向和位置。环境光使物体整体呈现柔和的明暗过渡效果。
- 漫反射（Diffuse）。该部分用来模拟光源对物体的方向性影响，即物体越是正对光源的面越亮。
   - 来自于光源的直接照射，**以与光源和表面法线的夹角余弦值为权重**。漫反射光会根据物体表面的粗糙程度产生不同程度的散射，使物体的局部区域出现明暗不一的效果。
- 镜面反射（Specular Lighting）：为了模拟光线照射在比较光滑的物体时，物体正对光源的部分会产生高亮效果。该分量颜色会和光源颜色更接近。
   - 来自于光源的直接照射**，以与光源和视线方向的夹角余弦值为权重**。镜面反射光用于模拟物体表面的镜面高光效果，使物体某些区域呈现明亮、有光泽的效果。
## 计算漫反射光照
当一束光线照射到物体表面时，光线的入射角越小，该表面的亮度就越大，看上去也就越亮。反之，该表面的亮度就越小，看上去越暗。
入射角和反射角是相等的关系，计算它们需要一条直于物体表面，并且朝向平面外部的法向量。
法向量是垂直于顶点所在平面，指向平面外部的向量，只有方向，没有大小，类比光学现象中的法线
有了法向量还需要知道光照的方向。光照方向根据光源的不同有两种：

- 平行光源
   - 全局光线方向是一致的，与照射点的位置无关
- 点光源
   - 向四周发射光线，光线方向与照射点的位置有关，越靠近光源的部分越亮

光源照射方向向量 = 光线照射到物体表面上的一点 - 光源所在的点
有了**法向量以及光线照射方向**，就可以计算入射角，有了入射角，那么反射光强度的计算就好计算了。因为入射角的大小与反射光的亮度成反比，所以漫反射的光线强度用入射角的余弦值来表示。
至此我们已知的条件：

- 入射角
   - 光源照射方向和法向量的夹角
- 法向量
   - 垂直于顶点所在平面，指向平面外部的向量，只有方向，没有大小
- 光线强度
   - 入射角的余弦值
   - 向量之间的点积，再除以向量的长度之积
      - 两个向量归一化，转换成单位向量，然后进行点积计算求出夹角余弦
      - webgl内置这两个方法
         - dot
            - 求出两个向量的点积。
         - normalize
            - 将向量转化为长度为 1 的向量。
- 光源照射方向
   - 光线照射到物体表面上的一点 - 光源所在的点

已知漫反射光照 = 光源颜色 * 漫反射光照强度因子，漫反射光照强度因子 = 入射角的余弦值。所以求出了这个余弦值就可以求出漫反射光照了。我们可以使用向量之间的点积，再除以向量的长度之积，就可以得出余弦值。
```javascript
//light_Direction表示光源照射方向向量。
//normal 代表当前入射点的法向量
vec3 light_Color = vec3(1, 1, 1);
float diffuseFactor = dot(normalize(light_Direction), normalize(normal))
vec4 lightColor = vec4(light_Color * diffuseFactor, 1);
```
### 平行光漫反射
!todo：数学部分没有学习，后续补上。
## 计算镜面高光
与漫反射分量相同，镜面高光也是根据光线的入射方向向量和法向量来决定的，只不过镜面高光还需要依赖视线的观察方向，也就是眼睛是从什么方向观察的物体。
**视线方向向量与反射光向量**的之间的夹角越小，夹角余弦值就会越大，那么人眼感受到的光照就会越强，反之，光照越暗。
算法和漫反射类似

- 首先需要求出反射光向量和人眼视线方向向量。
   - GLSL 内置了反射向量算法reflect(inVec, normal)，其中 inVec 为入射向量，方向由光源指向入射点，normal 为入射点的法向量。
      - inVec = 入射点位置 - 光源位置
   - 人眼视线方向向量 = 观察者坐标 - 入射点位置
- 归一化两个向量。
   - 反射向量
   - 人眼视线方向向量
- 求出两个归一化向量的点积，得到镜面高光因子。
   - 就是如果这两个向量的点积为负数，则说明视线观察向量和反射光向量大于 90 度，是没有反射光进入眼睛的，所以我们使用 max函数取点积和 0 之间的最大值。
- 反光度
   - 约束光圈的大小，一个物体的反光度越大，反光率就越强，散射的光就越少，看到的高光面积就越小
   - 最终的高光因子 = 前一步求得的高光因子 * （2 的反光度次幂）
- 将上一步求出的高光因子乘以光线颜色，得到镜面高光分量。

```javascript
    precision mediump float;
    varying vec4 v_Color;
    uniform vec3 u_LightColor;
    uniform float u_AmbientFactor;
    uniform vec3 u_LightPosition;
    varying vec3 v_Position;
    varying vec3 v_Normal;
    uniform vec3 u_ViewPosition;
    void main(){
      // 环境光分量
      vec3 ambient = u_AmbientFactor * u_LightColor; //环境光分量
      // 光线照射向量
      vec3 lightDirection =  v_Position - u_LightPosition;
      // 归一化光线照射向量
      lightDirection= normalize(lightDirection);
      // 漫反射因子
      float diffuseFactor = dot(normalize(lightDirection), normalize(v_Normal));
      // 如果大于 90 度，则无光线进入人眼，漫反射因子设置为0。
      diffuseFactor = max(diffuseFactor, 0.0);
      // 漫反射光照
      vec3 diffuseLightColor =u_LightColor * diffuseFactor;
      
      // 归一化视线观察向量
      vec3 viewDirection = normalize(v_Position - u_ViewPosition);
		//反射向量
      vec3 reflectDirection = reflect(-lightDirection, normalize(v_Normal));
      
      // 初始化镜面光照因子
      float specialFactor = 0.0;
      // 如果有光线进入人眼。
      if(diffuseFactor > 0.0){
       	specialFactor = dot(normalize(viewDirection), normalize(reflectDirection));
        specialFactor = max(specialFactor,0.0);
     }
     // 计算镜面光照分量
      vec3 specialLightColor  = u_LightColor * specialFactor * 0.5;
      // 计算总光照
      vec3 outColor = ambient + diffuseLightColor + specialLightColor;
      // 将物体自身颜色乘以总光照，即人眼看到的物体颜色。
      gl_FragColor = v_Color * vec4(outColor, 1); 
    }


```
