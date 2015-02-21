/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */

/**
 * xs.data.reader.JSON is reader, that processes JSON string into JS natives
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.data.reader.JSON
 *
 * @extends xs.data.reader.Reader
 */
xs.define(xs.Class, 'ns.JSON', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data.reader';

    Class.extends = 'ns.Reader';

    Class.constructor = function (config) {
    };

    Class.method.read = function (raw) {
        self.assert.string(raw, 'read - given raw data `$raw` is not a string', {
            $raw: raw
        });

        return JSON.parse(raw);
    };

});