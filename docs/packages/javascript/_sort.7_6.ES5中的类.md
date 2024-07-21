# ES5中的类

在ES6以前，我们通常使用构造函数（constructor functions）和原型（prototypes）来模拟类的行为。

## 类函数

```JS
function Foo(){}
Foo.prototype
```

**所有函数默认都会拥有一个名为``prototype``的共有且不可枚举的属性，它会指向一个对象。**  
这个对象通常被称为`Foo`的原型，因为我们通过名为`Foo.prototype`的属性引用来访问它。  

```JS
function Foo(){}
var a = new Foo()
Object.getownPrototypeOf(a)===Foo.prototype//true
```

**通过new Foo()创建的每个对象将被[[Prototype]]链接到这个Foo.prototype对象。**  
在JavaScript中，并没有类似的类的复制机制。只能创建多个对象，它们的[[Prototype]]是关联的同一个对象。但是在默认情况下并不会进行复制，因此这些对象之间并不会完全失去联系，是相互关联的。  
上面的例子最后我们得到了两个对象，它们之间相互关联。并没有初始化一个类，只是让两个对象互相关联。  
`new Foo()`这个操作实际上并没有直接创建关联，只是间接的完成了我们的目标：一个关联到其他对象的新对象。

### 类和新对象的关系

就JavaScript中不会将一个对象复制到另一个对象，只是将他们关联起来。  
这个机制通常被称为原型继承。  
它常常被视为动态语言版本的类继承。这个名称主要是为了应对面向类的世界中的继承的意义。  
继承以为着复制操作，JavaScript并不会复制对象属性。相反，会在两个对象之间创建一个关联，这样一个对象就可以通过委托访问另一个对象的属性和函数。  
委托这个术语可以更加准确的描述JavaScript中对象的关联机制。  
差异继承本质上也是通过委托获取通用的属性。

### 构造函数

```js
function Foo(){}
Foo.prototype.constructor === Foo//true
var a = new Foo()
a.constructor=== Foo//true
```

让大家觉得Foo是一个类可能就是因为``new``。  
``Foo.prototype``默认（在第一行代码声明时）有一个共有并且不可枚举的属性``.constructor``，这个属性引用的是对象关联的函数（这个例子是Foo）。此外通过构造函数调用``new Foo()``创建的对象也有一个``.constructor``属性，指向创建这个对象的函数。  
实际上a``.constructor``这个属性是不存在的。它只是指向``Foo``函数。这也不能表示`a`由``Foo``构造。  
实际上，Foo和程序中的其他函数没任何区别。函数本身不是构造函数，然而当在普通函数调用前面加上`new`关键字之后，就会把这个函数变成一个“构造函数调用”。  
实际上，`new`会劫持所有普通函数并用构造对象的形式来调用它。（不是所有的都可以`new`，例如``JSON.parse``）  
**JavaScript中对于构造函数的解释是，所有带new的函数调用。**  
**函数不是构造函数，但是当且仅当使用new时，函数调用会变成‘构造函数调用’。**

### constructor

每个对象都有一个``.constructor``属性，该属性默认指向创建该对象的构造函数。然而，这个属性并不是固定不变的，它可以被修改或覆盖。

#### .constructor 默认指向构造函数

当你创建一个对象时，如果没有显式地指定.constructor属性，那么该属性会默认指向创建该对象的构造函数。例如：

```JS
function Person(name) {
    this.name = name;
}

var john = new Person('John');
console.log(john.constructor); // 输出: [Function: Person]
```

#### .constructor 是可写的

尽管.constructor属性是不可枚举的（即它不会出现在for...in循环中），但它的值是可以被修改的。这意味着你可以给对象添加一个新的.constructor属性，或者修改现有属性：

```JS
john.constructor = Array;
console.log(john.constructor); // 输出: [Function: Array]
```

这样做并不会改变对象的行为，但它确实改变了.constructor属性的值。

#### .constructor 在原型链中可以被修改

你也可以在原型链的任何位置添加或修改.constructor属性。例如，如果你修改了某个构造函数的原型对象的.constructor属性，那么所有通过该构造函数创建的对象都会受到影响：

```JS
Person.prototype.constructor = Number;
var jane = new Person('Jane');
console.log(jane.constructor); // 输出: [Function: Number]
```

