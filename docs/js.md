Classes in JavaScript are syntactic sugar for prototypes,
and extending a prototype to include a new method is as simple as

```js
class Component {}
Component.prototype.loadMore = function () { ... }
```

Overriding these methods would
break the component. First, you want to use the **hasOwnProperty()** method to check
whether the method already exists in the component’s prototype. Unfortunately, this
method isn’t safe to use (a malicious user could use it to do some harm),


Arrow functions can’t have their own this keyword, so the this keyword inside the arrow function is inherited from the containing function.
Arrow functions are lexically scoped, which means that the this keyword is
bound to the value of this in the enclosing (function or global) scope. 

class Component {}
typeof Component // 'function'
