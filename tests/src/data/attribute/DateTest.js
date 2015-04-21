/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.data.attribute.Date', function () {

    'use strict';

    test('constructor', function () {
        //config is required
        throws(function () {
            return new xs.data.attribute.Date();
        });

        //config must be an object
        throws(function () {
            return new xs.data.attribute.Date(null);
        });

        //attribute default value must be a generator if given
        throws(function () {
            return new xs.data.attribute.Date({
                default: new Date()
            });
        });
    });

    test('get', function () {
        var attribute = new xs.data.attribute.Date({});

        var date = new Date();

        var format = xs.data.attribute.Format;


        //xs.data.attribute.Format.Raw
        //get returns value as is
        strictEqual(attribute.get(date, format.Raw), date);


        //xs.data.attribute.Format.Storage
        //get returns value as timestamp
        strictEqual(attribute.get(date, format.Storage), date.valueOf());


        //xs.data.attribute.Format.User
        //get returns value as is without options.format
        strictEqual(attribute.get(date, format.User, {}), date);

        //options.format must be a string
        throws(function () {
            return attribute.get(date, format.User, {
                format: null
            });
        });

        //get returns value as string, when format given
        strictEqual(attribute.get(date, format.User, {
            format: 'Y'
        }), String(date.getFullYear()));

    });

    test('set', function () {
        //init test variables
        var attribute, date;
        var raw = new Date();

        attribute = new xs.data.attribute.Date({});

        //Date instance
        date = attribute.set(raw);
        strictEqual(date, raw);

        //numeric value
        date = attribute.set(1);
        strictEqual(date.valueOf(), 1);

        //string value
        date = attribute.set('10.07.2015');
        strictEqual(date.getDate(), 7);
        strictEqual(date.getMonth(), 9);
        strictEqual(date.getFullYear(), 2015);

        //undefined value
        //attribute without default value
        date = (new xs.data.attribute.Date({})).set();
        strictEqual(date, undefined);

        //attribute with default generated value
        date = (new xs.data.attribute.Date({
            default: xs.generator(function () {

                return raw;
            })
        })).set();
        strictEqual(date, raw);

        //other value - throws
        throws(function () {
            attribute.set(null);
        });
    });

    test('format', function () {
        var attribute = new xs.data.attribute.Date({});
        var User = xs.data.attribute.Format.User;

        //day, leading zero
        strictEqual(attribute.get(new Date(2015, 0, 1, 2, 3, 4, 5), User, {
            format: 'd'
        }), '01');
        strictEqual(attribute.get(new Date(2015, 0, 13, 2, 3, 4, 5), User, {
            format: 'd'
        }), '13');

        //month, leading zero, 01-12
        strictEqual(attribute.get(new Date(2015, 0, 1, 2, 3, 4, 5), User, {
            format: 'm'
        }), '01');
        strictEqual(attribute.get(new Date(2015, 9, 1, 2, 3, 4, 5), User, {
            format: 'm'
        }), '10');

        //year, 4 digits
        strictEqual(attribute.get(new Date(2015, 0, 1, 2, 3, 4, 5), User, {
            format: 'Y'
        }), '2015');

        //day num, 1-Monday, 7-Sunday
        //sunday
        strictEqual(attribute.get(new Date(2015, 0, 4, 2, 3, 4, 5), User, {
            format: 'N'
        }), '7');
        //monday
        strictEqual(attribute.get(new Date(2015, 9, 5, 2, 3, 4, 5), User, {
            format: 'N'
        }), '1');

        //day num, 0-Sunday, 6-Saturday
        //sunday
        strictEqual(attribute.get(new Date(2015, 0, 4, 2, 3, 4, 5), User, {
            format: 'W'
        }), '0');
        //monday
        strictEqual(attribute.get(new Date(2015, 9, 5, 2, 3, 4, 5), User, {
            format: 'W'
        }), '1');

        //am/pm
        strictEqual(attribute.get(new Date(2015, 0, 1, 0, 3, 4, 5), User, {
            format: 'a'
        }), 'am');
        strictEqual(attribute.get(new Date(2015, 9, 1, 11, 3, 4, 5), User, {
            format: 'a'
        }), 'am');
        strictEqual(attribute.get(new Date(2015, 0, 1, 12, 3, 4, 5), User, {
            format: 'a'
        }), 'pm');
        strictEqual(attribute.get(new Date(2015, 9, 1, 23, 3, 4, 5), User, {
            format: 'a'
        }), 'pm');

        //AM/PM
        strictEqual(attribute.get(new Date(2015, 0, 1, 0, 3, 4, 5), User, {
            format: 'A'
        }), 'AM');
        strictEqual(attribute.get(new Date(2015, 9, 1, 11, 3, 4, 5), User, {
            format: 'A'
        }), 'AM');
        strictEqual(attribute.get(new Date(2015, 0, 1, 12, 3, 4, 5), User, {
            format: 'A'
        }), 'PM');
        strictEqual(attribute.get(new Date(2015, 9, 1, 23, 3, 4, 5), User, {
            format: 'A'
        }), 'PM');

        //01-12 hour
        strictEqual(attribute.get(new Date(2015, 0, 1, 0, 3, 4, 5), User, {
            format: 'G'
        }), '12');
        strictEqual(attribute.get(new Date(2015, 0, 1, 1, 3, 4, 5), User, {
            format: 'G'
        }), '01');
        strictEqual(attribute.get(new Date(2015, 9, 1, 11, 3, 4, 5), User, {
            format: 'G'
        }), '11');
        strictEqual(attribute.get(new Date(2015, 0, 1, 12, 3, 4, 5), User, {
            format: 'G'
        }), '12');
        strictEqual(attribute.get(new Date(2015, 0, 1, 13, 3, 4, 5), User, {
            format: 'G'
        }), '01');
        strictEqual(attribute.get(new Date(2015, 9, 1, 23, 3, 4, 5), User, {
            format: 'G'
        }), '11');

        //00-23 hour
        strictEqual(attribute.get(new Date(2015, 0, 1, 0, 3, 4, 5), User, {
            format: 'H'
        }), '00');
        strictEqual(attribute.get(new Date(2015, 0, 1, 1, 3, 4, 5), User, {
            format: 'H'
        }), '01');
        strictEqual(attribute.get(new Date(2015, 9, 1, 11, 3, 4, 5), User, {
            format: 'H'
        }), '11');
        strictEqual(attribute.get(new Date(2015, 0, 1, 12, 3, 4, 5), User, {
            format: 'H'
        }), '12');
        strictEqual(attribute.get(new Date(2015, 0, 1, 13, 3, 4, 5), User, {
            format: 'H'
        }), '13');
        strictEqual(attribute.get(new Date(2015, 9, 1, 23, 3, 4, 5), User, {
            format: 'H'
        }), '23');

        //00-59 minute
        strictEqual(attribute.get(new Date(2015, 0, 1, 2, 3, 4, 5), User, {
            format: 'i'
        }), '03');
        strictEqual(attribute.get(new Date(2015, 0, 1, 2, 30, 4, 5), User, {
            format: 'i'
        }), '30');

        //00-59 second
        strictEqual(attribute.get(new Date(2015, 0, 1, 2, 3, 4, 5), User, {
            format: 's'
        }), '04');
        strictEqual(attribute.get(new Date(2015, 0, 1, 2, 3, 40, 5), User, {
            format: 's'
        }), '40');

        //000-999 millisecond
        strictEqual(attribute.get(new Date(2015, 0, 1, 2, 3, 4, 5), User, {
            format: 'u'
        }), '005');
        strictEqual(attribute.get(new Date(2015, 0, 1, 2, 3, 4, 50), User, {
            format: 'u'
        }), '050');
        strictEqual(attribute.get(new Date(2015, 0, 1, 2, 3, 4, 500), User, {
            format: 'u'
        }), '500');

    });

});