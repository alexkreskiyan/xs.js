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
/**
 Promises represent a future value; i.e., a value that may not yet be available.

 A Promise's then() method is used to specify onFulfilled and onRejected
 callbacks that will be notified when the future value becomes available. Those
 callbacks can subsequently transform the value that was resolved or the reason
 that was rejected. Each call to then() returns a new Promise of that
 transformed value; i.e., a Promise that is resolved with the callback return
 value or rejected with any error thrown by the callback.

 In it's most basic and common form, a method will create and return a Promise like this:

 // A method in a service class which uses a Store and returns a Promise
 loadCompanies: function() {
      var deferred = xs.create('xs.promise.Deferred');

      this.companyStore.load({

        callback: function(records, operation, success) {
          if (success) {
            deferred.resolve(records);
          } else {
            deferred.reject("Error loading Companies.");
          }
        }

      });

      return deferred.promise;
    }

 You can see this method first creates a Deferred object. It then returns a Promise object for
 use by the caller. Finally, in the asynchronous callback, it resolves the Deferred object if
 the call was successful, and rejects the Deferred if the call failed.

 The method which calls the above code and works with the returned Promise might look like:

 // Using a Promise returned by another object.
 loadCompanies: function() {

      this.companyService.loadCompanies().then({
        success: function(records) {
          // Do something with result.
        },
        failure: function(error) {
          // Do something on failure.
        }
      }).always(function() {
        // Do something whether call succeeded or failed
      });

    }

 The calling code uses the Promise returned from the companyService.loadCompanies() method and
 uses then() to attach success and failure handlers. Finally, an always() method call is chained
 onto the returned Promise. This specifies a callback function that will run whether the underlying
 call succeeded or failed.
 */

xs.define('xs.promise.Promise', {
    requires: ['xs.promise.Resolver'],
    statics: {
        /**
         * Returns a new Promise that:
         *
         * * resolves immediately for the specified value, or
         * * resolves or rejects when the specified {@link xs.promise.Promise Promise} (or third-party Promise or then()-able) is resolved or rejected.
         *
         * @param {*} promiseOrValue A Promise (or third-party Promise or then()-able) or value.
         * @return {xs.promise.Promise} A Promise of the specified Promise or value.
         */
        when: function (promiseOrValue) {
            var deferred;
            deferred = xs.create('xs.promise.Deferred');
            deferred.resolve(promiseOrValue);
            return deferred.promise;
        },
        /**
         * Determines whether the specified value is a Promise (including third-party untrusted Promises or then()-ables), based on the Promises/A specification feature test.
         *
         * @param {*[]/xs.promise.Promise[]/xs.promise.Promise} value A potential Promise.
         * @return {Boolean} A Boolean indicating whether the specified value was a Promise.
         */
        isPromise: function (value) {
            return (value && xs.isFunction(value.then)) === true;
        }
    },
    constructor: function (resolver) {
        this.resolver = resolver;
    },
    properties: {
        resolver: null
    },
    methods: {
        rethrowError: function (error) {
            xs.nextTick(function () {
                throw error;
            });
        },
        /**
         * Attaches callbacks that will be notified when this Promise's future value becomes available. Those callbacks can subsequently transform the value that was resolved or the reason that was rejected.
         *
         * Each call to then() returns a new Promise of that transformed value; i.e., a Promise that is resolved with the callback return value or rejected with any error thrown by the callback.
         *
         * @param {Function} onFulfilled Callback function to be called when resolved.
         * @param {Function} onRejected Callback function to be called when rejected.
         * @param {Function} onProgress Callback function to be called with progress updates.
         * @param {Object} scope Optional scope for the callback(s).
         * @return {xs.promise.Promise} A Promise of the transformed future value.
         */
        then: function (onResolved, onRejected, onProgress, scope) {
            if (arguments.length === 1 && xs.isObject(arguments[0])) {
                var hash = arguments[0];
                onResolved = hash.success;
                onRejected = hash.failure;
                onProgress = hash.progress;
                scope = hash.scope;
            }
            if (scope != null) {
                xs.isFunction(onResolved) && (onResolved = xs.bind(onResolved, scope));
                xs.isFunction(onRejected) && (onRejected = xs.bind(onRejected, scope));
                xs.isFunction(onProgress) && (onProgress = xs.bind(onProgress, scope));
            }
            return this.resolver.then(onResolved, onRejected, onProgress);
        },
        /**
         * Attaches a callback that will be called if this Promise is rejected. The callbacks can subsequently transform the reason that was rejected.
         *
         * Each call to otherwise() returns a new Promise of that transformed value; i.e., a Promise that is resolved with the callback return value or rejected with any error thrown by the callback.
         *
         * @param {Function} onRejected Callback function to be called when rejected.
         * @param {Object} scope Optional scope for the callback.
         * @return {xs.promise.Promise} A Promise of the transformed future value.
         */
        otherwise: function (onRejected, scope) {
            if (arguments.length === 1 && xs.isObject(arguments[0])) {
                var hash = arguments[0];
                onRejected = hash.fn;
                scope = hash.scope;
            }
            if (scope != null) {
                onRejected = xs.bind(onRejected, scope);
            }
            return this.resolver.then(null, onRejected);
        },
        /**
         * Attaches a callback to this {xs.promise.Promise} that will be called when it resolves or rejects. Similar to "finally" in "try..catch..finally".
         *
         * @param {Function} onCompleted Callback function to be called when resolved or rejected.
         * @param {Object} scope Optional scope for the callback.
         * @return {xs.promise.Promise} A new "pass-through" Promise that resolves with the original value or rejects with the original reason.
         */
        always: function (onCompleted, scope) {
            if (arguments.length === 1 && xs.isObject(arguments[0])) {
                var hash = arguments[0];
                onCompleted = hash.fn;
                scope = hash.scope;
            }
            if (scope != null) {
                onCompleted = xs.bind(onCompleted, scope);
            }
            var me = this;
            return me.resolver.then(function (value) {
                try {
                    onCompleted();
                } catch (error) {
                    me.rethrowError(error);
                }
                return value;
            }, function (reason) {
                try {
                    onCompleted();
                } catch (error) {
                    me.rethrowError(error);
                }
                throw reason;
            });
        },
        /**
         * Terminates a {xs.promise.Promise} chain, ensuring that unhandled rejections will be thrown as Errors.
         */
        done: function () {
            this.resolver.then(null, this.rethrowError);
        },
        /**
         * Cancels this {xs.promise.Promise} if it is still pending, triggering a rejection with a CancellationError that will propagate to any Promises originating from this Promise.
         */
        cancel: function (reason) {
            if (reason == null) {
                reason = null;
            }
            this.resolver.reject(new Error(reason));
        }
    }
});