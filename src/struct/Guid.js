'use strict';

//define xs.core
xs.getNamespace(xs, 'struct');

var log = new xs.log.Logger('xs.struct.Guid');

var assert = new xs.core.Asserter(log, XsStructGuidError);

var guidRe = /^([0-9A-Fa-f]{8})-([0-9A-Fa-f]{4})-([0-9A-Fa-f]{4})-([0-9A-Fa-f]{4})-([0-9A-Fa-f]{12})$/;

var maxValue = Math.pow(2, 128) - 1;

/**
 * xs.struct.Guid is an xs framework struct, representing GUID structure
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class xs.struct.Guid
 *
 *
 *
 * @constructor
 *
 * xs.struct.Guid constructor
 *
 * @param {String/Number} [guid] collection source
 */
var Guid = xs.struct.Guid = function (guid) {
    var me = this;

    me.private = {};
    me.private.value = new Array(32);

    var i = 0;
    var item;

    //assert, that given guid is either string or number
    assert.ok(!arguments.length || xs.isString(guid) || xs.isNumber(guid), 'constructor - given guid `$guid` is not a string or number', {
        $guid: guid
    });

    //parse string guid
    if (xs.isString(guid)) {
        //try to parse guid
        var sourceGuid = guidRe.exec(guid);

        assert.ok(sourceGuid, 'constructor - given guid string `$guid` is not a valid guid', {
            $guid: guid
        });

        var rawGuid = sourceGuid.slice(1).join('');

        //parse into internal view
        for (i = 0; i < 32; i++) {
            me.private.value[ i ] = parseInt(rawGuid[ i ], 16);
        }

        //parse number guid
    } else if (xs.isNumber(guid)) {
        //assert, that guid value is in bounds
        assert.ok(guid >= 0 && guid <= maxValue, 'constructor - given guid number `$guid` exceeds bounds [$min;$max]', {
            $guid: guid,
            $min: 0,
            $max: maxValue
        });

        //assert, that guid is decimal
        assert.ok(Math.round(guid) === guid, 'constructor - given guid `$guid` is not decimal', {
            $guid: guid
        });

        for (i = 0; i < 32; i++) {
            item = guid % 16;
            guid = (guid - item) / 16;
            me.private.value[ i ] = item;
        }

        //generate GUID
    } else {
        for (i = 0; i < 32; i++) {
            me.private.value[ i ] = Math.floor(Math.random() * 16);
        }
    }
};

Guid.prototype.toString = function () {
    var me = this;

    if (me.private.hex) {
        return me.private.hex;
    }

    var hex = new Array(32);

    for (var i = 0; i < 32; i++) {
        hex[ i ] = me.private.value[i].toString(16).toUpperCase();
    }

    me.private.hex = [
        hex.slice(0, 8).join(''),
        hex.slice(8, 12).join(''),
        hex.slice(12, 16).join(''),
        hex.slice(16, 20).join(''),
        hex.slice(20, 32).join('')
    ].join('-');

    return me.private.hex;
};

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsStructGuidError
 */
function XsStructGuidError(message) {
    this.message = 'xs.struct.Guid::' + message;
}

XsStructGuidError.prototype = new Error();