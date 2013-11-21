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
        //inherit properties
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
        //inherit static properties
        this.staticProperties(parent.staticProperties());
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
            //define private class storage
            var _storage = {
                property: {},
                staticProperty: {},
                method: {},
                staticMethod: {}
            };
            //class static properties values
            var __privates = {};
            // create class
            var cls = _classes[name] = this[name] = function Class() {
                cls._constructor.apply(this, __defaults(_.values(arguments), cls._options));
                var caller = arguments.callee.caller._class;
                //return if nested construction
                if (caller && _.isFunction(caller.isChild) && caller.isChild(cls)) {
                    return;
                }
                //private storage
                var __privates = {};
                this.__get = function (name) {
                    return arguments.callee.caller.caller === _storage.property[name].descriptor.get ? __privates[name] : undefined;
                };
                this.__set = function (name, value) {
                    return arguments.callee.caller.caller === _storage.property[name].descriptor.set ? (__privates[name] = value) : undefined;
                };
                //define instance properties
                for (name in _storage.property) {
                    if (!_storage.property.hasOwnProperty(name)) continue;
                    var _property = _storage.properties[name];
                    __defined(this, name) || __define(this, name, _property.descriptor);
                    this[name] = _property.value;
                }
            };
            //define constructor function
            cls.constructor = _constructor;
            //add const function
            cls.const = _const;
            //static getter/setter
            cls.__get = function (name) {
                return arguments.callee.caller.caller === _storage.staticProperty[name].descriptor.get ? __privates[name] : undefined;
            };
            cls.__set = function (name, value) {
                return arguments.callee.caller.caller === _storage.staticProperty[name].descriptor.set ? (__privates[name] = value) : undefined;
            };
            //property declaration
            //define properties function
            cls.properties = function (type, dynamic, value) {
                var allow = arguments.callee.caller === __extend;
                if (value)
                    return allow ? _storage[type] : [];
                !allow || function (candidates) {
                    _.each(candidates, function (value, name) {
                        _storage[type][name] || (_storage[type][name] = value);
                    });
                }(arguments[0]);
                dynamic || _.each(_storage[type], function (property, name) {
                    this.property(type, dynamic, name, property.descriptor, property.value, property.access);
                }, this);
                return this;
            };
            //add property function
            cls.property = function (type, dynamic, name, descriptor, value, access) {
                if (!nameRe.test(name)) return this;
                _storage[type][name] || (_storage[type][name] = {
                    descriptor: __descriptor(cls, name, descriptor, access),
                    value: value,
                    access: access
                });
                var object = dynamic ? this.prototype : this;
                type !== 'method' || __defined(object, name) || __define(object, name, _storage[type][name].descriptor);
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
                return arguments.callee.caller.caller._class ? arguments.callee.caller.caller._class.super : this.constructor.super;
            });
            cls.publicMethod('self', function () {
                return arguments.callee.caller.caller._class ? arguments.callee.caller.caller._class : this;
            });
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
            return this.property('property', true, name, descriptor, value, 'public');
        }

        function _protectedProperty(name, descriptor, value) {
            return this.property('property', true, name, descriptor, value, 'protected');
        }

        function _privateProperty(name, descriptor, value) {
            return this.property('property', true, name, descriptor, value, 'private');
        }

        function _publicStaticProperty(name, descriptor, value) {
            return this.property('property', false, name, descriptor, value, 'public');
        }

        function _protectedStaticProperty(name, descriptor, value) {
            return this.property('property', false, name, descriptor, value, 'protected');
        }

        function _privateStaticProperty(name, descriptor, value) {
            return this.property('property', false, name, descriptor, value, 'private');
        }

        function _publicMethod(name, method, defaults) {
            return this.property('method', true, name, {value: method, defaults: defaults}, null, 'public');
        }

        function _protectedMethod(name, method, defaults) {
            return this.property('method', true, name, {value: method, defaults: defaults}, null, 'protected');
        }

        function _privateMethod(name, method, defaults) {
            return this.property('method', true, name, {value: method, defaults: defaults}, null, 'private');
        }

        function _publicStaticMethod(name, method, defaults) {
            return this.property('method', false, name, {value: method, defaults: defaults}, null, 'public');
        }

        function _protectedStaticMethod(name, method, defaults) {
            return this.property('method', false, name, {value: method, defaults: defaults}, null, 'protected');
        }

        function _privateStaticMethod(name, method, defaults) {
            return this.property('method', false, name, {value: method, defaults: defaults}, null, 'private');
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
                    descriptor.get = function () {
                        if (__callerIsProptected(arguments.callee.caller, cls))
                            return getter.apply(this, arguments);
                        throw 'Attempt to get ' + access + ' property "' + cls._name + '::' + name + '"';
                    };
                } else if (access === 'private') {
                    descriptor.get = function () {
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
                    descriptor.set = function () {
                        if (__callerIsProptected(arguments.callee.caller, cls))
                            return setter.apply(this, arguments);
                        throw 'Attempt to set ' + access + ' property "' + cls._name + '::' + name + '"';
                    };
                } else if (access === 'private') {
                    descriptor.set = function () {
                        if (__callerIsPrivate(arguments.callee.caller, cls))
                            return getter.apply(this, arguments);
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
                        descriptor.value = function () {
                            return value.apply(this, __defaults(_.values(arguments), defaults));
                        };
                    } else if (access === 'protected') {
                        descriptor.value = function () {
                            if (__callerIsProptected(arguments.callee.caller, cls))
                                return value.apply(this, __defaults(_.values(arguments), defaults));
                            throw 'Attempt to call ' + access + ' method "' + cls._name + '::' + name + '"';
                        };
                    } else if (access === 'private') {
                        descriptor.value = function () {
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