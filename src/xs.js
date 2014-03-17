/**
 This file is core of xs.js 0.1

 Copyright (c) 2013-2014, Coos Inc

 Contact:  http://coos.me/contact

 GNU General Public License Usage
 This file may be used under the terms of the GNU General Public License version 3.0 as
 published by the Free Software Foundation and appearing in the file LICENSE included in the
 packaging of this file.

 Please review the following information to ensure the GNU General Public License version 3.0
 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

 If you are unsure which license is appropriate for your use, please contact the sales department
 at http://coos.me/contact.

 */
'use strict';
(function (ns) {

    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;

    // Save bytes in the minified (but not gzipped) version:
    var ArrayPrototype = Array.prototype, ObjectPrototype = Object.prototype, FunctionPrototype = Function.prototype;

    // Create quick reference variables for speed access to core prototypes.
    var
        push = FunctionPrototype.call.bind(ArrayPrototype.push),
        slice = FunctionPrototype.call.bind(ArrayPrototype.slice),
        concat = FunctionPrototype.apply.bind(ArrayPrototype.concat),
        toString = FunctionPrototype.call.bind(ObjectPrototype.toString),
        hasOwnProperty = FunctionPrototype.call.bind(ObjectPrototype.hasOwnProperty);

    // All **ECMAScript 5** native function implementations that we hope to use
    // are declared here.
    var
        nativeForEach = ArrayPrototype.forEach,
        nativeMap = ArrayPrototype.map,
        nativeReduce = ArrayPrototype.reduce,
        nativeReduceRight = ArrayPrototype.reduceRight,
        nativeFilter = ArrayPrototype.filter,
        nativeEvery = ArrayPrototype.every,
        nativeSome = ArrayPrototype.some,
        nativeIndexOf = ArrayPrototype.indexOf,
        nativeLastIndexOf = ArrayPrototype.lastIndexOf,
        nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeBind = FunctionPrototype.bind;
    /**
     * collection class pre-definition
     * @type {{}}
     */
    var collection = new (function () {
        /**
         * returns all collection keys
         */
        this.keys = emptyFn;
        /**
         * return all collection values
         */
        this.values = emptyFn;
        /**
         * whether element in collection
         */
        this.has = emptyFn;
        /**
         * evaluate size of collection
         */
        this.size = emptyFn;
        /**
         * collection items iterator
         * @param object
         * @param iterator
         * @param context
         */
        this.each = function (list, iterator, context) {
            if (type.isArray(list)) {
                list.forEach(iterator, context);
            } else if (type.isObject(list)) {
                object.each(list, iterator, context);
            }
        };
        /**
         * produces a new collection with elements, returned by iterator function
         * if source was array - array is created
         * if source was object - object is created
         */
        this.map = emptyFn;
        /**
         * find one element, that passes given test function
         */
        this.find = emptyFn;
        /**
         * find all elements, that passes given test funciton
         */
        this.findAll = emptyFn;
        /**
         * return collection item, that suites where clause
         */
        this.filter = emptyFn;
        /**
         * return collection items, that suite where clause
         */
        this.filterAll = emptyFn;
    });
    /**
     * object class pre-definition
     * @type {{}}
     * @private
     */
    var object = new (function () {
        /**
         * fetch object keys
         */
        this.keys = function (obj) {
            return Object.keys(obj);
        };
        /**
         * fetch object values
         */
        this.values = function (obj) {
            var values = [];
            this.each(obj, function (value) {
                values.push(value);
            });
            return values;
        };
        this.has = function (obj, name) {
            return obj.hasOwnProperty(name);
        };
        /**
         * iterates over object elements
         */
        this.each = function (obj, iterator, context) {
            this.keys(obj).forEach(function (key) {
                iterator.call(this, obj[key], key, obj);
            }, context);
        };
        /**
         * copies all properties in source objects to destination object
         */
        this.extend = function (obj) {
            slice(arguments, 1).forEach(function (source) {
                type.isObject(source) && this.each(source, function (value, name) {
                    obj[name] = value;
                });
            }, this);
            return obj;
        };
        /**
         * return copy of object, filtered to only have whitelisted keys
         */
        this.pick = function (obj) {
            var copy = {};
            var keys = concat(slice(arguments, 1).pop());
            keys.forEach(function (key) {
                key in obj && (copy[key] = obj[key]);
            });
            return copy;
        };
        /**
         * return copy of object, filtered to have all but blacklisted keys
         */
        this.omit = function (obj) {
            var copy = {};
            var keys = concat(slice(arguments, 1).pop());
            this.each(obj, function (value, name) {
                array.has(keys, name) || (copy[name] = value);
            });
            return copy;
        };
        /**
         * Fill in undefined properties in object with values
         * from the defaults objects, and return the object.
         * As soon as the property is filled, further defaults will have no effect.
         * @param obj
         * @returns {*}
         */
        this.defaults = function (obj) {
            slice(arguments, 1).forEach(function (source) {
                type.isObject(source) && this.each(source, function (value, name) {
                    this.has(obj, name) || (obj[name] = source[name]);
                }, this);
            }, this);
            return obj;
        };
        /**
         * return shallow-cloned object copy
         */
        this.clone = function (obj) {
            return this.extend({}, obj);
        };
    });
    /**
     * array class pre-definition
     * @type {}
     * @private
     */
    var array = new (function () {
        this.has = function (arr, value) {
            return arr.indexOf(value) >= 0;
        };
        this.first = emptyFn;
        this.last = emptyFn;
        /**
         * returns array, filtered not to have falsy values
         */
        this.compact = emptyFn;
        this.shuffle = emptyFn;
        this.union = emptyFn;
        this.intersection = emptyFn;
        /**
         * Take the difference between one array and a number of other arrays.
         * Only the elements present in just the first array will remain.
         * @type {Function}
         */
        this.difference = function (arr) {
            var rest = concat(slice(arguments, 1).pop());
            return arr.filter(function (value) {
                return !this.has(rest, value);
            }, this);
        };
        this.uniques = emptyFn;
        this.defaults = function (arr, source) {
            source.forEach(function (value, index) {
                index >= arr.length && (arr[index] = value);
            }, this);
            return arr;
        };
    });
    /**
     * function class pre-definition
     * @type {}
     * @private
     */
    var fn = new (function () {
        /**
         * prefills function's arguments
         */
        this.prefill = emptyFn;
        /**
         * creates function, being called once
         */
        this.once = emptyFn;
        /**
         * wraps function
         */
        this.wrap = emptyFn;
    });
    /**
     * string class pre-definition
     * @type {}
     * @private
     */
    var string = new (function () {
    });
    /**
     * number class pre-definition
     * @type {}
     * @private
     */
    var number = new (function () {
    });

    /**
     * empty function instance
     * @type {Function}
     */
    var emptyFn = new Function;
    /**
     * base regular exceptions
     * @type {RegExp}
     */
    var namespaceRe = /^ns/i;
    var fnArgsRe = /^function\s(?:\w+)?\(([A-Za-z0-9\s,]*)\)/i;
    /**
     * Classes container
     * @type {{}}
     * @private
     */
    var classes = new (function () {
        /**
         * class definitions
         */
        var items = {};
        /**
         * checks whether items has class
         * @param name
         * @returns {boolean}
         */
        this.has = function (name) {
            return items.hasOwnProperty(name);
        };
        /**
         * gets class by name if exists, otherwise returns false
         * @param name
         * @returns {*}
         */
        this.get = function (name) {
            return this.has(name) ? items[name] : false;
        };
        /**
         * Sets given class as item at path, specified by name
         * @param root
         * @param name
         * @param cls
         */
        this.set = function (root, name, cls) {
            //explode name to parts
            var names = name.split('.');
            //return if empty name
            if (!names.length) {
                return;
            }
            if (cls.$name == name) {
                items[name] = cls;
            }
            //get parent namespace part
            var namespace = names.shift();
            //check whether namespace is leave or not
            if (names.length) {
                //create if not created yet
                typeof root[namespace] == 'object' || (root[namespace] = {});
                //downcall
                this.set(root[namespace], names.join('.'), cls);
            } else {
                //save cls as root's namespace item
                root[namespace] = cls;
            }
        };
        /**
         * gets class name according to namespace
         * @param name
         * @returns {string}
         */
        this.getName = function (name) {
            if (typeof this.$namespace === 'string') {
                return name.split(namespaceRe).join(this.$namespace);
            } else {
                return name;
            }
        };
        this.parent = function (args) {
            return args[args.length - 1];
        };
        this.isParent = function (child) {
            return type.isFunction(child.isChild) ? child.isChild(this) : false;
        };
        this.isChild = function (parent) {
            if (!type.isFunction(this.$parent)) {
                return false;
            } else if (this.$parent === parent) {
                return true;
            } else {
                return this.$parent.isChild(parent);
            }
        };
    });
    /**
     * core functions: extend, define, const, etc
     */
    var core = {
        /**
         * Extend core function
         * @param parent
         * @returns {}
         */
        extend: function (child, parent) {
            var F = new Function();
            F.prototype = parent.prototype;
            child.prototype = new F();
            child.prototype.constructor = child;
            //save reference to parent
            this.const(child, '$parent', parent);
        },
        defined: function (obj, key) {
            return !!(obj.hasOwnProperty(key));
        },
        define: function (obj, key, descriptor) {
            return descriptor ? Object.defineProperty(obj, key, descriptor) : Object.defineProperties(obj, key);
        },
        const: function (obj, name, value) {
            this.defined(obj, name) || this.define(obj, name, {
                value: value,
                writable: false,
                enumerable: true,
                configurable: false
            })
        },
        property: function (obj, name, descriptor) {
            this.defined(obj, name) || this.define(obj, name, object.defaults({
                enumerable: true,
                configurable: false
            }, descriptor))
        },
        method: function (obj, name, descriptor) {
            if (this.defined(obj, name)) {
                return;
            }
            var description = object.defaults({
                writable: false,
                enumerable: true,
                configurable: false
            }, descriptor);
            description.default = type.isArray(description.default) ? description.default : []
            if (description.wrap) {
                var fn = description.value;
                //get count of arguments, defined by function;
                var argsCount = fnArgsRe.exec(fn.toString()).pop().split(',').length;
                description.value = function () {
                    var args = array.defaults(slice(arguments), description.default);
                    //pass super, needed for parent() calls
                    if (args.length < argsCount) {
                        args[argsCount] = description.$parent;
                    } else {
                        args.push(description.$parent);
                    }
                    return fn.apply(this, args);
                };
            }
            this.define(obj, name, description);
        }
    };
    var desc = {
        /**
         * determines whether given value is property descriptor
         * returns true when it is object and contains only some of 6 descriptor-relative properties
         */
        is: function (descriptor) {
            //false if descriptor is not object
            if (!type.isObject(descriptor)) {
                return false;
            }
            //check descriptor fields are filled correctly
            if (descriptor.value) {
                return true;
            } else if (descriptor.get || descriptor.set) {
                if (descriptor.get && !type.isFunction(descriptor.get)) {
                    return false;
                }
                if (descriptor.set && !type.isFunction(descriptor.set)) {
                    return false;
                }
                return true;
            }
            return false;
        },
        property: function (descriptor, name) {
            //process descriptor
            var desc = this.is(descriptor) ? descriptor : {value: descriptor};
            //if accessors given - remove value
            if (desc.get || desc.set) {
                //default getter setter to simple interpretation
                desc.get || eval('desc.get = function () {return this.__get(\'' + name + '\');}');
                desc.set || eval('desc.set = function (value) {return this.__set(\'' + name + '\',value);}');
                delete desc.value;
                delete desc.writable;
            } else {
                //get value
                desc.value = type.isUndefined(desc.value) ? undefined : desc.value;
                desc.writable = true;
            }
            return desc;
        },
        method: function (descriptor) {
            //process descriptor
            var desc = {};
            //process given descriptor. if something wrong - returns false
            //simple function allowed
            if (type.isFunction(descriptor)) {
                desc.value = descriptor;
                //allowed as object with fn property, containing method function
            } else if (type.isObject(descriptor)) {
                //function may be specified in fn or value propeties
                if (type.isFunction(descriptor.fn)) {
                    desc.value = descriptor.fn;
                } else if (type.isFunction(descriptor.value)) {
                    desc.value = descriptor.value;
                } else {
                    return false;
                }
                //else  - return false
            } else {
                return false;
            }
            //assign defaults
            desc.default = type.isArray(descriptor.default) ? descriptor.default : [];
            return desc;
        },
        apply: function (cls, descriptor) {
            //correct descriptor
            var correctDescriptor = {
                const: {},
                static: {
                    properties: {},
                    methods: {}
                },
                properties: {},
                methods: {}
            };
            // constants
            collection.each(descriptor.const, function (value, name) {
                //save const to class descriptor
                correctDescriptor.const[name] = value;
                core.const(cls, name, value);
            });
            //public static properties
            collection.each(descriptor.static.properties, function (value, name) {
                //parse value as property descriptor
                var propertyDescriptor = this.property(value, name);
                //store desc to class descriptor
                correctDescriptor.static.properties[name] = propertyDescriptor;
                //define class property
                core.property(cls, name, propertyDescriptor);
                //assign default if specified
                object.has(propertyDescriptor, 'default') && (cls[name] = propertyDescriptor.default);
            }, this);
            //public static methods
            collection.each(descriptor.static.methods, function (value, name) {
                //parse value as method descriptor
                var propertyDescriptor = this.method(value);
                //if desc is wrong - return
                if (!propertyDescriptor) {
                    return;
                }
                //store desc to class descriptor
                correctDescriptor.static.methods[name] = propertyDescriptor;
                //define class property
                core.method(cls, name, object.extend(propertyDescriptor, {
                    $parent: cls.$parent,
                    wrap: true
                }));
            }, this);
            //public properties
            collection.each(descriptor.properties, function (value, name) {
                //parse value as property descriptor
                var propertyDescriptor = this.property(value, name);
                //store desc to class descriptor
                correctDescriptor.properties[name] = propertyDescriptor;
                //instance properties are defined in constructor
            }, this);
            //public methods
            collection.each(descriptor.methods, function (value, name) {
                //parse value as method descriptor
                var propertyDescriptor = this.method(value);
                //if desc is wrong - return
                if (!propertyDescriptor) {
                    return;
                }
                //store desc to class descriptor
                correctDescriptor.methods[name] = propertyDescriptor;
                //define class property
                core.method(cls.prototype, name, object.extend(propertyDescriptor, {
                    $parent: cls.$parent.prototype,
                    wrap: true
                }));
            }, this);
            return correctDescriptor;
        }
    };
    var preprocessors = {
        prepare: function (name, descriptor, createdFn) {
            if (!type.isString(name)) {
                throw 'class name must be string';
            }
            //default descriptor to empty object
            type.isObject(descriptor) || (descriptor = {});
            //default namespace to null if not string
            var namespace = type.isString(descriptor.namespace) ? descriptor.namespace : null;
            //evaluate class name according to given namespace
            name = classes.getName.call({$namespace: namespace}, name);

            //default descriptor to object
            type.isObject(descriptor) || (descriptor = {});

            //default constructor to emptyFn if not function
            type.isFunction(descriptor.constructor) || (descriptor.constructor = emptyFn);

            //default constructor default to empty array if not array
            type.isArray(descriptor.default) || (descriptor.default = []);

            //return prepared data
            return {
                name: name,
                class: classes.has(name) ? classes.get(name) : false,
                namespace: namespace,
                descriptor: descriptor,
                createdFn: type.isFunction(createdFn) ? createdFn : emptyFn
            }
        },
        extend: function (cls, descriptor) {
            var parent;
            //determine parent class
            if (type.isString(descriptor.extend)) {
                parent = classes.get(cls.getClassName(descriptor.extend));
            } else {
                parent = Base;
            }
            //cls from parent
            core.extend(cls, parent);
            return parent;
        },
        singleton: function (cls, descriptor) {
            return object.has(descriptor, 'singleton') && descriptor.singleton ? new cls : cls;
        },
        require: function (cls, descriptor) {

        },
        mixin: function (cls, descriptor) {

        },
        configure: function (cls, parent, descriptor) {
            //combinate class descriptor
            //inherited descriptor
            var inherits = parent.getDescriptor();

            //own descriptor
            var owned = {};
            //const
            owned.const = type.isObject(descriptor.const) ? descriptor.const : {};
            //static properties and methods
            owned.static = {};
            type.isObject(descriptor.static) || (descriptor.static = {});
            owned.static.properties = type.isObject(descriptor.static.properties) ? descriptor.static.properties : {};
            owned.static.methods = type.isObject(descriptor.static.methods) ? descriptor.static.methods : {};
            //public properties and methods
            owned.properties = type.isObject(descriptor.properties) ? descriptor.properties : {};
            owned.methods = type.isObject(descriptor.methods) ? descriptor.methods : {};

            //real class descriptor applies owned properties defaulted to inherits
            var real = {};
            //const: defaulted from inherits
            real.const = object.defaults(owned.const, inherits.const);
            //static properties and methods
            real.static = {};
            real.static.properties = object.defaults(owned.static.properties, inherits.static.properties);
            real.static.methods = object.defaults(owned.static.methods, inherits.static.methods);
            //public properties and methods
            real.properties = object.defaults(owned.properties, inherits.properties);
            real.methods = object.defaults(owned.methods, inherits.methods);

            //apply real descriptor and return it in processed variant
            return desc.apply(cls, real);
        }
    };
    var postprocessors = {

    };
    /**
     * type-related functions
     * @type {}
     */
    var type = {
        get: function (value) {
            var type = typeof value;
            if (value == null) {
                type = 'null';
            } else if (Array.isArray(value)) {
                type = 'array';
            } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
                type = 'number';
            }
            return type;
        },
        /**
         *
         * @param value
         * @returns {boolean}
         */
        isObject: function (value) {
            return typeof value == 'object';
        },
        isArray: function (value) {
            return Array.isArray(value);
        },
        isFunction: function (value) {
            return typeof value == 'function';
        },
        isString: function (value) {
            return typeof value == 'string';
        },
        isNumber: function (value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },
        isNull: function (value) {
            return value == null;
        },
        isUndefined: function (value) {
            return typeof value == 'undefined';
        },
        isBoolean: function (value) {
            return typeof value == 'boolean';
        },
        isEmpty: function (value) {
            var type = this.typeOf(value);
            if (type == 'object') {
                return !object.keys(value).length;
            } else if (type == 'array') {
                return !value.length;
            } else if (type == 'string') {
                return !value.trim();
            } else if (type == 'number') {
                return value == 0;
            } else {
                return type != 'function' && type != 'boolean';
            }
        }
    };
    /**
     * implement Base class (all classes extend it)
     * @constructor
     */
    var Base = function () {
    };
    //set class basics
    //basic consts
    core.const(Base, '$name', 'Base');
    core.const(Base, '$namespace', null);
    //set basic methods
    core.method(Base, 'getClassName', {value: classes.getName});
    core.method(Base, 'getDescriptor', {value: function () {
        return {
            const: {
                $isClass: true
            },
            static: {
                properties: {},
                methods: {
                }
            },
            properties: {},
            methods: {
            }
        };
    }});
    //inheritance
    core.method(Base, 'isParent', {value: classes.isParent});
    core.method(Base, 'isChild', {value: classes.isChild});

    /**
     * framework-related base implementations
     * @type {}
     */
    var framework = {
        define: function (name, description, createdFn) {
            //prepare class data
            var data = preprocessors.prepare(name, description, createdFn);
            description = data.descriptor;
            createdFn = data.createdFn;
            //return class if exists
            if (data.class) {
                //call createdFn
                createdFn.call(data.class);
                return data.class;
            }
            //proto object, containing constructor
            var proto = {};
            //class descriptor
            var descriptor;
            //static privates
            var privates = {};

            //create class object
            var cls = function Class() {
                //instance privates
                var privates = {};
                //parent method
                core.method(this, 'parent', {value: classes.parent});
                //private setter/getter
                core.method(this, '__get', {value: function (name) {
                    return privates[name]
                }});
                core.method(this, '__set', {value: function (name, value) {
                    privates[name] = value;
                }});
                //class reference
                core.const(this, '$class', cls);
                //apply properties to object
                collection.each(descriptor.properties, function (description, name) {
                    core.property(this, name, description);
                    object.has(description, 'default') && (this[name] = description.default);
                }, this);
                //apply constructor
                proto.constructor.apply(this, arguments);
            };

            //set class basics
            //basic consts
            core.const(cls, '$name', data.name);
            core.const(cls, '$namespace', data.namespace);
            //basic methods
            core.method(cls, 'getClassName', {value: classes.getName});
            core.method(cls, 'getDescriptor', {value: function () {
                return descriptor;
            }});
            //inheritance
            core.method(cls, 'parent', {value: classes.parent});
            core.method(cls, 'isParent', {value: classes.isParent});
            core.method(cls, 'isChild', {value: classes.isChild});
            //static getter/setter
            core.method(cls, '__get', {value: function (name) {
                return privates[name]
            }});
            core.method(cls, '__set', {value: function (name, value) {
                privates[name] = value;
            }});

            //extend
            var parent = preprocessors.extend(cls, description);

            //proto constructor
            core.method(proto, 'constructor', {
                value: description.constructor,
                default: description.default,
                $parent: cls.$parent.prototype,
                wrap: true
            });


            //requires
            preprocessors.require(cls, data);
            //mixins
            preprocessors.mixin(cls, data);
            //properties configuration
            descriptor = preprocessors.configure(cls, parent, description);
            //singleton implementation
            cls = preprocessors.singleton(cls, description);

            //save class in namespace
            classes.set(root, data.name, cls);

            //call createdFn after class created
            createdFn.call(cls);

            //return created class
            return cls;
        },
        /**
         * create class instance
         * @param name
         * @param properties
         */
        create: function (name, properties) {
            if (!classes.has(name)) {
                throw 'class "' + name + '" doesn\'t exist';
            }
            var cls = classes.get(name);
            var instance = new cls();
            type.isObject(properties) && object.each(properties, function (value, name) {
                instance[name] = value;
            });
            return instance;
        }
    };

    //define framework class
    framework.define(ns, {
        singleton: true,
        methods: {
            define: framework.define,
            create: framework.create
        }
    });

    //shortcut framework
    var xs = root[ns];

    // Export the xs object for **Node.js**, if on server side.
    if (typeof exports !== 'undefined') {
        delete root[ns];
        exports[ns] = xs;
    }
}).call(window, 'xs');
//
//var extend = function (child, parent) {
//    //update prototype chain of class
//    var oldPrototype = child.prototype;
//    var F = new Function();
//    F.prototype = parent.prototype;
//    child.prototype = new F();
//    child.prototype.constructor = child;
//    //save reference to parent.prototype
//    child.super = parent.prototype;
//    //TODO inherit properties
//    return child;
//};
//
//var slice = Function.prototype.call.bind(Array.prototype.slice);
//
//function A() {
//    this.super = this.constructor.super;
//}
//
//var printSimple = function () {
//    console.log('context', this, 'constructor', this.constructor);
//};
//
//var printSuper = function () {
//    console.log('context', this, 'constructor', this.constructor);
//    var me = this, args = arguments;
//    setTimeout(function () {
//        var parent = me.parent(args);
//        parent.print.call(me);
//    }, 100);
//};
//
//A.prototype.print = function () {
//    var args = slice(arguments);
//    args.push(A.super);
//    return printSimple.apply(this, args);
//}
//
//A.prototype.parent = function (args) {
//    return args[args.length - 1];
//}
//
//function B() {
//    this.super = this.constructor.super;
//}
//extend(B, A);
//B.prototype.print = function () {
//    var args = slice(arguments);
//    args.push(B.super);
//    return printSuper.apply(this, args);
//}
//
//function C() {
//    this.super = this.constructor.super;
//}
//extend(C, B);
//C.prototype.print = function () {
//    var args = slice(arguments);
//    args.push(C.super);
//    return printSuper.apply(this, args);
//}
//C.prototype.print.owner = C;
//
//
//var a = new A;
//var b = new B;
//var c = new C;
//
//
//
//
