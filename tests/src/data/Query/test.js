/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.data.Query', function () {

    'use strict';

    test('constructor', function () {
        var query, source;

        //source is required
        throws(function () {
            return new xs.data.Query();
        });

        //source must be an iterable
        throws(function () {
            return new xs.data.Query(null);
        });

        //given array is converted to xs.core.Collection
        query = new xs.data.Query([
            1
        ]);
        strictEqual(query.private.source instanceof xs.core.Lazy, true);
        source = query.private.source.get();
        strictEqual(source instanceof xs.core.Collection, true);
        strictEqual(source.size, 1);

        //given object is converted to xs.core.Collection
        query = new xs.data.Query({
            a: 1
        });
        strictEqual(query.private.source instanceof xs.core.Lazy, true);
        source = query.private.source.get();
        strictEqual(source instanceof xs.core.Collection, true);
        strictEqual(source.size, 1);

        //given xs.core.Collection is left as is
        source = new xs.core.Collection([
            1
        ]);
        query = new xs.data.Query(source);
        strictEqual(query.private.source instanceof xs.core.Lazy, true);
        strictEqual(query.private.source.get(), source);
    });

    test('execute', function () {
        var query, source;

        //source is lazy evaluated on first execution
        //query source is executed
        //empty stack results in use source's data as-is (items are copied)
        //isExecuted flag is set up
        source = new xs.data.Query([
            1,
            2,
            3
        ]);

        //create query from query source
        query = new xs.data.Query(source);
        strictEqual(query.private.source instanceof xs.core.Lazy, true);
        strictEqual(source.isExecuted, false);
        strictEqual(source.size, 0);
        strictEqual(query.isExecuted, false);
        strictEqual(query.size, 0);

        //execute
        query.execute();
        strictEqual(query.private.source, source);
        strictEqual(source.isExecuted, true);
        strictEqual(source.values().toString(), '1,2,3');
        strictEqual(query.isExecuted, true);
        strictEqual(query.values().toString(), '1,2,3');
    });

    test('select', function () {
        var query, source;

        source = new xs.core.Collection([
            1,
            2,
            3
        ]);

        //create query from query source
        query = new xs.data.Query(source);

        //set selection
        query.select(function (item) {
            return {
                x: item,
                sqr: item * item
            };
        });

        //execute and verify
        query.execute();
        strictEqual(query.isExecuted, true);
        strictEqual(JSON.stringify(query.values()), '[{"x":1,"sqr":1},{"x":2,"sqr":4},{"x":3,"sqr":9}]');
    });

    test('where', function () {
        var query, source;

        source = new xs.core.Collection([
            1,
            2,
            3
        ]);

        //create query from query source
        query = new xs.data.Query(source);

        //selector must be a function
        throws(function () {
            query.where({
                a: 1
            });
        });

        //set where clause
        query.where(function (item) {
            return item > 1;
        });

        //execute and verify
        query.execute();
        strictEqual(query.isExecuted, true);
        strictEqual(query.values().toString(), '2,3');
    });

    test('group', function () {
        var query, source;

        source = new xs.core.Collection([
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

        //create query from query source
        query = new xs.data.Query(source);

        //grouper must be a function
        throws(function () {
            query.group({
                a: 1
            });
        });

        //simply grouper goes ok (without options)
        query.group(function (item) {
            return item > 1;
        });

        //options must be an object
        throws(function () {
            query.group(function (item) {
                return item > 1;
            }, []);
        });

        //normal case
        query.group(function (item) {
            return item > 1;
        }, {});


        //without options
        query = new xs.data.Query(source);
        query.group(function (item) {
            return item.x;
        });
        query.execute();

        strictEqual(query.size, 3);
        strictEqual(Object.keys(query.at(0)).toString(), 'key,group');
        strictEqual(query.at(0).key, 1);
        strictEqual(query.at(0).group instanceof xs.core.Collection, true);
        strictEqual(query.at(0).group.size, 1);
        strictEqual(query.at(0).group.at(0), source.at(0));
        strictEqual(query.at(1).key, 2);
        strictEqual(query.at(1).group instanceof xs.core.Collection, true);
        strictEqual(query.at(1).group.size, 2);
        strictEqual(query.at(1).group.at(0), source.at(1));
        strictEqual(query.at(1).group.at(1), source.at(2));
        strictEqual(query.at(2).key, 3);
        strictEqual(query.at(2).group instanceof xs.core.Collection, true);
        strictEqual(query.at(2).group.size, 1);
        strictEqual(query.at(2).group.at(0), source.at(3));

        //with selector
        query = new xs.data.Query(source);
        query.group(function (item) {
            return item.x;
        }, {
            selector: function (item) {
                return item.a;
            }
        });
        query.execute();

        strictEqual(query.size, 3);
        strictEqual(Object.keys(query.at(0)).toString(), 'key,group');
        strictEqual(query.at(0).key, 1);
        strictEqual(query.at(0).group instanceof xs.core.Collection, true);
        strictEqual(query.at(0).group.size, 1);
        strictEqual(query.at(0).group.at(0), source.at(0).a);
        strictEqual(query.at(1).key, 2);
        strictEqual(query.at(1).group instanceof xs.core.Collection, true);
        strictEqual(query.at(1).group.size, 2);
        strictEqual(query.at(1).group.at(0), source.at(1).a);
        strictEqual(query.at(1).group.at(1), source.at(2).a);
        strictEqual(query.at(2).key, 3);
        strictEqual(query.at(2).group instanceof xs.core.Collection, true);
        strictEqual(query.at(2).group.size, 1);
        strictEqual(query.at(2).group.at(0), source.at(3).a);


        //with alias (and multiple key)
        query = new xs.data.Query(source);
        query.group(function (item) {
            return {
                x: item.x,
                y: item.a % 2
            };
        }, {
            alias: 'items'
        });
        query.execute();

        strictEqual(query.size, 3);
        strictEqual(Object.keys(query.at(0)).toString(), 'x,y,items');
        strictEqual(query.at(0).x, 1);
        strictEqual(query.at(0).y, 0);
        strictEqual(query.at(0).items instanceof xs.core.Collection, true);
        strictEqual(query.at(0).items.size, 1);
        strictEqual(query.at(0).items.at(0), source.at(0));
        strictEqual(query.at(1).x, 2);
        strictEqual(query.at(1).y, 1);
        strictEqual(query.at(1).items instanceof xs.core.Collection, true);
        strictEqual(query.at(1).items.size, 2);
        strictEqual(query.at(1).items.at(0), source.at(1));
        strictEqual(query.at(1).items.at(1), source.at(2));
        strictEqual(query.at(2).x, 3);
        strictEqual(query.at(2).y, 0);
        strictEqual(query.at(2).items instanceof xs.core.Collection, true);
        strictEqual(query.at(2).items.size, 1);
        strictEqual(query.at(2).items.at(0), source.at(3));


        //as array
        query = new xs.data.Query(source);
        query.group(function (item) {
            return item.x;
        }, {
            asArray: true
        });
        query.execute();

        strictEqual(query.size, 3);
        strictEqual(Object.keys(query.at(0)).toString(), 'key,group');
        strictEqual(query.at(0).key, 1);
        strictEqual(query.at(0).group instanceof Array, true);
        strictEqual(query.at(0).group.length, 1);
        strictEqual(query.at(0).group[ 0 ], source.at(0));
        strictEqual(query.at(1).key, 2);
        strictEqual(query.at(1).group instanceof Array, true);
        strictEqual(query.at(1).group.length, 2);
        strictEqual(query.at(1).group[ 0 ], source.at(1));
        strictEqual(query.at(1).group[ 1 ], source.at(2));
        strictEqual(query.at(2).key, 3);
        strictEqual(query.at(2).group instanceof Array, true);
        strictEqual(query.at(2).group.length, 1);
        strictEqual(query.at(2).group[ 0 ], source.at(3));
    });

    test('sort', function () {
        var query, source;

        source = new xs.core.Collection([
            2,
            1,
            3
        ]);

        //create query from query source
        query = new xs.data.Query(source);

        //sorter must be a function
        throws(function () {
            query.sort();
        });

        //sort asc
        query = new xs.data.Query(source);
        query.sort(function (a, b) {
            return a < b;
        });
        query.execute();
        strictEqual(query.values().toString(), '1,2,3');

        //sort desc
        query = new xs.data.Query(source);
        query.sort(function (a, b) {
            return a > b;
        });
        query.execute();
        strictEqual(query.values().toString(), '3,2,1');

        //source is not touched
        strictEqual(source.values().toString(), '2,1,3');
    });

    //test('simple', function () {
    //
    //    var query = (new xs.data.Query([
    //        {
    //            x: 1,
    //            a: 2
    //        },
    //        {
    //            x: 2,
    //            a: 5
    //        },
    //        {
    //            x: 2,
    //            a: 3
    //        },
    //        {
    //            x: 3,
    //            a: 4
    //        }
    //    ]))
    //        .where(function (item) {
    //            return item.x > 1;
    //        })
    //        .group(function (item) {
    //            return {
    //                x: item.x,
    //                y: item.a % 2
    //            };
    //        }, 'group', function (item) {
    //            return {
    //                x1: item.x,
    //                x2: item.a
    //            };
    //        })
    //        .sort(function (a, b) {
    //            return a.group.size < b.group.size;
    //        })
    //        .select(function (item) {
    //            return {
    //                x1: item.x,
    //                y1: item.y,
    //                items: item.group
    //            };
    //        });
    //
    //    query.execute();
    //    console.log(query.values());
    //
    //});
    //
    //test('constructor', function () {
    //    var queryLeft = new xs.data.Query([
    //        {
    //            x: 1
    //        },
    //        {
    //            x: 2
    //        },
    //        {
    //            x: 3
    //        },
    //        {
    //            x: 4
    //        },
    //        {
    //            x: 5
    //        }
    //    ]);
    //
    //    var queryRight = new xs.data.Query([
    //        {
    //            x: 1,
    //            a: 2
    //        },
    //        {
    //            x: 2,
    //            a: 5
    //        },
    //        {
    //            x: 2,
    //            a: 3
    //        },
    //        {
    //            x: 3,
    //            a: 4
    //        }
    //    ]);
    //
    //    queryLeft.select(function (item) {
    //        return {
    //            x: item.x,
    //            y: item.x * 2 - 1
    //        };
    //    });
    //
    //    queryRight.select(function (item) {
    //        return {
    //            x: item.x,
    //            b: item.a
    //        };
    //    });
    //
    //    var query = queryLeft
    //        .outerJoin(queryRight, function (left, right) {
    //            return left.x === right.x;
    //        })
    //        .where(function (item) {
    //            return item.x > 1;
    //        })
    //        .group(function (item) {
    //            return item.x;
    //        }, 'items', function (item) {
    //            return item;
    //        })
    //        .sort(function (a, b) {
    //            return a < b;
    //        });
    //    //query.execute();
    //});

});