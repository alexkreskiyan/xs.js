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

    /**
     * base regular exceptions
     * @type {RegExp}
     */
    var namespaceRe = /^ns/i;
    var fnArgsRe = /^function\s(?:\w+)?\(([A-Za-z0-9\s,]*)\)/i;
    /**
     * Classes container
     * @type {{}}
     * @private
     */
    var classes = new (function () {
        /**
         * class definitions
         */
        var items = {};
        /**
         * checks whether items has class
         * @param name
         * @returns {boolean}
         */
        this.has = function (name) {
            return items.hasOwnProperty(name);
        };
        /**
         * gets class by name if exists, otherwise returns false
         * @param name
         * @returns {*}
         */
        this.get = function (name) {
            return this.has(name) ? items[name] : false;
        };
        /**
         * Sets given class as item at path, specified by name
         * @param root
         * @param name
         * @param cls
         */
        this.set = function (root, name, cls) {
            //explode name to parts
            var names = name.split('.');
            //return if empty name
            if (!names.length) {
                return;
            }
            if (cls.$name == name) {
                items[name] = cls;
            }
            //get parent namespace part
            var namespace = names.shift();
            //check whether namespace is leave or not
            if (names.length) {
                //create if not created yet
                type.isFunction(root[namespace]) || type.isObject(root[namespace]) || (root[namespace] = {});
                //downcall
                this.set(root[namespace], names.join('.'), cls);
            } else {
                //save cls as root's namespace item
                root[namespace] = cls;
            }
        };
        this.create = function (name) {
            //proto constructor
            core.method(proto, 'constructor', {
                value: description.constructor,
                default: description.default,
                $parent: cls.$parent.prototype,
                wrap: true
            });
            var Class = function () {
                //no all operations in native class constructor, preventing downcall usage
                if (!this.$class || this.$class === cls) {
                    //instance privates
                    var privates = {};
                    //parent method
                    core.method(this, 'parent', {value: classes.parent});
                    //private setter/getter
                    core.method(this, '__get', {value: function (name) {
                        return privates[name]
                    }});
                    core.method(this, '__set', {value: function (name, value) {
                        privates[name] = value;
                    }});
                    //class reference
                    core.const(this, '$class', cls);
                    //apply properties to object
                    object.each(descriptor.properties, function (propertyDescriptor, name) {
                        core.property(this, name, propertyDescriptor);
                        object.hasKey(propertyDescriptor, 'default') && (this[name] = propertyDescriptor.default);
                    }, this);
                }
                //apply constructor
                proto.constructor.apply(this, arguments);
            };
            return Class;
        };
        /**
         * gets class name according to namespace
         * @param name
         * @returns {string}
         */
        this.getName = function (name) {
            if (typeof this.$namespace === 'string') {
                return name.split(namespaceRe).join(this.$namespace);
            } else {
                return name;
            }
        };
        this.parent = function (args) {
            return args[args.length - 1];
        };
        this.isParent = function (child) {
            return type.isFunction(child.isChild) ? child.isChild(this) : false;
        };
        this.isChild = function (parent) {
            if (!type.isFunction(this.$parent)) {
                return false;
            } else if (this.$parent === parent) {
                return true;
            } else {
                return this.$parent.isChild(parent);
            }
        };
    });

    var xsClass;

    xs.Class = xsClass = function (Class, data, createdFn) {
        if (typeof Class !== 'function') {
            createdFn = data;
            data = Class;
            Class = null;
        }
        data = data || {};
        Class = xsClass.create(Class, data);
        xsClass.process(Class, data, createdFn);
        return Class;
    };


    xs.extend(Class, {
        exists: function (name) {
            return classes.has(name);
        },
        /**
         * @private
         */
        create: function (Class, data) {
            var name, i;

            if (!Class) {
                Class = makeCtor(
                    //<debug>
                    data.$className
                    //</debug>
                );
            }

            for (i = 0; i < baseStaticMemberLength; i++) {
                name = baseStaticMembers[i];
                Class[name] = Base[name];
            }

            return Class;
        },
        /**
         * @private
         */
        process: function (Class, data, onCreated) {
            var preprocessorStack = data.preprocessors || ExtClass.defaultPreprocessors,
                registeredPreprocessors = this.preprocessors,
                hooks = {
                    onBeforeCreated: this.onBeforeCreated
                },
                preprocessors = [],
                preprocessor, preprocessorsProperties,
                i, ln, j, subLn, preprocessorProperty;

            delete data.preprocessors;

            for (i = 0, ln = preprocessorStack.length; i < ln; i++) {
                preprocessor = preprocessorStack[i];

                if (typeof preprocessor == 'string') {
                    preprocessor = registeredPreprocessors[preprocessor];
                    preprocessorsProperties = preprocessor.properties;

                    if (preprocessorsProperties === true) {
                        preprocessors.push(preprocessor.fn);
                    }
                    else if (preprocessorsProperties) {
                        for (j = 0, subLn = preprocessorsProperties.length; j < subLn; j++) {
                            preprocessorProperty = preprocessorsProperties[j];

                            if (data.hasOwnProperty(preprocessorProperty)) {
                                preprocessors.push(preprocessor.fn);
                                break;
                            }
                        }
                    }
                }
                else {
                    preprocessors.push(preprocessor);
                }
            }

            hooks.onCreated = onCreated ? onCreated : Ext.emptyFn;
            hooks.preprocessors = preprocessors;

            this.doProcess(Class, data, hooks);
        },

        doProcess: function (Class, data, hooks) {
            var me = this,
                preprocessors = hooks.preprocessors,
                preprocessor = preprocessors.shift(),
                doProcess = me.doProcess;

            for (; preprocessor; preprocessor = preprocessors.shift()) {
                // Returning false signifies an asynchronous preprocessor - it will call doProcess when we can continue
                if (preprocessor.call(me, Class, data, hooks, doProcess) === false) {
                    return;
                }
            }
            hooks.onBeforeCreated.apply(me, arguments);
        }
    });
