/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

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
    xs.ContractsManager = new (function () {
        var me = this;

        /**
         * Store of all registered contracts
         *
         * @private
         *
         * @property registry
         *
         * @type {xs.core.Collection}
         */
        var registry = new xs.core.Collection;

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
        var _has = me.has = function (name) {

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
         *
         * @throws {Error} Error is thrown, when:
         *
         * - contract with given name is already registered
         * - contract is not function
         */
        var _add = me.add = function (name, Contract) {
            //throw error if trying to set defined
            if (_has(name)) {
                throw new ContractsManagerError('contract "' + name + '" is already defined');
            }

            //throw error if trying to add already added with other name
            if (registry.has(Contract)) {
                throw new ContractsManagerError('contract "' + Contract.label + '" can not be added as "' + name + '"');
            }

            //throw error if Contract is not function
            if (!xs.isFunction(Contract)) {
                throw new ContractsManagerError('contract "' + name + '" is not a function');
            }

            //assign real name as label
            Contract.label = name;

            //get short name of Contract
            var label = _getName(name);

            //get Contract namespace by path
            var namespace = _namespace(root, _getPath(name));

            //save Contract to namespace
            namespace[label] = Contract;

            //save Contract to registry
            registry.add(name, Contract);

            //sync namespaces
            _syncNamespaces(namespace, 'add', label);
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
         *
         * @throws {Error} Error is thrown, when:
         *
         * - contract with given name is not registered
         */
        me.remove = function (name) {
            //throw error if trying to unset undefined
            if (!_has(name)) {
                throw new ContractsManagerError('contract "' + name + '" is not defined');
            }

            //unset Contract label
            delete registry.at(name).label;

            //get short name of Contract
            var label = _getName(name);

            //get path of Contract
            var path = _getPath(name);

            //get Contract namespace by path
            var namespace = _namespace(root, path);

            //sync namespaces
            _syncNamespaces(namespace, 'remove', label);

            //unset Contract from namespace
            delete namespace[label];

            //clean namespace
            _cleanNamespace(root, path);

            //remove Contract from registry
            registry.removeAt(name);
        };

        /**
         * Creates contract via relative constructor. After that, when preprocessors
         * stack is processed, saves created contract in internal registry with given name. If contract with that name is already defined,
         * respective error is thrown.
         *
         * For example:
         *
         *     //define simple class
         *     xs.define(xs.Class, 'myClass', function (self, ns) {
         *         //here is Class descriptor returned
         *         return {
         *         };
         *     }, function(Class) {
         *         console.log('class', Class, 'created');
         *     );
         *
         * @method define
         *
         * @param {Function} Contractor contractor, that is used
         * @param {String} name name of created contract
         * @param {Function} descFn descriptor function. Is called with 2 params:
         *
         * - self. Created contract instance
         * - ns. namespace object, where namespace references are placed
         *
         * @param {Function} createdFn contract creation callback. Is called after
         * preprocessors stack is processed. When called, created contract is passed as param
         *
         * @return {Function} created Contract
         *
         * @throws {Error} Error is thrown, when:
         *
         * - contract with given name is already registered
         */
        me.define = function (Contractor, name, descFn, createdFn) {
            //create Contract and start it's processing
            var Contract = Contractor(descFn, createdFn);

            //here contract namespace is evaluated. Evaluate real name of contract
            name = Contract.descriptor.resolveName(name);

            //throw error if trying to redefine
            if (_has(name)) {
                throw new ContractsManagerError('contract "' + name + '" is already defined');
            }

            //save Contract in registry by name
            _add(name, Contract);

            return Contract;
        };

        /**
         * Returns short name of contract by full name
         *
         * For example:
         *
         *     _getName('xs.module.my.Class'); //Class
         *
         * @ignore
         *
         * @method getName
         *
         * @param {String} name contract name
         *
         * @return {String} short name
         */
        var _getName = function (name) {

            return name.split('.').slice(-1).join('.');
        };

        /**
         * Returns contract path by full name
         *
         * For example:
         *
         *     _getPath('xs.module.my.Class'); //xs.module.my
         *
         * @ignore
         *
         * @method getPath
         *
         * @param {String} name contract name
         *
         * @return {String} contract path
         */
        var _getPath = function (name) {

            return name.split('.').slice(0, -1).join('.');
        };

        /**
         * Returns namespace in root by given full name. If any part does not exist, it is created
         *
         * For example:
         *
         *     var namespace = _namespace(window, 'xs.module.my'); //returns window.xs.module.my reference
         *
         * @ignore
         *
         * @method namespace
         *
         * @param {Object|Function} root namespace relative root
         * @param {String} path relative path to root
         *
         * @return {Object|Function} namespace for given path
         */
        var _namespace = function (root, path) {
            //use root if no path
            if (!path) {
                return root;
            }

            //explode name to parts
            var parts = path.split('.');

            //get first path's part
            var part = parts.shift();

            //create namespace if missing
            if (!xs.isFunction(root[part]) && !xs.isObject(root[part])) {
                root[part] = {};
            }

            //process down or return
            if (parts.length) {

                return _namespace(root[part], parts.join('.'));
            }

            return root[part];
        };

        /**
         * Clears all empty namespaces from namespace, specified by name down to given root
         *
         * For example:
         *
         *     _cleanNamespace(window, 'xs.module.my');
         *
         * @ignore
         *
         * @method cleanNamespace
         *
         * @param {Object|Function} root namespace relative root
         * @param {String} path relative path to root
         */
        var _cleanNamespace = function (root, path) {
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
            var namespace = _namespace(root, path);

            //remove namespace if empty
            if (xs.isEmpty(namespace[part])) {

                //remove empty namespace
                delete namespace[part];

                //try to clean parent
                _cleanNamespace(root, path);
            }
        };

        /**
         * Updates internal namespaces of all contracts, registered in namespace
         *
         * For example:
         *
         *     _syncNamespaces(window, 'add', 'Demo');
         *
         * @ignore
         *
         * @method syncNamespaces
         *
         * @param {Object|Function} namespace synchronized namespace
         * @param {String} operation operation name
         * @param {String} name name of changed contract
         */
        var _syncNamespaces = function (namespace, operation, name) {
            var contracts = new xs.core.Collection(namespace).find(function (value) {
                return xs.isFunction(value) && xs.isObject(value.namespace);
            }, xs.core.Collection.ALL);
            var changedContract = contracts.at(name);

            //add new contract to all namespaces
            if (operation == 'add') {
                //add all contracts to new contract' namespace
                contracts.each(function (Contract, name) {
                    changedContract.namespace[name] = Contract;
                });

                //add new contract to all namespaces
                contracts.each(function (Contract) {
                    Contract.namespace[name] = contracts.at(name);
                });
            } else if (operation == 'remove') {
                //empty old contract' namespace
                Object.keys(changedContract.namespace).forEach(function (key) {
                    delete changedContract.namespace[key];
                });

                //remove old contract from all namespaces
                contracts.each(function (Contract) {
                    delete Contract.namespace[name];
                });
            }
        };
    });

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class ContractsManagerError
     */
    function ContractsManagerError(message) {
        this.message = 'xs.core.ContractsManager::' + message;
    }

    ContractsManagerError.prototype = new Error();

    xs.extend(xs, {
        define: xs.ContractsManager.define
    });
})(window, 'xs');