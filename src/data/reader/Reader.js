/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */

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

    Class.implements = ['ns.IReader'];

    Class.abstract = true;

});