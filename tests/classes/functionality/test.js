function speed(fn, n) {
    var start = Date.now();
    for (var i = 0; i < n; i++) {
        fn();
    }
    var duration = Date.now() - start;
    console.log('duration: ', duration, 'ms for ', n, 'operations');
    console.log('median: ', duration / n, 'ms per operation');
    console.log('mark: about', n / duration, 'operation per ms');
}

function value() {
    return '*' + value + '*';
}
function getter(name) {
    return function () {
        return '?' + this.__get(name);
    };
}
function setter(name) {
    return function (value) {
        return this.__set(name, value + '!');
    };
}
function getProperty(object, name) {
    return function () {
        return object[name];
    };
}
function setProperty(object, name, value) {
    return function () {
        return object[name] = value;
    }
}
function caller(name, args) {
    return function () {
        return this[name].apply(this, args);
    };
}
function getMethod(name) {
    return function () {
        return this[name];
    };
}
function getMethodCall(method) {
    return function () {
        method();
    };
}
function getMethodParent(name) {
    return function () {
        return this.parent()[name];
    };
}
function getMethodDown(name) {
    return function () {
        return this.parent()[name].call(this);
    };
}
function setMethod(name) {
    return function (value) {
        return this[name] = value;
    };
}
function setMethodCall(method, value) {
    return function () {
        method(value);
    };
}
function setMethodParent(name) {
    return function (value) {
        return this.parent()[name] = value;
    };
}
function setMethodDown(name) {
    return function (value) {
        return this.parent()[name].call(this, value);
    };
}
function xsStart(suffix) {
    xs.createClass('simple');
    xs.createClass('a' + suffix);
    xs['a' + suffix].constructor(function (x) {
        this.x = x;
    }, [0]);
    //private static properties variations
    xs['a' + suffix].privateStaticProperty('aprispvv', {value: 1, get: 2, set: 3});
    xs['a' + suffix].privateStaticProperty('aprispvf', {value: 4, get: 5, set: setter('aprispvf')});
    xs['a' + suffix].privateStaticProperty('aprispfv', {value: 6, get: getter('aprispfv'), set: 7});
    xs['a' + suffix].privateStaticProperty('aprispff', {value: 8, get: getter('aprispff'), set: setter('aprispff')});
    //protected static properties variations
    xs['a' + suffix].protectedStaticProperty('aprospvv', {value: 11, get: 12, set: 13});
    xs['a' + suffix].protectedStaticProperty('aprospvf', {value: 14, get: 15, set: setter('aprospvf')});
    xs['a' + suffix].protectedStaticProperty('aprospfv', {value: 16, get: getter('aprospfv'), set: 17});
    xs['a' + suffix].protectedStaticProperty('aprospff', {value: 18, get: getter('aprospff'), set: setter('aprospff')});
    //public static properties variations
    xs['a' + suffix].publicStaticProperty('apubspvv', {value: 21, get: 22, set: 23});
    xs['a' + suffix].publicStaticProperty('apubspvf', {value: 24, get: 25, set: setter('apubspvf')});
    xs['a' + suffix].publicStaticProperty('apubspfv', {value: 26, get: getter('apubspfv'), set: 27});
    xs['a' + suffix].publicStaticProperty('apubspff', {value: 28, get: getter('apubspff'), set: setter('apubspff')});
    //private static getters/setters for private static properties
    xs['a' + suffix].privateStaticMethod('aprismGETaprispvv', getMethod('aprispvv'));
    xs['a' + suffix].privateStaticMethod('aprismSETaprispvv', setMethod('aprispvv'));
    xs['a' + suffix].privateStaticMethod('aprismGETaprispvf', getMethod('aprispvf'));
    xs['a' + suffix].privateStaticMethod('aprismSETaprispvf', setMethod('aprispvf'));
    xs['a' + suffix].privateStaticMethod('aprismGETaprispfv', getMethod('aprispfv'));
    xs['a' + suffix].privateStaticMethod('aprismSETaprispfv', setMethod('aprispfv'));
    xs['a' + suffix].privateStaticMethod('aprismGETaprispff', getMethod('aprispff'));
    xs['a' + suffix].privateStaticMethod('aprismSETaprispff', setMethod('aprispff'));
    //protected static getters/setters for protected static properties
    xs['a' + suffix].protectedStaticMethod('aprosmGETaprospvv', getMethod('aprospvv'));
    xs['a' + suffix].protectedStaticMethod('aprosmSETaprospvv', setMethod('aprospvv'));
    xs['a' + suffix].protectedStaticMethod('aprosmGETaprospvf', getMethod('aprospvf'));
    xs['a' + suffix].protectedStaticMethod('aprosmSETaprospvf', setMethod('aprospvf'));
    xs['a' + suffix].protectedStaticMethod('aprosmGETaprospfv', getMethod('aprospfv'));
    xs['a' + suffix].protectedStaticMethod('aprosmSETaprospfv', setMethod('aprospfv'));
    xs['a' + suffix].protectedStaticMethod('aprosmGETaprospff', getMethod('aprospff'));
    xs['a' + suffix].protectedStaticMethod('aprosmSETaprospff', setMethod('aprospff'));
    //public static getters/setters for private static properties
    xs['a' + suffix].publicStaticMethod('apubsmGETaprispvv', getMethod('aprispvv'));
    xs['a' + suffix].publicStaticMethod('apubsmSETaprispvv', setMethod('aprispvv'));
    xs['a' + suffix].publicStaticMethod('apubsmGETaprispvf', getMethod('aprispvf'));
    xs['a' + suffix].publicStaticMethod('apubsmSETaprispvf', setMethod('aprispvf'));
    xs['a' + suffix].publicStaticMethod('apubsmGETaprispfv', getMethod('aprispfv'));
    xs['a' + suffix].publicStaticMethod('apubsmSETaprispfv', setMethod('aprispfv'));
    xs['a' + suffix].publicStaticMethod('apubsmGETaprispff', getMethod('aprispff'));
    xs['a' + suffix].publicStaticMethod('apubsmSETaprispff', setMethod('aprispff'));
    //public static getters/setters for protected static properties
    xs['a' + suffix].publicStaticMethod('apubsmGETaprospvv', getMethod('aprospvv'));
    xs['a' + suffix].publicStaticMethod('apubsmSETaprospvv', setMethod('aprospvv'));
    xs['a' + suffix].publicStaticMethod('apubsmGETaprospvf', getMethod('aprospvf'));
    xs['a' + suffix].publicStaticMethod('apubsmSETaprospvf', setMethod('aprospvf'));
    xs['a' + suffix].publicStaticMethod('apubsmGETaprospfv', getMethod('aprospfv'));
    xs['a' + suffix].publicStaticMethod('apubsmSETaprospfv', setMethod('aprospfv'));
    xs['a' + suffix].publicStaticMethod('apubsmGETaprospff', getMethod('aprospff'));
    xs['a' + suffix].publicStaticMethod('apubsmSETaprospff', setMethod('aprospff'));
    //public static getters/setters for public static properties
    xs['a' + suffix].publicStaticMethod('apubsmGETapubspvv', getMethod('apubspvv'));
    xs['a' + suffix].publicStaticMethod('apubsmSETapubspvv', setMethod('apubspvv'));
    xs['a' + suffix].publicStaticMethod('apubsmGETapubspvf', getMethod('apubspvf'));
    xs['a' + suffix].publicStaticMethod('apubsmSETapubspvf', setMethod('apubspvf'));
    xs['a' + suffix].publicStaticMethod('apubsmGETapubspfv', getMethod('apubspfv'));
    xs['a' + suffix].publicStaticMethod('apubsmSETapubspfv', setMethod('apubspfv'));
    xs['a' + suffix].publicStaticMethod('apubsmGETapubspff', getMethod('apubspff'));
    xs['a' + suffix].publicStaticMethod('apubsmSETapubspff', setMethod('apubspff'));
    //private properties variations
    xs['a' + suffix].privateProperty('apridpvv', {value: 1, get: 2, set: 3});
    xs['a' + suffix].privateProperty('apridpvf', {value: 4, get: 5, set: setter('apridpvf')});
    xs['a' + suffix].privateProperty('apridpfv', {value: 6, get: getter('apridpfv'), set: 7});
    xs['a' + suffix].privateProperty('apridpff', {value: 8, get: getter('apridpff'), set: setter('apridpff')});
    //protected properties variations
    xs['a' + suffix].protectedProperty('aprodpvv', {value: 11, get: 12, set: 13});
    xs['a' + suffix].protectedProperty('aprodpvf', {value: 14, get: 15, set: setter('aprodpvf')});
    xs['a' + suffix].protectedProperty('aprodpfv', {value: 16, get: getter('aprodpfv'), set: 17});
    xs['a' + suffix].protectedProperty('aprodpff', {value: 18, get: getter('aprodpff'), set: setter('aprodpff')});
    //public properties variations
    xs['a' + suffix].publicProperty('apubdpvv', {value: 21, get: 22, set: 23});
    xs['a' + suffix].publicProperty('apubdpvf', {value: 24, get: 25, set: setter('apubdpvf')});
    xs['a' + suffix].publicProperty('apubdpfv', {value: 26, get: getter('apubdpfv'), set: 27});
    xs['a' + suffix].publicProperty('apubdpff', {value: 28, get: getter('apubdpff'), set: setter('apubdpff')});
    //private getters/setters for private properties
    xs['a' + suffix].privateMethod('apridmGETapridpvv', getMethod('apridpvv'));
    xs['a' + suffix].privateMethod('apridmSETapridpvv', setMethod('apridpvv'));
    xs['a' + suffix].privateMethod('apridmGETapridpvf', getMethod('apridpvf'));
    xs['a' + suffix].privateMethod('apridmSETapridpvf', setMethod('apridpvf'));
    xs['a' + suffix].privateMethod('apridmGETapridpfv', getMethod('apridpfv'));
    xs['a' + suffix].privateMethod('apridmSETapridpfv', setMethod('apridpfv'));
    xs['a' + suffix].privateMethod('apridmGETapridpff', getMethod('apridpff'));
    xs['a' + suffix].privateMethod('apridmSETapridpff', setMethod('apridpff'));
    //protected getters/setters for protected properties
    xs['a' + suffix].protectedMethod('aprodmGETaprodpvv', getMethod('aprodpvv'));
    xs['a' + suffix].protectedMethod('aprodmSETaprodpvv', setMethod('aprodpvv'));
    xs['a' + suffix].protectedMethod('aprodmGETaprodpvf', getMethod('aprodpvf'));
    xs['a' + suffix].protectedMethod('aprodmSETaprodpvf', setMethod('aprodpvf'));
    xs['a' + suffix].protectedMethod('aprodmGETaprodpfv', getMethod('aprodpfv'));
    xs['a' + suffix].protectedMethod('aprodmSETaprodpfv', setMethod('aprodpfv'));
    xs['a' + suffix].protectedMethod('aprodmGETaprodpff', getMethod('aprodpff'));
    xs['a' + suffix].protectedMethod('aprodmSETaprodpff', setMethod('aprodpff'));
    //public getters/setters for private properties
    xs['a' + suffix].publicMethod('apubdmGETapridpvv', getMethod('apridpvv'));
    xs['a' + suffix].publicMethod('apubdmSETapridpvv', setMethod('apridpvv'));
    xs['a' + suffix].publicMethod('apubdmGETapridpvf', getMethod('apridpvf'));
    xs['a' + suffix].publicMethod('apubdmSETapridpvf', setMethod('apridpvf'));
    xs['a' + suffix].publicMethod('apubdmGETapridpfv', getMethod('apridpfv'));
    xs['a' + suffix].publicMethod('apubdmSETapridpfv', setMethod('apridpfv'));
    xs['a' + suffix].publicMethod('apubdmGETapridpff', getMethod('apridpff'));
    xs['a' + suffix].publicMethod('apubdmSETapridpff', setMethod('apridpff'));
    //public getters/setters for protected properties
    xs['a' + suffix].publicMethod('apubdmGETaprodpvv', getMethod('aprodpvv'));
    xs['a' + suffix].publicMethod('apubdmSETaprodpvv', setMethod('aprodpvv'));
    xs['a' + suffix].publicMethod('apubdmGETaprodpvf', getMethod('aprodpvf'));
    xs['a' + suffix].publicMethod('apubdmSETaprodpvf', setMethod('aprodpvf'));
    xs['a' + suffix].publicMethod('apubdmGETaprodpfv', getMethod('aprodpfv'));
    xs['a' + suffix].publicMethod('apubdmSETaprodpfv', setMethod('aprodpfv'));
    xs['a' + suffix].publicMethod('apubdmGETaprodpff', getMethod('aprodpff'));
    xs['a' + suffix].publicMethod('apubdmSETaprodpff', setMethod('aprodpff'));
    //public getters/setters for public properties
    xs['a' + suffix].publicMethod('apubdmGETapubdpvv', getMethod('apubdpvv'));
    xs['a' + suffix].publicMethod('apubdmSETapubdpvv', setMethod('apubdpvv'));
    xs['a' + suffix].publicMethod('apubdmGETapubdpvf', getMethod('apubdpvf'));
    xs['a' + suffix].publicMethod('apubdmSETapubdpvf', setMethod('apubdpvf'));
    xs['a' + suffix].publicMethod('apubdmGETapubdpfv', getMethod('apubdpfv'));
    xs['a' + suffix].publicMethod('apubdmSETapubdpfv', setMethod('apubdpfv'));
    xs['a' + suffix].publicMethod('apubdmGETapubdpff', getMethod('apubdpff'));
    xs['a' + suffix].publicMethod('apubdmSETapubdpff', setMethod('apubdpff'));
    //downcalls check methods and properties
    xs['a' + suffix].privateProperty('apridpvvsc', {value: 1});
    xs['a' + suffix].protectedProperty('aprodpvvsc', {value: 2});
    xs['a' + suffix].publicProperty('apubdpvvsc', {value: 3});
    xs['a' + suffix].privateMethod('apridmGETapridpvvsc', getMethod('apridpvvsc'));
    xs['a' + suffix].privateMethod('apridmSETapridpvvsc', setMethod('apridpvvsc'));
    xs['a' + suffix].protectedMethod('aprodmGETapridpvvsc', getMethod('apridpvvsc'));
    xs['a' + suffix].protectedMethod('aprodmSETapridpvvsc', setMethod('apridpvvsc'));
    xs['a' + suffix].publicMethod('apubdmGETapridpvvsc', getMethod('apridpvvsc'));
    xs['a' + suffix].publicMethod('apubdmSETapridpvvsc', setMethod('apridpvvsc'));
    xs['a' + suffix].privateMethod('apridmGETaprodpvvsc', getMethod('aprodpvvsc'));
    xs['a' + suffix].privateMethod('apridmSETaprodpvvsc', setMethod('aprodpvvsc'));
    xs['a' + suffix].protectedMethod('aprodmGETaprodpvvsc', getMethod('aprodpvvsc'));
    xs['a' + suffix].protectedMethod('aprodmSETaprodpvvsc', setMethod('aprodpvvsc'));
    xs['a' + suffix].publicMethod('apubdmGETaprodpvvsc', getMethod('aprodpvvsc'));
    xs['a' + suffix].publicMethod('apubdmSETaprodpvvsc', setMethod('aprodpvvsc'));
    xs['a' + suffix].privateMethod('apridmGETapubdpvvsc', getMethod('apubdpvvsc'));
    xs['a' + suffix].privateMethod('apridmSETapubdpvvsc', setMethod('apubdpvvsc'));
    xs['a' + suffix].protectedMethod('aprodmGETapubdpvvsc', getMethod('apubdpvvsc'));
    xs['a' + suffix].protectedMethod('aprodmSETapubdpvvsc', setMethod('apubdpvvsc'));
    xs['a' + suffix].publicMethod('apubdmGETapubdpvvsc', getMethod('apubdpvvsc'));
    xs['a' + suffix].publicMethod('apubdmSETapubdpvvsc', setMethod('apubdpvvsc'));
    //class b
    xs.createClass('b' + suffix);
    xs['b' + suffix].extend(xs['a' + suffix]);
    xs['b' + suffix].constructor(function (x, y) {
        this.parent().constructor.call(this, x);
        this.y = y;
    }, [0, 0]);
    xs['b' + suffix].privateProperty('bpridpvvsc', {value: 4});
    xs['b' + suffix].protectedProperty('bprodpvvsc', {value: 5});
    xs['b' + suffix].publicProperty('bpubdpvvsc', {value: 6});
    xs['b' + suffix].privateMethod('bpridmGETbpridpvvsc', getMethod('bpridpvvsc'));
    xs['b' + suffix].privateMethod('bpridmSETbpridpvvsc', setMethod('bpridpvvsc'));
    xs['b' + suffix].protectedMethod('bprodmGETbpridpvvsc', getMethod('bpridpvvsc'));
    xs['b' + suffix].protectedMethod('bprodmSETbpridpvvsc', setMethod('bpridpvvsc'));
    xs['b' + suffix].publicMethod('bpubdmGETbpridpvvsc', getMethod('bpridpvvsc'));
    xs['b' + suffix].publicMethod('bpubdmSETbpridpvvsc', setMethod('bpridpvvsc'));
    xs['b' + suffix].privateMethod('bpridmGETbprodpvvsc', getMethod('bprodpvvsc'));
    xs['b' + suffix].privateMethod('bpridmSETbprodpvvsc', setMethod('bprodpvvsc'));
    xs['b' + suffix].protectedMethod('bprodmGETbprodpvvsc', getMethod('bprodpvvsc'));
    xs['b' + suffix].protectedMethod('bprodmSETbprodpvvsc', setMethod('bprodpvvsc'));
    xs['b' + suffix].publicMethod('bpubdmGETbprodpvvsc', getMethod('bprodpvvsc'));
    xs['b' + suffix].publicMethod('bpubdmSETbprodpvvsc', setMethod('bprodpvvsc'));
    xs['b' + suffix].privateMethod('bpridmGETbpubdpvvsc', getMethod('bpubdpvvsc'));
    xs['b' + suffix].privateMethod('bpridmSETbpubdpvvsc', setMethod('bpubdpvvsc'));
    xs['b' + suffix].protectedMethod('bprodmGETbpubdpvvsc', getMethod('bpubdpvvsc'));
    xs['b' + suffix].protectedMethod('bprodmSETbpubdpvvsc', setMethod('bpubdpvvsc'));
    xs['b' + suffix].publicMethod('bpubdmGETbpubdpvvsc', getMethod('bpubdpvvsc'));
    xs['b' + suffix].publicMethod('bpubdmSETbpubdpvvsc', setMethod('bpubdpvvsc'));
    xs['b' + suffix].privateMethod('bpridmGETapridpvvsc', getMethodParent('apridpvvsc'));
    xs['b' + suffix].privateMethod('bpridmSETapridpvvsc', setMethodParent('apridpvvsc'));
    xs['b' + suffix].protectedMethod('bprodmGETapridpvvsc', getMethodParent('apridpvvsc'));
    xs['b' + suffix].protectedMethod('bprodmSETapridpvvsc', setMethodParent('apridpvvsc'));
    xs['b' + suffix].publicMethod('bpubdmGETapridpvvsc', getMethodParent('apridpvvsc'));
    xs['b' + suffix].publicMethod('bpubdmSETapridpvvsc', setMethodParent('apridpvvsc'));
    xs['b' + suffix].privateMethod('bpridmGETaprodpvvsc', getMethodParent('aprodpvvsc'));
    xs['b' + suffix].privateMethod('bpridmSETaprodpvvsc', setMethodParent('aprodpvvsc'));
    xs['b' + suffix].protectedMethod('bprodmGETaprodpvvsc', getMethodParent('aprodpvvsc'));
    xs['b' + suffix].protectedMethod('bprodmSETaprodpvvsc', setMethodParent('aprodpvvsc'));
    xs['b' + suffix].publicMethod('bpubdmGETaprodpvvsc', getMethodParent('aprodpvvsc'));
    xs['b' + suffix].publicMethod('bpubdmSETaprodpvvsc', setMethodParent('aprodpvvsc'));
    xs['b' + suffix].privateMethod('bpridmGETapubdpvvsc', getMethodParent('apubdpvvsc'));
    xs['b' + suffix].privateMethod('bpridmSETapubdpvvsc', setMethodParent('apubdpvvsc'));
    xs['b' + suffix].protectedMethod('bprodmGETapubdpvvsc', getMethodParent('apubdpvvsc'));
    xs['b' + suffix].protectedMethod('bprodmSETapubdpvvsc', setMethodParent('apubdpvvsc'));
    xs['b' + suffix].publicMethod('bpubdmGETapubdpvvsc', getMethodParent('apubdpvvsc'));
    xs['b' + suffix].publicMethod('bpubdmSETapubdpvvsc', setMethodParent('apubdpvvsc'));
    //class c
    xs.createClass('c' + suffix);
    xs['c' + suffix].extend(xs['b' + suffix]);
    xs['c' + suffix].constructor(function (x, y, z) {
        this.parent().constructor.call(this, x, y);
        this.z = z;
    }, [0, 0, 0]);
    xs['c' + suffix].privateProperty('cpridpvvsc', {value: 7});
    xs['c' + suffix].protectedProperty('cprodpvvsc', {value: 8});
    xs['c' + suffix].publicProperty('cpubdpvvsc', {value: 9});
    xs['c' + suffix].privateMethod('cpridmGETbpridpvvsc', getMethod('cpridpvvsc'));
    xs['c' + suffix].privateMethod('cpridmSETbpridpvvsc', setMethod('cpridpvvsc'));
    xs['c' + suffix].protectedMethod('cprodmGETbpridpvvsc', getMethod('cpridpvvsc'));
    xs['c' + suffix].protectedMethod('cprodmSETbpridpvvsc', setMethod('cpridpvvsc'));
    xs['c' + suffix].publicMethod('cpubdmGETbpridpvvsc', getMethod('cpridpvvsc'));
    xs['c' + suffix].publicMethod('cpubdmSETbpridpvvsc', setMethod('cpridpvvsc'));
    xs['c' + suffix].privateMethod('cpridmGETbprodpvvsc', getMethod('cprodpvvsc'));
    xs['c' + suffix].privateMethod('cpridmSETbprodpvvsc', setMethod('cprodpvvsc'));
    xs['c' + suffix].protectedMethod('cprodmGETbprodpvvsc', getMethod('cprodpvvsc'));
    xs['c' + suffix].protectedMethod('cprodmSETbprodpvvsc', setMethod('cprodpvvsc'));
    xs['c' + suffix].publicMethod('cpubdmGETbprodpvvsc', getMethod('cprodpvvsc'));
    xs['c' + suffix].publicMethod('cpubdmSETbprodpvvsc', setMethod('cprodpvvsc'));
    xs['c' + suffix].privateMethod('cpridmGETbpubdpvvsc', getMethod('cpubdpvvsc'));
    xs['c' + suffix].privateMethod('cpridmSETbpubdpvvsc', setMethod('cpubdpvvsc'));
    xs['c' + suffix].protectedMethod('cprodmGETbpubdpvvsc', getMethod('cpubdpvvsc'));
    xs['c' + suffix].protectedMethod('cprodmSETbpubdpvvsc', setMethod('cpubdpvvsc'));
    xs['c' + suffix].publicMethod('cpubdmGETbpubdpvvsc', getMethod('cpubdpvvsc'));
    xs['c' + suffix].publicMethod('cpubdmSETbpubdpvvsc', setMethod('cpubdpvvsc'));
    xs['c' + suffix].privateMethod('cpridmGETapridpvvsc', getMethodParent('apridpvvsc'));
    xs['c' + suffix].privateMethod('cpridmSETapridpvvsc', setMethodParent('apridpvvsc'));
    xs['c' + suffix].protectedMethod('cprodmGETapridpvvsc', getMethodParent('apridpvvsc'));
    xs['c' + suffix].protectedMethod('cprodmSETapridpvvsc', setMethodParent('apridpvvsc'));
    xs['c' + suffix].publicMethod('cpubdmGETapridpvvsc', getMethodParent('apridpvvsc'));
    xs['c' + suffix].publicMethod('cpubdmSETapridpvvsc', setMethodParent('apridpvvsc'));
    xs['c' + suffix].privateMethod('cpridmGETaprodpvvsc', getMethodParent('aprodpvvsc'));
    xs['c' + suffix].privateMethod('cpridmSETaprodpvvsc', setMethodParent('aprodpvvsc'));
    xs['c' + suffix].protectedMethod('cprodmGETaprodpvvsc', getMethodParent('aprodpvvsc'));
    xs['c' + suffix].protectedMethod('cprodmSETaprodpvvsc', setMethodParent('aprodpvvsc'));
    xs['c' + suffix].publicMethod('cpubdmGETaprodpvvsc', getMethodParent('aprodpvvsc'));
    xs['c' + suffix].publicMethod('cpubdmSETaprodpvvsc', setMethodParent('aprodpvvsc'));
    xs['c' + suffix].privateMethod('cpridmGETapubdpvvsc', getMethodParent('apubdpvvsc'));
    xs['c' + suffix].privateMethod('cpridmSETapubdpvvsc', setMethodParent('apubdpvvsc'));
    xs['c' + suffix].protectedMethod('cprodmGETapubdpvvsc', getMethodParent('apubdpvvsc'));
    xs['c' + suffix].protectedMethod('cprodmSETapubdpvvsc', setMethodParent('apubdpvvsc'));
    xs['c' + suffix].publicMethod('cpubdmGETapubdpvvsc', getMethodParent('apubdpvvsc'));
    xs['c' + suffix].publicMethod('cpubdmSETapubdpvvsc', setMethodParent('apubdpvvsc'));
    xs['c' + suffix].privateMethod('cpridmGETbpridpvvdc', getMethodDown('bpridmGETapridpvvsc'));
    xs['c' + suffix].privateMethod('cpridmSETbpridpvvdc', setMethodDown('bpridmSETapridpvvsc'));
    xs['c' + suffix].protectedMethod('cprodmGETbpridpvvdc', getMethodDown('bprodmGETapridpvvsc'));
    xs['c' + suffix].protectedMethod('cprodmSETbpridpvvdc', setMethodDown('bprodmSETapridpvvsc'));
    xs['c' + suffix].publicMethod('cpubdmGETbpridpvvdc', getMethodDown('bpubdmGETapridpvvsc'));
    xs['c' + suffix].publicMethod('cpubdmSETbpridpvvdc', setMethodDown('bpubdmSETapridpvvsc'));
    xs['c' + suffix].privateMethod('cpridmGETbprodpvvdc', getMethodDown('bpridmGETaprodpvvsc'));
    xs['c' + suffix].privateMethod('cpridmSETbprodpvvdc', setMethodDown('bpridmSETaprodpvvsc'));
    xs['c' + suffix].protectedMethod('cprodmGETbprodpvvdc', getMethodDown('bprodmGETaprodpvvsc'));
    xs['c' + suffix].protectedMethod('cprodmSETbprodpvvdc', setMethodDown('bprodmSETaprodpvvsc'));
    xs['c' + suffix].publicMethod('cpubdmGETbprodpvvdc', getMethodDown('bpubdmGETaprodpvvsc'));
    xs['c' + suffix].publicMethod('cpubdmSETbprodpvvdc', setMethodDown('bpubdmSETaprodpvvsc'));
    xs['c' + suffix].privateMethod('cpridmGETbpubdpvvdc', getMethodDown('bpridmGETapubdpvvsc'));
    xs['c' + suffix].privateMethod('cpridmSETbpubdpvvdc', setMethodDown('bpridmSETapubdpvvsc'));
    xs['c' + suffix].protectedMethod('cprodmGETbpubdpvvdc', getMethodDown('bprodmGETapubdpvvsc'));
    xs['c' + suffix].protectedMethod('cprodmSETbpubdpvvdc', setMethodDown('bprodmSETapubdpvvsc'));
    xs['c' + suffix].publicMethod('cpubdmGETbpubdpvvdc', getMethodDown('bpubdmGETapubdpvvsc'));
    xs['c' + suffix].publicMethod('cpubdmSETbpubdpvvdc', setMethodDown('bpubdmSETapubdpvvsc'));
    a1 = new xs['a' + suffix]();
    a2 = new xs['a' + suffix](4);
    b1 = new xs['b' + suffix](3);
    b2 = new xs['b' + suffix](6, 9);
    c1 = new xs['c' + suffix](1, 2);
    c2 = new xs['c' + suffix](5, 1, -7);
}
speed(function () {
    xsStart('')
}, 1);
var astorage = xs.a.storage();
var aprivates = xs.a.privates();
var bstorage = xs.b.storage();
var bprivates = xs.b.privates();
var cstorage = xs.c.storage();
var cprivates = xs.c.privates();
var a1privates = a1.privates();
var a2privates = a2.privates();
var b1privates = b1.privates();
var b2privates = b2.privates();
var c1privates = c1.privates();
var c2privates = c2.privates();
module('Creation');
test('create namespace', function () {
    //check create, references and recreation prevention
    equal(xs.createNamespace('test'), xs.getNamespace('test'), 'check that namespace was created');
    equal(xs.createNamespace('test'), xs.test, 'check namespace recreate prevention and direct access');
    //check namespace name is const
    ok(xs.test._name = 'test', 'check namespace name');
    //check hasNameSpace function
    ok(xs.hasNamespace('test'), 'check hasNamespace function');
    //check hasNameSpace function
    xs.test = null;
    ok(xs.hasNamespace('test'), 'check namespace cannot be modified');
    delete xs.test;
    ok(xs.hasNamespace('test'), 'check namespace cannot be deleted');
});
test('create class', function () {
    //check create, references and recreation prevention
    equal(xs.createClass('a'), xs.getClass('a'), 'check that class was created');
    equal(xs.createClass('a'), xs.a, 'check class recreate prevention and direct access');
    //check class name is const
    ok(xs.a._name = 'a', 'check class name');
    //check hasClass function
    ok(xs.hasClass('a'), 'check hasClass function');
    //check hasClass function
    xs.a = null;
    ok(xs.hasClass('a'), 'check class cannot be modified');
    delete xs.a;
    ok(xs.hasClass('a'), 'check class cannot be deleted');
});
test('Object creation basics', function () {
    var s1 = new xs.simple;
    //instanceof check
    ok(s1 instanceof xs.simple, 'check object instance');
});
module('static properties');
test('private static properties tests', function () {
    throws(getProperty(xs.a, 'aprispvv'), /^Attempt to get private property "a::aprispvv"$/, 'access to private static property with value=value,getter=value,setter=value is restricted');
    throws(getProperty(xs.a, 'aprispvf'), /^Attempt to get private property "a::aprispvf"$/, 'access to private static property with value=value,getter=value,setter=function is restricted');
    throws(getProperty(xs.a, 'aprispfv'), /^Attempt to get private property "a::aprispfv"$/, 'access to private static property with value=value,getter=function,setter=value is restricted');
    throws(getProperty(xs.a, 'aprispff'), /^Attempt to get private property "a::aprispff"$/, 'access to private static property with value=value,getter=function,setter=function is restricted');
    throws(setProperty(xs.a, 'aprispvv', 101), /^Attempt to set private property "a::aprispvv"$/, 'access to private static property with value=value,getter=value,setter=value is restricted');
    throws(setProperty(xs.a, 'aprispvf', 104), /^Attempt to set private property "a::aprispvf"$/, 'access to private static property with value=value,getter=value,setter=function is restricted');
    throws(setProperty(xs.a, 'aprispfv', 106), /^Attempt to set private property "a::aprispfv"$/, 'access to private static property with value=value,getter=function,setter=value is restricted');
    throws(setProperty(xs.a, 'aprispff', 108), /^Attempt to set private property "a::aprispff"$/, 'access to private static property with value=value,getter=function,setter=function is restricted');
});
test('protected static properties tests', function () {
    throws(getProperty(xs.a, 'aprospvv'), /^Attempt to get protected property "a::aprospvv"$/, 'access to protected static property with value=value,getter=value,setter=value is restricted');
    throws(getProperty(xs.a, 'aprospvf'), /^Attempt to get protected property "a::aprospvf"$/, 'access to protected static property with value=value,getter=value,setter=function is restricted');
    throws(getProperty(xs.a, 'aprospfv'), /^Attempt to get protected property "a::aprospfv"$/, 'access to protected static property with value=value,getter=function,setter=value is restricted');
    throws(getProperty(xs.a, 'aprospff'), /^Attempt to get protected property "a::aprospff"$/, 'access to protected static property with value=value,getter=function,setter=function is restricted');
    throws(setProperty(xs.a, 'aprospvv', 101), /^Attempt to set protected property "a::aprospvv"$/, 'access to protected static property with value=value,getter=value,setter=value is restricted');
    throws(setProperty(xs.a, 'aprospvf', 104), /^Attempt to set protected property "a::aprospvf"$/, 'access to protected static property with value=value,getter=value,setter=function is restricted');
    throws(setProperty(xs.a, 'aprospfv', 106), /^Attempt to set protected property "a::aprospfv"$/, 'access to protected static property with value=value,getter=function,setter=value is restricted');
    throws(setProperty(xs.a, 'aprospff', 108), /^Attempt to set protected property "a::aprospff"$/, 'access to protected static property with value=value,getter=function,setter=function is restricted');
});
test('public static properties tests', function () {
    equal(xs.a.apubspvv, 21, 'check default value assigned for public static property with value=value,getter=value,setter=value');
    equal(xs.a.apubspvf, '24!', 'check default value assigned for public static property with value=value,getter=value,setter=function');
    equal(xs.a.apubspfv, '?26', 'check default value assigned for public static property with value=value,getter=function,setter=value');
    equal(xs.a.apubspff, '?28!', 'check default value assigned for public static property with value=value,getter=function,setter=function');
    //check assignment goes ok
    xs.a.apubspvv = 101;
    xs.a.apubspvf = 104;
    xs.a.apubspfv = 106;
    xs.a.apubspff = 108;
    equal(xs.a.apubspvv, 101, 'check new value assigned for public static property with value=value,getter=value,setter=value');
    equal(xs.a.apubspvf, '104!', 'check new value assigned for public static property with value=value,getter=value,setter=function');
    equal(xs.a.apubspfv, '?106', 'check new value assigned for public static property with value=value,getter=function,setter=value');
    equal(xs.a.apubspff, '?108!', 'check new value assigned for public static property with value=value,getter=function,setter=function');
    xs.a.apubspvv = 21;
    xs.a.apubspvf = 24;
    xs.a.apubspfv = 26;
    xs.a.apubspff = 28;
    equal(xs.a.apubspvv, 21, 'check default value assigned for public static property with value=value,getter=value,setter=value');
    equal(xs.a.apubspvf, '24!', 'check default value assigned for public static property with value=value,getter=value,setter=function');
    equal(xs.a.apubspfv, '?26', 'check default value assigned for public static property with value=value,getter=function,setter=value');
    equal(xs.a.apubspff, '?28!', 'check default value assigned for public static property with value=value,getter=function,setter=function');
});
module('static methods');
test('private static methods tests', function () {
    throws(getMethodCall(xs.a.aprismGETaprispvv), /^Attempt to call private method "a::aprismGETaprispvv"$/, 'call private static getter method for property with value=value,getter=value,setter=value is restricted');
    throws(setMethodCall(xs.a.aprismSETaprispvv, 101), /^Attempt to call private method "a::aprismSETaprispvv"$/, 'call private static setter method for property with value=value,getter=value,setter=value is restricted');
    throws(getMethodCall(xs.a.aprismGETaprispvf), /^Attempt to call private method "a::aprismGETaprispvf"$/, 'call private static getter method for property with value=value,getter=value,setter=function is restricted');
    throws(setMethodCall(xs.a.aprismSETaprispvf, 104), /^Attempt to call private method "a::aprismSETaprispvf"$/, 'call private static setter method for property with value=value,getter=value,setter=function is restricted');
    throws(getMethodCall(xs.a.aprismGETaprispfv), /^Attempt to call private method "a::aprismGETaprispfv"$/, 'call private static getter method for property with value=value,getter=function,setter=value is restricted');
    throws(setMethodCall(xs.a.aprismSETaprispfv, 106), /^Attempt to call private method "a::aprismSETaprispfv"$/, 'call private static setter method for property with value=value,getter=function,setter=value is restricted');
    throws(getMethodCall(xs.a.aprismGETaprispff), /^Attempt to call private method "a::aprismGETaprispff"$/, 'call private static getter method for property with value=value,getter=function,setter=function is restricted');
    throws(setMethodCall(xs.a.aprismSETaprispff, 108), /^Attempt to call private method "a::aprismSETaprispff"$/, 'call private static setter method for property with value=value,getter=function,setter=function is restricted');
});
test('protected static methods tests', function () {
    throws(getMethodCall(xs.a.aprosmGETaprospvv), /^Attempt to call protected method "a::aprosmGETaprospvv"$/, 'call private static getter method for property with value=value,getter=value,setter=value is restricted');
    throws(setMethodCall(xs.a.aprosmSETaprospvv, 101), /^Attempt to call protected method "a::aprosmSETaprospvv"$/, 'call private static setter method for property with value=value,getter=value,setter=value is restricted');
    throws(getMethodCall(xs.a.aprosmGETaprospvf), /^Attempt to call protected method "a::aprosmGETaprospvf"$/, 'call private static getter method for property with value=value,getter=value,setter=function is restricted');
    throws(setMethodCall(xs.a.aprosmSETaprospvf, 104), /^Attempt to call protected method "a::aprosmSETaprospvf"$/, 'call private static setter method for property with value=value,getter=value,setter=function is restricted');
    throws(getMethodCall(xs.a.aprosmGETaprospfv), /^Attempt to call protected method "a::aprosmGETaprospfv"$/, 'call private static getter method for property with value=value,getter=function,setter=value is restricted');
    throws(setMethodCall(xs.a.aprosmSETaprospfv, 106), /^Attempt to call protected method "a::aprosmSETaprospfv"$/, 'call private static setter method for property with value=value,getter=function,setter=value is restricted');
    throws(getMethodCall(xs.a.aprosmGETaprospff), /^Attempt to call protected method "a::aprosmGETaprospff"$/, 'call private static getter method for property with value=value,getter=function,setter=function is restricted');
    throws(setMethodCall(xs.a.aprosmSETaprospff, 108), /^Attempt to call protected method "a::aprosmSETaprospff"$/, 'call private static setter method for property with value=value,getter=function,setter=function is restricted');
});
test('public static methods tests', function () {
    //get private variables values
    equal(xs.a.apubsmGETaprispvv(), 1, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprispvf(), '4!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprispfv(), '?6', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprispff(), '?8!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.a.apubsmGETaprospvv(), 11, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprospvf(), '14!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprospfv(), '?16', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprospff(), '?18!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.a.apubsmGETapubspvv(), 21, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETapubspvf(), '24!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETapubspfv(), '?26', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETapubspff(), '?28!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //assignments
    //private variables
    xs.a.apubsmSETaprispvv(101);
    xs.a.apubsmSETaprispvf(104);
    xs.a.apubsmSETaprispfv(106);
    xs.a.apubsmSETaprispff(108);
    //protected variables
    xs.a.apubsmSETaprospvv(111);
    xs.a.apubsmSETaprospvf(114);
    xs.a.apubsmSETaprospfv(116);
    xs.a.apubsmSETaprospff(118);
    //public variables
    xs.a.apubsmSETapubspvv(121);
    xs.a.apubsmSETapubspvf(124);
    xs.a.apubsmSETapubspfv(126);
    xs.a.apubsmSETapubspff(128);
    //get private variables values
    equal(xs.a.apubsmGETaprispvv(), 101, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprispvf(), '104!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprispfv(), '?106', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprispff(), '?108!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.a.apubsmGETaprospvv(), 111, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprospvf(), '114!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprospfv(), '?116', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprospff(), '?118!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.a.apubsmGETapubspvv(), 121, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETapubspvf(), '124!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETapubspfv(), '?126', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETapubspff(), '?128!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //assign back
    //private variables
    xs.a.apubsmSETaprispvv(1);
    xs.a.apubsmSETaprispvf(4);
    xs.a.apubsmSETaprispfv(6);
    xs.a.apubsmSETaprispff(8);
    //protected variables
    xs.a.apubsmSETaprospvv(11);
    xs.a.apubsmSETaprospvf(14);
    xs.a.apubsmSETaprospfv(16);
    xs.a.apubsmSETaprospff(18);
    //public variables
    xs.a.apubsmSETapubspvv(21);
    xs.a.apubsmSETapubspvf(24);
    xs.a.apubsmSETapubspfv(26);
    xs.a.apubsmSETapubspff(28);
    //get private variables values
    equal(xs.a.apubsmGETaprispvv(), 1, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprispvf(), '4!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprispfv(), '?6', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprispff(), '?8!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.a.apubsmGETaprospvv(), 11, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprospvf(), '14!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprospfv(), '?16', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprospff(), '?18!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.a.apubsmGETapubspvv(), 21, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETapubspvf(), '24!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETapubspfv(), '?26', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETapubspff(), '?28!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
});
module('static inheritance');
test('inheritance basics', function () {
    //root class check
    equal(xs.a.parent(), xs.a, 'root class check: parent() refers class itself');
    equal(a1.parent(), xs.a.prototype, 'root class instance check: parent() refers class prototype');
    equal(a1.self(), xs.a.prototype, 'root class instance check: self() refers class prototype');
    //child level 1 check
    equal(xs.b.parent(), xs.a, 'child level 1 class check: parent() refers root class');
    equal(b1.parent(), xs.a.prototype, 'child level 1 class instance check: parent() refers root class prototype');
    equal(b1.self(), xs.b.prototype, 'child level 1 instance check: self() refers class prototype');
    //child level 2 check
    equal(xs.c.parent(), xs.b, 'child level 2 class check: parent() refers child level 1');
    equal(c1.parent(), xs.b.prototype, 'child level 2 class instance check: parent() refers child level 1 prototype');
    equal(c1.self(), xs.c.prototype, 'child level 2 instance check: self() refers class prototype');
    //child level 2 check deep
    equal(xs.c.parent().parent(), xs.a, 'child level 2 class check: parent().parent() refers root class');
    equal(c1.parent().parent(), xs.a.prototype, 'child level 2 class instance check: parent().parent() refers root class prototype');
});
test('static properties independency', function () {
    //Class a
    //get private variables values
    equal(xs.a.apubsmGETaprispvv(), 1, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprispvf(), '4!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprispfv(), '?6', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprispff(), '?8!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.a.apubsmGETaprospvv(), 11, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprospvf(), '14!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprospfv(), '?16', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprospff(), '?18!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.a.apubsmGETapubspvv(), 21, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETapubspvf(), '24!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETapubspfv(), '?26', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETapubspff(), '?28!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //Class b
    //get private variables values
    equal(xs.b.apubsmGETaprispvv(), 1, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(xs.b.apubsmGETaprispvf(), '4!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(xs.b.apubsmGETaprispfv(), '?6', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(xs.b.apubsmGETaprispff(), '?8!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.b.apubsmGETaprospvv(), 11, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(xs.b.apubsmGETaprospvf(), '14!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(xs.b.apubsmGETaprospfv(), '?16', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(xs.b.apubsmGETaprospff(), '?18!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.b.apubsmGETapubspvv(), 21, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(xs.b.apubsmGETapubspvf(), '24!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(xs.b.apubsmGETapubspfv(), '?26', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(xs.b.apubsmGETapubspff(), '?28!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //Class c
    //get private variables values
    equal(xs.c.apubsmGETaprispvv(), 1, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(xs.c.apubsmGETaprispvf(), '4!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(xs.c.apubsmGETaprispfv(), '?6', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(xs.c.apubsmGETaprispff(), '?8!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.c.apubsmGETaprospvv(), 11, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(xs.c.apubsmGETaprospvf(), '14!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(xs.c.apubsmGETaprospfv(), '?16', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(xs.c.apubsmGETaprospff(), '?18!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.c.apubsmGETapubspvv(), 21, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(xs.c.apubsmGETapubspvf(), '24!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(xs.c.apubsmGETapubspfv(), '?26', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(xs.c.apubsmGETapubspff(), '?28!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');

    //assignments
    //Class a
    //private variables
    xs.a.apubsmSETaprispvv(101);
    xs.a.apubsmSETaprispvf(104);
    xs.a.apubsmSETaprispfv(106);
    xs.a.apubsmSETaprispff(108);
    //protected variables
    xs.a.apubsmSETaprospvv(111);
    xs.a.apubsmSETaprospvf(114);
    xs.a.apubsmSETaprospfv(116);
    xs.a.apubsmSETaprospff(118);
    //public variables
    xs.a.apubsmSETapubspvv(121);
    xs.a.apubsmSETapubspvf(124);
    xs.a.apubsmSETapubspfv(126);
    xs.a.apubsmSETapubspff(128);
    //Class b
    //private variables
    xs.b.apubsmSETaprispvv(201);
    xs.b.apubsmSETaprispvf(204);
    xs.b.apubsmSETaprispfv(206);
    xs.b.apubsmSETaprispff(208);
    //protected variables
    xs.b.apubsmSETaprospvv(211);
    xs.b.apubsmSETaprospvf(214);
    xs.b.apubsmSETaprospfv(216);
    xs.b.apubsmSETaprospff(218);
    //public variables
    xs.b.apubsmSETapubspvv(221);
    xs.b.apubsmSETapubspvf(224);
    xs.b.apubsmSETapubspfv(226);
    xs.b.apubsmSETapubspff(228);
    //Class c
    //private variables
    xs.c.apubsmSETaprispvv(301);
    xs.c.apubsmSETaprispvf(304);
    xs.c.apubsmSETaprispfv(306);
    xs.c.apubsmSETaprispff(308);
    //protected variables
    xs.c.apubsmSETaprospvv(311);
    xs.c.apubsmSETaprospvf(314);
    xs.c.apubsmSETaprospfv(316);
    xs.c.apubsmSETaprospff(318);
    //public variables
    xs.c.apubsmSETapubspvv(321);
    xs.c.apubsmSETapubspvf(324);
    xs.c.apubsmSETapubspfv(326);
    xs.c.apubsmSETapubspff(328);
    //Checks
    //Class a
    //get private variables values
    equal(xs.a.apubsmGETaprispvv(), 101, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprispvf(), '104!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprispfv(), '?106', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprispff(), '?108!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.a.apubsmGETaprospvv(), 111, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprospvf(), '114!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprospfv(), '?116', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprospff(), '?118!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.a.apubsmGETapubspvv(), 121, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETapubspvf(), '124!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETapubspfv(), '?126', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETapubspff(), '?128!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //Class b
    //get private variables values
    equal(xs.b.apubsmGETaprispvv(), 201, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(xs.b.apubsmGETaprispvf(), '204!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(xs.b.apubsmGETaprispfv(), '?206', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(xs.b.apubsmGETaprispff(), '?208!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.b.apubsmGETaprospvv(), 211, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(xs.b.apubsmGETaprospvf(), '214!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(xs.b.apubsmGETaprospfv(), '?216', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(xs.b.apubsmGETaprospff(), '?218!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.b.apubsmGETapubspvv(), 221, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(xs.b.apubsmGETapubspvf(), '224!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(xs.b.apubsmGETapubspfv(), '?226', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(xs.b.apubsmGETapubspff(), '?228!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //Class c
    //get private variables values
    equal(xs.c.apubsmGETaprispvv(), 301, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(xs.c.apubsmGETaprispvf(), '304!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(xs.c.apubsmGETaprispfv(), '?306', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(xs.c.apubsmGETaprispff(), '?308!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.c.apubsmGETaprospvv(), 311, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(xs.c.apubsmGETaprospvf(), '314!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(xs.c.apubsmGETaprospfv(), '?316', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(xs.c.apubsmGETaprospff(), '?318!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.c.apubsmGETapubspvv(), 321, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(xs.c.apubsmGETapubspvf(), '324!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(xs.c.apubsmGETapubspfv(), '?326', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(xs.c.apubsmGETapubspff(), '?328!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    //assign back
    //Class a
    //private variables
    xs.a.apubsmSETaprispvv(1);
    xs.a.apubsmSETaprispvf(4);
    xs.a.apubsmSETaprispfv(6);
    xs.a.apubsmSETaprispff(8);
    //protected variables
    xs.a.apubsmSETaprospvv(11);
    xs.a.apubsmSETaprospvf(14);
    xs.a.apubsmSETaprospfv(16);
    xs.a.apubsmSETaprospff(18);
    //public variables
    xs.a.apubsmSETapubspvv(21);
    xs.a.apubsmSETapubspvf(24);
    xs.a.apubsmSETapubspfv(26);
    xs.a.apubsmSETapubspff(28);
    //Class b
    //private variables
    xs.b.apubsmSETaprispvv(1);
    xs.b.apubsmSETaprispvf(4);
    xs.b.apubsmSETaprispfv(6);
    xs.b.apubsmSETaprispff(8);
    //protected variables
    xs.b.apubsmSETaprospvv(11);
    xs.b.apubsmSETaprospvf(14);
    xs.b.apubsmSETaprospfv(16);
    xs.b.apubsmSETaprospff(18);
    //public variables
    xs.b.apubsmSETapubspvv(21);
    xs.b.apubsmSETapubspvf(24);
    xs.b.apubsmSETapubspfv(26);
    xs.b.apubsmSETapubspff(28);
    //Class c
    //private variables
    xs.c.apubsmSETaprispvv(1);
    xs.c.apubsmSETaprispvf(4);
    xs.c.apubsmSETaprispfv(6);
    xs.c.apubsmSETaprispff(8);
    //protected variables
    xs.c.apubsmSETaprospvv(11);
    xs.c.apubsmSETaprospvf(14);
    xs.c.apubsmSETaprospfv(16);
    xs.c.apubsmSETaprospff(18);
    //public variables
    xs.c.apubsmSETapubspvv(21);
    xs.c.apubsmSETapubspvf(24);
    xs.c.apubsmSETapubspfv(26);
    xs.c.apubsmSETapubspff(28);
    //Class a
    //get private variables values
    equal(xs.a.apubsmGETaprispvv(), 1, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprispvf(), '4!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprispfv(), '?6', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprispff(), '?8!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.a.apubsmGETaprospvv(), 11, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprospvf(), '14!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprospfv(), '?16', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprospff(), '?18!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.a.apubsmGETapubspvv(), 21, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETapubspvf(), '24!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETapubspfv(), '?26', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETapubspff(), '?28!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //Class b
    //get private variables values
    equal(xs.b.apubsmGETaprispvv(), 1, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(xs.b.apubsmGETaprispvf(), '4!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(xs.b.apubsmGETaprispfv(), '?6', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(xs.b.apubsmGETaprispff(), '?8!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.b.apubsmGETaprospvv(), 11, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(xs.b.apubsmGETaprospvf(), '14!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(xs.b.apubsmGETaprospfv(), '?16', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(xs.b.apubsmGETaprospff(), '?18!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.b.apubsmGETapubspvv(), 21, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(xs.b.apubsmGETapubspvf(), '24!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(xs.b.apubsmGETapubspfv(), '?26', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(xs.b.apubsmGETapubspff(), '?28!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //Class c
    //get private variables values
    equal(xs.c.apubsmGETaprispvv(), 1, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(xs.c.apubsmGETaprispvf(), '4!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(xs.c.apubsmGETaprispfv(), '?6', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(xs.c.apubsmGETaprispff(), '?8!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.c.apubsmGETaprospvv(), 11, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(xs.c.apubsmGETaprospvf(), '14!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(xs.c.apubsmGETaprospfv(), '?16', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(xs.c.apubsmGETaprospff(), '?18!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.c.apubsmGETapubspvv(), 21, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(xs.c.apubsmGETapubspvf(), '24!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(xs.c.apubsmGETapubspfv(), '?26', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(xs.c.apubsmGETapubspff(), '?28!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
});
test('public static methods downcalls', function () {
    //get private variables values
    equal(xs.a.apubsmGETaprispvv(), 1, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprispvf(), '4!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprispfv(), '?6', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprispff(), '?8!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.a.apubsmGETaprospvv(), 11, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprospvf(), '14!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprospfv(), '?16', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprospff(), '?18!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.a.apubsmGETapubspvv(), 21, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETapubspvf(), '24!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETapubspfv(), '?26', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETapubspff(), '?28!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //assignments
    //private variables
    xs.a.apubsmSETaprispvv(101);
    xs.a.apubsmSETaprispvf(104);
    xs.a.apubsmSETaprispfv(106);
    xs.a.apubsmSETaprispff(108);
    //protected variables
    xs.b.parent().apubsmSETaprospvv(111);
    xs.b.parent().apubsmSETaprospvf(114);
    xs.b.parent().apubsmSETaprospfv(116);
    xs.b.parent().apubsmSETaprospff(118);
    //public variables
    xs.c.parent().parent().apubsmSETapubspvv(121);
    xs.c.parent().parent().apubsmSETapubspvf(124);
    xs.c.parent().parent().apubsmSETapubspfv(126);
    xs.c.parent().parent().apubsmSETapubspff(128);
    //get private variables values
    equal(xs.c.parent().parent().apubsmGETaprispvv(), 101, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.c.parent().parent().apubsmGETaprispvf(), '104!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.c.parent().parent().apubsmGETaprispfv(), '?106', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.c.parent().parent().apubsmGETaprispff(), '?108!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.a.apubsmGETaprospvv(), 111, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprospvf(), '114!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprospfv(), '?116', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprospff(), '?118!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.b.parent().apubsmGETapubspvv(), 121, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.b.parent().apubsmGETapubspvf(), '124!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.b.parent().apubsmGETapubspfv(), '?126', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.b.parent().apubsmGETapubspff(), '?128!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //assign back
    //private variables
    xs.b.parent().apubsmSETaprispvv(1);
    xs.b.parent().apubsmSETaprispvf(4);
    xs.b.parent().apubsmSETaprispfv(6);
    xs.b.parent().apubsmSETaprispff(8);
    //protected variables
    xs.c.parent().parent().apubsmSETaprospvv(11);
    xs.c.parent().parent().apubsmSETaprospvf(14);
    xs.c.parent().parent().apubsmSETaprospfv(16);
    xs.c.parent().parent().apubsmSETaprospff(18);
    //public variables
    xs.a.apubsmSETapubspvv(21);
    xs.a.apubsmSETapubspvf(24);
    xs.a.apubsmSETapubspfv(26);
    xs.a.apubsmSETapubspff(28);
    //get private variables values
    equal(xs.a.apubsmGETaprispvv(), 1, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprispvf(), '4!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprispfv(), '?6', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprispff(), '?8!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.a.apubsmGETaprospvv(), 11, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprospvf(), '14!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprospfv(), '?16', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprospff(), '?18!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.a.apubsmGETapubspvv(), 21, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETapubspvf(), '24!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETapubspfv(), '?26', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETapubspff(), '?28!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
});
module('properties');
test('private properties tests', function () {
    throws(getProperty(b1, 'apridpvv'), /^Attempt to get private property "b::apridpvv"$/, 'access to private property with value=value,getter=value,setter=value is restricted');
    throws(getProperty(b1, 'apridpvf'), /^Attempt to get private property "b::apridpvf"$/, 'access to private property with value=value,getter=value,setter=function is restricted');
    throws(getProperty(b1, 'apridpfv'), /^Attempt to get private property "b::apridpfv"$/, 'access to private property with value=value,getter=function,setter=value is restricted');
    throws(getProperty(b1, 'apridpff'), /^Attempt to get private property "b::apridpff"$/, 'access to private property with value=value,getter=function,setter=function is restricted');
    throws(setProperty(b1, 'apridpvv', 101), /^Attempt to set private property "b::apridpvv"$/, 'access to private property with value=value,getter=value,setter=value is restricted');
    throws(setProperty(b1, 'apridpvf', 104), /^Attempt to set private property "b::apridpvf"$/, 'access to private property with value=value,getter=value,setter=function is restricted');
    throws(setProperty(b1, 'apridpfv', 106), /^Attempt to set private property "b::apridpfv"$/, 'access to private property with value=value,getter=function,setter=value is restricted');
    throws(setProperty(b1, 'apridpff', 108), /^Attempt to set private property "b::apridpff"$/, 'access to private property with value=value,getter=function,setter=function is restricted');
});
test('protected properties tests', function () {
    throws(getProperty(b2, 'aprodpvv'), /^Attempt to get protected property "b::aprodpvv"$/, 'access to protected property with value=value,getter=value,setter=value is restricted');
    throws(getProperty(b2, 'aprodpvf'), /^Attempt to get protected property "b::aprodpvf"$/, 'access to protected property with value=value,getter=value,setter=function is restricted');
    throws(getProperty(b2, 'aprodpfv'), /^Attempt to get protected property "b::aprodpfv"$/, 'access to protected property with value=value,getter=function,setter=value is restricted');
    throws(getProperty(b2, 'aprodpff'), /^Attempt to get protected property "b::aprodpff"$/, 'access to protected property with value=value,getter=function,setter=function is restricted');
    throws(setProperty(b2, 'aprodpvv', 101), /^Attempt to set protected property "b::aprodpvv"$/, 'access to protected property with value=value,getter=value,setter=value is restricted');
    throws(setProperty(b2, 'aprodpvf', 104), /^Attempt to set protected property "b::aprodpvf"$/, 'access to protected property with value=value,getter=value,setter=function is restricted');
    throws(setProperty(b2, 'aprodpfv', 106), /^Attempt to set protected property "b::aprodpfv"$/, 'access to protected property with value=value,getter=function,setter=value is restricted');
    throws(setProperty(b2, 'aprodpff', 108), /^Attempt to set protected property "b::aprodpff"$/, 'access to protected property with value=value,getter=function,setter=function is restricted');
});
test('public properties tests', function () {
    equal(a1.apubdpvv, 21, 'check default value assigned for public static property with value=value,getter=value,setter=value');
    equal(a1.apubdpvf, '24!', 'check default value assigned for public static property with value=value,getter=value,setter=function');
    equal(a1.apubdpfv, '?26', 'check default value assigned for public static property with value=value,getter=function,setter=value');
    equal(a1.apubdpff, '?28!', 'check default value assigned for public static property with value=value,getter=function,setter=function');
    //check assignment goes ok
    a1.apubdpvv = 101;
    a1.apubdpvf = 104;
    a1.apubdpfv = 106;
    a1.apubdpff = 108;
    equal(a1.apubdpvv, 101, 'check new value assigned for public static property with value=value,getter=value,setter=value');
    equal(a1.apubdpvf, '104!', 'check new value assigned for public static property with value=value,getter=value,setter=function');
    equal(a1.apubdpfv, '?106', 'check new value assigned for public static property with value=value,getter=function,setter=value');
    equal(a1.apubdpff, '?108!', 'check new value assigned for public static property with value=value,getter=function,setter=function');
    a1.apubdpvv = 21;
    a1.apubdpvf = 24;
    a1.apubdpfv = 26;
    a1.apubdpff = 28;
    equal(a1.apubdpvv, 21, 'check default value assigned for public static property with value=value,getter=value,setter=value');
    equal(a1.apubdpvf, '24!', 'check default value assigned for public static property with value=value,getter=value,setter=function');
    equal(a1.apubdpfv, '?26', 'check default value assigned for public static property with value=value,getter=function,setter=value');
    equal(a1.apubdpff, '?28!', 'check default value assigned for public static property with value=value,getter=function,setter=function');
});
module('methods');
test('private methods tests', function () {
    throws(getMethodCall(a1.apridmGETapridpvv), /^Attempt to call private method "a::apridmGETapridpvv"$/, 'call private static getter method for property with value=value,getter=value,setter=value is restricted');
    throws(setMethodCall(a1.apridmSETapridpvv, 101), /^Attempt to call private method "a::apridmSETapridpvv"$/, 'call private static setter method for property with value=value,getter=value,setter=value is restricted');
    throws(getMethodCall(a1.apridmGETapridpvf), /^Attempt to call private method "a::apridmGETapridpvf"$/, 'call private static getter method for property with value=value,getter=value,setter=function is restricted');
    throws(setMethodCall(a1.apridmSETapridpvf, 104), /^Attempt to call private method "a::apridmSETapridpvf"$/, 'call private static setter method for property with value=value,getter=value,setter=function is restricted');
    throws(getMethodCall(a1.apridmGETapridpfv), /^Attempt to call private method "a::apridmGETapridpfv"$/, 'call private static getter method for property with value=value,getter=function,setter=value is restricted');
    throws(setMethodCall(a1.apridmSETapridpfv, 106), /^Attempt to call private method "a::apridmSETapridpfv"$/, 'call private static setter method for property with value=value,getter=function,setter=value is restricted');
    throws(getMethodCall(a1.apridmGETapridpff), /^Attempt to call private method "a::apridmGETapridpff"$/, 'call private static getter method for property with value=value,getter=function,setter=function is restricted');
    throws(setMethodCall(a1.apridmSETapridpff, 108), /^Attempt to call private method "a::apridmSETapridpff"$/, 'call private static setter method for property with value=value,getter=function,setter=function is restricted');
});
test('protected methods tests', function () {
    throws(getMethodCall(a1.aprodmGETaprodpvv), /^Attempt to call protected method "a::aprodmGETaprodpvv"$/, 'call private static getter method for property with value=value,getter=value,setter=value is restricted');
    throws(setMethodCall(a1.aprodmSETaprodpvv, 101), /^Attempt to call protected method "a::aprodmSETaprodpvv"$/, 'call private static setter method for property with value=value,getter=value,setter=value is restricted');
    throws(getMethodCall(a1.aprodmGETaprodpvf), /^Attempt to call protected method "a::aprodmGETaprodpvf"$/, 'call private static getter method for property with value=value,getter=value,setter=function is restricted');
    throws(setMethodCall(a1.aprodmSETaprodpvf, 104), /^Attempt to call protected method "a::aprodmSETaprodpvf"$/, 'call private static setter method for property with value=value,getter=value,setter=function is restricted');
    throws(getMethodCall(a1.aprodmGETaprodpfv), /^Attempt to call protected method "a::aprodmGETaprodpfv"$/, 'call private static getter method for property with value=value,getter=function,setter=value is restricted');
    throws(setMethodCall(a1.aprodmSETaprodpfv, 106), /^Attempt to call protected method "a::aprodmSETaprodpfv"$/, 'call private static setter method for property with value=value,getter=function,setter=value is restricted');
    throws(getMethodCall(a1.aprodmGETaprodpff), /^Attempt to call protected method "a::aprodmGETaprodpff"$/, 'call private static getter method for property with value=value,getter=function,setter=function is restricted');
    throws(setMethodCall(a1.aprodmSETaprodpff, 108), /^Attempt to call protected method "a::aprodmSETaprodpff"$/, 'call private static setter method for property with value=value,getter=function,setter=function is restricted');
});
test('public methods tests', function () {
    //get private variables values
    equal(a1.apubdmGETapridpvv(), 1, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(a1.apubdmGETapridpvf(), '4!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(a1.apubdmGETapridpfv(), '?6', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(a1.apubdmGETapridpff(), '?8!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get protected variables values
    equal(a1.apubdmGETaprodpvv(), 11, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(a1.apubdmGETaprodpvf(), '14!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(a1.apubdmGETaprodpfv(), '?16', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(a1.apubdmGETaprodpff(), '?18!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get public variables values
    equal(a1.apubdmGETapubdpvv(), 21, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(a1.apubdmGETapubdpvf(), '24!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(a1.apubdmGETapubdpfv(), '?26', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(a1.apubdmGETapubdpff(), '?28!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //assignments
    //private variables
    a1.apubdmSETapridpvv(101);
    a1.apubdmSETapridpvf(104);
    a1.apubdmSETapridpfv(106);
    a1.apubdmSETapridpff(108);
    //protected variables
    a1.apubdmSETaprodpvv(111);
    a1.apubdmSETaprodpvf(114);
    a1.apubdmSETaprodpfv(116);
    a1.apubdmSETaprodpff(118);
    //public variables
    a1.apubdmSETapubdpvv(121);
    a1.apubdmSETapubdpvf(124);
    a1.apubdmSETapubdpfv(126);
    a1.apubdmSETapubdpff(128);
    //get private variables values
    equal(a1.apubdmGETapridpvv(), 101, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(a1.apubdmGETapridpvf(), '104!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(a1.apubdmGETapridpfv(), '?106', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(a1.apubdmGETapridpff(), '?108!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get protected variables values
    equal(a1.apubdmGETaprodpvv(), 111, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(a1.apubdmGETaprodpvf(), '114!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(a1.apubdmGETaprodpfv(), '?116', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(a1.apubdmGETaprodpff(), '?118!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get public variables values
    equal(a1.apubdmGETapubdpvv(), 121, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(a1.apubdmGETapubdpvf(), '124!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(a1.apubdmGETapubdpfv(), '?126', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(a1.apubdmGETapubdpff(), '?128!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //assign back
    //private variables
    a1.apubdmSETapridpvv(1);
    a1.apubdmSETapridpvf(4);
    a1.apubdmSETapridpfv(6);
    a1.apubdmSETapridpff(8);
    //protected variables
    a1.apubdmSETaprodpvv(11);
    a1.apubdmSETaprodpvf(14);
    a1.apubdmSETaprodpfv(16);
    a1.apubdmSETaprodpff(18);
    //public variables
    a1.apubdmSETapubdpvv(21);
    a1.apubdmSETapubdpvf(24);
    a1.apubdmSETapubdpfv(26);
    a1.apubdmSETapubdpff(28);
    //get private variables values
    equal(a1.apubdmGETapridpvv(), 1, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(a1.apubdmGETapridpvf(), '4!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(a1.apubdmGETapridpfv(), '?6', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(a1.apubdmGETapridpff(), '?8!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get protected variables values
    equal(a1.apubdmGETaprodpvv(), 11, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(a1.apubdmGETaprodpvf(), '14!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(a1.apubdmGETaprodpfv(), '?16', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(a1.apubdmGETaprodpff(), '?18!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get public variables values
    equal(a1.apubdmGETapubdpvv(), 21, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(a1.apubdmGETapubdpvf(), '24!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(a1.apubdmGETapubdpfv(), '?26', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(a1.apubdmGETapubdpff(), '?28!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
});
module('instances inheritance');
test('properties independency', function () {
    //Class a
    //get private variables values
    equal(a1.apubdmGETapridpvv(), 1, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(a2.apubdmGETapridpvv(), 1, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(a1.apubdmGETapridpvf(), '4!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(a2.apubdmGETapridpvf(), '4!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(a1.apubdmGETapridpfv(), '?6', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(a2.apubdmGETapridpfv(), '?6', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(a1.apubdmGETapridpff(), '?8!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    equal(a2.apubdmGETapridpff(), '?8!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //get protected variables values
    equal(a1.apubdmGETaprodpvv(), 11, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(a2.apubdmGETaprodpvv(), 11, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(a1.apubdmGETaprodpvf(), '14!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(a2.apubdmGETaprodpvf(), '14!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(a1.apubdmGETaprodpfv(), '?16', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(a2.apubdmGETaprodpfv(), '?16', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(a1.apubdmGETaprodpff(), '?18!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    equal(a2.apubdmGETaprodpff(), '?18!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //get public variables values
    equal(a1.apubdmGETapubdpvv(), 21, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(a2.apubdmGETapubdpvv(), 21, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(a1.apubdmGETapubdpvf(), '24!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(a2.apubdmGETapubdpvf(), '24!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(a1.apubdmGETapubdpfv(), '?26', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(a2.apubdmGETapubdpfv(), '?26', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(a1.apubdmGETapubdpff(), '?28!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    equal(a2.apubdmGETapubdpff(), '?28!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //Class b
    //get private variables values
    equal(b1.apubdmGETapridpvv(), 1, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(b2.apubdmGETapridpvv(), 1, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(b1.apubdmGETapridpvf(), '4!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(b2.apubdmGETapridpvf(), '4!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(b1.apubdmGETapridpfv(), '?6', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(b2.apubdmGETapridpfv(), '?6', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(b1.apubdmGETapridpff(), '?8!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    equal(b2.apubdmGETapridpff(), '?8!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //get protected variables values
    equal(b1.apubdmGETaprodpvv(), 11, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(b2.apubdmGETaprodpvv(), 11, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(b1.apubdmGETaprodpvf(), '14!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(b2.apubdmGETaprodpvf(), '14!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(b1.apubdmGETaprodpfv(), '?16', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(b2.apubdmGETaprodpfv(), '?16', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(b1.apubdmGETaprodpff(), '?18!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    equal(b2.apubdmGETaprodpff(), '?18!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //get public variables values
    equal(b1.apubdmGETapubdpvv(), 21, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(b2.apubdmGETapubdpvv(), 21, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(b1.apubdmGETapubdpvf(), '24!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(b2.apubdmGETapubdpvf(), '24!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(b1.apubdmGETapubdpfv(), '?26', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(b2.apubdmGETapubdpfv(), '?26', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(b1.apubdmGETapubdpff(), '?28!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    equal(b2.apubdmGETapubdpff(), '?28!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //Class c
    //get private variables values
    equal(c1.apubdmGETapridpvv(), 1, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(c2.apubdmGETapridpvv(), 1, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(c1.apubdmGETapridpvf(), '4!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(c2.apubdmGETapridpvf(), '4!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(c1.apubdmGETapridpfv(), '?6', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(c2.apubdmGETapridpfv(), '?6', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(c1.apubdmGETapridpff(), '?8!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    equal(c2.apubdmGETapridpff(), '?8!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    //get protected variables values
    equal(c1.apubdmGETaprodpvv(), 11, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(c2.apubdmGETaprodpvv(), 11, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(c1.apubdmGETaprodpvf(), '14!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(c2.apubdmGETaprodpvf(), '14!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(c1.apubdmGETaprodpfv(), '?16', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(c2.apubdmGETaprodpfv(), '?16', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(c1.apubdmGETaprodpff(), '?18!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    equal(c2.apubdmGETaprodpff(), '?18!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    //get public variables values
    equal(c1.apubdmGETapubdpvv(), 21, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(c2.apubdmGETapubdpvv(), 21, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(c1.apubdmGETapubdpvf(), '24!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(c2.apubdmGETapubdpvf(), '24!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(c1.apubdmGETapubdpfv(), '?26', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(c2.apubdmGETapubdpfv(), '?26', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(c1.apubdmGETapubdpff(), '?28!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    equal(c2.apubdmGETapubdpff(), '?28!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');

    //assignments
    //Class a
    //private variables
    a1.apubdmSETapridpvv(101);
    a2.apubdmSETapridpvv(1010);
    a1.apubdmSETapridpvf(104);
    a2.apubdmSETapridpvf(1040);
    a1.apubdmSETapridpfv(106);
    a2.apubdmSETapridpfv(1060);
    a1.apubdmSETapridpff(108);
    a2.apubdmSETapridpff(1080);
    //protected variables
    a1.apubdmSETaprodpvv(111);
    a2.apubdmSETaprodpvv(1110);
    a1.apubdmSETaprodpvf(114);
    a2.apubdmSETaprodpvf(1140);
    a1.apubdmSETaprodpfv(116);
    a2.apubdmSETaprodpfv(1160);
    a1.apubdmSETaprodpff(118);
    a2.apubdmSETaprodpff(1180);
    //public variables
    a1.apubdmSETapubdpvv(121);
    a2.apubdmSETapubdpvv(1210);
    a1.apubdmSETapubdpvf(124);
    a2.apubdmSETapubdpvf(1240);
    a1.apubdmSETapubdpfv(126);
    a2.apubdmSETapubdpfv(1260);
    a1.apubdmSETapubdpff(128);
    a2.apubdmSETapubdpff(1280);
    //Class b
    //private variables
    b1.apubdmSETapridpvv(201);
    b2.apubdmSETapridpvv(2010);
    b1.apubdmSETapridpvf(204);
    b2.apubdmSETapridpvf(2040);
    b1.apubdmSETapridpfv(206);
    b2.apubdmSETapridpfv(2060);
    b1.apubdmSETapridpff(208);
    b2.apubdmSETapridpff(2080);
    //protected variables
    b1.apubdmSETaprodpvv(211);
    b2.apubdmSETaprodpvv(2110);
    b1.apubdmSETaprodpvf(214);
    b2.apubdmSETaprodpvf(2140);
    b1.apubdmSETaprodpfv(216);
    b2.apubdmSETaprodpfv(2160);
    b1.apubdmSETaprodpff(218);
    b2.apubdmSETaprodpff(2180);
    //public variables
    b1.apubdmSETapubdpvv(221);
    b2.apubdmSETapubdpvv(2210);
    b1.apubdmSETapubdpvf(224);
    b2.apubdmSETapubdpvf(2240);
    b1.apubdmSETapubdpfv(226);
    b2.apubdmSETapubdpfv(2260);
    b1.apubdmSETapubdpff(228);
    b2.apubdmSETapubdpff(2280);
    //Class c
    //private variables
    c1.apubdmSETapridpvv(301);
    c2.apubdmSETapridpvv(3010);
    c1.apubdmSETapridpvf(304);
    c2.apubdmSETapridpvf(3040);
    c1.apubdmSETapridpfv(306);
    c2.apubdmSETapridpfv(3060);
    c1.apubdmSETapridpff(308);
    c2.apubdmSETapridpff(3080);
    //protected variables
    c1.apubdmSETaprodpvv(311);
    c2.apubdmSETaprodpvv(3110);
    c1.apubdmSETaprodpvf(314);
    c2.apubdmSETaprodpvf(3140);
    c1.apubdmSETaprodpfv(316);
    c2.apubdmSETaprodpfv(3160);
    c1.apubdmSETaprodpff(318);
    c2.apubdmSETaprodpff(3180);
    //public variables
    c1.apubdmSETapubdpvv(321);
    c2.apubdmSETapubdpvv(3210);
    c1.apubdmSETapubdpvf(324);
    c2.apubdmSETapubdpvf(3240);
    c1.apubdmSETapubdpfv(326);
    c2.apubdmSETapubdpfv(3260);
    c1.apubdmSETapubdpff(328);
    c2.apubdmSETapubdpff(3280);
    //Checks
    //Class a
    //get private variables values
    equal(a1.apubdmGETapridpvv(), 101, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(a2.apubdmGETapridpvv(), 1010, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(a1.apubdmGETapridpvf(), '104!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(a2.apubdmGETapridpvf(), '1040!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(a1.apubdmGETapridpfv(), '?106', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(a2.apubdmGETapridpfv(), '?1060', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(a1.apubdmGETapridpff(), '?108!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    equal(a2.apubdmGETapridpff(), '?1080!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //get protected variables values
    equal(a1.apubdmGETaprodpvv(), 111, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(a2.apubdmGETaprodpvv(), 1110, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(a1.apubdmGETaprodpvf(), '114!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(a2.apubdmGETaprodpvf(), '1140!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(a1.apubdmGETaprodpfv(), '?116', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(a2.apubdmGETaprodpfv(), '?1160', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(a1.apubdmGETaprodpff(), '?118!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    equal(a2.apubdmGETaprodpff(), '?1180!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //get public variables values
    equal(a1.apubdmGETapubdpvv(), 121, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(a2.apubdmGETapubdpvv(), 1210, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(a1.apubdmGETapubdpvf(), '124!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(a2.apubdmGETapubdpvf(), '1240!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(a1.apubdmGETapubdpfv(), '?126', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(a2.apubdmGETapubdpfv(), '?1260', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(a1.apubdmGETapubdpff(), '?128!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    equal(a2.apubdmGETapubdpff(), '?1280!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //Class b
    //get private variables values
    equal(b1.apubdmGETapridpvv(), 201, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(b2.apubdmGETapridpvv(), 2010, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(b1.apubdmGETapridpvf(), '204!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(b2.apubdmGETapridpvf(), '2040!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(b1.apubdmGETapridpfv(), '?206', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(b2.apubdmGETapridpfv(), '?2060', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(b1.apubdmGETapridpff(), '?208!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    equal(b2.apubdmGETapridpff(), '?2080!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //get protected variables values
    equal(b1.apubdmGETaprodpvv(), 211, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(b2.apubdmGETaprodpvv(), 2110, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(b1.apubdmGETaprodpvf(), '214!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(b2.apubdmGETaprodpvf(), '2140!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(b1.apubdmGETaprodpfv(), '?216', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(b2.apubdmGETaprodpfv(), '?2160', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(b1.apubdmGETaprodpff(), '?218!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    equal(b2.apubdmGETaprodpff(), '?2180!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //get public variables values
    equal(b1.apubdmGETapubdpvv(), 221, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(b2.apubdmGETapubdpvv(), 2210, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(b1.apubdmGETapubdpvf(), '224!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(b2.apubdmGETapubdpvf(), '2240!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(b1.apubdmGETapubdpfv(), '?226', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(b2.apubdmGETapubdpfv(), '?2260', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(b1.apubdmGETapubdpff(), '?228!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    equal(b2.apubdmGETapubdpff(), '?2280!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //Class c
    //get private variables values
    equal(c1.apubdmGETapridpvv(), 301, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(c2.apubdmGETapridpvv(), 3010, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(c1.apubdmGETapridpvf(), '304!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(c2.apubdmGETapridpvf(), '3040!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(c1.apubdmGETapridpfv(), '?306', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(c2.apubdmGETapridpfv(), '?3060', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(c1.apubdmGETapridpff(), '?308!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    equal(c2.apubdmGETapridpff(), '?3080!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    //get protected variables values
    equal(c1.apubdmGETaprodpvv(), 311, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(c2.apubdmGETaprodpvv(), 3110, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(c1.apubdmGETaprodpvf(), '314!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(c2.apubdmGETaprodpvf(), '3140!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(c1.apubdmGETaprodpfv(), '?316', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(c2.apubdmGETaprodpfv(), '?3160', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(c1.apubdmGETaprodpff(), '?318!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    equal(c2.apubdmGETaprodpff(), '?3180!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    //get public variables values
    equal(c1.apubdmGETapubdpvv(), 321, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(c2.apubdmGETapubdpvv(), 3210, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(c1.apubdmGETapubdpvf(), '324!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(c2.apubdmGETapubdpvf(), '3240!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(c1.apubdmGETapubdpfv(), '?326', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(c2.apubdmGETapubdpfv(), '?3260', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(c1.apubdmGETapubdpff(), '?328!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    equal(c2.apubdmGETapubdpff(), '?3280!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    //assign back
    //Class a
    //private variables
    a1.apubdmSETapridpvv(1);
    a2.apubdmSETapridpvv(1);
    a1.apubdmSETapridpvf(4);
    a2.apubdmSETapridpvf(4);
    a1.apubdmSETapridpfv(6);
    a2.apubdmSETapridpfv(6);
    a1.apubdmSETapridpff(8);
    a2.apubdmSETapridpff(8);
    //protected variables
    a1.apubdmSETaprodpvv(11);
    a2.apubdmSETaprodpvv(11);
    a1.apubdmSETaprodpvf(14);
    a2.apubdmSETaprodpvf(14);
    a1.apubdmSETaprodpfv(16);
    a2.apubdmSETaprodpfv(16);
    a1.apubdmSETaprodpff(18);
    a2.apubdmSETaprodpff(18);
    //public variables
    a1.apubdmSETapubdpvv(21);
    a2.apubdmSETapubdpvv(21);
    a1.apubdmSETapubdpvf(24);
    a2.apubdmSETapubdpvf(24);
    a1.apubdmSETapubdpfv(26);
    a2.apubdmSETapubdpfv(26);
    a1.apubdmSETapubdpff(28);
    a2.apubdmSETapubdpff(28);
    //Class b
    //private variables
    b1.apubdmSETapridpvv(1);
    b2.apubdmSETapridpvv(1);
    b1.apubdmSETapridpvf(4);
    b2.apubdmSETapridpvf(4);
    b1.apubdmSETapridpfv(6);
    b2.apubdmSETapridpfv(6);
    b1.apubdmSETapridpff(8);
    b2.apubdmSETapridpff(8);
    //protected variables
    b1.apubdmSETaprodpvv(11);
    b2.apubdmSETaprodpvv(11);
    b1.apubdmSETaprodpvf(14);
    b2.apubdmSETaprodpvf(14);
    b1.apubdmSETaprodpfv(16);
    b2.apubdmSETaprodpfv(16);
    b1.apubdmSETaprodpff(18);
    b2.apubdmSETaprodpff(18);
    //public variables
    b1.apubdmSETapubdpvv(21);
    b2.apubdmSETapubdpvv(21);
    b1.apubdmSETapubdpvf(24);
    b2.apubdmSETapubdpvf(24);
    b1.apubdmSETapubdpfv(26);
    b2.apubdmSETapubdpfv(26);
    b1.apubdmSETapubdpff(28);
    b2.apubdmSETapubdpff(28);
    //Class c
    //private variables
    c1.apubdmSETapridpvv(1);
    c2.apubdmSETapridpvv(1);
    c1.apubdmSETapridpvf(4);
    c2.apubdmSETapridpvf(4);
    c1.apubdmSETapridpfv(6);
    c2.apubdmSETapridpfv(6);
    c1.apubdmSETapridpff(8);
    c2.apubdmSETapridpff(8);
    //protected variables
    c1.apubdmSETaprodpvv(11);
    c2.apubdmSETaprodpvv(11);
    c1.apubdmSETaprodpvf(14);
    c2.apubdmSETaprodpvf(14);
    c1.apubdmSETaprodpfv(16);
    c2.apubdmSETaprodpfv(16);
    c1.apubdmSETaprodpff(18);
    c2.apubdmSETaprodpff(18);
    //public variables
    c1.apubdmSETapubdpvv(21);
    c2.apubdmSETapubdpvv(21);
    c1.apubdmSETapubdpvf(24);
    c2.apubdmSETapubdpvf(24);
    c1.apubdmSETapubdpfv(26);
    c2.apubdmSETapubdpfv(26);
    c1.apubdmSETapubdpff(28);
    c2.apubdmSETapubdpff(28);
    //Class a
    //get private variables values
    equal(a1.apubdmGETapridpvv(), 1, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(a2.apubdmGETapridpvv(), 1, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(a1.apubdmGETapridpvf(), '4!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(a1.apubdmGETapridpvf(), '4!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(a1.apubdmGETapridpfv(), '?6', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(a2.apubdmGETapridpfv(), '?6', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(a1.apubdmGETapridpff(), '?8!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    equal(a2.apubdmGETapridpff(), '?8!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //get protected variables values
    equal(a1.apubdmGETaprodpvv(), 11, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(a2.apubdmGETaprodpvv(), 11, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(a1.apubdmGETaprodpvf(), '14!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(a2.apubdmGETaprodpvf(), '14!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(a1.apubdmGETaprodpfv(), '?16', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(a2.apubdmGETaprodpfv(), '?16', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(a1.apubdmGETaprodpff(), '?18!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    equal(a2.apubdmGETaprodpff(), '?18!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //get public variables values
    equal(a1.apubdmGETapubdpvv(), 21, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(a2.apubdmGETapubdpvv(), 21, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(a1.apubdmGETapubdpvf(), '24!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(a2.apubdmGETapubdpvf(), '24!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(a1.apubdmGETapubdpfv(), '?26', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(a2.apubdmGETapubdpfv(), '?26', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(a1.apubdmGETapubdpff(), '?28!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    equal(a2.apubdmGETapubdpff(), '?28!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //Class b
    //get private variables values
    equal(b1.apubdmGETapridpvv(), 1, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(b2.apubdmGETapridpvv(), 1, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(b1.apubdmGETapridpvf(), '4!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(b2.apubdmGETapridpvf(), '4!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(b1.apubdmGETapridpfv(), '?6', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(b2.apubdmGETapridpfv(), '?6', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(b1.apubdmGETapridpff(), '?8!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    equal(b2.apubdmGETapridpff(), '?8!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //get protected variables values
    equal(b1.apubdmGETaprodpvv(), 11, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(b2.apubdmGETaprodpvv(), 11, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(b1.apubdmGETaprodpvf(), '14!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(b2.apubdmGETaprodpvf(), '14!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(b1.apubdmGETaprodpfv(), '?16', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(b2.apubdmGETaprodpfv(), '?16', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(b1.apubdmGETaprodpff(), '?18!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    equal(b2.apubdmGETaprodpff(), '?18!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //get public variables values
    equal(b1.apubdmGETapubdpvv(), 21, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(b2.apubdmGETapubdpvv(), 21, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(b1.apubdmGETapubdpvf(), '24!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(b2.apubdmGETapubdpvf(), '24!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(b1.apubdmGETapubdpfv(), '?26', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(b2.apubdmGETapubdpfv(), '?26', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(b1.apubdmGETapubdpff(), '?28!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    equal(b2.apubdmGETapubdpff(), '?28!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //Class c
    //get private variables values
    equal(c1.apubdmGETapridpvv(), 1, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(c2.apubdmGETapridpvv(), 1, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(c1.apubdmGETapridpvf(), '4!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(c2.apubdmGETapridpvf(), '4!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(c1.apubdmGETapridpfv(), '?6', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(c2.apubdmGETapridpfv(), '?6', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(c1.apubdmGETapridpff(), '?8!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    equal(c2.apubdmGETapridpff(), '?8!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    //get protected variables values
    equal(c1.apubdmGETaprodpvv(), 11, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(c2.apubdmGETaprodpvv(), 11, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(c1.apubdmGETaprodpvf(), '14!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(c2.apubdmGETaprodpvf(), '14!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(c1.apubdmGETaprodpfv(), '?16', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(c2.apubdmGETaprodpfv(), '?16', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(c1.apubdmGETaprodpff(), '?18!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    equal(c2.apubdmGETaprodpff(), '?18!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    //get public variables values
    equal(c1.apubdmGETapubdpvv(), 21, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(c2.apubdmGETapubdpvv(), 21, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(c1.apubdmGETapubdpvf(), '24!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(c2.apubdmGETapubdpvf(), '24!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(c1.apubdmGETapubdpfv(), '?26', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(c2.apubdmGETapubdpfv(), '?26', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(c1.apubdmGETapubdpff(), '?28!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    equal(c2.apubdmGETapubdpff(), '?28!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
});
test('downcall', function () {
    //Class a
    ok(true);
});

































