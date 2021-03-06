'use strict';

var log = new xs.log.Logger('xs.core.ContractsManager');

var assert = new xs.core.Asserter(log, XsCoreContractsManagerError);

/**
 * xs.core.ContractsManager is core class, that is used to manage created contracts
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.core.ContractsManager
 *
 * @alternateClassName xs.ContractsManager
 *
 * @singleton
 */
xs.ContractsManager = (function () {
    var me = {};

    /**
     * Store of all registered contracts
     *
     * @private
     *
     * @property registry
     *
     * @type {xs.core.Collection}
     */
    var registry = new xs.core.Collection();

    /**
     * Checks whether contract with given name is already defined by ContractsManager
     *
     * For example:
     *
     *     console.log(xs.ContractsManager.has('xs.myClass')); // false
     *
     * @method has
     *
     * @param {String} name verified name
     *
     * @return {Boolean} verification result
     */
    me.has = function (name) {

        //assert, that name is valid string
        assert.fullName(name, 'has - given name `$name` is not valid', {
            $name: name
        });

        return registry.hasKey(name);
    };

    /**
     * Returns contract from registry by name, or undefined if no contract registered
     *
     * For example:
     *
     *      xs.ContractsManager.get('xs.myClass');
     *
     * @method get
     *
     * @param {String} name contract name
     *
     * @return {Function|undefined} contract by name or undefined
     */
    me.get = function (name) {

        //assert, that name is valid string
        assert.fullName(name, 'get - given name `$name` is not valid', {
            $name: name
        });

        return registry.at(name);
    };

    /**
     * Registers contract in registry with given name. If contract with given name is already defined - respective
     * error is thrown. Internally:
     *
     * - label is assigned for contract
     * - namespace is created if not defined
     * - contract is saved in namespace
     * - contract is saved in registry with name
     *
     * For example:
     *
     *     var Class = xs.Class(function() {
     *         return {};
     *     });
     *     xs.ContractsManager.add('xs.myClass', Class);
     *
     * @method add
     *
     * @param {String} name new contract name
     * @param {Function} Contract registered contract
     */
    var add = me.add = function (name, Contract) {

        //assert, that name is valid string
        assert.fullName(name, 'add - given name `$name` is not valid', {
            $name: name
        });

        //assert that Contract is function or object
        assert.ok(xs.isObject(Contract) || xs.isFunction(Contract), 'add - contract is nor a function, neither an object');

        //assert no contract with that name was defined yet
        assert.not(registry.hasKey(name), 'add - contract `$name` is already defined', {
            $name: name
        });

        //assert that Contract is not registered in manager yet
        assert.not(registry.has(Contract), 'add - contract `$label` can not be added as `$name`', {
            $label: Contract.label,
            $name: name
        });


        //assign real name as label
        Contract.label = name;

        //set to string methods
        Contract.toString = function () {
            return '[' + this.contractor.label + (this.label ? ' ' + this.label : '') + ']';
        };

        if (xs.isFunction(Contract)) {
            Contract.prototype.toString = function () {
                return '[' + this.constructor.contractor.label + (this.constructor.label ? ' ' + this.constructor.label : '') + ' instance]';
            };
        }

        //get short name of Contract
        var label = getName(name);

        //get Contract namespace by path
        var namespace = getNamespace(window, getPath(name));

        //save Contract to namespace
        namespace[ label ] = Contract;

        //save Contract to registry
        registry.add(name, Contract);
    };

    /**
     * Removes contract, registered with given name from registry. If contract with given name is not defined - respective
     * error is thrown. Internally:
     *
     * - label is removed for contract
     * - namespace is created if not defined
     * - contract is saved in namespace
     * - contract is saved in registry with name
     *
     * For example:
     *
     *     //unset Class
     *     xs.ContractsManager.remove('xs.myClass');
     *
     * @method remove
     *
     * @param {String} name name of unset Contract
     */
    me.remove = function (name) {
        //assert contract with that name is defined
        assert.ok(registry.hasKey(name), 'remove - contract `$name` is not defined', {
            $name: name
        });

        //unset Contract label
        delete registry.at(name).label;

        //get short name of Contract
        var label = getName(name);

        //get path of Contract
        var path = getPath(name);

        //get Contract namespace by path
        var namespace = getNamespace(window, path);

        //unset Contract from namespace
        delete namespace[ label ];

        //clean namespace
        cleanNamespace(window, path);

        //remove Contract from registry
        registry.removeAt(name);
    };

    /**
     * Creates contract via relative constructor. After that, when preprocessors
     * stack is processed, saves created contract in internal registry with given name. If contract with that name is already defined,
     * respective error is ln.
     *
     * For example:
     *
     *     //define simple class
     *     xs.define(xs.Class, 'myClass', function (self, imports) {
     *         //here is Class descriptor returned
     *         return {
     *         };
     *     }, function(Class) {
     *         console.log('class', Class, 'created');
     *     );
     *
     * @method define
     *
     * @param {Function} contractor contractor, that is used
     * @param {String} name name of created contract
     * @param {Function} descFn descriptor function. Is called with 2 params:
     *
     * - self. Created contract instance
     * - imports. namespace object, where imported references are placed
     *
     * @param {Function} createdFn contract creation callback. Is called after
     * preprocessors stack is processed. When called, created contract is passed as param
     *
     * @return {Function} created Contract
     */
    me.define = function (contractor, name, descFn, createdFn) {

        //assert, that name is valid string
        assert.fullName(name, 'define - given name `$name` is not valid', {
            $name: name
        });

        //assert no contract with that name was defined yet
        assert.not(registry.hasKey(name), 'define - contract `$name` is already defined', {
            $name: name
        });

        //create Contract and start it's processing
        var Contract = contractor(descFn, createdFn);

        //here contract namespace is evaluated. Evaluate real name of contract
        name = Contract.descriptor.resolveName(name);

        //save Contract in registry by name
        add(name, Contract);

        return Contract;
    };

    /**
     * Returns short name of by full name
     *
     * For example:
     *
     *     xs.ContractsManager.getName('xs.module.my.Class'); //Class
     *
     * @private
     *
     * @method getName
     *
     * @param {String} name full name
     *
     * @return {String} short name
     */
    var getName = me.getName = function (name) {

        //assert, that name is valid string
        assert.fullName(name, 'getName - given name `$name` is not valid', {
            $name: name
        });

        return name.split('.').slice(-1).join('.');
    };

    /**
     * Returns path by full name
     *
     * For example:
     *
     *     xs.ContractsManager.getPath('xs.module.my.Class'); //xs.module.my
     *
     * @private
     *
     * @method getPath
     *
     * @param {String} name full name
     *
     * @return {String} path
     */
    var getPath = me.getPath = function (name) {

        //assert, that name is valid string
        assert.fullName(name, 'getPath - given name `$name` is not valid', {
            $name: name
        });

        return name.split('.').slice(0, -1).join('.');
    };

    /**
     * Returns namespace in root by given full name. If any part does not exist, it is created
     *
     * For example:
     *
     *     var namespace = xs.ContractsManager.getNamespace(window, 'xs.module.my'); //returns window.xs.module.my reference
     *
     * @private
     *
     * @method getNamespace
     *
     * @param {Object|Function} root namespace relative root
     * @param {String} path relative path to root
     *
     * @return {Object|Function} namespace for given path
     */
    var getNamespace = me.getNamespace = function (root, path) {

        //assert, that root is object
        assert.object(root, 'getNamespace - given root `$root` is not an object', {
            $root: root
        });

        //use root if no path
        if (path === '') {
            return root;
        }

        //assert, that path is empty string or valid name
        assert.fullName(path, 'getNamespace - given name `$name` is not valid', {
            $name: path
        });

        //explode name to parts
        var parts = path.split('.');

        //get first path's part
        var part = parts.shift();

        //create namespace if missing
        if (!xs.isFunction(root[ part ]) && !xs.isObject(root[ part ])) {
            root[ part ] = {};
        }

        //process down or return
        if (parts.length) {

            return getNamespace(root[ part ], parts.join('.'));
        }

        return root[ part ];
    };

    /**
     * Clears all empty namespaces from namespace, specified by name down to given root
     *
     * For example:
     *
     *     cleanNamespace(window, 'xs.module.my');
     *
     * @ignore
     *
     * @method cleanNamespace
     *
     * @param {Object|Function} root namespace relative root
     * @param {String} path relative path to root
     */
    var cleanNamespace = function (root, path) {
        //return if path is empty
        if (!path) {
            return;
        }

        //explode name to parts
        var parts = path.split('.');

        //get last path's part
        var part = parts.pop();

        //set path to parent
        path = parts.join('.');

        //get parent namespace
        var namespace = getNamespace(root, path);

        //remove namespace if empty
        if (xs.isEmpty(namespace[ part ])) {

            //remove empty namespace
            delete namespace[ part ];

            //try to clean parent
            cleanNamespace(root, path);
        }
    };

    return me;
})();

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsCoreContractsManagerError
 */
function XsCoreContractsManagerError(message) {
    this.message = 'xs.core.ContractsManager::' + message;
}

XsCoreContractsManagerError.prototype = new Error();

xs.apply(xs, {
    define: xs.ContractsManager.define
});