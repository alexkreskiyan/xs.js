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

    /* create define function, as a shortcut for Object.defineProperty(ies) */
    function define(ctx, key, descriptor) {
        return descriptor ? Object.defineProperty(ctx, key, descriptor) : Object.defineProperties(ctx, key);
    }

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

    function defaults(values, defaults) {
        _.each(defaults, function (value, key) {
            values[key] || (values[key] = value);
        });
        return values;
    }

    function parent() {
        return arguments.callee.caller._class ? arguments.callee.caller._class.super : this.constructor.super;
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
            if (hasClass(name))
                return getClass(name);
            var cls = _classes[name] = this[name] = function Class() {
                cls._constructor.apply(this, defaults(_.toArray(arguments), cls._options));
            };
            cls.prototype.parent = parent;
            //define name
            define(cls, '_name', {
                get: function () {
                    return name;
                }
            });
            var _constructor = new Function();
            //define _constructor
            define(cls, '_constructor', {
                get: function () {
                    return _constructor;
                },
                set: function (constructor) {
                    !_.isFunction(constructor) || (_constructor = constructor);
                }
            });
            cls.constructor = function (constructor) {
                constructor._class = cls;
                cls._constructor = constructor;
                return this;
            };
            var _options = [];
            //define _options
            define(cls, '_options', {
                get: function () {
                    return _options;
                },
                set: function (options) {
                    _options = _.isArray(options) ? options : [];
                }
            });
            cls.options = function (options) {
                cls._options = options;
                return this;
            };
            cls.method = function (name, fn, access) {
                var _access = {'public': 0, 'protected': 1, 'private': 2}[access || 'public'];
                switch (access) {
                    case 0:
                        return this.publicMethod(name, fn);
                    case 1:
                        return this.protectedMethod(name, fn);
                    case 2:
                        return this.privateMethod(name, fn);
                }
                return this;
            };
            cls.publicMethod = function (name, fn) {
                fn._class = cls;
                this.prototype[name] = fn;
                return this;
            };
            cls.protectedMethod = function (name, fn) {
                fn._class = cls;
                this.prototype[name] = function () {
                    var caller = arguments.callee.caller;
                    fn.apply(this, arguments);
                };
                return this;
            };
            cls.privateMethod = function (name, fn) {
                fn._class = cls;
                this.prototype[name] = fn;
                return this;
            };
            cls.extend = function (parent) {
                return extend.call(this, parent);
            }
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

    }

}).call(this, 'xs');