#### .constructor 并不总是可靠的

由于.constructor属性可以被修改，所以它并不是确定对象类型的可靠方式。在某些情况下，你可能需要使用instanceof操作符或Object.prototype.toString方法来更准确地检查对象的类型。

总之，.constructor属性在JavaScript中是一个有用的工具，但它不应该被视为确定对象类型的唯一或最可靠的方式。在处理对象时，了解它的灵活性和局限性是很重要的。

### prototype

prototype是一个非常重要的概念，它与对象的继承和方法共享有关。保存共有成员。

```js
function Foo(name){
    this.name=name
}
Foo.prototype.myName=function(){
    return this.name
}
var a = new Foo('a')
var b = new Foo('b')
a.myName()//a
b.myName()//b
```

这段代码中的``this.name=name``给每个对象都添加了``.name``属性，有点像类实例封装的数据值。  
``Foo.prototype.myName=...``这段代码会给``Foo.prototype``对象添加一个属性，创建对象的过程中新对象内部的``[[prototype]]``都会关联到``Foo.prototype``上。当`a`和`b`中无法找到`myName`时，就会通过委托的方式在`Foo.prototype`上找到。 

**前面说``a.constructor===Foo``为真，意味着a确实有一个指向``Foo``的``.constructor``属性，但事实不是这样的。**  
**``a.constructor``只是通过默认的``[[prototype]]``委托指向``Foo``，这和构造毫无关系。**  
举例来说，``Foo.prototype``的``.constructor``属性只是``Foo``函数在声明时的默认属性。**如果我们创建一个新的对象并替换了函数默认的``.prototype``对象引用，那么新对象并不会自动获得``.constructor``属性。**

```js
function Foo(){}
Foo.prototype={}
var a = new Foo()
a.constructor===Foo//false
a.constructor===Object//true
```

这个例子``a.constructor``没有就会通过原型链往上找，``Foo.prototype``也没有，然后继续找，到了顶端``Object.prototype``。这个有.``constructor``属性，指向内置的``Object(..)``函数。  
当然也可以手动的给``Foo.prototype``添加一个，需要加一个符合正常行为不可枚举属性。

```js
function Foo(){}
Foo.prototype={}
Object.defineProperty(Foo.prototype,"constructor",{
    enumerable:false,
    writable:true,
    configurable:true,
    value:foo//让.constructor指向Foo
})
```

函数的`prototype`属性是一个对象。这个对象主要用于在创建新实例时提供共享的属性和方法。  
函数本身也是一个对象，因此它有一个`constructor`属性。这个属性通常默认指向函数自身，表明该函数是创建其原型对象的构造函数。（函数声明时默认关联的`prototype`属性，是函数自身创建的。）

```JS
function MyFunction() {
    // ...
}
 
console.log(MyFunction.prototype); // { constructor: ƒ }
console.log(MyFunction.prototype.constructor === MyFunction); // true 
```

## 继承（原型）

```js
function Foo(name){
    this.name=name
}
Foo.prototype.myName=function(){
    return this.name
}
function Bar(name,label){
    Foo.call(this,name)
    this.label=label
}
//创建一个新的Bar.prototype对象并关联到Foo.prototype
Bar.prototype=Object.create(Foo.prototype)
// 注意，现在没有Bar.prototype.constructor了
// 原来的prototype被抛弃了，新的不会自动赋值
// 如果打印的话会是原型链上面的不会是Bar
// 如果需要的话，那就得手动修复
Bar.prototype.myLabel=function(){
    return this.label
}
var a =new Bar('a','obj a')
a.myName()//'a'
a.myLabel()//'obj a'
```

上面`Object.create`的做法是创建一个全新的对象，它继承了Foo.prototype的所有属性和方法。  
如果直接使用``Bar.prototype=Foo.prototype``只是替换了引用，操作的时候容易修改``Foo.prototype``对象本身。  
如果使用``Bar.prototype=new Foo()``会创建一个关联到``Foo.prototype``的新对象。但是它使用了Foo的**构造函数调用**，如果函数Foo有一些副作用就会影响Bar()的后代。  
在es6之前有一个方法来修改对象原型链的关联，但是这个方法并不是标准无法兼容所有浏览器``__proto__``（es6已经加入标准）。  
ES6新增了辅助函数``Object.setPrototypeOf``来修改关联。  
**``__proto__``属性引用了内部的[[prototype]]对象。**  
它看起来就像一个属性，但是实际上更像是一个getter/setter。