//    ,
//    extend: fn,
//        factory: fn,
//        preprocessors: {},
//    postprocessors: {}
    /**
     * core functions: extend, define, const, etc
     */
    var core = {
        /**
         * Extend core function
         * @param child child class
         * @param parent parent class
         * @returns {}
         */
        extend: function (child, parent) {
            var fn = function () {
            };
            fn.prototype = parent.prototype;
            child.prototype = new fn();
            child.prototype.constructor = child;
            //save reference to parent
            this.const(child, '$parent', parent);
        },
        factory: function (constructor) {
            function fn(args) {
                return constructor.apply(this, args);
            }

            fn.prototype = constructor.prototype;
            return function () {
                return new fn(arguments);
            };
        },
        defined: function (obj, key) {
            return !!(obj.hasOwnProperty(key));
        },
        define: function (obj, key, descriptor) {
            return descriptor ? Object.defineProperty(obj, key, descriptor) : Object.defineProperties(obj, key);
        },
        const: function (obj, name, value) {
            this.defined(obj, name) || this.define(obj, name, {
                value: value,
                writable: false,
                enumerable: true,
                configurable: false
            })
        },
        property: function (obj, name, descriptor) {
            this.defined(obj, name) || this.define(obj, name, object.defaults({
                enumerable: true,
                configurable: false
            }, descriptor))
        },
        method: function (obj, name, descriptor) {
            if (this.defined(obj, name)) {
                return;
            }
            var description = object.defaults({
                writable: false,
                enumerable: true,
                configurable: false
            }, descriptor);
            if (description.default || description.wrap) {
                description.default = type.isArray(description.default) ? description.default : [];
                var fn = description.value;
                if (description.wrap) {
                    //get count of arguments, defined by function;
                    var argsCount = fnArgsRe.exec(fn.toString()).pop().split(',').length;
                    description.value = function () {
                        var args = array.defaults(array.values(arguments), description.default);
                        //pass super, needed for parent() calls
                        if (args.length < argsCount) {
                            args[argsCount] = description.$parent;
                        } else {
                            args.push(description.$parent);
                        }
                        return fn.apply(this, args);
                    };
                } else {
                    description.value = function () {
                        var args = array.defaults(array.values(arguments), description.default);
                        return fn.apply(this, args);
                    };
                }
            }
            this.define(obj, name, description);
        }
    };
    var desc = {
        /**
         * determines whether given value is property descriptor
         * returns true when it is object and contains only some of 6 descriptor-relative properties
         */
        is: function (descriptor) {
            //false if descriptor is not object
            if (!type.isObject(descriptor)) {
                return false;
            }
            //check descriptor fields are filled correctly
            if (object.hasKey(descriptor, 'value')) {
                return true;
            } else if (object.hasKey(descriptor, 'get') || object.hasKey(descriptor, 'set')) {
                if (descriptor.get && !type.isFunction(descriptor.get)) {
                    return false;
                }
                if (descriptor.set && !type.isFunction(descriptor.set)) {
                    return false;
                }
                return true;
            }
            return false;
        },
        property: function (descriptor, name) {
            //process descriptor
            var desc = this.is(descriptor) ? descriptor : {value: descriptor};
            //if accessors given - remove value
            if (desc.get || desc.set) {
                //default getter setter to simple interpretation
                desc.get || eval('desc.get = function () {return this.__get(\'' + name + '\');}');
                desc.set || eval('desc.set = function (value) {return this.__set(\'' + name + '\',value);}');
                delete desc.value;
                delete desc.writable;
            } else {
                //get value
                desc.value = type.isDefined(desc.value) ? desc.value : undefined;
                desc.writable = true;
            }
            return desc;
        },
        method: function (descriptor) {
            //process descriptor
            var desc = {};
            //process given descriptor. if something wrong - returns false
            //simple function allowed
            if (type.isFunction(descriptor)) {
                desc.value = descriptor;
                //allowed as object with fn property, containing method function
            } else if (type.isObject(descriptor)) {
                //function may be specified in fn or value propeties
                if (type.isFunction(descriptor.fn)) {
                    desc.value = descriptor.fn;
                } else if (type.isFunction(descriptor.value)) {
                    desc.value = descriptor.value;
                } else {
                    return false;
                }
                //else  - return false
            } else {
                return false;
            }
            //assign defaults
            type.isArray(descriptor.default) && (desc.default = descriptor.default);
            //assign wrap
            type.isBoolean(descriptor.wrap) && (desc.wrap = descriptor.wrap);
            return desc;
        },
        apply: function (cls, descriptor) {
            //correct descriptor
            var correctDescriptor = {
                const: {},
                static: {
                    properties: {},
                    methods: {}
                },
                properties: {},
                methods: {}
            };
            // constants
            object.each(descriptor.const, function (value, name) {
                //save const to class descriptor
                correctDescriptor.const[name] = value;
                core.const(cls, name, value);
            });
            //public static properties
            object.each(descriptor.static.properties, function (value, name) {
                //parse value as property descriptor
                var propertyDescriptor = this.property(value, name);
                //store desc to class descriptor
                correctDescriptor.static.properties[name] = propertyDescriptor;
                //define class property
                core.property(cls, name, propertyDescriptor);
                //assign default if specified
                object.hasKey(propertyDescriptor, 'default') && (cls[name] = propertyDescriptor.default);
            }, this);
            //public static methods
            object.each(descriptor.static.methods, function (value, name) {
                //parse value as method descriptor
                var propertyDescriptor = this.method(value);
                //if desc is wrong - return
                if (!propertyDescriptor) {
                    return;
                }
                //store desc to class descriptor
                correctDescriptor.static.methods[name] = propertyDescriptor;
                //define class property
                core.method(cls, name, object.defaults(propertyDescriptor, {
                    $parent: cls.$parent,
                    wrap: false
                }));
            }, this);
            //public properties
            object.each(descriptor.properties, function (value, name) {
                //parse value as property descriptor
                var propertyDescriptor = this.property(value, name);
                //store desc to class descriptor
                correctDescriptor.properties[name] = propertyDescriptor;
                //instance properties are defined in constructor
            }, this);
            //public methods
            object.each(descriptor.methods, function (value, name) {
                //parse value as method descriptor
                var propertyDescriptor = this.method(value);
                //if desc is wrong - return
                if (!propertyDescriptor) {
                    return;
                }
                //store desc to class descriptor
                correctDescriptor.methods[name] = propertyDescriptor;
                //define class property
                core.method(cls.prototype, name, object.defaults(propertyDescriptor, {
                    $parent: cls.$parent.prototype,
                    wrap: false
                }));
            }, this);
            return correctDescriptor;
        }
    };
    var preprocessors = {
        prepare: function (name, descriptor, createdFn) {
            if (!type.isString(name)) {
                throw 'class name must be string';
            }
            //check descriptor
            if (type.isFunction(descriptor)) {
                descriptor = descriptor();
            }
            //default descriptor to empty object
            type.isObject(descriptor) || (descriptor = {});
            //default namespace to null if not string
            var namespace = type.isString(descriptor.namespace) ? descriptor.namespace : null;
            //evaluate class name according to given namespace
            name = classes.getName.call({$namespace: namespace}, name);

            //default descriptor to object
            type.isObject(descriptor) || (descriptor = {});

            //default constructor to emptyFn if not function
            type.isFunction(descriptor.constructor) || (descriptor.constructor = emptyFn);

            //default constructor default to empty array if not array
            type.isArray(descriptor.default) || (descriptor.default = []);

            var cls = classes.get(name);
            var parent;

            if (type.isString(descriptor.extend)) {
                var parentName = classes.getName.call({$namespace: namespace}, descriptor.extend);
                parent = classes.get(parentName) || Base;
            } else {
                parent = Base;
            }

            //return prepared data
            return {
                name: name,
                class: cls,
                parent: parent,
                namespace: namespace,
                descriptor: descriptor,
                createdFn: type.isFunction(createdFn) ? createdFn : emptyFn
            }
        },
        extend: function (cls, parent) {
            //cls from parent
            core.extend(cls, parent);
        },
        describe: function (parent, descriptor) {
            //combine class descriptor with inherited descriptor
            var inherits = parent.getDescriptor();

            //own descriptor
            var owned = {};
            //const
            owned.const = type.isObject(descriptor.const) ? descriptor.const : {};
            //static properties and methods
            owned.static = {};
            type.isObject(descriptor.static) || (descriptor.static = {});
            owned.static.properties = type.isObject(descriptor.static.properties) ? descriptor.static.properties : {};
            owned.static.methods = type.isObject(descriptor.static.methods) ? descriptor.static.methods : {};
            //public properties and methods
            owned.properties = type.isObject(descriptor.properties) ? descriptor.properties : {};
            owned.methods = type.isObject(descriptor.methods) ? descriptor.methods : {};

            //const: defaulted from inherits
            descriptor.const = object.defaults(owned.const, inherits.const);
            //static properties and methods
            descriptor.static = {};
            descriptor.static.properties = object.defaults(owned.static.properties, inherits.static.properties);
            descriptor.static.methods = object.defaults(owned.static.methods, inherits.static.methods);
            //public properties and methods
            descriptor.properties = object.defaults(owned.properties, inherits.properties);
            descriptor.methods = object.defaults(owned.methods, inherits.methods);
        },
        singleton: function (cls, description) {
            //return cls if not singleton
            if (object.hasKey(description, 'singleton') && description.singleton) {
                //update description - move methods and properties to static
                if (description.properties) {
                    description.static.properties = object.defaults(description.static.properties, description.properties);
                    description.properties = {};
                }
                if (description.methods) {
                    description.static.methods = object.defaults(description.static.methods, description.methods);
                    description.methods = {};
                }
                return function () {
                };
            } else {
                return cls;
            }
        },
        require: function (cls, descriptor) {

        },
        mixin: function (cls, descriptor) {

        },
        configure: function (cls, description) {
            //apply real descriptor and return it in processed variant
            return desc.apply(cls, description);
        }
    };
    var postprocessors = {

    };
    /**
     * type-related functions
     * @type {}
     */
    var type = {
        get: function (value) {
            var type = typeof value;
            if (value == null) {
                type = 'null';
            } else if (Array.isArray(value)) {
                type = 'array';
            } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
                type = 'number';
            }
            return type;
        },
        isPrimitive: function (value) {
            var valueType = type.get(value);
            return valueType !== 'object' && valueType !== 'array';
        },
        isObject: function (value) {
            return type.get(value) == 'object';
        },
        isArray: function (value) {
            return Array.isArray(value);
        },
        isFunction: function (value) {
            return typeof value == 'function';
        },
        isString: function (value) {
            return typeof value == 'string';
        },
        isNumber: function (value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },
        isNull: function (value) {
            return value == null;
        },
        isDefined: function (value) {
            return typeof value != 'undefined';
        },
        isBoolean: function (value) {
            return typeof value == 'boolean';
        },
        isEmpty: function (value) {
            var type = this.typeOf(value);
            if (type == 'object') {
                return !object.keys(value).length;
            } else if (type == 'array') {
                return !value.length;
            } else if (type == 'string') {
                return !value.trim();
            } else if (type == 'number') {
                return value == 0;
            } else {
                return type != 'function' && type != 'boolean';
            }
        }
    };
    /**
     * implement Base class (all classes extend it)
     * @constructor
     */
    var Base = function () {
    };
    //set class basics
    //basic consts
    core.const(Base, '$name', 'Base');
    core.const(Base, '$namespace', null);
    //set basic methods
    core.method(Base, 'getClassName', {value: classes.getName});
    core.method(Base, 'getDescriptor', {value: function () {
        return {
            const: {
                $isClass: true
            },
            static: {
                properties: {},
                methods: {
                }
            },
            properties: {},
            methods: {
            }
        };
    }});
    //inheritance
    core.method(Base, 'isParent', {value: classes.isParent});
    core.method(Base, 'isChild', {value: classes.isChild});

    /**
     * framework-related base implementations
     * @type {}
     */
    var framework = {
        defined: function (name) {
            return classes.has(name);
        },
        define: function (name, description, createdFn) {
            //prepare class data
            var data = preprocessors.prepare(name, description, createdFn);
            description = data.descriptor;
            createdFn = data.createdFn;
            var parent = data.parent;
            //return class if exists
            if (data.class) {
                //call createdFn
                createdFn.call(data.class);
                return data.class;
            }

            //proto object, containing constructor
            var proto = {};
            //class descriptor
            var descriptor;
            //static privates
            var privates = {};

            //create class object
            var cls = function Class() {
                //no all operations in native class constructor, preventing downcall usage
                if (!this.$class || this.$class === cls) {
                    //instance privates
                    var privates = {};
                    //parent method
                    core.method(this, 'parent', {value: classes.parent});
                    //private setter/getter
                    core.method(this, '__get', {value: function (name) {
                        return privates[name]
                    }});
                    core.method(this, '__set', {value: function (name, value) {
                        privates[name] = value;
                    }});
                    //class reference
                    core.const(this, '$class', cls);
                    //apply properties to object
                    object.each(descriptor.properties, function (propertyDescriptor, name) {
                        core.property(this, name, propertyDescriptor);
                        object.hasKey(propertyDescriptor, 'default') && (this[name] = propertyDescriptor.default);
                    }, this);
                }
                //apply constructor
                proto.constructor.apply(this, arguments);
            };

            //convert description to full description
            preprocessors.describe(parent, description);

            //singleton implementation
            cls = preprocessors.singleton(cls, description);


            core.method(cls, 'getDescriptor', {value: function () {
                return descriptor;
            }});
            //static getter/setter
            core.method(cls, '__get', {value: function (name) {
                return privates[name]
            }});
            core.method(cls, '__set', {value: function (name, value) {
                privates[name] = value;
            }});

            //extend
            preprocessors.extend(cls, parent);

            //requires
            preprocessors.require(cls, data);
            //mixins
            preprocessors.mixin(cls, data);
            //properties configuration
            descriptor = preprocessors.configure(cls, description);

            //set class basics
            //basic consts
            core.const(cls, '$name', data.name);
            core.const(cls, '$namespace', data.namespace);
            //basic methods
            core.method(cls, 'getClassName', {value: classes.getName});
            //inheritance
            core.method(cls, 'parent', {value: classes.parent});
            core.method(cls, 'isParent', {value: classes.isParent});
            core.method(cls, 'isChild', {value: classes.isChild});

            //proto constructor
            core.method(proto, 'constructor', {
                value: description.constructor,
                default: description.default,
                $parent: cls.$parent.prototype,
                wrap: true
            });
            core.method(cls, '$factory', {
                value: core.factory(cls)
            });

            //save class in namespace
            classes.set(root, data.name, cls);

            //call createdFn after class created
            createdFn.call(cls);

            //return created class
            return cls;
        },
        /**
         * create class instance
         * @param name
         * @param properties
         */
        create: function (name) {
            if (!classes.has(name)) {
                throw 'class "' + name + '" doesn\'t exist';
            }
            var cls = classes.get(name);
            //call factory
            var instance = cls.$factory.apply(null, slice(arguments, 1));
            return instance;
        }
    };

    //define framework class
    framework.define(ns, {
        singleton: true,
        properties: {
            emptyFn: emptyFn
        },
        methods: {
            defined: framework.defined,
            define: framework.define,
            create: framework.create,
            typeOf: type.get,
            isObject: type.isObject,
            isArray: type.isArray,
            isFunction: type.isFunction,
            isPrimitive: type.isPrimitive,
            isString: type.isString,
            isNumber: type.isNumber,
            isNull: type.isNull,
            isDefined: type.isDefined,
            isBoolean: type.isBoolean,
            isEmpty: type.isEmpty,
            keys: set.keys,
            values: set.values,
            hasKey: set.hasKey,
            has: set.has,
            keyOf: set.keyOf,
            lastKeyOf: set.lastKeyOf,
            size: set.size,
            each: set.each,
            eachReverse: set.eachReverse,
            map: set.map,
            reduce: set.reduce,
            reduceRight: set.reduceRight,
            filter: set.filter,
            filterLast: set.filterLast,
            filterAll: set.filterAll,
            find: set.find,
            findLast: set.findLast,
            findAll: set.findAll,
            every: set.every,
            some: set.some,
            first: set.first,
            last: set.last,
            shift: set.shift,
            pop: set.pop,
            remove: set.remove,
            removeLast: set.removeLast,
            removeAll: set.removeAll,
            clone: set.clone,
            pick: set.pick,
            omit: set.omit,
            defaults: set.defaults,
            extend: object.extend,
            toQueryObjects: object.toQueryObjects,
            toQueryString: object.toQueryString,
            urlAppend: string.urlAppend,
            compact: array.compact,
            union: array.union,
            intersection: array.intersection,
            difference: array.difference,
            uniques: array.uniques,
            range: array.range,
            bind: fn.bind,
            prefill: fn.prefill,
            once: fn.once,
            wrap: fn.wrap,
            nextTick: fn.nextTick
        }
    });

    //return framework
    return root[ns];
})(window, 'xs');