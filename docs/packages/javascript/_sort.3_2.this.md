# 关于this

this会自动定义在所有（除了箭头函数外）函数的作用域中，函数会自动的引用合适的上下文对象（this指代函数当前的运行环境）。

## 误解

### 指向自身（错误）

例如:

```js
function f(num){
    console.log('f:'+num)
    this.c++
}
f.c=0
var i
for(i=0;i<10;i++){
    if(i>5){
        f(i)
    }
}
console.log(f.c)//0
console.log(c)//NaN
```

执行f.c=0时，的确向函数对象f添加了一个属性c。但是函数内部代码this的指向并不是那个函数对象，所以属性名相同，但是根对象却不相同。  
全局多一个c，因为引擎在执行f时，里面的this指向全局（当前的运行环境），全局中没有c，所以新建了一个全局的c变量，但是没有值，直接++就会成NaN。  
解决这个问题有很多方法，使用词法作用域直接在全局声明一个对象，函数内访问他即可，不要使用this；使用f标识符代替this来引用函数对象；或者在for执行f的时候使用call绑定到f

### 它的作用域（错误）

this在任何情况下都不指向函数的词法作用域。  
js内部，作用域和对象类似，可见的标识符都是它的属性。但是作用域无法通过js代码访问，它存在js引擎内部。

### this到底是什么小结

this会自动定义在所有的（除了箭头函数外）函数作用域中，函数会自动引用合适的上下文对象，即当前函数的运行环境。

- this是在运行时绑定的，并不是在编写的时候，它的上下文取决与函数调用时的各种条件
- this既不指向函数自身，也不指向函数的词法作用域
- 当一个函数被调用的时候会创建一个执行上下文对象
  - 会包含函数在哪里调用，函数的调用方式，传入的参数等信息
  - this只是其中的一个属性，会在函数执行的时候用到

## this全面解析：调用位置

就是函数执行的位置，想要找到一个函数的调用位置，就需要分析调用栈（就是为了到达当前执行位置所调用的所有函数），而调用的位置就在当前执行的函数前一个调用中。

## this全面解析：绑定规则

绑定规则有四条，如果多条规则同时满足的时候，它们是有优先级的。

### 1.默认绑定

独立函数的调用

```js
function f(){
    console.log(this.a)
}
var a = 2
f()//2
```

如果在严格模式下，则不能将全局对象用于默认绑定，this会是undefined

```js
function f(){
    console.log(this.a);
}
var a = 2;
(function(){
    "use strict";
    //console.log(this.a) 会报错，this没有指向全局
    f();//2 这种情况下可以指向全局
})()
```

### 2.隐式绑定

这种情况是调用的位置没有上下文，或者说被某个对象拥有或者包含。

```js
function f(){
    console.log(this.a)
}
var o={
    a:2,
    f:f
}
o.f()//2
```

当f被调用的时候，它前面加上了对obj的引用。当函数引用有上下文对象时，隐式绑定规则会把函数调用中的this绑定到这个对象上。  
对象属性的引用链只在上一层会者说最后一层位置中起作用。

```js
function f(){
    console.log(this.a)
}
var o1={
    a:1,
    f:f
}
var o2={
    a:2,
    o1:o1
}
o2.o1.f()//1
```

**隐式丢失**
隐式绑定的函数会丢失绑定的对象，而应用默认绑定。

```js
function f(){
    console.log(this.a)
}
var o ={
    a:2,
    f:f
}

var b = o.f

var a = '丢了'

b()//丢了 ?why
```

因为b只是一个引用，引用的是f函数本身，所以此时的b()其实是一个不带任何修饰的函数调用。

```js
function f(){
    console.log(this.a)
}
function dof(fn){
    fn()
}
var o ={
    a:2,
    f:f
}
var a = '丢了'

dof(o.f)//丢了
```

因为传参就是一种隐式的赋值，所以和上面的例子其实一样。(前面作用域部分有讲到过)

### 3.显式绑定

顾名思义，就是在某个对象上强制绑定调用函数。具体点就是用函数的call(..)和apply(..)方法（这些方法函数都有，原型部分会解释为什么有）。  
它们第一个参数是一个对象，是给this准备的，调用函数的时候会将其绑定到this。这种直接指定this的绑定对象的方式，就是显式绑定。  
顺便说下如果你传入的是原始值来当做this的绑定对象，这个原始值会转换成它的对象形式。（就是new一下）这通常被称为装箱。  
但是这样还是不能解决丢失的问题。(它们是直接执行了，不是引用)  
可以使用bind方法解决,bind只是绑定了上下文，返回了一个新的函数。