```js
//大致实现
Object.defineProperty(Object.prototype,"__proto__",{
    get:function(){
        return Object.getPrototypeOf(this)
    },
    set:function(v){
        Object.setPrototypeOf(this,v)
        return v
    }
})
```

```js
//es6之前需要抛弃默认的Bar.prototype
Bar.prototype=Object.create(Foo.prototype)
//es6可以直接修改
Object.setPrototypeOf(Bar.prototype,Foo.prototype)
```

如果忽略掉Object.create带来的轻微性能损失（抛弃的对象需要进行垃圾回收），它实际上比es6的方法更短可读性更高。

### 检查类关系

假设对象有a，如何寻找对象a委托的对象？在传统的面向类的语言里，检查一个实例的继承祖先通常被称为内省或者反射。

```js
a instanceof Foo
```

`instanceof`操作符的左侧操作是一个普通的对象，右操作是一个函数。  
`a`的原型链中是否存在`Foo.prototype`指向的对象。**这个方法只能处理对象（a）和函数（Foo）之间的关系**。如果是判断两个对象之间是否通过原型链关联是不行的。  
如果使用`.bind`来生成一个绑定函数，该函数是没有`prototype`属性的。如果使用`instanceof`的话，目标函数的`prototype`会代替硬绑定函数的`prototype`。  
非常简单的判断出两个对象之间存在的关系

```js
a.isPrototypeOf(c)
```

也可以直接获取对象的原型链

```js
Object.getPrototypeOf(a)
```

关于``__proto__``其实很多浏览器还是支持的。

```js
a.__proto__
```

和之前说的`constructor`一样，实际是不存在与正在使用的对象中，实际上，它和其他常用函数一样内置于`Object.prototype`中。不可枚举。  
es6中新增了class关键字，后面会介绍。

## 对象关联

**prototype机制就是存在与对象中的一个内部链接，它会引用其他对象。作用是：如果在对象上没有找到需要的属性或者方法引用，引擎就会继续在prototype链关联的对象上进行查找，以此类推。这就是原型链。**

### 创建关联

`Object.create`会创建一个拥有空原型链的对象，这个对象无法进行委托。由于这个对象没有原型链，所以`instanceof`操作符无法进行判断，因此总是返回`false`。这些特殊的空`prototype`对象通常被称为字典，它们完全不受原型链的干扰，因此很适合用来存储数据。

## 小结

### `[[Get]]` 操作和原型链

在JavaScript中，当你尝试访问一个对象的属性时，会触发`[[Get]]`操作。如果对象本身没有这个属性，JavaScript引擎会在对象的`[[Prototype]]`（即`__proto__`）指向的原型对象上查找这个属性。如果原型对象上也没有这个属性，那么引擎会继续沿着原型链向上查找，直到找到这个属性或者到达原型链的顶端（即`Object.prototype`）。

### `Object.prototype` 和原型链顶端

所有的普通JavaScript对象都继承自`Object.prototype`，这意味着`Object.prototype`位于原型链的顶端。即使你创建了一个空对象（例如通过`{}`或`new Object()`），它仍然具有从`Object.prototype`继承来的方法和属性，如`toString()`、`hasOwnProperty()`等。

### new 操作符和构造函数调用

当你使用`new`关键字调用一个函数时，会发生以下几件事情：

- 创建一个新的空对象。
- 这个新对象的`[[Prototype]]`被设置为函数的prototype属性。
- 函数体内的this被绑定到这个新对象。
- 如果函数没有返回一个对象，那么`new`表达式中的函数调用会自动返回这个新对象。  
这种使用``new``的函数调用通常被称为“构造函数调用”，尽管JavaScript中的构造函数并不像传统面向类的语言那样创建类和实例。在JavaScript中，构造函数只是普通的函数，它们通过`new`操作符被特殊地调用，以创建对象并设置原型链。

### JavaScript与传统面向类语言的区别

