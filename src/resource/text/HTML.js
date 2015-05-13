/**
 * HTML resource bae class
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.resource.text.HTML
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.text.HTML', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.resource';

    Class.implements = [ 'xs.resource.IResource' ];

    Class.constructor = function (config) {
        var me = this;

        //assert, that config is an object
        self.assert.object(config, 'constructor - given config `$config` is not an object', {
            $config: config
        });

        //handle preloaded resource case
        if (config.hasOwnProperty('data')) {

            //assert, that data is a string
            self.assert.string(config.data, 'constructor - given data `$data` is not a string', {
                $data: config.data
            });

            //save data to private
            me.private.data = parseTemplate(config.data);

            return;
        }

        //assert, that url is given
        self.assert.ok(config.hasOwnProperty('url'), 'constructor - no url given');

        //assert, that url is a string
        self.assert.string(config.url, 'constructor - given url `$url` is not a string', {
            $url: config.url
        });

        //save url to private
        me.private.url = config.url;
    };

    Class.property.data = {
        set: xs.noop
    };

    Class.property.isLoaded = {
        get: function () {
            //resource is loaded when data is filled
            return xs.isDefined(this.private.data);
        },
        set: xs.noop
    };

    Class.method.load = function () {
        var me = this;

        if (me.isLoaded) {
            var promise = new xs.core.Promise();

            xs.nextTick(function () {
                promise.resolve(me.private.data);
            });

            return promise;
        }

        //return request promise
        return request(me.private.url).then(function (data) {
            me.private.data = parseTemplate(data);

            return me.private.data;
        });
    };

    /**
     * Returns template parsed into an element
     *
     * @ignore
     *
     * @private
     *
     * @method parseTemplate
     *
     * @param {String} template
     *
     * @return {Element} root of parsed template
     */
    var parseTemplate = function (template) {

        //create container div element to parse html into
        var container = document.createElement('div');

        //set template as div innerHTML
        container.innerHTML = template;

        //assert, that template has single root
        self.assert.equal(container.childNodes.length, 1, 'parseTemplate - template must contain single root element');

        //assert, that template root is element
        self.assert.ok(container.firstChild instanceof Element, 'parseTemplate - template root must be an Element');

        //get root
        var root = container.lastChild;

        //remove root from container
        container.removeChild(root);

        //return root
        return root;
    };

    var request = function (url) {

        self.assert.string(url, 'request - given url `$url` is not a string', {
            $url: url
        });

        var promise = new xs.core.Promise();

        var xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);

        xhr.onload = function () {
            promise.resolve(xhr.responseText);
        };

        xhr.onerror = function () {
            promise.reject(xhr);
        };

        xhr.send();

        return promise;
    };

});