(function (rootNamespace) {
    var glb = {};
    var _prototypes = {};
    var _classes = {};
    var _aliases = {};
    var _stack = [];

    function classByName(name) {
        return _classes[name] || _aliases[name];
    }

    function ex(a, b) {
        for (var i in b) a[i] = b[i];
        return a
    }

    return {

        _name: '',

        _parents: {},

        createNamespace: function (name) {
            return this.createClass(name)
        },

        newObject: function (options) {
            return new this(options);
        },

        createClass: function (className) {
            var path = this._name ? this._name + '.' + className : className;
            var cls = _classes[path];
            if (cls) return cls;

            var a = className.split('.');
            if (a.length > 1) {
                var ns = this;
                for (var i = 0, n = a.length; i < n; i++)
                    ns = ns.createClass(a[i]);
                return ns;
            }
            // proto methods
            var proto = _prototypes[path] = _prototypes[path] || {
                options: {},
                aliases: [],
                methods: {},
                events: [],
                attributes: {}
            };
            // create class
            var cls = _classes[path] = window[className] = this[className] = function () {
                var privateContext = {
                    _events: {},
                    _options: {},
                    _property: {}
                };
                this.__private = function (g) {
                    if (g === glb) return privateContext;
                    throw "Error: Call to private method  " + className + "::__private()";
                };
                //
                with (proto) {
                    for (var i = 0, n = events.length, ev; i < n; i++)
                        if (ev = events[i])
                            (privateContext._events[ev.name] = privateContext._events[ev.name] || []).push(ev.fn);
                    ex(this, attributes);
                }
                // call constructor
                var options = arguments[0] = privateContext._options = ex(ex({}, cls.options()), arguments[0] || {});
                try {
                    var fn = this._constructor || function () {
                    };
                    fn._class = cls;
                    _stack.push(fn);
                    fn.apply(this, arguments.length ? arguments : [options]);
                    _stack.pop();
                } catch (e) {
                    _stack.pop();
                    throw e;
                }
                return this;
            };
            // extend from this namespace
            ex(ex(cls, this), {
                _name: path,
                _parents: {}
            });

            //---- constructor ----
            cls.constructor = function (fn) {
                return this.protectedMethod('_constructor', fn);
            };

            //----- options -----
            cls.options = function (obj) {
                with (proto) {
                    if (obj === undefined) return options;
                    ex(options, obj);
                }
                return this;
            };

            //---- aliases -----
            cls.alias = function (alias) {
                proto.aliases.push(alias);
                return window[alias] = _aliases[alias] = this;
            };

            //---- method ----
            cls.method = function (name, fn, access) {
                var _class = fn._class = fn._class || cls;
                fn._access = access = access || 'public';
                var _access = {'public': 0, 'protected': 1, 'private': 2}[access];
                var fullname = [fn._class._name, name].join('.');
                proto.methods[fullname] = proto.methods[name] = fn;
                this.prototype[fullname] = this.prototype[name] = function () {
                    var upcls;
                    if (!_access || _stack.length && (_class.isInherit(upcls = _stack[_stack.length - 1]._class) || _access == 1 && upcls.isInherit(_class))) {
                        _stack.push(fn);
                        try {
                            var result = fn.apply(this, arguments);
                            _stack.pop();
                            return result;
                        } catch (e) {
                            _stack.pop();
                            throw e;
                        }
                    }
                    throw "Call to " + access + " method " + cls._name + "::" + name + "()";
                }
                return this;
            };

            //---- event ----
            cls.event = function (name, fn, access) {
                if (fn instanceof Function) {
                    fn._class = cls;
                    proto.events.push({name: name, fn: fn});
                }
                return this.method(name, ex(function (fn, unbindfn) {
                    var events = this.__private(glb)._events;
                    if (fn instanceof Function) {
                        (events[name] = events[name] || []).push(fn);
                    } else if (fn === null && arguments.length == 1) { // clear all events
                        events[name] = [];
                    } else if (fn === null && unbindfn instanceof Function && arguments.length == 2) { // clear all events
                        for (var i = 0, arr = events[name] || [], n = arr.length; i < n; i++)
                            if (arr[i] === unbindfn) arr[i] = null;
                    } else { // exec bind-functions
                        for (var i = 0, fn, arr = events[name] || [], n = arr.length; i < n; i++)
                            if (fn = arr[i])
                                fn.apply(this, arguments);
                    }
                    return this;
                }, {_event: name}), access);
            };

            //---- class extend ----
            cls.extend = function (methodsAndProperties, access) {
                var exAccess = {
                    'public': {'public': 'public', 'protected': 'protected', 'private': 'private'},
                    'protected': {'public': 'protected', 'protected': 'protected', 'private': 'private'},
                    'private': {'public': 'private', 'protected': 'private', 'private': 'private'}
                }[access || 'public'] || {};

                if (methodsAndProperties instanceof Object) {
                    exAccess = exAccess['public'];
                    for (var name in methodsAndProperties) {
                        var val = methodsAndProperties[name];
                        if (val instanceof Function)
                            this.method(name, val, exAccess);
                        else if (val instanceof Object && (val.get || val.set))
                            this.property(name, val, exAccess);
                        else
                            this.attribute(name, val);
                    }
                } else {
                    var parent = classByName(methodsAndProperties);
                    if (!parent) throw "Error: not found base class " + methodsAndProperties;

                    for (var i in this._parents) break;
                    if (i) {
                        ex(this.prototype, parent.prototype);
                    } else {
                        var F = function () {
                        };
                        F.prototype = parent.prototype;
                        this.prototype = new F();
                        this.prototype.constructor = this;
                    }
                    var parentName = parent._name;
                    this._parents[parentName] = parent;
                    with (_prototypes[parentName]) {
                        this.options(options);
                        for (var i = 0, n = events.length; i < n; i++)
                            proto.events.push(events[i]);
                        var fn, protoMethods = proto.methods, specMethods = {
                            _property: 1,
                            _options: 1,
                            _proto: 1,
                            _class: 1,
                            _self: 1,
                            _call: 1
                        };
                        for (var name in methods)
                            protoMethods[name] || specMethods[name.split('.').pop()] || this.method(name, fn = methods[name], exAccess[fn._access]);
                    }
                }
                return this;
            };

            //---- attribute ----
            cls.attribute = function (name, defaultValue) {
                proto.attributes[name] = defaultValue;
                return this;
            };

            //---- property ----
            cls.property = function (name, fns, access) {
                fns = fns || {};
                var get = fns.get || function () {
                    return this._property(name);
                }
                var set = fns.set || function (value) {
                    return this._property(name, value);
                }
                return this.method(name, function () {
                    if (!arguments.length)
                        return get.apply(this, arguments);
                    set.apply(this, arguments);
                    return this;
                }, access);
            };

            //---- synonyms ----
            cls.publicMethod = function (name, fn) {
                return this.method(name, fn, 'public')
            }
            cls.protectedMethod = function (name, fn) {
                return this.method(name, fn, 'protected')
            }
            cls.privateMethod = function (name, fn) {
                return this.method(name, fn, 'private')
            }

            cls.publicEvent = function (name, fn) {
                return this.event(name, fn, 'public')
            }
            cls.protectedEvent = function (name, fn) {
                return this.event(name, fn, 'protected')
            }
            cls.privateEvent = function (name, fn) {
                return this.event(name, fn, 'private')
            }

            cls.publicProperty = function (name, fn) {
                return this.property(name, fn, 'public')
            }
            cls.protectedProperty = function (name, fn) {
                return this.property(name, fn, 'protected')
            }
            cls.privateProperty = function (name, fn) {
                return this.property(name, fn, 'private')
            }

            cls.publicExtend = function (methodsAndProperties) {
                return this.extend(methodsAndProperties, 'public')
            };
            cls.protectedExtend = function (methodsAndProperties) {
                return this.extend(methodsAndProperties, 'protected')
            };
            cls.privateExtend = function (methodsAndProperties) {
                return this.extend(methodsAndProperties, 'private')
            };

            //---- add methods for each classes ----
            cls.protectedMethod('_property', function (name, value) {
                var pr = this.__private(glb)._property;
                if (name === undefined) return pr;
                if (value === undefined) return pr[name];
                pr[name] = value;
                return this;
            })
                .protectedMethod('_options', function (name, value) {
                    var op = this.__private(glb)._options;
                    if (name === undefined) return op;
                    if (value === undefined) return op[name];
                    op[name] = value;
                    return this;
                })
                .protectedMethod('_proto', function () {
                    return proto;
                });

            ex(cls.prototype, {
                _class: function () {
                    return cls;
                },

                _self: function () {
                    return _stack[_stack.length - 1]._class;
                },

                _call: function (name) {
                    var method = this[name];
                    if (!method) {
                        var a = name.split('.');
                        var s = a.pop();
                        var cname = a.join('.');
                        var cl;
                        if (cname == 'self') {
                            cl = this._self();
                        } else if (cname == 'parent') {
                            var parents = this._self()._parents;
                            for (var i in parents) {
                                cl = parents[i];
                                break;
                            }
                        }
                        cl = cl || classByName(cname);
                        if (s == 'constructor') s = '_constructor';
                        if (!cl || !(method = this[[cl._name, s].join('.')])) throw "Error: Not found method " + name;
                    }
                    var args = [];
                    for (var i = 1, n = arguments.length; i < n; i++)
                        args.push(arguments[i]);
                    return method.apply(this, args);
                }
            });
            return cls;
        },

        isInherit: function (className) {
            var c = (className instanceof Function) ? className : classByName(className);
            var _is = function (cls, c) {
                if (cls === c) return true;
                with (cls)
                    for (var i in _parents)
                        if (_is(_parents[i], c))
                            return true;
                return false;
            };
            return c && _is(this, c);
        }

    }.createNamespace(rootNamespace).alias(rootNamespace)

})('xs');