JavaScript的原型继承机制与传统面向类语言（如Java或C++）的类继承机制不同。在JavaScript中，并没有真正的类和实例的概念，而是通过原型链来实现对象之间的继承关系。这种继承不是通过复制父对象的属性到子对象来实现的，而是通过链接对象到另一个对象，从而形成一个链条，允许属性查找沿着这个链条进行。

总结来说，JavaScript的原型链机制是一种基于委托的继承模型，它允许对象通过原型链相互关联，而不是通过传统的类和实例的复制模型。这种设计使得JavaScript在处理对象和继承时更加灵活和动态。

## 以JS的角度理解

如果js是第一门接触的语言，没有接触过其他的面向类的编程语言的话上面的讲的这种理解方式可能就不适用了。下面的这种可能更容易理解一些

## JS的面向对象

- **封装：将现实中一个事物的属性和功能集中定义在一个对象中。**
  - 如何封装？
    - 创建一个对象
      - 直接量
      - 使用`new Object()`
    - 如果需要反复创建多个结构相同的对象
      - 定义构造函数
      - 将公用的属性和方法使用this.的形式绑定
      - 然后使用`new`关键字调用初始化行的对象
        - `new`的时候会创建一个新的对象
        - 设置新对象的`__proto__`继承构造函数的原型对象（`prototype`）
        - 用当前新对象调用构造函数，向对象中添加属性和方法
        - 将新对象地址返回
- **继承**
  - js中的继承都是通过原型实现的（`prototype`）
  - 在定义构造函数的时候，js会自动创建对应的原型对象（`prototype`）
  - 共有成员都在原型对象里面
- **多态**
  - 同一个函数在不同情况下表现出不同的状态
  - 就是可以重写的意思，在子对象中，觉得父对象的方法不满足需求，就可以再子对象本地重新定义同名成员
  - 重写也可以调用父对象的原方法
    - es6之前可以使用`this`的显示绑定
    - es6之后新增了`super`关键字

## __proto__和constructor属性是对象所独有的，prototype属性是函数所独有的。（函数本身也是对象）

- `prototype`只是一个属性，默认指向了原型对象，言外之意他是可以修改的！！！
- 同样的`prototype`的`.constructor`属性只是函数在声明时的默认属性，如果`prototype`被修改了，那么`constructor`就没了，不会自动帮我们关联到新的绑定的对象上。此时一般我们需要手动修复这个问题。
- `__proto__`这个属性不在标准里面(es6之前)，不是所有的JS引擎都支持它，它作为`Object.prototype`上的一个存取器属性主要用来获取或者设置某个对象的`[[prototype]]`（可以直接使用`__proto__`赋值）
  - 如果要设置可以使用`Object.setPrototypeOf`(操作的目标，要继承的目标)
  - 在就是上面说的`prototype`可以直接修改的``构造函数.prototype=source``
    - 这样修改之后，后面new的对象都会改变

`prototype`对于函数而言就是保存了共有成员  
`constructor`对于对象来说就是指向构造函数  
`__proto__`对于对象来说就是操作原型链的  
需要注意的是这些都是可以修改的  
**原型链**：由多级父对象逐级继承形成的链式结构

## 行为委托

### 类理论

许多行为可以先抽象到父类然后在用子类进行特殊化（重写）。

### 委托理论

JavaScript中原型链机制会把对象关联到其他对象。委托的行为以为着某些对象在找不到属性或者方法引用时会把这个请求委托给另一个对象。

### 相互委托（禁止）

行为委托认为对象之间是兄弟关系，互相委托，而不是父类和子类的关系。JavaScript的原型机制本质上就是行为委托机制。也就是说，我们可以选择在JavaScript中努力实现类机制，也可以拥抱更自然的原型委托机制。

在JavaScript中，每个对象都有一个内部属性`[[Prototype]]`，它指向另一个对象。当我们试图访问一个对象的某个属性或方法时，如果该对象本身不具有这个属性或方法，JavaScript会沿着`[[Prototype]]`链向上查找，直到找到这个属性或方法，或者到达原型链的末端（通常是`Object.prototype`）。

这种机制允许我们创建对象，并通过改变它们的`[[Prototype]]`属性来实现继承和重用代码。这种继承方式被称为“原型继承”或“委托继承”。
