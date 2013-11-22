(function (ns) {

    // initial setup
    // -------------

    // Save a reference to the global object (`window` in the browser, `exports`
    // on the server).
    var root = this;

    // Save the previous value of the `xs` variable, so that it can be
    // restored later on, if `noConflict` is used.
    var previousXs = root[ns] || root.xs || {};

    // The top-level namespace. All public classes and modules will
    // be attached to this. Exported for both the browser and the server.
    var xs = new Namespace(ns);
    // Export the xs object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object via a string identifier,
    // for Closure Compiler "advanced" mode.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = xs;
        }
        exports[ns] = xs;
    } else {
        root[ns] = xs;
    }

    // Current version of the library. Keep in sync with `package.json`.
    xs.VERSION = '0.1.0';

    // Require Underscore, if we're on the server, and it's not already present and store it to `xs` scope
    var _ = !root._ && (typeof require === 'function') ? require('underscore') : root._;

    // For `xs` purposes, `jQuery`, `Zepto` or `Ender` owns
    // the `$` variable.
    xs.$ = root.jQuery || root.Zepto || root.ender || root.$;

    // Runs xs.js in *noConflict* mode, returning the `xs` variable
    // to its previous owner. Returns a reference to this xs object.
    xs.noConflict = function () {
        root[ns] = previousXs || xs;
        return this;
    };

    /* create define functions pair, as a shortcut for Object.defineProperty(ies) */

    function __defined(object, key) {
        return !!(object.hasOwnProperty(key));
    }

    function __define(object, key, descriptor) {
        return descriptor ? Object.defineProperty(object, key, descriptor) : Object.defineProperties(object, key);
    }

    /* setup global commonly used regulars */

    var nameRe = /^[A-z]+$/;

    /* Class functions */
    function __extend(parent) {
        var oldPrototype = this.prototype;
        var F = new Function();
        F.prototype = parent.prototype;
        this.prototype = new F();
        this.prototype.constructor = this;
        this.super = parent.prototype;
        //inherit static properties
        this.properties('static', 'property', parent.properties('static', 'property'));
        //inherit static methods
        this.properties('static', 'method', parent.properties('static', 'method'));
        //inherit properties
        this.properties('dynamic', 'property', parent.properties('dynamic', 'property'));
        //inherit methods
        this.properties('dynamic', 'method', parent.properties('dynamic', 'method'));
        return this;
    }

    function __mixin(target) {
        var object = {}, args = [].slice.call(arguments, 1);
        for (var k in args) {
            if (!args.hasOwnProperty(k)) continue;
            var source = args[k];
            for (var x in source) {
                if (!source.hasOwnProperty(x)) continue;
                ((typeof object[x] !== "undefined") && (object[x] === source[x])) || (target[x] = source[x]);
            }
        }
        return this;
    }

    //define namespace class
    function Namespace(name) {
        //store nested namespaces list within namespace private _namespaces
        var _namespaces = {};
        //store classes list within namespace private _classes
        var _classes = {};
        //define name const
        _const.call(this, '_name', name);
        //define createNamespace function
        this.hasNamespace = function (name) {
            return !!_namespaces[name];
        };
        this.getNamespace = function (name) {
            return _namespaces[name];
        }
        this.createNamespace = function (name) {
            if (this.hasClass(name)) {
                throw 'Namespace ' + this._name + ' already has a class "' + name + '"';
            }
            this.hasNamespace(name) || (function () {
                _namespaces[name] = new Namespace(name);
                //save namespace as const
                _const.call(this, name, _namespaces[name]);
            }).call(this);
            return this.getNamespace(name);
        };
        this.hasClass = function (name) {
            return !!_classes[name];
        };
        this.getClass = function (name) {
            return _classes[name];
        };
        //define createClass function
        this.createClass = function (name) {
            if (this.hasNamespace(name)) {
                throw 'Namespace ' + this._name + ' already has a namespace "' + name + '"';
            }
            //return class if already has
            if (this.hasClass(name)) return this.getClass(name);
            //define private class storage
            var _storage = {
                static: {
                    property: {},
                    method: {}
                },
                dynamic: {
                    property: {},
                    method: {}
                }
            };
            //class static properties values
            var __privates = {};
            // create class
            var cls = _classes[name] = function Class() {
                !_.isFunction(cls._constructor) || cls._constructor.apply(this, __defaults(_.values(arguments), cls._options));
                var caller = arguments.callee.caller && arguments.callee.caller._class;
                //return if nested construction
                if (caller && _.isFunction(caller.isChild) && caller.isChild(cls)) {
                    return;
                }
                //private storage
                var __privates = {};
                this.__get = function (name) {
                    return arguments.callee.caller.caller === _storage.dynamic.property[name].descriptor.get ? __privates[name] : undefined;
                };
                this.__set = function (name, value) {
                    return arguments.callee.caller.caller === _storage.dynamic.property[name].descriptor.set ? (__privates[name] = value) : undefined;
                };
                //define instance properties
                for (name in _storage.dynamic.property) {
                    if (!_storage.dynamic.property.hasOwnProperty(name)) continue;
                    var _property = _storage.dynamic.property[name];
                    __defined(this, name) || __define(this, name, _property.descriptor);
                    this[name] = _property.value;
                }
            };
            //save namespace as const
            _const.call(this, name, _classes[name]);
            //define constructor function
            cls.constructor = _constructor;
            //add const function
            cls.const = _const;
            //static getter/setter
            cls.__get = function (name) {
                return arguments.callee.caller.caller === _storage.static.property[name].descriptor.get ? __privates[name] : undefined;
            };
            cls.__set = function (name, value) {
                return arguments.callee.caller.caller === _storage.static.property[name].descriptor.set ? (__privates[name] = value) : undefined;
            };
            //property declaration
            //define properties function
            cls.properties = function (usage, type, value) {
                var allow = arguments.callee.caller === __extend;
                if (!allow)
                    return value ? [] : undefined;
                if (!value)
                    return _storage[usage][type];
                _.each(value, function (property, name) {
                    this.property(usage, type, name, property.descriptor, property.value, property.access);
                }, this);
                return this;
            };
            //add property function
            cls.property = function (usage, type, name, descriptor, value, access) {
                if (!nameRe.test(name)) return this;
                var data = _storage[usage][type];
                data[name] || (function () {
                    data[name] = {
                        descriptor: __descriptor(this, name, descriptor, access),
                        value: value,
                        access: access
                    };
                    var realDescriptor = _.clone(data[name].descriptor);
                    //replace methods in realDescriptor
                    realDescriptor.setter && (realDescriptor.set = realDescriptor.setter);
                    realDescriptor.getter && (realDescriptor.set = realDescriptor.getter);
                    realDescriptor.method && (realDescriptor.value = realDescriptor.method);
                    data[name].realDescriptor = realDescriptor;
                }).call(this);
                var object = usage == 'static' ? this : this.prototype;
                __defined(object, name) || __define(object, name, data[name].realDescriptor);
                return this;
            };
            //needed to recognize function as private
            cls.property._class = cls;
            //properties declaration
            cls.publicProperty = _publicProperty;
            cls.protectedProperty = _protectedProperty;
            cls.privateProperty = _privateProperty;
            cls.publicStaticProperty = _publicStaticProperty;
            cls.protectedStaticProperty = _protectedStaticProperty;
            cls.privateStaticProperty = _privateStaticProperty;
            //methods declaration
            cls.publicMethod = _publicMethod;
            cls.protectedMethod = _protectedMethod;
            cls.privateMethod = _privateMethod;
            cls.publicStaticMethod = _publicStaticMethod;
            cls.protectedStaticMethod = _protectedStaticMethod;
            cls.privateStaticMethod = _privateStaticMethod;
            //add extend function
            cls.extend = __extend;
            //add isParent function
            cls.isParent = __isParent;
            //add isChild function
            cls.isChild = __isChild;
            //define name const
            cls.const('_name', name);
            //define parent function
            cls.publicStaticMethod('parent', function () {
                return this.super ? this.super.constructor : this;
            });
            cls.publicMethod('parent', function () {
                return arguments.callee._class.parent();
            });
            cls.publicMethod('self', function () {
                return arguments.callee._class;
            });
            return cls;
        };

        function __defaults(values, defaults) {
            !_.isArray(defaults) || defaults.forEach(function (value, key) {
                values[key] || (values[key] = value);
            });
            return values;
        }

        function __isParent(child) {
            return child.isChild(this);
        }

        function __isChild(parent) {
            if (!_.isObject(this.super)) {
                return false;
            } else if (this.super.constructor === parent) {
                return true;
            } else {
                return this.super.constructor.isChild(parent);
            }
        }

        function _constructor(constructor, options) {
            constructor._class = this;
            this._constructor = constructor;
            this._options = options || [];
            return this;
        }

        function _const(name, value) {
            __defined(this, name) || __define(this, name, {
                value: value,
                writable: false,
                configurable: false,
                enumerable: true
            });
            return this;
        }

        function _publicProperty(name, descriptor, value) {
            return this.property('dynamic', 'property', name, descriptor, value, 'public');
        }

        function _protectedProperty(name, descriptor, value) {
            return this.property('dynamic', 'property', name, descriptor, value, 'protected');
        }

        function _privateProperty(name, descriptor, value) {
            return this.property('dynamic', 'property', name, descriptor, value, 'private');
        }

        function _publicStaticProperty(name, descriptor, value) {
            return this.property('static', 'property', name, descriptor, value, 'public');
        }

        function _protectedStaticProperty(name, descriptor, value) {
            return this.property('static', 'property', name, descriptor, value, 'protected');
        }

        function _privateStaticProperty(name, descriptor, value) {
            return this.property('static', 'property', name, descriptor, value, 'private');
        }

        function _publicMethod(name, method, defaults, final) {
            return this.property('dynamic', 'method', name, {value: method, defaults: defaults, configurable: !final}, null, 'public');
        }

        function _protectedMethod(name, method, defaults, final) {
            return this.property('dynamic', 'method', name, {value: method, defaults: defaults, configurable: !final}, null, 'protected');
        }

        function _privateMethod(name, method, defaults, final) {
            return this.property('dynamic', 'method', name, {value: method, defaults: defaults, configurable: !final}, null, 'private');
        }

        function _publicStaticMethod(name, method, defaults, final) {
            return this.property('static', 'method', name, {value: method, defaults: defaults, configurable: !final}, null, 'public');
        }

        function _protectedStaticMethod(name, method, defaults, final) {
            return this.property('static', 'method', name, {value: method, defaults: defaults, configurable: !final}, null, 'protected');
        }

        function _privateStaticMethod(name, method, defaults, final) {
            return this.property('static', 'method', name, {value: method, defaults: defaults, configurable: !final}, null, 'private');
        }

        function __callerIsProptected(caller, cls) {
            caller = caller._class || caller;
            //caller is protected if if caller is method of this class or child class
            return caller === cls || (_.isFunction(caller.isChild) && caller.isChild(cls));
        }

        function __callerIsPrivate(caller, cls) {
            //caller is private if it is cls or cls' nested class or cls' function
            return caller === cls || (_.isFunction(caller.isChild) && caller.isChild(cls)) || (caller._class === cls);
        }

        function __descriptor(cls, name, descriptor, access) {
            if (descriptor.get) {
                delete descriptor.value;
                delete descriptor.writable;
                var getter = descriptor.get;
                getter._class = cls;
                //mutate getter and setter if given respectively to access level
                if (access === 'protected') {
                    descriptor.getter = function () {
                        if (__callerIsProptected(arguments.callee.caller, cls))
                            return getter.apply(this, arguments);
                        throw 'Attempt to get ' + access + ' property "' + cls._name + '::' + name + '"';
                    };
                } else if (access === 'private') {
                    descriptor.getter = function () {
                        if (__callerIsPrivate(arguments.callee.caller, cls))
                            return getter.apply(this, arguments);
                        throw 'Attempt to get ' + access + ' property "' + cls._name + '::' + name + '"';
                    };
                }
            }
            if (descriptor.set) {
                delete descriptor.value;
                delete descriptor.writable;
                var setter = descriptor.set;
                setter._class = cls;
                //mutate getter and setter if given respectively to access level
                if (access === 'protected') {
                    descriptor.setter = function () {
                        if (__callerIsProptected(arguments.callee.caller, cls))
                            return setter.apply(this, arguments);
                        throw 'Attempt to set ' + access + ' property "' + cls._name + '::' + name + '"';
                    };
                } else if (access === 'private') {
                    descriptor.setter = function () {
                        if (__callerIsPrivate(arguments.callee.caller, cls))
                            return setter.apply(this, arguments);
                        throw 'Attempt to set ' + access + ' property "' + cls._name + '::' + name + '"';
                    };
                }
            }
            if (descriptor.value) {
                delete descriptor.get;
                delete descriptor.set;
                if (_.isFunction(descriptor.value)) {
                    var value = descriptor.value;
                    value._class = cls;
                    var defaults = descriptor.defaults || [];
                    if (access === 'public') {
                        descriptor.method = function () {
                            return value.apply(this, __defaults(_.values(arguments), defaults));
                        };
                    } else if (access === 'protected') {
                        descriptor.method = function () {
                            if (__callerIsProptected(arguments.callee.caller, cls))
                                return value.apply(this, __defaults(_.values(arguments), defaults));
                            throw 'Attempt to call ' + access + ' method "' + cls._name + '::' + name + '"';
                        };
                    } else if (access === 'private') {
                        descriptor.method = function () {
                            if (__callerIsPrivate(arguments.callee.caller, cls))
                                return value.apply(this, __defaults(_.values(arguments), defaults));
                            throw 'Attempt to set ' + access + ' method "' + cls._name + '::' + name + '"';
                        };
                    }
                }
            }
            return descriptor;
        }

    }

}).call(this, 'xs');