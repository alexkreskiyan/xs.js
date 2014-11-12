/*!
 This file is core of xs.js

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
                    name:       name,
                    fn:         fn,
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
                desc:  desc
            };
        };

        var prepare = function (Class, desc, queue) {
            var stack = queue.getStack(), registered = queue.get(), used = [], processor, properties;
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
            var me = this, processors = hooks.processors, processor = processors.shift();

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
                createdFn:      createdFn,
                processors:     usedPreprocessors,
                postprocessors: usedPostprocessors
            });
        };

        xs.extend(classCreator, {
            registerPreprocessor:  preprocessors.register,
            registerPostprocessor: postprocessors.register
        });
        return classCreator;
    });

    /**
     * Register pre-base class
     */
    xs.Base = new Function;
    //apply empty descriptor
    var descriptor = applyDescriptor(xs.Base, {
        const:      {},
        mixins:     {},
        static:     {
            properties: {},
            methods:    {}
        },
        properties: {},
        methods:    {}
    });

    //define descriptor static property
    xs.property.define(xs.Base, 'descriptor', {
        get: function () {
            return descriptor;
        }
    });
})(window, 'xs');