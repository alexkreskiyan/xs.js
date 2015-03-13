'use strict';

var log = new xs.log.Logger('xs.class.postprocessors.asserter');

/**
 * This postprocessor automatically creates and saves asserter instance for this class as Class.assert
 *
 * This is made to automatically create asserter instances, that use Class.label as category.
 *
 * Later, asserter can be accessed via self.assert
 *
 * @member xs.class.postprocessors
 *
 * @private
 *
 * @abstract
 *
 * @property asserter
 */
xs.class.postprocessors.add('asserter', function () {

    return true;
}, function (Class) {
    log.trace(Class.label);

    var label = Class.label ? Class.label : '';
    eval('Class.Error = function ' + getErrorClassName(label) + '(message) { this.message = \'' + label + '::\' + message; }');

    Class.Error.prototype = new Error();

    //assign asserter instance
    Class.assert = new xs.core.Asserter(Class.log, Class.Error);
});

function getErrorClassName(label) {
    if (!label) {

        return 'Error';
    }

    var parts = label.split('.');

    var name = '';
    parts.forEach(function (part) {
        name += part[0].toUpperCase() + part.slice(1);
    });

    return name + 'Error';
}