```js
function f(something){
    console.log(this.a,something)
    return this.a+something
}
var o = {
    a:3
}
var bar = foo.bind(o)
var b =bar(3)
console.log(b)
```

**bind也可以叫做硬绑定，是显示绑定的一种变种，内部其实还是调用了显式绑定，只不过是返回了一个函数，不会直接执行。**

### 4.new绑定

这就要说下构造函数了，其实js中new的机制实际上和面向类的语言完全不同。  
在js中的‘**构造函数**’只是一些使用new操作符时被调用的函数。它们不属于某个类，也不会实例化一个类。  
实际上它们甚至都不能说是一种特殊的函数类型，只是被new操作符调用的普通函数而以。  
所以，包括内置对象函数在内所有的函数都可以用new来调用，这种函数调用被称为构造函数调用。实际上并不存在所谓的"**构造函数**"，只是对于函数的"**构造调用**"。  
当一个函数通过new关键字被调用时，会发生以下几个步骤：

- 创建或者说构建一个全新的对象
- 这个新的对象会被执行[[protopyte]]连接
  - 将这个新对象的原型（``__proto__``）指向该函数的原型对象（``prototype``）
- 函数内部的this关键字会被绑定到这个新对象上。
- 执行函数体内的代码。
- 如果函数没有返回一个对象，那么new表达式中的函数调用会自动返回这个新对象
  - 如果函数返回了一个对象，那么这个返回的对象将成为new表达式的结果
- 把这个对象绑定到函数调用中的this上

```js
function f(a){
    this.a=a
}
var bar = new f(2)
console.log(bar.a)//2
```

## this绑定方式的优先级

首先默认的优先级肯定是最低的。

```js
function f(){
    console.log(this.a)
}
var o1 ={
    a:1,
    f:f
}
var o2 ={
    a:2,
    f:f
}
o1.f()//1
o2.f()//2

o1.f.call(o2)//2
o2.f.call(o1)//1
```

上面的例子可以看出显式绑定高于隐式绑定。  

```js
function f(args){
    this.a= args
}
var o1 ={
    f:f
}
var o2 ={}
o1.f(1)
console.log(o1.a)//1
o1.f.call(o2,2)
console.log(o2.a)//2

var b = new o1.f(3)
console.log(o1.a)//1
console.log(b.a)//3
```

上面的例子可以看出new的比隐式的高。  
但是new和显式呢？它们无法一起使用，我们可以使用bind来创建一个新的包装函数测试。

```js
function f(args){
    this.a= args
}
var o1 ={}
var b = f.bind(o1)
b(1)
console.log(o1.a)//1

var z = new b(2)

console.log(o1.a)//1
console.log(z.a)//2
```

b被硬绑到o1上，但是new b并没有修改o1.a修改为2。new修改了硬绑定，就是修改了调用b的this，改成了new的时候得到的新的z对象，所以z.a的值为2。  
**在new的时候会判断硬绑定的函数是否被new调用，如果是的话就会使用新创建的this代替硬绑定的this。**
为什么要调用硬绑定？因为new的时候是可以接受参数的，bind的功能就是除了第一个参数外，其他的参数可以传给下层的函数（这种技术叫做‘部分应用’，是‘柯里化’的一种）

### 判断this

- 函数是否在new中调用？
  - 是的话this绑定的是新创建的对象
- 函数是否通过call、apply（显式绑定）或者硬绑定调用？
  - 是的话this绑定的是指定的对象
- 函数是否在某个上下文对象中调用(隐式调用)？
  - 是的话this绑定的是哪个上下文对象
- 如果都不是的话，使用默认绑定
  - 如果是严格模式，就绑定到undefined
  - 否则就是全局对象

### 绑定的例外

规则总有例外

#### 被忽略的this

