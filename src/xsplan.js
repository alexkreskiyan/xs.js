var fn = function () {
};
var root = this;
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
                } else if (xs.isObject(descriptor) && xs.isFunction(descriptor.fn)) {
                    desc.value = descriptor.fn;
                    xs.isObject(descriptor.defaults) && (desc.defaults = descriptor.defaults);
                    //otherwise - return false
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
        }
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
        isObject: fn,
        define: function (className, data, createdFn) {
            var me = this;
            if (!me.isString(className)) {
                throw 'className must be string';
            }
            //default data ot object
            me.isObject(data) || (data = {});

            //prepare class data
            var constructor = data.constructor ? data.constructor : emptyFn,
                defaults = me.isObject(data.defaults) ? data.defaults : {},
                descriptor,
                cls,
                parent,
                description;

            cls = function () {
                //apply properties to object
                collection.each(descriptor.properties, function (property, name) {
                    core.define(this, name, property.descriptor);
                    this[name] = property.value;
                }, this);
                //apply constructor
                constructor.apply(this, object.defaults(object.values(arguments), defaults));
            };

            //set class basic constants
            core.const(cls, '$namespace', me.isString(namespace) ? namespace : null);

            //set basic methods
            core.method(cls, 'getClassName', {value: classes.getName});

            //evaluate className according to given namespace
            className = cls.getClassName(className);
            //if class already exists - return it, else - set it
            if (classes.has(className)) {
                return classes.get(className);
            } else {
                classes.set(root, className, cls);
            }

            //extend class from parent
            //determine parent class
            if (this.isString(data.extend)) {
                parent = classes.get(cls.getClassName(data.extend));
            } else {
                parent = Base;
            }

            //extend. completes only extend mechanism. all other definitions - later
            core.extend(cls, parent);
            //requires mechanism
            //mixins mechanism
            //properties

            //apply descriptor
            description = {};
            //const
            description.const = this.isObject(data.const) ? data.const : {};
            //static properties and methods
            description.static = {};
            description.static.properties = this.isObject(data.static.properties) ? data.static.properties : {};
            description.static.methods = this.isObject(data.static.methods) ? data.static.methods : {};
            //public properties and methods
            description.properties = this.isObject(data.properties) ? data.properties : {};
            description.methods = this.isObject(data.methods) ? data.methods : {};
            //apply description and save returned descriptor
            descriptor = core.descriptor.apply(cls, description);


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
        }
    }
}





















