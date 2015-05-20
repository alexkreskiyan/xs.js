/**
 * xs.storage.CookieStorage is a singleton, that provides access to browser's cookie storage
 *
 * @author
 *
 * @private
 *
 * @singleton
 *
 * @class xs.storage.CookieStorage
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.CookieStorage', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.storage';

    Class.imports = [
        {
            'event.AddBefore': 'ns.event.AddBefore'
        },
        {
            'event.Add': 'ns.event.Add'
        },
        {
            'event.SetBefore': 'ns.event.SetBefore'
        },
        {
            'event.Set': 'ns.event.Set'
        },
        {
            'event.RemoveBefore': 'ns.event.RemoveBefore'
        },
        {
            'event.Remove': 'ns.event.Remove'
        },
        {
            'event.Clear': 'ns.event.Clear'
        }
    ];

    Class.mixins.observable = 'xs.event.StaticObservable';

    Class.abstract = true;



});