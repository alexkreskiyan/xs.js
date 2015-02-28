/**
 * xs.data.reader.JSON is reader, that processes JSON string into JS natives
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.data.writer.JSON
 *
 * @extends xs.data.writer.Writer
 */
xs.define(xs.Class, 'ns.JSON', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data.writer';

    Class.extends = 'ns.Writer';

    Class.constructor = function (config) {
    };

    Class.method.write = function (data) {
        return JSON.stringify(data);
    };

});