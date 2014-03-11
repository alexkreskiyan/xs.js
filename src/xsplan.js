var fn = function () {
};
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
        shuffle: fn
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
                configurable: false,
                enumerable: true
            })
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
        /**
         * determines whether given value is property descriptor
         * returns true when it is object and contains only some of 6 descriptor-relative properties
         */
        isPropertyDescriptor: fn,
        define: function (className, data, namespace, createdFn) {
            /**
             * supported sections:
             *  - extend: specifies parent class
             *  - constructor: constructor function
             *  - defaults: constructor defaults
             *  - requires: specifies required classes
             *  - mixins: specifies class mixins
             *  - elements
             */
                //default data ot object
            this.isObject(data) || (data = {});

            //prepare class data
            var constructor = data.constructor ? data.constructor : emptyFn;
            var defaults = this.isObject(data.defaults) ? data.defaults : {};
            var descriptor = {
                const: {},
                static: {
                    properties: {},
                    methods: {}
                },
                properties: {},
                methods: {}
            };

            var cls = function () {
                //apply properties to object
                collection.each(descriptor.properties, function (property, name) {
                    core.define(this, name, property.descriptor);
                    this[name] = property.value;
                }, this);
                //apply constructor
                constructor.apply(this, object.defaults(object.values(arguments), defaults));
            };
            //set namespace
            this.isString(namespace) || (namespace = null);
            cls.$namespace = namespace;

            //save classes.getName as cls.getClassName
            cls.getClassName = classes.getName;
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
            var parent;
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

            //fill descriptor
            //const
            if (this.isObject(data.const)) {
                collection.each(data.const, function (value, name) {
                    core.const(cls, name, value);
                    //TODO stopped here
                }, this);
                descriptor.const
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
        }
    }
}





















