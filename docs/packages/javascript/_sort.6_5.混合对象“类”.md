# 混合对象“类”

类理论是面向对象编程（OOP）的核心概念之一，它提供了一种组织和管理代码的方式，使得代码更加模块化、可维护和可扩展。  
JavaScript和面向类的语言不同，它并没有类来作为对象的抽象模式或者说蓝图。JavaScript中只有对象。
实际上，JavaScript才是真正应该被称为面向对象的语言，因为它是少有可以不通过类，直接创建对象的语言。  

## 类理论

类/继承描述了一种代码的组织结构形式：一种在软件中对真实世界中问题领域的建模。  
面向对象编程强调的是数据和操作数据的行为本质上互相关联的，因此好的设计就是把数据以及和它相关的行为打包（封装）起来。这在正式的计算机科学中有时被称为数据结构。  
举例来说，用来表示一个单词的字符通常被称为字符串。字符就是数据，但是我们通常关心的是可以对数据做什么，所以可以应用在这种数据上的行为都被设计成了String类的方法（计算长度、添加数据等等）。  
所有字符串都是String类的一个实例，也就是说它是一个包裹，包含字符数据和我们可以应用在数据上的函数。  
我们还可以使用类对数据结构进行分类，可以把任意数据结构看做范围更广的定义的一种特例。这就是类、继承和实例化。  
类的另一个概念就是多态，意思是父类的通用行为可以被子类用更特殊的行为重写。  
类强烈建议父类和子类使用相同的方法名表示特定的行为，从而让子类重写父类。

## JavaScript中的“类”

相当长一段时间里，JavaScript只是有一些近似类的语法元素（比如new和instanceof），不过后来es6新增了一个class关键字。但这也不意味着JavaScript中实际有类。  
由于类是一种设计模式，所以可以使用一些方法近似实现类的功能。JavaScript提供了一些近似类的语法。在近似的表象之下，JavaScript的机制其实和类完全不同。

## 类的机制

在许多面向类的语言中，标准库会提供stack类，它是一种栈数据结构。stack类内部会有一些变量来存储数据，同时会提供一些共有的可访问行为，从而让你的代码可以和数据进行交互。（实际上并不是直接操作stack）。stack类仅仅是一个抽象的表示，他描述了所有栈需要做的事，但是它本身并不是一个栈。必须先实例化stack类然后才能进行操作。

## 建造

类和实例的概念来源于房屋建造。  
建筑师会规划出一个建造所有特性：多宽、多高、多少个窗户以及位置，甚至连建造的材料都计划好了。在这个阶段他并不需要关心建筑会被建在哪，也不关心建造多少。也太关心里面的间距，只关心用什么构成来容纳它们。  
建筑蓝图只是建筑计划，它们并不是真正的建造，本质上就是对蓝图的复制。之后建筑工人就可以到下一个地方，把所有的工作重复一遍，再创建一个副本。  
完成之后，建筑就成为了蓝图的物理实例，本质上就是对蓝图的复制。  
建筑和蓝图之间的关系是间接的。你可以通过蓝图了解建筑的结构，只是观察建筑本身是无法获得这些信息的。但是如果你是想打开一扇窗户，那就必须接触真实的建筑才行。蓝图只能表示窗户应该在哪，但不是真正的窗户。  
一个类就是一张蓝图。建筑就是实例，有需要的话，我们可以直接在实例上调用方法并访问其他所有共有数据属性。  
把类和实例对象之间的关系看做是直接关系而不是间接关系通常更有助于理解。类通过复制操作被实例化为对象形式。  
**在面向对象编程中，类是一种蓝图或模板，用于创建具有相同属性和方法的对象。类定义了对象的结构和行为。**

## 构造函数

类实例是由一个特殊的类方法构造的，这个方法名通常和类名相同，被称为构造函数。这个方法的任务就是初始化实例需要的所有信息。

## 类的继承

在面向类的语言中，可以先定义一个类，然后定义一个继承它的类。后者通常被称为子类，前者被称为父类。  
子类会包含父类行为的原始副本，但是也可以重写所有继承的行为甚至定义新行为。  
**继承是一种机制，允许一个类（子类）继承另一个类（父类）的属性和方法。这有助于代码的重用和扩展。**

## 多态

子类重写了继承自父类的方法，但还是可以调用父类的这个方法，这个技术被称为多态或者虚拟多态，或者相对多态。  
任何方法都可以引用继承层次中高层的方法，无论是否重名，只是相对的引用查找上一层。  
在许多语言里可以使用super来指代当前类的父类/祖先类。  
多态的另一个方面就是在继承链的不同层次中一个方法名可以多次的被定义，当调用的时候会自动选择合适的定义。  
在es6之前没有super，类是属于构造函数的，由于父类和子类的关系只存在于两者的构造函数对应的.prototype对象中，因此它们不存在直接联系，从而无法简单的实现两者的相对引用。即在子类中无法直接调用父类的构造函数，super可以。  
多态并不表示子类和父类有关联，子类得到的只是父类的一份副本。类的继承其实就是复制。  

