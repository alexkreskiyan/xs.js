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
 Resolvers are used internally by Deferreds and Promises to capture and notify
 callbacks, process callback return values and propagate resolution or rejection
 to chained Resolvers.

 Developers never directly interact with a Resolver.

 A Resolver captures a pair of optional onResolved and onRejected callbacks and
 has an associated Promise. That Promise delegates its then() calls to the
 Resolver's then() method, which creates a new Resolver and schedules its
 delayed addition as a chained Resolver.

 Each Deferred has an associated Resolver. A Deferred delegates resolve() and
 reject() calls to that Resolver's resolve() and reject() methods. The Resolver
 processes the resolution value and rejection reason, and propagates the
 processed resolution value or rejection reason to any chained Resolvers it may
 have created in response to then() calls. Once a chained Resolver has been
 notified, it is cleared out of the set of chained Resolvers and will not be
 notified again.
 @private
 */

xs.define('xs.promise.Resolver', {
    constructor: function (onResolved, onRejected, onProgress) {
        //create promise object
        this.promise = xs.create('xs.promise.Promise', this);
        //prepare callbacks
        this.onResolved = onResolved;
        this.onRejected = xs.isFunction(onRejected) ? onRejected : function (error) {
            throw error;
        };
        this.onProgress = onProgress;
        //set pendingResolvers value
        this.pendingResolvers = [];

    },
    properties:  {
        /**
         * resolver promise
         * @param {xs.promise.Promise}
         */
        promise:          undefined,
        pendingResolvers: [],
        processed:        false,
        completed:        false,
        completionAction: null,
        completionValue:  null,
        onResolved:       xs.emptyFn,
        onRejected:       xs.emptyFn,
        onProgress:       xs.emptyFn
    },
    methods:     {
        /**
         * private method to execute action in resolvers
         */
        propagate:        function () {
            this.pendingResolvers.forEach(function (resolver) {
                resolver[this.completionAction](this.completionValue);
            }, this);
            this.pendingResolvers = [];
        },
        /**
         * private function to schedule resolver
         * @param pendingResolver
         */
        schedule:         function (pendingResolver) {
            this.pendingResolvers.push(pendingResolver);
            this.completed && this.propagate();
        },
        /**
         * internal function to complete pending resolver
         * @param action
         * @param value
         */
        complete:         function (action, value) {
            this.onResolved = this.onRejected = this.onProgress = null;
            this.completionAction = action;
            this.completionValue = value;
            this.completed = true;
            this.propagate();
        },
        /**
         * shortcut function to complete resolved
         * @param value
         */
        completeResolved: function (value) {
            this.complete('resolve', value);
        },
        /**
         * shortcut function to complete rejected
         * @param reason
         */
        completeRejected: function (reason) {
            this.complete('reject', reason);
        },
        /**
         * processes callback with given value
         * @param callback
         * @param value
         */
        process:          function (callback, value) {
            this.processed = true;
            try {
                if (xs.isFunction(callback)) {
                    value = callback(value);
                }
                if (value && xs.isFunction(value.then)) {
                    value.then(this.completeResolved, this.completeRejected);
                } else {
                    this.completeResolved(value);
                }
            } catch (error) {
                this.completeRejected(error);
            }
        },
        /**
         * Resolves this Resolver with the specified value, triggering it to execute the 'onResolved' callback and propagate the resulting resolution value or rejection reason to Resolvers that originate from this Resolver.
         * @param {*} value The resolved future value.
         */
        resolve:          function (value) {
            if (!this.processed) {
                this.process(this.onResolved, value);
            }
        },
        /**
         * Rejects this Resolver with the specified reason, triggering it to execute the 'onRejected' callback and propagate the resulting resolution value or rejection reason to Resolvers that originate from this Resolver.
         * @param {Error} reason The rejection reason.
         */
        reject:           function (reason) {
            if (!this.processed) {
                this.process(this.onRejected, reason);
            }
        },
        /**
         * Updates progress for this Resolver, if it is still pending, triggering it to execute the 'onProgress' callback and propagate the resulting transformed progress value to Resolvers that originate from this Resolver.
         * @param {*} progress The progress value.
         */
        progress:         function (progress) {
            var pendingResolver, index;
            if (this.completed) {
                return;
            }
            if (xs.isFunction(this.onProgress)) {
                progress = this.onProgress(progress);
            }
            for (index = 0; index < this.pendingResolvers.length; index++) {
                pendingResolver = this.pendingResolvers[index];
                pendingResolver.progress(progress);
            }
        },
        /**
         * Schedules creation of a new Resolver that originates from this Resolver, configured with the specified callbacks.  Those callbacks can subsequently transform the value that was resolved or the reason that was rejected.
         * Each call to then() returns a new Promise of that transformed value; i.e., a Promise that is resolved with the callback return value or rejected with any error thrown by the callback.
         * @param {Function} onResolved Callback function to be called when resolved.
         * @param {Function} onRejected Callback function to be called when rejected.
         * @param {Function} onProgress Callback function to be called with progress updates.
         * @return {xs.promise.Promise} A Promise of the transformed future value.
         */
        then:             function (onResolved, onRejected, onProgress) {
            var me = this;
            if (!xs.isFunction(onResolved) && !xs.isFunction(onRejected) && !xs.isFunction(onProgress)) {
                return me.promise;
            }
            var pendingResolver = xs.create('xs.promise.Resolver', onResolved, onRejected, onProgress);
            xs.nextTick(function () {
                me.schedule(pendingResolver);
            });
            return pendingResolver.promise;
        }
    }
});