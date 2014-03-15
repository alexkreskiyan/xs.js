var fn = function () {
};
var root = this;
'use strict';
var xs = {
    //base prototypes
    ArrayPrototype: Array.prototype,
    //quick fn references
    slice: ArrayPrototype.slice,
    //native functions implementations - no need
    //Base class
    Base: fn,
    //basic implementations
    //collection
    collection: {
        /**
         * returns all collection keys
         */
        keys: fn,
        /**
         * return all collection values
         */
        values: fn,
        /**
         * whether element in collection
         */
        has: fn,
        /**
         * evaluate size of collection
         */
        size: fn,
        /**
         * iterates over collection
         */
        each: fn,
        /**
         * produces a new collection with elements, returned by iterator function
         * if source was array - array is created
         * if source was object - object is created
         */
        map: fn,
        /**
         * find one element, that passes given test function
         */
        find: fn,
        /**
         * find all elements, that passes given test funciton
         */
        findAll: fn,
        /**
         * return collection item, that suites where clause
         */
        filter: fn,
        /**
         * return collection items, that suite where clause
         */
        filterAll: fn
    },
    //object
    object: {
        /**
         * fetch object keys
         */
        keys: fn,
        /**
         * fetch object values
         */
        values: fn,
        /**
         * copies all properties in source objects to destination object
         */
        extend: fn,
        /**
         * return copy of object, filtered to only have whitelisted keys
         */
        pick: fn,
        /**
         * return copy of object, filtered to have all but blacklisted keys
         */
        omit: fn,
        /**
         * return object, with undefined or unexistent properties defaulted to given by defaults objects
         */
        defaults: fn,
        /**
         * return shallow-cloned object copy
         */
        clone: fn
    },
    //function
    function: {
        /**
         * prefills function's arguments
         */
        prefill: fn,
        /**
         * creates function, being called once
         */
        once: fn,
        /**
         * wraps function
         */
        wrap: fn
    },
    //array
    array: {
        first: fn,
        last: fn,
        /**
         * returns array, filtered not to have falsy values
         */
        compact: fn,
        shuffle: fn,
        union: fn,
        intersection: fn,
        difference: fn,
        uniques: fn
    },
    /**
     * core functions: extend, define, const, etc
     */
    core: {
        /**
         * Extend core function
         * @param parent
         * @returns {}
         */
        extend: function (child, parent) {
            var F = new Function();
            F.prototype = parent.prototype;
            child.prototype = new F();
            child.prototype.constructor = child;
            //save reference to parent.prototype
            child.super = parent.prototype;
        },
        defined: function (object, key) {
            return !!(object.hasOwnProperty(key));
        },
        define: function (object, key, descriptor) {
            return descriptor ? Object.defineProperty(object, key, descriptor) : Object.defineProperties(object, key);
        },
        const: function (object, name, value) {
            this.defined(object, name) || this.define(object, name, {
                value: value,
                writable: false,
                enumerable: true,
                configurable: false
            })
        },
        property: function (object, name, descriptor) {
            this.defined(object, name) || this.define(object, name, object.defaults({
                writable: true,
                enumerable: true,
                configurable: false
            }, descriptor))
        },
        method: function (object, name, descriptor) {
            this.defined(object, name) || this.define(object, name, object.defaults({
                writable: false,
                enumerable: true,
                configurable: false
            }, descriptor))
        }
    },
    descriptor: {
        /**
         * determines whether given value is property descriptor
         * returns true when it is object and contains only some of 6 descriptor-relative properties
         */
        is: function (descriptor) {
            //false if descriptor is not object
            if (!xs.isObject(descriptor)) {
                return false;
            }
            //only allowed descriptor keys
            var allowed = ['get', 'set', 'value', 'writable', 'enumerable', 'configurable'];
            //real descriptor keys
            var keys = object.keys(descriptor);
            //if any other fields - is not descriptor
            if (array.difference(keys, allowed).length) {
                return false;
            }
            //check allowed fields are filled correctly
            if (descriptor.get && !xs.isFunction(descriptor.get)) {
                return false;
            }
            if (descriptor.set && !xs.isFunction(descriptor.set)) {
                return false;
            }
            if (descriptor.writable && !xs.isBoolean(descriptor.writable)) {
                return false;
            }
            if (descriptor.enumerable && !xs.isBoolean(descriptor.enumerable)) {
                return false;
            }
            if (descriptor.configurable && !xs.isBoolean(descriptor.configurable)) {
                return false;
            }
            return true;
        },
        property: function (descriptor) {
            //process descriptor
            var desc = this.is(descriptor) ? descriptor : {value: descriptor};
            //if accessors given - remove value
            if (desc.get || desc.set) {
                delete desc.value;
            } else {
                desc.value = xs.isUndefined(desc.value) ? undefined : desc.value;
            }
            return desc;
        },
        method: function (descriptor) {
            //process descriptor
            var desc = {
                value: null,
                defaults: {}
            };
            //process given descriptor. if something wrong - returns false
            //simple function allowed
            if (xs.isFunction(descriptor)) {
                desc.value = descriptor;
                //allowed as object with fn property, containing method function
            } else if (xs.isObject(descriptor)) {
                //function may be specified in fn or value propeties
                if (xs.isFunction(descriptor.fn)) {
                    desc.value = descriptor.fn;
                } else if (xs.isFunction(descriptor.value)) {
                    desc.value = descriptor.value;
                } else {
                    return false;
                }
                xs.isObject(descriptor.defaults) && (desc.defaults = descriptor.defaults);
                //else  - return false
            } else {
                return false;
            }
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
            collection.each(descriptor.const, function (value, name) {
                //save const to class descriptor
                correctDescriptor.const[name] = value;
                core.const(cls, name, value);
            });
            //public static properties
            collection.each(descriptor.static.properties, function (value, name) {
                //parse value as property descriptor
                var propertyDescriptor = this.property(value);
                //store desc to class descriptor
                correctDescriptor.static.properties[name] = propertyDescriptor;
                //define class property
                core.property(cls, name, propertyDescriptor);
            });
            //public static methods
            collection.each(descriptor.static.methods, function (value, name) {
                //parse value as method descriptor
                var propertyDescriptor = this.method(value);
                //if desc is wrong - return
                if (!propertyDescriptor) {
                    return;
                }
                //store desc to class descriptor
                correctDescriptor.static.methods[name] = propertyDescriptor;
                //define class property
                core.method(cls, name, propertyDescriptor);
            });
            //public properties
            collection.each(descriptor.properties, function (value, name) {
                //parse value as property descriptor
                var propertyDescriptor = core.descriptor.property(value);
                //store desc to class descriptor
                correctDescriptor.static.properties[name] = propertyDescriptor;
                //instance properties are defined in constructor
            });
            //public methods
            collection.each(descriptor.methods, function (value, name) {
                //parse value as method descriptor
                var propertyDescriptor = this.method(value);
                //if desc is wrong - return
                if (!propertyDescriptor) {
                    return;
                }
                //store desc to class descriptor
                correctDescriptor.methods[name] = propertyDescriptor;
                //define class property
                core.method(cls.prototype, name, propertyDescriptor);
            });
        }
    },
    preprocessors: {
        prepare: function (name, descriptor, createdFn) {
            if (!xs.isString(name)) {
                throw 'class name must be string';
            }
            //default namespace to null if not string
            var namespace = xs.isString(descriptor.namespace) ? descriptor.namespace : null;
            //evaluate class name according to given namespace
            name = classes.getName.call({$namespace: namespace}, name);

            //default descriptor to object
            xs.isObject(descriptor) || (descriptor = {});

            //default constructor to emptyFn if not function
            xs.isFunction(descriptor.constructor) || (descriptor.constructor = emptyFn);

            //default constructor default to empty array if not array
            xs.isArray(descriptor.defaults) || (descriptor.defaults = []);

            //return prepared data
            return {
                name: name,
                class: classes.has(name) ? classes.get(name) : false,
                namespace: namespace,
                descriptor: descriptor,
                createdFn: xs.isFunction(createdFn) ? createdFn : emptyFn
            }
        },
        extend: function (cls, descriptor) {
            var parent;
            //determine parent class
            if (xs.isString(descriptor.extend)) {
                parent = classes.get(cls.getClassName(descriptor.extend));
            } else {
                parent = Base;
            }
            //cls from parent
            core.extend(cls, parent);
            return parent;
        },
        require: function (cls, descriptor) {

        },
        mixin: function (cls, descriptor) {

        },
        configure: function (cls, parent, descriptor) {
            //combinate class descriptor
            //inherited descriptor
            var inherits = parent.getDescriptor();

            //own descriptor
            var owned = {};
            //const
            owned.const = this.isObject(descriptor.const) ? descriptor.const : {};
            //static properties and methods
            owned.static = {};
            owned.static.properties = this.isObject(descriptor.static.properties) ? descriptor.static.properties : {};
            owned.static.methods = this.isObject(descriptor.static.methods) ? descriptor.static.methods : {};
            //public properties and methods
            owned.properties = this.isObject(descriptor.properties) ? descriptor.properties : {};
            owned.methods = this.isObject(descriptor.methods) ? descriptor.methods : {};

            //real class descriptor applies owned properties defaulted to inherits
            var real = {};
            //const: defaulted from inherits
            real.const = object.defaults(owned.const, inherits.const);
            //static properties and methods
            real.static = {};
            real.static.properties = object.defaults(owned.static.properties, inherits.static.properties);
            real.static.methods = object.defaults(owned.static.methods, inherits.static.methods);
            //public properties and methods
            real.properties = object.defaults(owned.properties, inherits.properties);
            real.methods = object.defaults(owned.methods, inherits.methods);

            //apply real descriptor and return it in processed variant
            return core.descriptor.apply(cls, real);
        }
    },
    postprocessors: {

    },
    //framework-related base implementations
    framework: {
        isObject: fn,
        isArray: fn,
        isFunction: fn,
        isString: fn,
        isNumber: fn,
        isNull: fn,
        isUndefined: fn,
        isBoolean: fn,
        isEmpty: fn,
        define: function (name, description, createdFn) {
            var me = this;
            //prepare class data
            var data = preprocessors.prepare(name, description, createdFn);
            //return class if exists
            if (data.class) {
                return data.class;
            }
            var constructor = data.constructor,
                defaults = data.defaults,
            //class real descriptor
                descriptor;

            //create class object
            var cls = function () {
                //apply properties to object
                collection.each(descriptor.properties, function (property, name) {
                    core.define(this, name, property.descriptor);
                    this[name] = property.value;
                }, this);
                //apply constructor
                constructor.apply(this, object.defaults(object.values(arguments), defaults));
            };

            //set class basic constants
            core.const(cls, '$namespace', data.namespace);

            //set basic methods
            core.method(cls, 'getClassName', {value: classes.getName});
            core.method(cls, 'getDescriptor', {value: function () {
                return descriptor;
            }});

            //extend
            var parent = preprocessors.extend(cls, data.descriptor);
            //requires
            preprocessors.require(cls, data);
            //mixins
            preprocessors.mixin(cls, data);
            //properties configuration
            descriptor = preprocessors.configure(cls, parent, data.descriptor);

            //save class in namespace
            classes.set(root, data.name, cls);

            //call createdFn after class created
            this.isFunction(createdFn) && createdFn.call(cls);
        }
    }
}

