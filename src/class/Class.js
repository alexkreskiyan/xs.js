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
/**
 * @class xs.Class
 * @singleton
 * xs.Class is core class, that is used internally for class generation.
 *
 * xs.Class defines 2 static methods:
 * {@link xs.Class#registerPreprocessor registerPreprocessor}
 * {@link xs.Class#registerPostprocessor registerPostprocessor}
 */
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    xs.Class = new (function () {

        var ProcessingQueue = function () {
            var me = this;
            var items = {};
            var stack = [];
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
            me.register = function (name, fn, properties, position, relativeTo) {
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
            me.get = function (name) {
                return name ? items[name] : items;
            };
            me.getStack = function () {
                return stack;
            }
        };

        var preprocessors = new ProcessingQueue();
        var postprocessors = new ProcessingQueue();

        var create = function (descFn) {
            var _each = xs.Object.each;
            var _define = xs.Attribute.define;

            //create class
            var Class = function xClass(desc) {
                var me = this;
                desc || (desc = {});
                //define class constructor
                var descriptor = Class.descriptor;
                var constructor = descriptor.hasOwnProperty('constructor') && xs.isFunction(descriptor.constructor) ? descriptor.constructor : undefined;
                //if parent constructor - just call it
                if (me.self && me.self !== Class) {
                    constructor && constructor.call(me, desc);
                    return;
                }
                //class reference
                me.self = Class;
                //instance privates
                var privates = {};
                //private setter/getter
                me.__get = function (name) {
                    return privates[name];
                };
                me.__set = function (name, value) {
                    privates[name] = value;
                };
                //apply properties to object
                _each(Class.descriptor.properties, function (descriptor, name) {
                    //accessed descriptor only
                    if (descriptor.get) {
                        _define(me, name, descriptor);
                    } else {
                        me[name] = descriptor.value;
                    }
                }, me);
                //apply constructor
                constructor && constructor.call(me, desc);
            };

            var desc = descFn(Class);

            //static privates
            var privates = {};
            //static getter/setter
            Class.__get = function (name) {
                return privates[name];
            };
            Class.__set = function (name, value) {
                privates[name] = value;
            };
            return {
                Class: Class,
                desc: desc
            };
        };

        var prepare = function (Class, desc, queue) {
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
                        return desc.hasOwnProperty(property);
                    }) && used.push(processor.fn);
                }
            });
            return used;
        };

        var process = function (Class, desc, hooks) {
            var me = this,
                processors = hooks.processors,
                processor = processors.shift();

            for (; processor; processor = processors.shift()) {
                // Returning false signifies an asynchronous preprocessor - it will call doProcess when we can continue
                if (processor.call(me, Class, desc, hooks, process) === false) {
                    return;
                }
            }
            hooks.createdFn && hooks.createdFn.apply(me, arguments);
            hooks.postprocessors && process(Class, desc, {
                processors: hooks.postprocessors
            });
        };

        var classCreator = function (descFn, createdFn) {
            if (!xs.isFunction(descFn)) {
                xs.Error.raise('incorrect incoming decriptor function');
            }
            xs.isFunction(createdFn) || (createdFn = xs.emptyFn);

            //create class
            var result = create(descFn);
            var Class = result.Class;
            var desc = result.desc;

            //prepare pre- and postprocessors for class
            var usedPreprocessors = prepare(Class, desc, preprocessors);
            var usedPostprocessors = prepare(Class, desc, postprocessors);

            //process class
            process(Class, desc, {
                createdFn: createdFn,
                processors: usedPreprocessors,
                postprocessors: usedPostprocessors
            });
        };

        xs.extend(classCreator, {
            registerPreprocessor: preprocessors.register,
            registerPostprocessor: postprocessors.register
        });
        return classCreator;
    });

    var extend = function (child, parent) {
        var fn = function () {
        };
        fn.prototype = parent.prototype;
        child.prototype = new fn();
        child.prototype.constructor = child;
        //save reference to parent
        xs.const(child, 'parent', parent);
    };

    var applyDescriptor = function (Class, desc) {
        //processed descriptor
        var realDesc = {
                constructor: undefined,
                const: {},
                static: {
                    properties: {},
                    methods: {}
                },
                properties: {},
                methods: {},
                mixins: {}
            },
            each = xs.Object.each,
            property = xs.property,
            method = xs.method;

        //constructor
        realDesc.constructor = desc.constructor;

        // constants
        each(desc.const, function (value, name) {
            realDesc.const[name] = value;
            xs.const(Class, name, value);
        });

        //public static properties
        each(desc.static.properties, function (value, name) {
            var descriptor = property.prepare(name, value);
            realDesc.static.properties[name] = descriptor;
            property.define(Class, name, descriptor);
            descriptor.hasOwnProperty('default') && (Class[name] = descriptor.default);
        });

        //public static methods
        each(desc.static.methods, function (value, name) {
            var descriptor = method.prepare(name, value);
            if (!descriptor) {
                return;
            }
            realDesc.static.methods[name] = descriptor;
            method.define(Class, name, descriptor);
        });

        //public properties
        each(desc.properties, function (value, name) {
            realDesc.properties[name] = property.prepare(name, value);
        });

        //public methods
        each(desc.methods, function (value, name) {
            var descriptor = method.prepare(name, value);
            if (!descriptor) {
                return;
            }
            realDesc.methods[name] = descriptor;
            method.define(Class.prototype, name, descriptor);
        });

        //mixins processing
        //define mixins storage in class
        if (xs.Object.size(desc.mixins)) {
            Class.mixins = {};
            Class.prototype.mixins = {};
        }
        each(desc.mixins, function (value, name) {
            //leave mixin in descriptor
            realDesc.mixins[name] = value;
            //get mixClass
            var mixClass = xs.ClassManager.get(value);
            Class.mixins[name] = mixClass;
            Class.prototype.mixins[name] = mixClass.prototype;
        });

        return realDesc;
    };

    /**
     * Register extend preprocessor
     */
    xs.Class.registerPreprocessor('extend', function (Class, desc, hooks, ready) {
        //if incorrect parent given - extend from Base
        if (!xs.isString(desc.extend)) {
            extend(Class, xs.Base);
            return;
        }

        //if parent class exists - extend from it
        var Parent = xs.ClassManager.get(desc.extend);
        if (Parent) {
            extend(Class, Parent);
            return;
        }

        //check require is available
        if (!xs.require) {
            xs.Error.raise('xs.Loader not loaded. Class ' + desc.extend + ' load fails');
        }

        var me = this;
        //require async
        xs.require(desc.extend, function () {
            extend(Class, xs.ClassManager.get(desc.extend));
            ready.call(me, Class, desc, hooks);
        });

        //return false to sign async processor
        return false;
    });
    xs.Class.registerPreprocessor('configure', function (Class, desc) {
        //combine class descriptor with inherited descriptor
        var inherits = Class.parent.descriptor;

        //constructor
        desc.constructor = desc.hasOwnProperty('constructor') && xs.isFunction(desc.constructor) ? desc.constructor : undefined;
        //const
        desc.const = xs.isObject(desc.const) ? desc.const : {};
        //static properties and methods
        xs.isObject(desc.static) || (desc.static = {});
        desc.static.properties = xs.isObject(desc.static.properties) ? desc.static.properties : {};
        desc.static.methods = xs.isObject(desc.static.methods) ? desc.static.methods : {};
        //public properties and methods
        desc.properties = xs.isObject(desc.properties) ? desc.properties : {};
        desc.methods = xs.isObject(desc.methods) ? desc.methods : {};
        //mixins
        if (xs.isString(desc.mixins)) {
            desc.mixins = [desc.mixins];
        }
        if (xs.isArray(desc.mixins)) {
            var mixins = {}, mixClass;
            xs.Array.each(desc.mixins, function (mixin) {
                mixClass = xs.ClassManager.get(mixin);
                xs.Array.has(mixins, mixin) || (mixins[mixClass.label] = mixin);
            });
            //update mixins at descriptor
            desc.mixins = mixins;
        } else if (!xs.isObject(desc.mixins)) {
            desc.mixins = {};
        }

        //constructor
        desc.constructor = desc.constructor ? desc.constructor : inherits.constructor;
        //constructor
        desc.const = xs.Object.defaults(desc.const, inherits.const);
        //static properties and methods
        desc.static.properties = xs.Object.defaults(desc.static.properties, inherits.static.properties);
        desc.static.methods = xs.Object.defaults(desc.static.methods, inherits.static.methods);
        //public properties and methods
        desc.properties = xs.Object.defaults(desc.properties, inherits.properties);
        //methods are not defaulted from inherits - prototype usage covers that
        //mixins
        desc.mixins = xs.Object.unique(xs.Object.defaults(desc.mixins, inherits.mixins));
    });
    xs.Class.registerPreprocessor('mixins', function (Class, desc) {
        var mixClasses = {};

        if (!xs.Object.size(desc.mixins)) {
            return;
        }

        //process mixins
        xs.Object.each(desc.mixins, function (mixin, alias) {
            mixClasses[alias] = xs.ClassManager.get(mixin);
        });

        //overriden mixed storage, that will be defaulted to descriptor
        var mixed = {
            const: {},
            static: {
                properties: {},
                methods: {}
            },
            properties: {},
            methods: {}
        };

        //iterate mixins and prepare
        var descriptor;
        xs.Object.each(mixClasses, function (mixClass) {
            descriptor = mixClass.descriptor;
            xs.extend(mixed.const, descriptor.const);
            xs.extend(mixed.static.properties, descriptor.static.properties);
            xs.extend(mixed.static.methods, descriptor.static.methods);
            xs.extend(mixed.properties, descriptor.properties);
            xs.extend(mixed.methods, descriptor.methods);
        });

        //const
        desc.const = xs.Object.defaults(desc.const, mixed.const);
        //static properties and methods
        desc.static.properties = xs.Object.defaults(desc.static.properties, mixed.static.properties);
        desc.static.methods = xs.Object.defaults(desc.static.methods, mixed.static.methods);
        //public properties and methods
        desc.properties = xs.Object.defaults(desc.properties, mixed.properties);
        desc.methods = xs.Object.defaults(desc.methods, mixed.methods);
    }, 'mixins');
    xs.Class.registerPreprocessor('inherit', function (Class, desc) {
        //apply configured descriptor
        var descriptor = applyDescriptor(Class, desc);

        //define descriptor static property
        xs.property.define(Class, 'descriptor', {
            get: function () {
                return descriptor;
            }
        });
    });
    /**
     * Register singleton preprocessor
     */
    xs.Class.registerPreprocessor('singleton', function (Class, desc, hooks, ready) {
        if (desc.singleton) {
            ready.call(this, new Class, desc, hooks);
            return false;
        }
    }, 'singleton');
    /**
     * Register pre-base class
     */
    xs.Base = new Function;
    //apply empty descriptor
    var descriptor = applyDescriptor(xs.Base, {
        const: {},
        mixins: {},
        static: {
            properties: {},
            methods: {}
        },
        properties: {},
        methods: {}
    });

    //define descriptor static property
    xs.property.define(xs.Base, 'descriptor', {
        get: function () {
            return descriptor;
        }
    });
})(window, 'xs');