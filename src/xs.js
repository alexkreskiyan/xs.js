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
    var _ = root._;
    if (!_ && (typeof require === 'function'))
        _ = require('underscore');

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

    function defined(object, key) {
        return !!(object.hasOwnProperty(key));
    }

    function define(object, key, descriptor) {
        return descriptor ? Object.defineProperty(object, key, descriptor) : Object.defineProperties(object, key);
    }

    /* setup global commonly used regulars */

    var nameRe = /^[A-z]+$/;

    /* Class functions */
    function extend(parent) {
        var oldPrototype = this.prototype;
        var F = new Function();
        F.prototype = parent.prototype;
        this.prototype = new F();
        for (var property in oldPrototype) {
            if (!oldPrototype.hasOwnProperty(property))
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
        this.prototype.constructor = this;
        this.super = parent.prototype;
        return this;
    }

    function mixin(target) {
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
        //store name in private _name
        var _name = name;
        //store nested namespaces list within namespace private _namespaces
        var _namespaces = {};
        //store classes list within namespace private _classes
        var _classes = {};
        //define name
        define(this, '_name', {
            get: function () {
                return _name;
            }
        });
        //define createNamespace function
        this.createNamespace = function (name) {
            if (hasNamespace(name))
                return getNamespace(name);
            return _namespaces[name] = new Namespace(name);
        };
        //define createClass function
        this.createClass = function (name) {
            //return class if already has
            if (hasClass(name))
                return getClass(name);
            // create class
            var cls = _classes[name] = this[name] = function Class() {
                //define instance properties
                for (name in _properties) {
                    if (!_properties.hasOwnProperty(name)) continue;
                    var property = _properties[name];
                    _property.call(this, cls, name, property.descriptor, property.value);
                }
                cls._constructor.apply(this, defaults(_.values(arguments), cls._options));
            };
            //define properties list
            var _properties = {};
            //extend prototype with parent function
            cls.prototype.parent = parent;
            //add const function
            cls.const = constant;
            //define _name const
            cls.const('_name', name);
            //define _constructor
            var _constructor = new Function();
            define(cls, '_constructor', {
                get: function () {
                    return _constructor;
                },
                set: function (constructor) {
                    !_.isFunction(constructor) || (_constructor = constructor);
                }
            });
            //define _options
            var _options = [];
            define(cls, '_options', {
                get: function () {
                    return _options;
                },
                set: function (options) {
                    _options = _.isArray(options) ? options : [];
                }
            });
            //define constructor function
            cls.constructor = constructor;
            //property declaration
            //add property function
            cls.property = function property(name, descriptor, value, access) {
                _properties[name] || (_properties[name] = {
                    descriptor: _getDescriptor(this, descriptor, access),
                    value: value
                });
                return this;
            };
            //add public property function
            cls.publicProperty = publicProperty;
            //add protected property function
            cls.protectedProperty = protectedProperty;
            //add private property function
            cls.privateProperty = privateProperty;
            //method declaration
            //add method function
            cls.method = method;
            //add public method function
            cls.publicMethod = publicMethod;
            //add protected method function
            cls.protectedMethod = protectedMethod;
            //add private method function
            cls.privateMethod = privateMethod;
            //add extend function
            cls.extend = extend;
            //add isParent function
            cls.isParent = isParent;
            //add isChild function
            cls.isChild = isChild;
            return cls;
        };
        function hasNamespace(name) {
            return _namespaces[name] ? true : false;
        }

        function getNamespace(name) {
            return _namespaces[name];
        }

        function hasClass(name) {
            return _classes[name] ? true : false;
        }

        function getClass(name) {
            return _classes[name];
        }

        function defaults(values, defaults) {
            defaults.forEach(function (value, key) {
                values[key] || (values[key] = value);
            });
            return values;
        }

        function parent() {
            return arguments.callee.caller._class ? arguments.callee.caller._class.super : this.constructor.super;
        }

        function isParent(child) {
            return child.isChild(this);
        }

        function isChild(parent) {
            if (!_.isObject(this.super)) {
                return false;
            } else if (this.super.constructor === parent) {
                return true;
            } else {
                return this.super.constructor.isChild(parent);
            }
        }

        function constant(name, value) {
            //define const if not defined
            defined(this, name) || define(this, name, {
                value: value,
                writable: false,
                configurable: false,
                enumerable: true
            });
            return this;
        }

        function publicProperty(name, descriptor, value) {
            return this.property(name, descriptor, value, 'public');
        }

        function protectedProperty(name, descriptor, value) {
            return this.property(name, descriptor, value, 'protected');
        }

        function privateProperty(name, descriptor, value) {
            return this.property(name, descriptor, value, 'private');
        }

        function staticProperty(name, descriptor, value, access) {
            return _property.call(this, this, name, descriptor, value, access);
        }

        function publicStaticProperty(name, descriptor, value) {
            return this.staticProperty(name, descriptor, value, 'public');
        }

        function protectedStaticProperty(name, descriptor, value) {
            return this.staticProperty(name, descriptor, value, 'protected');
        }

        function privateStaticProperty(name, descriptor, value) {
            return this.staticProperty(name, descriptor, value, 'private');
        }

        function constructor(constructor, options) {
            constructor._class = this;
            this._constructor = constructor;
            this._options = options || [];
            return this;
        }

        function method(name, fn, options, access) {
            return _method(this, this.prototype, name, fn, options, access);
        }

        function publicMethod(name, fn, options) {
            return this.method(name, fn, options, 'public');
        }

        function protectedMethod(name, fn, options) {
            return this.method(name, fn, options, 'protected');
        }

        function privateMethod(name, fn, options) {
            return this.method(name, fn, options, 'private');
        }

        function _getDescriptor(cls, descriptor, access) {
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
            switch (access) {
                case 'public':
                    !getter || (descriptor.get = function () {
                        return getter.apply(this, arguments);
                    });
                    !setter || (descriptor.set = function () {
                        return setter.apply(this, arguments);
                    });
                    break;
                case 'protected':
                    !getter || (descriptor.get = function () {
                        return getter.apply(this, arguments);
                    });
                    !setter || (descriptor.set = function () {
                        return setter.apply(this, arguments);
                    });
                    break;
                case 'private':
                    !getter || (descriptor.get = function () {
                        return getter.apply(this, arguments);
                    });
                    !setter || (descriptor.set = function () {
                        return setter.apply(this, arguments);
                    });
                    break;
            }
            return descriptor;
        }

        function _property(cls, name, descriptor, value) {
            //return if name is not applicable
            if (!nameRe.test(name)) {
                return cls;
            }
            //return if property defined
            if (defined(this, name)) {
                return cls;
            }
            //define property
            define(this, name, descriptor);
            //create local variable via eval if setter/getter defined
            (!descriptor.get && descriptor.set) || eval('var ' + name);
            //set property default value
            this[name] = value;
            return cls;
        }

        function _method(cls, object, name, fn, options, access) {
            access || (access = 'public');
            fn._class = cls;
            options || (options = []);
            switch (access) {
                case 'public':
                    object[name] = function () {
                        return fn.apply(this, defaults(arguments, options));
                    };
                    break;
                case 'protected':
                    object[name] = function () {
                        var caller = arguments.callee.caller;
                        //call method if caller is method of child class or this class
                        if (_.isFunction(caller._class) && (caller._class === fn._class || caller._class.isChild(fn._class))) {
                            return fn.apply(this, defaults(arguments, options));
                        }
                        throw 'Call to ' + access + ' method "' + fn._class._name + '::' + name + '"';
                    };
                    break;
                case 'private':
                    object[name] = function () {
                        var caller = arguments.callee.caller;
                        //call method if caller is method of child class or this class
                        if (_.isFunction(caller._class) && caller._class === fn._class) {
                            return fn.apply(this, defaults(arguments, options));
                        }
                        throw 'Call to ' + access + ' method "' + fn._class._name + '::' + name + '"';
                    };
                    break;
            }
            return cls;
        }
    }

}).call(this, 'xs');