/**
 * properties definition
 * 1. scope, type
 * 2. storage mechanism
 * 3. value preparing
 * 4. wrapping
 * 5. accessors
 * 6. inheritance mechanism
 * 7. writable
 * 8. enumerable
 * 9. configurable
 */
/**
 * 1. constant
 * 2. is saved as class property
 * 3. no preparing, is saved as is
 * 4. no wrapping
 * 5. no accessors
 * 6. class has __descriptor.constants hash, storing name:value pairs.
 *    when extending is extracted from parent class and applied to child
 * 7. false
 * 8. true
 * 9. false
 */
/**
 * 1. static property
 * 2. is saved as class property
 * 3. if identified as descriptor:
 *       if has accessors - they will be applied,
 *       if has value - value is applied, else - undefined
 *       writable, configurable and enumerable are omitted
 *    else
 *       stored as is
 * 4. no wrapping
 * 5. no accessors
 * 6. class has __descriptor.static.properties hash, storing name:value pairs.
 *    when extending is extracted from parent class and applied to child
 * 7. true
 * 8. true
 * 9. false
 */
/**
 * 1. static method
 * 2. is saved as class property
 * 3. is saved, if is method, otherwise is omitted
 * 4. no wrapping
 * 5. no accessors
 * 6. class has __descrpiptor.static.methods hash, storing name:value pairs.
 *    when extending is extracted from parent class and applied to child
 * 7. false
 * 8. true,
 * 9. false
 */
/**
 * 1. property
 * 2. is saved as instance property before constructor is called
 * 3. if identified as descriptor:
 *       if has accessors - they will be applied,
 *       if has value - value is applied, else - undefined
 *       writable, configurable and enumerable are omitted
 *    else
 *       stored as is
 * 4. no wrapping
 * 5. no accessors
 * 6. class has __descriptor.properties hash, storing name:value pairs.
 *    when extending is extracted from parent class and applied to child
 * 7. true
 * 8. true
 * 9. false
 */
/**
 * 1. method
 * 2. is saved as instance property before constructor is called
 * 3. is saved, if is method, otherwise is omitted
 * 4. no wrapping
 * 5. no accessors
 * 6. class has __descriptor.methods hash, storing name:value pairs.
 *    when extending is extracted from parent class and applied to child
 * 7. false
 * 8. true
 * 9. false
 */




















