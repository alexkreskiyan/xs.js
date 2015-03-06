'use strict';

var log = new xs.log.Logger('xs.reactive.Reactive');

var assert = new xs.core.Asserter(log, ReactiveError);

var Reactive = module.Reactive = function () {
    throw new ReactiveError('constructor - abstract class');
};

Reactive.prototype.listen = function (listener) {
    console.log('add listener', listener);
};

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class ReactiveError
 */
function ReactiveError(message) {
    this.message = 'xs.reactive.Reactive::' + message;
}

ReactiveError.prototype = new Error();