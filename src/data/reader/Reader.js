/**
 * Reader is base xs.data subsystem element. It's task is reading raw encrypted data into natives
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.data.reader.Reader
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Reader', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data.reader';

    Class.implements = [ 'ns.IReader' ];

    Class.abstract = true;

});