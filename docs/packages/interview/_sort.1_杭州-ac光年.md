# 1、vue编译时做了什么事
new 一个全新的vue实例时首先是进行选项合并initMinin(Vue)方法，将用户自定义属性和Vue函数中默认属性进行合并（Vue.$options就是在此时进行赋值）。 在之后就进行初始化，首先初始化生命周期initLifecycle()、初始化监听事件initEvents、初始化插槽内容initRender()、调用生命周期beforeCreate,callHook(vm,'beforeCreate')、初始化组件之间传参,进行依赖注入通过(provid,inject)initInjections()、初始化data,initState()、初始化依赖的收集ininProvid(vm,)、调用生命周期create,callHook(vm,'create')  
需要注意事情，编译解析之后进行挂载，可以手动挂载，也可以自动挂载，设置el之后vue会触发隐式挂载（挂载函数$mount()）其他两种方式(render、template)需要手动挂载。
# 2、vue中v-model实现原理
v-model实际上是一个语法糖，在目标上动态绑定一个值，同时监听一个事件，如果内部值改变通过监听事件进行通知父级更改。  
在vue2时是通过动态绑定(v-bind)value值和监听input事件进行实现  
在vue3时是通过动态绑定(v-bind)modelValue值和监听update:modelValue事件进行实现
# 3、vue中组件间通信
## 1、父子组件
父组件通过在子组件上动态绑定值子组件通过props.xxx进行接收，未在子组件props上声明的通过this.$attrs进行接收  
子组件通过调用父组件监听事件进行传递
## 2、兄弟组件
1. 兄弟组件可以通过父组件进行中转进行值的交换(react常用)  
2. 通过eventBus进行通信，两个组件之间都引用同一个vue实例，通过触发、监听同个事件进行触发值的传递
## 3、跨组件通信
1. vuex
2. 依赖注入(比较重，一般组件库使用)
通过provide(提供)进行全局变量提供、在需要使用的页面通过inject(注入)进行使用
# 4、uniapp的优缺点是什么
1. 性能问题 
毕竟是通过一套代码编译成不同平台的代码存在性能问题
2. 兼容性
不同组件不同平台内部实现不同导致显示效果不一样
3. 自测费力
同上每个平台显示效果不同导致部分代码在健壮性不好的平台会出现奇奇怪怪的问题，需要每个平台都要看看
4. 不支持所有原生API：由于跨平台的限制，不是所有的iOS和Android原生API都可以直接使用。
# 5、uniapp开发使用的单位是什么，rpx和px、rem等的区别
1. uniapp通过rpx进行单位控制，1px约等于2rpx
2. px是固定单位，rem是相对单位，是相对于项目中根元素的字体大小的单位.rpx是微信小程序官方推出的新单位，适用于移动端的uni-app或者微信小程序的开发。可以根据屏幕宽度进行自适应，1rpx实际上等于相对于屏幕宽度的1物理像素。
# 6、微前端 乾坤原理
1. 微前端： 一个前端应用能够单独跑，也能被作为一个模块集成到另一个应用里，在 url 变化的时候，加载、卸载对应的子应用。
2. qiankun：
 1. Qiankun 是一个基于 single-spa 的微前端框架，提供了生命周期管理、路由管理等核心功能，通过将不同的子应用打包成独立的 JavaScript 包。 
 2. 使用沙箱（sandbox）进行隔离。把 js 代码包裹了一层 function，代码放在了单独作用域，然后再把内部的 window 用 Proxy 包一层，这样内部的代码就被完全隔离了，这样就实现了一个 JS 沙箱。Qiankun 会为每个子应用创建一个沙箱，保证各个子应用之间的运行环境隔离。CSS 隔离使用 shadow dom ，这是浏览器支持的特性，shadow root 下的 dom 的样式不会影响其他 dom 的样式。
 3. 使用 Proxy 对全局变量进行代理。为了防止子应用修改全局变量导致其他子应用受影响，Qiankun 会使用 Proxy 对全局变量进行代理，防止子应用直接修改全局变量。
 4. 路由管理和资源加载。Qiankun 会根据路由或者菜单等方式来决定加载哪些子应用，并负责资源的加载和缓存管理。

# 7、写个深拷贝
```
function deep(arr){
  function deepFn(value){
    if(!value){
      // 值不存在直接返回
      return value
    }
    let copyValue=null
    if(value instanceof Object){
      // 复杂值判断是否是数组和对象
      if(Array.isArray(value)){
        copyValue=[]
        value.map((item,index)=>{
          copyValue.push(deepFn(item))
        })
      }else{
        copyValue={}
        for(let key in value){
          copyValue[key]=deepFn(value[key])
        }

      }

    }else{
      // 基本值直接返回
      return value
    }
  return copyValue
  }
  return deepFn(arr)
}

console.log(deep([1,2,3,4,5,[6,7,[8]]]))
console.log(deep({
  1:1,
  2:3,
  3:4,
  5:{
    6:7,
    8:9,
    10:{
      11:11,
      12:12
    }
  }
}))

```
# 8、打平数组
~~~
 function drawArray(dataArray) {
    if (!Array.isArray(dataArray)) {
      return
    }
    let newArray = []
    function drawArraySon(dataArraySon) {
      for (let key in dataArraySon) {
        if (!Array.isArray(dataArraySon[key])) {
          newArray.push(dataArraySon[key])
        } else {
          drawArraySon(dataArraySon[key])
        }
      }
    }
    drawArraySon(dataArray)
    return newArray

  }
  let ceshiArray = [1, [2, [3, 4, [5]]]]
  console.log(drawArray(ceshiArray), 'nums')
~~~
# 9、防抖
~~~
  let setTimeoutEr=null
  function shake(){
    if(setTimeoutEr){
      clearTimeout(setTimeoutEr)
    }
    setTimeoutEr=setTimeout(()=>{
console.log('aaaaa')
    },1000)
  }
~~~
