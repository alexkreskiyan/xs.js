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
            xs.method.define(Class, 'factory', {value: factory(Class)});
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
                used = hooks.used,
                processor = used.shift();

            for (; processor; processor = used.shift()) {
                // Returning false signifies an asynchronous preprocessor - it will call doProcess when we can continue
                if (processor.call(me, Class, data, hooks, process) === false) {
                    return;
                }
            }
            hooks.createdFn && hooks.createdFn.apply(me, arguments);
            hooks.postProcess && hooks.postProcess();
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
                used: usedPreprocessors,
                postProcess: function () {
                    process(Class, data, {
                        used: usedPostprocessors
                    });
                }
            });
            return Class;
        };

        xs.extend(metaClass, {
            extend: extend,
            registerPreprocessor: preprocessors.register,
            registerPostprocessor: postprocessors.register
        });
        return metaClass;
    });
    /**
     * Register className preprocessor
     */
    xs.Class.registerPreprocessor('className', function (Class, data) {
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

        //require async
        xs.require(data.extend, function () {
            xs.Class.extend(Class, xs.ClassManager.get(data.extend));
            ready();
        });

        //return false to sign async processor
        return false;
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

        //require async
        xs.require(data.extend, function () {
            xs.Class.extend(Class, xs.ClassManager.get(data.extend));
            ready();
        });

        //return false to sign async processor
        return false;
    });
})(window, 'xs');





























