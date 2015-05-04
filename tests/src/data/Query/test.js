/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.data.Query', function () {

    'use strict';

    test('simple', function () {

        var query = (new xs.data.Query([
            {
                x: 1,
                a: 2
            },
            {
                x: 2,
                a: 5
            },
            {
                x: 2,
                a: 3
            },
            {
                x: 3,
                a: 4
            }
        ]))
            .where(function (item) {
                return item.x > 1;
            })
            .group(function (item) {
                return {
                    x: item.x,
                    y: item.a % 2
                };
            }, 'group', function (item) {
                return {
                    x1: item.x,
                    x2: item.a
                };
            })
            .sort(function (a, b) {
                return a.group.size < b.group.size;
            })
            .select(function (item) {
                return {
                    x1: item.x,
                    y1: item.y,
                    items: item.group
                };
            });

        query.execute();
        console.log(query.values());

    });

    test('constructor', function () {
        var queryLeft = new xs.data.Query([
            {
                x: 1
            },
            {
                x: 2
            },
            {
                x: 3
            },
            {
                x: 4
            },
            {
                x: 5
            }
        ]);

        var queryRight = new xs.data.Query([
            {
                x: 1,
                a: 2
            },
            {
                x: 2,
                a: 5
            },
            {
                x: 2,
                a: 3
            },
            {
                x: 3,
                a: 4
            }
        ]);

        queryLeft.select(function (item) {
            return {
                x: item.x,
                y: item.x * 2 - 1
            };
        });

        queryRight.select(function (item) {
            return {
                x: item.x,
                b: item.a
            };
        });

        var query = queryLeft
            .outerJoin(queryRight, function (left, right) {
                return left.x === right.x;
            })
            .where(function (item) {
                return item.x > 1;
            })
            .group(function (item) {
                return item.x;
            }, 'items', function (item) {
                return item;
            })
            .sort(function (a, b) {
                return a < b;
            });
        //query.execute();
    });

});