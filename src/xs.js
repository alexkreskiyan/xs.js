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
        //some magic at inheritance of properties
        var parentProperties = parent.properties();
        for (var property in oldPrototype) {
            //pass if not own property or property in parent's properties list
            if (!oldPrototype.hasOwnProperty(property) || property in parentProperties)
                continue;
            var getter = oldPrototype.__lookupGetter__(property);
            var setter = oldPrototype.__lookupSetter__(property);
            if (getter) {
                this.prototype.__defineGetter__(property, getter);
            } else if (setter) {
                this.prototype.__defineSetter__(property, setter);
            } else {
                this.prototype[property] = oldPrototype[property];
            }
        }
        this.properties(parentProperties);
        this.prototype.constructor = this;
        this.super = parent.prototype;
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
        this.createNamespace = function (name) {
            return _hasNamespace(name) ? _getNamespace(name) : (_namespaces[name] = this[name] = new Namespace(name));
        };
        //define createClass function
        this.createClass = function (name) {
            //return class if already has
            if (_hasClass(name)) return _getClass(name);
            //define private class storages
            var _properties = {};
            // create class
            var cls = _classes[name] = this[name] = function Class() {
                cls._constructor.apply(this, __defaults(_.values(arguments), cls._options));
                var caller = arguments.callee.caller;
                //return if nested construction
                if (caller._class && _.isFunction(caller._class.isChild) && caller._class.isChild(cls)) {
                    return;
                }
                //private storage
                var __privates = {};
                this.__get = function (name) {
                    var caller = arguments.callee.caller;
                    return (caller._class === cls || caller._class.isParent(cls)) ? __privates[name] : undefined;
                };
                this.__set = function (name, value) {
                    var caller = arguments.callee.caller;
                    return (caller._class === cls || caller._class.isParent(cls)) ? (__privates[name] = value) : undefined;
                };
                //define instance properties
                for (name in _properties) {
                    if (!_properties.hasOwnProperty(name)) continue;
                    var _property = _properties[name];
                    __property.call(this, name, _property.descriptor);
                    this[name] = _property.value;
                }
                return;
            };
            //define name const
            _const.call(cls, '_name', name);
            //extend prototype with parent function
            __define(cls.prototype, 'parent', {
                value: __parent,
                writable: false,
                configurable: false,
                enumerable: false
            });
            //add const function
            cls.const = _const;
            //define constructor function
            cls.constructor = _constructor;
            //property declaration
            //define properties function
            cls.properties = function properties() {
                var caller = arguments.callee.caller;
                var allow = caller === __extend || caller === this || true;
                if (!arguments.length)
                    return allow ? _properties : [];
                !allow || function (candidates) {
                    _.each(candidates, function (value, name) {
                        _properties[name] || (_properties[name] = value);
                    });
                }(arguments[0]);
                return this;
            };
            //add property function
            cls.property = function property(name, descriptor, value, access) {
                !nameRe.test(name) || (_properties[name] = {
                    owner: cls,
                    descriptor: __getDescriptor(cls, name, descriptor, access),
                    value: value,
                    access: access
                });
                return this;
            };
            //add public property function
            cls.publicProperty = _publicProperty;
            //add protected property function
            cls.protectedProperty = _protectedProperty;
            //add private property function
            cls.privateProperty = _privateProperty;
            //method declaration
            //add method function
            cls.method = _method;
            //add public method function
            cls.publicMethod = _publicMethod;
            //add protected method function
            cls.protectedMethod = _protectedMethod;
            //add private method function
            cls.privateMethod = _privateMethod;
            //add extend function
            cls.extend = __extend;
            //add isParent function
            cls.isParent = __isParent;
            //add isChild function
            cls.isChild = __isChild;
            return cls;
        };
        function _hasNamespace(name) {
            return !!_namespaces[name];
        }

        function _getNamespace(name) {
            return _namespaces[name];
        }

        function _hasClass(name) {
            return !!_classes[name];
        }

        function _getClass(name) {
            return _classes[name];
        }

        function __defaults(values, defaults) {
            defaults.forEach(function (value, key) {
                values[key] || (values[key] = value);
            });
            return values;
        }

        function __parent() {
            return arguments.callee.caller._class ? arguments.callee.caller._class.super : this.constructor.super;
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
            return this.property(name, descriptor, value, 'public');
        }

        function _protectedProperty(name, descriptor, value) {
            return this.property(name, descriptor, value, 'protected');
        }

        function _privateProperty(name, descriptor, value) {
            return this.property(name, descriptor, value, 'private');
        }

        function _staticProperty(name, descriptor, value, access) {
            return _property.call(this, this, name, descriptor, value, access);
        }

        function _publicStaticProperty(name, descriptor, value) {
            return this.staticProperty(name, descriptor, value, 'public');
        }

        function _protectedStaticProperty(name, descriptor, value) {
            return this.staticProperty(name, descriptor, value, 'protected');
        }

        function _privateStaticProperty(name, descriptor, value) {
            return this.staticProperty(name, descriptor, value, 'private');
        }

        function _constructor(constructor, options) {
            constructor._class = this;
            this._constructor = constructor;
            this._options = options || [];
            return this;
        }

        function _method(name, fn, options, access) {
            return __method.call(this, this.prototype, name, fn, options, access);
        }

        function _publicMethod(name, fn, options) {
            return this.method(name, fn, options, 'public');
        }

        function _protectedMethod(name, fn, options) {
            return this.method(name, fn, options, 'protected');
        }

        function _privateMethod(name, fn, options) {
            return this.method(name, fn, options, 'private');
        }

        function __getDescriptor(cls, name, descriptor, access) {
            if (!descriptor.get && !descriptor.set) {
                return descriptor;
            }
            delete descriptor.value;
            delete descriptor.writable;
            var getter = descriptor.get;
            var setter = descriptor.set;
            !getter || (getter._class = cls);
            !setter || (setter._class = cls);
            //mutate getter and setter if given respectively to access level
            if (access === 'public') {
                !getter || (descriptor.get = function () {
                    return getter.apply(this, arguments);
                });
                !setter || (descriptor.set = function () {
                    return setter.apply(this, arguments);
                });
            } else if (access === 'protected') {
                !getter || (descriptor.get = function () {
                    var caller = arguments.callee.caller._class || arguments.callee.caller;
                    //call method if caller is method of child class or this class
                    if (caller === cls || (caller.isChild && caller.isChild(cls))) {
                        return getter.apply(this, arguments);
                    }
                    throw 'Attempt to get ' + access + ' property "' + cls._name + '::' + name + '"';
                });
                !setter || (descriptor.set = function () {
                    var caller = arguments.callee.caller._class || arguments.callee.caller;
                    //call method if caller is method of child class or this class
                    if (caller === cls || (caller.isChild && caller.isChild(cls))) {
                        return setter.apply(this, arguments);
                    }
                    throw 'Attempt to set ' + access + ' property "' + cls._name + '::' + name + '"';
                });
            } else if (access === 'private') {
                !getter || (descriptor.get = function () {
                    var caller = arguments.callee.caller;
                    //call method if caller is class constructor, or child's class constructor or this class function
                    if (caller === cls || (caller.isChild && caller.isChild(cls)) || (caller._class === cls)) {
                        return getter.apply(this, arguments);
                    }
                    throw 'Attempt to get ' + access + ' property "' + cls._name + '::' + name + '"';
                });
                !setter || (descriptor.set = function () {
                    var caller = arguments.callee.caller;
                    //call method if caller is class constructor, or child's class constructor or this class function
                    if (caller === cls || (caller.isChild && caller.isChild(cls)) || (caller._class === cls)) {
                        return setter.apply(this, arguments);
                    }
                    throw 'Attempt to set ' + access + ' property "' + cls._name + '::' + name + '"';
                });
            }
            return descriptor;
        }

        function __property(name, descriptor) {
            __defined(this, name) || __define(this, name, descriptor);
            return this;
        }

        function __method(object, name, fn, options, access) {
            var cls = this;
            access || (access = 'public');
            fn._class = cls;
            options || (options = []);
            if (access === 'public') {
                object[name] = function () {
                    return fn.apply(this, __defaults(arguments, options));
                };
            } else if (access === 'protected') {
                object[name] = function () {
                    var caller = arguments.callee.caller._class || arguments.callee.caller;
                    //call method if caller is method of child class or this class
                    if (caller === cls || (caller.isChild && caller.isChild(cls))) {
                        return fn.apply(this, __defaults(arguments, options));
                    }
                    throw 'Call to ' + access + ' method "' + cls._name + '::' + name + '"';
                };
            } else if (access === 'private') {
                object[name] = function () {
                    var caller = arguments.callee.caller;
                    //call method if caller is class constructor, or child's class constructor or this class function
                    if (caller === cls || (caller.isChild && caller.isChild(cls)) || (caller._class === cls)) {
                        return fn.apply(this, __defaults(arguments, options));
                    }
                    throw 'Call to ' + access + ' method "' + cls._name + '::' + name + '"';
                };
            }
            return this;
        }
    }

}).call(this, 'xs');