如果使用null或者undefined作为this的绑定对象传入call、apply或者bind，这些值在调用的时候会被忽略，实际会使用默认的规则。  
一般我们需要打撒参数类似的操作可能需要这么做（es6``...``操作符可以解决这个问题）。  
如果需要这么做可以传入一个空的对象。  
这里说下创建空对象可以使用Object.create(null),这样比直接使用{}更空，因为Object.create不会创建Object.prototype这个委托。

#### 间接引用

如果创建了函数的间接引用，就会使用默认规则绑定。最容易发生在赋值的时候。

```js
function f(){
    console.log(this.a)
}
var a = 2
var o ={
    a:3,
    f:f
}
var p={a:4}
o.f();//3
(p.f=o.f)()//2
```

赋值导致p.f直接指向了f，只是引用。因此调用位置不是o、p。会使用默认规则。  
**对于默认绑定来说，决定this绑定对象的并不是调用的位置是否处在严格模式，而是函数体是否存在严格模式。**

#### 软绑定

**使用硬绑定之后就不能使用隐式绑定或者显示绑定来修改this。**  
可以实现一个方法，让函数默认绑定指定的一个全局的对象、undefined和null以外的值，那就可以实现和硬绑定相同的效果，同时保留隐式绑定或者显式绑定修改this的能力。  

```js
if(!Function.prototype.softBind){
    Function.prototype.softBind=function(obj){
        var fn = this;
        //捕获所有的参数
        var args = [].slice.call(arguments,1);
        var bound = function(){
            console.log(this)
            return fn.apply(
                //如果this不存在或者是全局对象就绑定obj,否则就用调用时的
                (!this||this===(window||global))?obj:this,
                //参数
                args.concat.apply(args,arguments)
            );
        };
        bound.prototype = Object.create(fn.prototype);
        return bound;
    }
}

//验证
function f(){
    console.log('name'+this.name)
}
var o1={name:1};
var o2={name:2};
var o3={name:3};
//绑定默认的对象o
var fo = f.softBind(o1);
fo();//name1
//隐式绑定
o2.f=f.softBind(o1)
o2.f()//name2
//显式绑定
fo.call(o3)//name3
//应用了默认绑定的o
setTimeout(o2.f,10)//name1
```

### 绑定规则小结

- 默认绑定
  - 函数的独立调用,this指向全局
  - 在严格模式下是undefined
- 隐式绑定
  - 被某个对象拥有包含，以某个对象.的形式调用，函数的this会绑定到这个对象上。
  - 如果是对象链式的调用，那么会绑定最后一个对象，即离调用函数最近的那个。
  - 隐式丢失
    - 如果不是直接调用而是赋值给一个变量再调用,此时变量只是一个引用，引用的是函数本身，因此变成了不带任何修饰的函数调用，成了默认绑定。
    - 以传参的形式也是一样的因为传参就是一种隐式的赋值
- 显示绑定
  - 就是在某个对象上强制调用函数
    - 使用函数的call和apply方法
    - 第一个参数是一个对象，给this准备的
    - apply第二个参数为数组，函数的参数
    - call第二个参数开始为函数的参数，用逗号间隔
    - 使用bind方法
    - 也可以叫做硬绑定
    - 返回一个新的函数
    - 其他参数和call一样
- new绑定
  - 用new来调用函数时
    - 创建或者说构建一个全新的对象
    - 这个新的对象会被执行原型连接
    - __proto__指向该函数的prototype
    - constructor指向该函数
    - 这个对象会被绑定到函数调用的this
    - 如果函数没有返回其他对象，那么new表达式的函数会自动返回这个新对象
- 优先级
  - 函数是否在new中调用
    - 是的话this就是新创建的对象
  - 函数通过显示绑定
    - 是的话this就是绑定的对象
  - 函数是否在某个上下文对象中调用
    - 是的话this就是这个对象
  - 如果都不是，就使用默认绑定
    - 严格模式为undefined
    - 否则就是全局对象  

如果使用null或者undefined作为this的绑定对象传入call、apply或者bind，这些值在调用的时候会被忽略，实际会使用默认的规则。
上面的规则不适用于箭头函数，箭头函数是根据外层作用域来决定this的，会继承外层函数调用的this绑定。内部的this就是定义时上层作用域中的this。
- 可以简单的理解为静态的，如果将箭头函数直接赋值对象的属性，然后调用this是不能指向对象，因为对象不构成单独的作用域
- 而普通函数的this为动态的，和函数的运行环境相关。
