/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */

/**
 * Writer is base xs.data subsystem element. It's task is combinating native data into format, that proxy can pass to data provider
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.data.writer.Writer
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Writer', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data.writer';

    Class.implements = ['ns.IWriter'];

    Class.abstract = true;

});