/**
 This file is core of xs.js 0.1

 Copyright (c) 2013-2014, Annium Inc

 Contact:  http://annium.com/contact

 GNU General Public License Usage
 This file may be used under the terms of the GNU General Public License version 3.0 as
 published by the Free Software Foundation and appearing in the file LICENSE included in the
 packaging of this file.

 Please review the following information to ensure the GNU General Public License version 3.0
 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

 If you are unsure which license is appropriate for your use, please contact the sales department
 at http://annium.com/contact.

 */
'use strict';
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    xs.Class = new (function () {

        var ProcessorQueue = function () {
            var items = {};
            var stack = [];
            this.items = items;
            this.stack = stack;
            var setPosition = function (name, position, relativeTo) {
                //if old preprocessor in stack - remove it
                var currentIndex = stack.indexOf(name);
                if (currentIndex >= 0) {
                    stack.splice(currentIndex, 1);
                }
                //insert to specified position
                if (position == 'first') {
                    stack.unshift(name);
                } else if (position == 'last') {
                    stack.push(name);
                } else {
                    var relativeIndex = stack.indexOf(relativeTo);
                    if (relativeIndex >= 0) {
                        position == 'after' && relativeIndex++;
                        stack.splice(relativeIndex, 0, name);
                    }
                }
            };
            this.register = function (name, fn, properties, position, relativeTo) {
                //default properties to array if string and to true (all properties) - if none
                if (xs.isString(properties)) {
                    properties = [properties];
                } else if (!xs.isArray(properties)) {
                    properties = true;
                }
                //position defaults to last
                position || (position = 'last');
                items[name] = {
                    name: name,
                    fn: fn,
                    properties: properties
                };
                setPosition(name, position, relativeTo);
            };
            this.get = function (name) {
                return name ? items[name] : items;
            };
            this.getStack = function () {
                return stack;
            }
        };

        var preprocessors = new ProcessorQueue();
        var postprocessors = new ProcessorQueue();

        var factory = function (constructor) {
            var xClass = function (args) {
                return constructor.apply(this, args);
            };

            xClass.prototype = constructor.prototype;
            return function () {
                return new xClass(arguments);
            };
        };

        var create = function (data) {
            //create proto object, which will be constructing class instances
            var meta = {};
            //if no constructor given - default to emptyfn
            if (data.constructor == Object) {
                data.constructor = function () {
                };
            }
            //prepare constructor descriptor
            var desc = xs.method.prepare('constructor', data.constructor);
            if (!desc) {
                desc = {
                    value: function () {
                    }
                };
            }
            //assign constructor
            xs.method.define(meta, 'constructor', desc);
            //create class
            var Class = function xClass() {
                //no all operations in native class constructor, preventing downcall usage
                if (!this.self || this.self === Class) {
                    //instance privates
                    var privates = {};
                    //private setter/getter
                    xs.method.define(this, '__get', {
                        value: function (name) {
                            return privates[name];
                        }
                    });
                    xs.method.define(this, '__set', {
                        value: function (name, value) {
                            privates[name] = value;
                        }
                    });
                    //class reference
                    xs.const(this, 'self', Class);
                }
                //apply constructor
                meta.constructor.apply(this, arguments);
            };
            //define factory
            xs.method.define(Class, 'factory', {value: factory(Class)});
            //static privates
            var privates = {};
            //static getter/setter
            xs.method.define(Class, '__get', {value: function (name) {
                return privates[name];
            }});
            xs.method.define(Class, '__set', {value: function (name, value) {
                privates[name] = value;
            }});
            return Class;
        };

        var prepare = function (Class, data, queue) {
            var stack = queue.getStack(),
                registered = queue.get(),
                used = [], processor,
                properties;
            xs.Object.each(stack, function (name) {
                processor = registered[name];
                properties = processor.properties;
                if (properties === true) {
                    used.push(processor.fn);
                } else {
                    xs.Array.some(properties, function (property) {
                        return data.hasOwnProperty(property);
                    }) && used.push(processor.fn);
                }
            });
            return used;
        };

        var process = function (Class, data, hooks) {
            var me = this,
                processors = hooks.processors,
                processor = processors.shift();

            for (; processor; processor = processors.shift()) {
                // Returning false signifies an asynchronous preprocessor - it will call doProcess when we can continue
                if (processor.call(me, Class, data, hooks, process) === false) {
                    return;
                }
            }
            hooks.createdFn && hooks.createdFn.apply(me, arguments);
            hooks.postprocessors && process(Class, data, {
                processors: hooks.postprocessors
            });
        };

        var extend = function (child, parent) {
            var fn = function () {
            };
            fn.prototype = parent.prototype;
            child.prototype = new fn();
            child.prototype.constructor = child;
            //save reference to parent
            xs.const(child, 'parent', parent);
        };

        var apply = function (Class, data) {
            //processed descriptor
            var desc = {
                    const: {},
                    static: {
                        properties: {},
                        methods: {}
                    },
                    properties: {},
                    methods: {}
                },
                each = xs.Object.each,
                property = xs.property,
                method = xs.method;

            // constants
            each(data.const, function (value, name) {
                desc.const[name] = value;
                xs.const(Class, name, value);
            });

            //public static properties
            each(data.static.properties, function (value, name) {
                var descriptor = property.prepare(name, value);
                desc.static.properties[name] = descriptor;
                property.define(Class, name, descriptor);
                descriptor.hasOwnProperty('default') && (Class[name] = descriptor.default);
            });

            //public static methods
            each(data.static.methods, function (value, name) {
                var descriptor = method.prepare(name, value);
                if (!descriptor) {
                    return;
                }
                desc.static.methods[name] = descriptor;
                method.define(Class, name, descriptor);
            });

            //public properties
            each(data.properties, function (value, name) {
                desc.properties[name] = property.prepare(name, value);
            });

            //public methods
            each(data.methods, function (value, name) {
                var descriptor = method.prepare(name, value);
                if (!descriptor) {
                    return;
                }
                desc.methods[name] = descriptor;
                method.define(Class.prototype, name, descriptor);
            });

            return desc;
        };

        var metaClass = function (data, createdFn) {
            var Class;
            if (xs.isFunction(data)) {
                data = data();
            } else if (!xs.isObject(data)) {
                data = data || {};
            }
            xs.isFunction(createdFn) || (createdFn = xs.emptyFn);

            //create class
            Class = create(data);

            //prepare pre- and postprocessors for class
            var usedPreprocessors = prepare(Class, data, preprocessors);
            var usedPostprocessors = prepare(Class, data, postprocessors);

            //process class
            process(Class, data, {
                createdFn: createdFn,
                processors: usedPreprocessors,
                postprocessors: usedPostprocessors
            });
        };

        xs.extend(metaClass, {
            extend: extend,
            applyDescriptor: apply,
            registerPreprocessor: preprocessors.register,
            registerPostprocessor: postprocessors.register
        });
        return metaClass;
    });
    /**
     * Register singleton preprocessor
     */
    xs.Class.registerPreprocessor('singleton', function (Class, data, hooks, ready) {
        if (data.singleton) {
            ready.call(this, new Class, data, hooks);
            return false;
        }
    }, 'singleton');
    /**
     * Register className preprocessor
     */
    xs.Class.registerPreprocessor('className', function (Class, data) {
        xs.property.define(Class, 'label', {value: data.label});
    });

    /**
     * Register extend preprocessor
     */
    xs.Class.registerPreprocessor('extend', function (Class, data, hooks, ready) {
        //if incorrect parent given - extend from Base
        if (!xs.isString(data.extend)) {
            xs.Class.extend(Class, xs.Base);
            return;
        }

        //if parent class exists - extend from it
        var Parent = xs.ClassManager.get(data.extend);
        if (Parent) {
            xs.Class.extend(Class, Parent);
            return;
        }

        //check require is available
        if (!xs.require) {
            xs.Error.raise('xs.Loader not loaded. Class ' + data.extend + ' load fails');
        }

        var me = this;
        //require async
        xs.require(data.extend, function () {
            xs.Class.extend(Class, xs.ClassManager.get(data.extend));
            ready.call(me, Class, data, hooks);
        });

        //return false to sign async processor
        return false;
    });
    xs.Class.registerPreprocessor('configure', function (Class, data) {
        //combine class descriptor with inherited descriptor
        var inherits = Class.parent.descriptor;

        //const
        data.const = xs.isObject(data.const) ? data.const : {};
        //static properties and methods
        xs.isObject(data.static) || (data.static = {});
        data.static.properties = xs.isObject(data.static.properties) ? data.static.properties : {};
        data.static.methods = xs.isObject(data.static.methods) ? data.static.methods : {};
        //public properties and methods
        data.properties = xs.isObject(data.properties) ? data.properties : {};
        data.methods = xs.isObject(data.methods) ? data.methods : {};

        //const: defaulted from inherits
        data.const = xs.Object.defaults(data.const, inherits.const);
        //static properties and methods
        data.static.properties = xs.Object.defaults(data.static.properties, inherits.static.properties);
        data.static.methods = xs.Object.defaults(data.static.methods, inherits.static.methods);
        //public properties and methods
        data.properties = xs.Object.defaults(data.properties, inherits.properties);
        //methods are not defaulted from inherits - prototype usage covers that
    });
    xs.Class.registerPreprocessor('inherit', function (Class, data) {
        //apply configured descriptor
        var descriptor = xs.Class.applyDescriptor(Class, data);

        //define descriptor static property
        xs.property.define(Class, 'descriptor', {
            get: function () {
                return descriptor;
            }
        });
    });
})(window, 'xs');





