## 多重继承

就是继承多个父类。  
如果继承的父类中有两个父类都是继承了一个相同的类，并且都重写了其中的a方法，那现在这个继承他们的类该继承哪个的a方法呢？  
JavaScript中本身并没有提供这个功能。但是有其他办法可以实现。

## 混入

在继承或者实例化的时候，JavaScript的对象机制并不会自动执行复制行为。简单来说，JavaScript中只有对象，并不存在可以被实例化的类。一个对象并不会被复制到其他对象，它们会被关联起来。  
由于其他语言中类表现的都是复制行为，JavaScript中可以用**混入**来模拟复制行为。

### 显式混入

```js
function mixin(sourceObj,targetObj){
    for(var key in sourceObj){
        if(!(key in targetObj)){
            targetObj[key]=sourceObj[key]
        }
    }
    return targetObj
}
var Vehicle ={
    englnes:1,
    ignition:function(){
        console.log("turning on my engline");
    },
    drive:function(){
        this.ignition()
        console.log('steering and moving forward!');
    }
}
var Car = mixin(Vehicle,{
    wheels:4,
    drive:function(){
        Vehicle.drive.call(this)
        console.log("rollong on all"+this.wheels+" wheels!");
    }
})
```

从技术的角度来说函数并没有被复制，复制的是函数引用。相反，属性englnes就是直接复制过来的。  
这种用法会导致代码变复杂，极大的增加维护成本。

### 再说多态

``Vehicle.drive.call(this)``这就是显式多态。  
相对多态是使用super这样的关键字调用父类的方法。  

### 混合复制

由于两个对象引用同一个函数，这种复制或者说混入实际上并不能完全模拟面向类语言中的复制。  
JavaScript中的函数无法真正的复制，复制的仅仅是相关引用。如果修改了共享的引用，相关联的对象都会受到影响。

### 寄生继承

```js
function Vehicle(){
    this.englnes=1
}
Vehicle.prototype.ignition=function(){
    console.log('turing on my engine');
}
Vehicle.prototype.drive=function(){
    this.ignition()
    console.log('steering and moving forward!');
}
// 寄生类
function Car(){
    // car就是一个Vehicle
    var car = new Vehicle()
    // 定制
    car.wheels=4
    // 保存Vehicle的drive的特殊引用
    var VehicleDrive = car.drive
    // 重写
    car.drive=function(){
        VehicleDrive.call(this)
        console.log("rollong on all"+this.wheels+" wheels!");
    }
    return car 
}
var myCar = new Car()
```

通过创建一个新的构造函数，将它的原型指向父类的实例，然后在这个新的构造函数上添加或覆盖方法来实现继承。这种模式之所以被称为“寄生”，是因为新的构造函数“寄生”在父类的实例上，利用了父类的属性和方法。

### 隐式混入

和前面说的显式伪多态很像，该有的问题也都有。用法就是在对象的方法内部call的方式传入this调用。

```js
var Source = {
    methodA: function() {
        console.log('Method A from Source'); 
    },
    methodB: function() {
        console.log('Method B from Source');
    }
};
 
var Target = {
    methodC: function() {
        console.log('Method C from Target'); 
    }
};
 
// 隐式混入 Source 的方法到 Target
Target.methodA = Source.methodA;
Target.methodB = function() { 
    Source.methodB.call(this); // 使用 call() 改变 this 上下文 
};
 
// 现在 Target 对象拥有了 Source 的方法 
Target.methodA(); // 输出: Method A from Source 
Target.methodB(); // 输出: Method B from Source 
Target.methodC(); // 输出: Method C from Target 
```

在这个例子中，我们有一个Source对象，它有两个方法methodA和methodB。我们还有一个Target对象，它有一个方法methodC。通过将Source的方法赋值给Target对象，并在必要时使用call()方法来确保this指向Target，我们实现了隐式混入。

## 小结

类是一种设计模式，许多语言原生支持。js也有类似的语法，但是和他们的类完全不同。  
类意味着复制。  
传统的类被实例化时，它的行为被复制到实例中。类被继承时，行为也会被复制到子类中。  
多态看起来似乎是从子类引用父类，但是本质上引用的其实是复制的结果。  
**JavaScript并不会自动创建对象的副本。** 只是引用，会留下隐患。
