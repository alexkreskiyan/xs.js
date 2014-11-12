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

    /**
     * Private internal queue class
     *
     * @ignore
     */
    var Queue = function () {
        var me = this;

        //items hash
        var items = {};

        /**
         * Sets item in queue no new position
         *
         * @param {string} name
         * @param {string} position
         * @param {*} relativeTo
         */
        var setPosition = function (name, position, relativeTo) {
            if (!xs.has([
                'first',
                'last',
                'before',
                'after'
            ], position)) {
                throw new Exception('Incorrect position given');
            }

            //if old processor in stack - remove it previously
            var processor = items[name];
            xs.deleteAt(items, name);

            //get current keys
            var keys = xs.keys(items);

            //insert to specified position
            if (position == 'first') {

                xs.unshift(stack, name);
            } else if (position == 'last') {
                xs.push(stack, name);
            } else {
                var relativeKey = xs.keyOf(stack, relativeTo);
                if (!xs.isDefined(relativeKey)) {
                    throw new Exception('Relative item missing in queue');
                }
                position == 'after' && relativeKey++;
                stack.splice(relativeKey, 0, name);
            }
        };

        /**
         * Adds
         * @param name
         * @param fn
         * @param properties
         * @param position
         * @param relativeTo
         */
        me.add = function (name, fn, properties, position, relativeTo) {
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

        /**
         * Returns items by name or ordered stack
         * @param name
         * @returns {*}
         */
        me.get = function (name) {
            if (name) {
                return items[name];
            }
            return xs.pick(items, stack);
        };
    };

    xs.Class = new (function () {

        //Queue of processors, processing class before it's considered to be created
        var preProcessors = new Queue();
        //Queue of processors, processing class after it's considered to be created
        var postProcessors = new Queue();
        //Queue of processors, called before object constructor is called
        var preConstructors = new Queue();
        //Queue of processors, called before object constructor is called
        var postConstructors = new Queue();

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
                xs.each(Class.descriptor.properties, function (descriptor, name) {
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
            hooks.postProcessors && process(Class, desc, {
                processors: hooks.postProcessors
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

            //prepare pre- and postProcessors for class
            var usedPreprocessors = prepare(Class, desc, preProcessors);
            var usedPostprocessors = prepare(Class, desc, postProcessors);

            //process class
            process(Class, desc, {
                createdFn:      createdFn,
                processors:     usedPreprocessors,
                postProcessors: usedPostprocessors
            });
        };

        xs.extend(classCreator, {
            registerPreprocessor:  preProcessors.register,
            registerPostprocessor: postProcessors.register
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