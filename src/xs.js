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
    var ArrayPrototype = Array.prototype, ObjPrototype = Object.prototype, FuncPrototype = Function.prototype;

    // Create quick reference variables for speed access to core prototypes.
    var
        push = ArrayPrototype.push,
        slice = ArrayPrototype.slice,
        concat = ArrayPrototype.concat,
        toString = ObjPrototype.toString,
        hasOwnProperty = ObjPrototype.hasOwnProperty;

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
        nativeBind = FuncPrototype.bind;
    /**
     * implement Base class (all classes extend it)
     * @constructor
     */
    var Base = function () {
    };
    /**
     * base regular exceptions
     * @type {RegExp}
     */
    var namespaceRe = /^ns/gi;
    /**
     * Classes container
     * @type {{}}
     * @private
     */
    var classes = {
        /**
         * class definitions
         */
        items: {},
        /**
         * checks whether items has class
         * @param name
         * @returns {boolean}
         */
        has: function (name) {
            return this.items.hasOwnProperty(name);
        },
        /**
         * gets class by name if exists, otherwise returns false
         * @param name
         * @returns {*}
         */
        get: function (name) {
            return this.has(name) ? this.items[name] : false;
        },
        /**
         * Sets given class as item at path, specified by name
         * @param root
         * @param name
         * @param cls
         */
        set: function (root, name, cls) {
            //explode name to parts
            var names = name.split('.');
            //return if empty name
            if (!names.length) {
                return;
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
        },
        /**
         * gets class name according to namespace
         * @param name
         * @returns {string}
         */
        getName: function (name) {
            if (typeof this.$namespace === 'string') {
                return name.split(namespaceRe).join(this.$namespace);
            } else {
                return name;
            }
        }
    };
    /**
     * collection class pre-definition
     * @type {{}}
     */
    var collection = {
        /**
         * collection items iterator
         * @param object
         * @param iterator
         * @param context
         */
        each: function (list, iterator, context) {
            if (list == null) return;
            if (list.forEach) {
                list.forEach(iterator, context);
            } else {
                Object.keys(list).forEach(function (key, index, context) {
                    iterator.call(context, list[key], key, list);
                }, context);
            }
        }
    };
    /**
     * object class pre-definition
     * @type {{}}
     * @private
     */
    var obj = {
        /**
         * Fill in undefined properties in object with values
         * from the defaults objects, and return the object.
         * As soon as the property is filled, further defaults will have no effect.
         * @param obj
         * @returns {*}
         */
        defaults: function (obj) {
            collection.each(slice.call(arguments, 1), function (source) {
                if (source) {
                    for (var prop in source) {
                        if (obj[prop] === void 0) obj[prop] = source[prop];
                    }
                }
            });
            return obj;
        }
    };
    /**
     * array class pre-definition
     * @type {}
     * @private
     */
    var arr = {
    };
    /**
     * function class pre-definition
     * @type {{is: is}}
     * @private
     */
    var fn = {

    };
    /**
     * string class pre-definition
     * @type {}
     * @private
     */
    var str = {
    };
    /**
     * number class pre-definition
     * @type {}
     * @private
     */
    var num = {
    };
    /**
     * Extend core function
     * @param parent
     * @returns {}
     */
    var extend = function (parent) {
        //update prototype chain of class
        var oldPrototype = this.prototype;
        var F = new Function();
        F.prototype = parent.prototype;
        this.prototype = new F();
        this.prototype.constructor = this;
        //save reference to parent.prototype
        this.super = parent.prototype;
        //TODO inherit properties
//            //inherit properties
//            var parentProperties = parent.properties();
//            for (var property in oldPrototype) {
//                //pass if not own property or property in parent's properties list
//                if (!oldPrototype.hasOwnProperty(property) || property in parentProperties)
//                    continue;
//                var getter = oldPrototype.__lookupGetter__(property);
//                var setter = oldPrototype.__lookupSetter__(property);
//                if (getter) {
//                    this.prototype.__defineGetter__(property, getter);
//                } else if (setter) {
//                    this.prototype.__defineSetter__(property, setter);
//                } else {
//                    this.prototype[property] = oldPrototype[property];
//                }
//            }
//            this.properties(parentProperties);
//            //inherit static properties
//            this.staticProperties(parent.staticProperties());
        return this;
    };
    /**
     * core classes pre-definitions
     */
    /**
     * framework class pre-definition
     */
    var framework = {
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
        }
    };
    /**
     * Implement core functions
     */
    /**
     * define function. is used for class definition
     * @param className name of created class
     * @param data class definition object
     * @param namespace namespace - is used for isolated blocks with common base path.
     * is stored in class and used for evaluating real class names
     * @param createdFn callback, called after class has been created
     * @private
     */
    framework.define = function (className, data, namespace, createdFn) {
        /**
         * supported sections:
         *  - extend: specifies parent class
         *  - constructor: constructor function
         *  - requires: specifies required classes
         *  - mixins: specifies class mixins
         *  - public: public elements
         *  - protected: protected elements
         *  - private: private elements
         */

        var constructor;
        //create raw class instance
        var cls = function () {
            cls._constructor.apply(this, __defaults(_.values(arguments), cls._options));
            var caller = arguments.callee.caller;
            //return if nested construction
            if (caller._class && _.isFunction(caller._class.isChild) && caller._class.isChild(cls)) {
                return;
            }
            //private storage
            var __privates = {};
            this.__get = function (name) {
                return arguments.callee.caller.caller === _properties[name].descriptor.get ? __privates[name] : undefined;
            };
            this.__set = function (name, value) {
                return arguments.callee.caller.caller === _properties[name].descriptor.set ? (__privates[name] = value) : undefined;
            };
            //define instance properties
            for (var name in _properties) {
                if (!_properties.hasOwnProperty(name)) continue;
                var _property = _properties[name];
                __defined(this, name) || __define(this, name, _property.descriptor);
                this[name] = _property.value;
            }
        };
        //set namespace
        this.isString(namespace) || (namespace = null);
        cls.$namespace = namespace;

        //save classes.getName as cls.getClassName
        cls.getClassName = classes.getName;
        //evaluate className according to given namespace
        className = cls.getClassName(className);
        //if class already exists - return it, else - set it
        if (classes.has(className)) {
            return classes.get(className);
        } else {
            classes.set(root, className, cls);
        }

        //default data ot object
        this.isObject(data) || (data = {});

        //extend class from parent
        //determine parent class
        var parent;
        if (this.isString(data.extend)) {
            parent = classes.get(cls.getClassName(data.extend));
        } else {
            parent = Base;
        }
        //extend class from parent
        extend.call(cls, parent);

        /**
         * params definition here
         */

            //call createdFn after class created
        this.isFunction(createdFn) && createdFn.call(cls);

        //return created class
        return cls;
    };
    /**
     *
     * @param className
     * @param data
     * @param namespace
     * @param createdFn
     */
    framework.create = function (className, data, namespace, createdFn) {
        //
    };

    //define framework class
    framework.define(ns, {
        const: {
            define: framework.define,
            extend: framework.extend,
            cut: framework.cut,
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

var extend = function (child, parent) {
    //update prototype chain of class
    var oldPrototype = child.prototype;
    var F = new Function();
    F.prototype = parent.prototype;
    child.prototype = new F();
    child.prototype.constructor = child;
    //save reference to parent.prototype
    child.super = parent.prototype;
    //TODO inherit properties
    return child;
};

var slice = Function.prototype.call.bind(Array.prototype.slice);

function A() {
    this.super = this.constructor.super;
}

var printSimple = function () {
    console.log('context', this, 'constructor', this.constructor);
};

var printSuper = function () {
    console.log('context', this, 'constructor', this.constructor);
    var me = this, args = arguments;
    setTimeout(function () {
        var parent = me.parent(args);
        parent.print.call(me);
    }, 100);
};

A.prototype.print = function () {
    var args = slice(arguments);
    args.push(A.super);
    return printSimple.apply(this, args);
}

A.prototype.parent = function (args) {
    return args[args.length - 1];
}

function B() {
    this.super = this.constructor.super;
}
extend(B, A);
B.prototype.print = function () {
    var args = slice(arguments);
    args.push(B.super);
    return printSuper.apply(this, args);
}

function C() {
    this.super = this.constructor.super;
}
extend(C, B);
C.prototype.print = function () {
    var args = slice(arguments);
    args.push(C.super);
    return printSuper.apply(this, args);
}
C.prototype.print.owner = C;


var a = new A;
var b = new B;
var c = new C;








