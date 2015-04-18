/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.storage.WebStorage', function () {

    'use strict';

    test('size', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.storage.WebStorage';

            Class.constant.storage = (function () {
                var storage = {};

                var clear = function () {
                    Object.keys(storage).forEach(function (key) {
                        delete storage[ key ];
                    });
                };

                var getItem = function (key) {

                    return storage[ key ];
                };

                var key = function (index) {

                    return Object.keys(storage)[ index ];
                };

                var removeItem = function (key) {
                    delete storage[ key ];
                };

                var setItem = function (key, value) {
                    storage[ key ] = value;
                };

                var result = {
                    clear: clear,
                    getItem: getItem,
                    key: key,
                    removeItem: removeItem,
                    setItem: setItem
                };

                Object.defineProperty(result, 'length', {
                    get: function () {
                        return Object.keys(storage).length;
                    },
                    set: function () {
                    }
                });

                return result;

            })();

        }, me.done);

        return false;
    }, function () {
        var storage = this.Class;

        //check empty array list
        strictEqual(storage.size, 0);

        //add some items
        storage.add('a', 'b');
        strictEqual(storage.size, 1);
    });

    test('keys', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.storage.WebStorage';

            Class.constant.storage = (function () {
                var storage = {};

                var clear = function () {
                    Object.keys(storage).forEach(function (key) {
                        delete storage[ key ];
                    });
                };

                var getItem = function (key) {

                    return storage[ key ];
                };

                var key = function (index) {

                    return Object.keys(storage)[ index ];
                };

                var removeItem = function (key) {
                    delete storage[ key ];
                };

                var setItem = function (key, value) {
                    storage[ key ] = value;
                };

                var result = {
                    clear: clear,
                    getItem: getItem,
                    key: key,
                    removeItem: removeItem,
                    setItem: setItem
                };

                Object.defineProperty(result, 'length', {
                    get: function () {
                        return Object.keys(storage).length;
                    },
                    set: function () {
                    }
                });

                return result;

            })();

        }, me.done);

        return false;
    }, function () {
        var storage = this.Class;

        //check empty storage
        strictEqual(JSON.stringify(storage.keys()), '[]');

        //check simple
        storage.add('a', 'b');
        storage.add('c', 'd');
        strictEqual(JSON.stringify(storage.keys()), '["a","c"]');
    });

    test('values', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.storage.WebStorage';

            Class.constant.storage = (function () {
                var storage = {};

                var clear = function () {
                    Object.keys(storage).forEach(function (key) {
                        delete storage[ key ];
                    });
                };

                var getItem = function (key) {

                    return storage[ key ];
                };

                var key = function (index) {

                    return Object.keys(storage)[ index ];
                };

                var removeItem = function (key) {
                    delete storage[ key ];
                };

                var setItem = function (key, value) {
                    storage[ key ] = value;
                };

                var result = {
                    clear: clear,
                    getItem: getItem,
                    key: key,
                    removeItem: removeItem,
                    setItem: setItem
                };

                Object.defineProperty(result, 'length', {
                    get: function () {
                        return Object.keys(storage).length;
                    },
                    set: function () {
                    }
                });

                return result;

            })();

        }, me.done);

        return false;
    }, function () {
        var storage = this.Class;

        //check empty storage
        strictEqual(JSON.stringify(storage.values()), '[]');

        //check simple
        storage.add('a', 'b');
        storage.add('c', 'd');
        strictEqual(JSON.stringify(storage.values()), '["b","d"]');
    });

    test('hasKey', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.storage.WebStorage';

            Class.constant.storage = (function () {
                var storage = {};

                var clear = function () {
                    Object.keys(storage).forEach(function (key) {
                        delete storage[ key ];
                    });
                };

                var getItem = function (key) {

                    return storage[ key ];
                };

                var key = function (index) {

                    return Object.keys(storage)[ index ];
                };

                var removeItem = function (key) {
                    delete storage[ key ];
                };

                var setItem = function (key, value) {
                    storage[ key ] = value;
                };

                var result = {
                    clear: clear,
                    getItem: getItem,
                    key: key,
                    removeItem: removeItem,
                    setItem: setItem
                };

                Object.defineProperty(result, 'length', {
                    get: function () {
                        return Object.keys(storage).length;
                    },
                    set: function () {
                    }
                });

                return result;

            })();

        }, me.done);

        return false;
    }, function () {
        var storage = this.Class;

        //check key processing
        throws(function () {
            storage.hasKey([]);
        });

        //check empty storage
        strictEqual(storage.hasKey('0'), false);

        //check simple
        storage.add('a', 'b');
        storage.add('c', 'd');
        strictEqual(storage.hasKey('a'), true);
        strictEqual(storage.hasKey('d'), false);
    });

    test('has', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.storage.WebStorage';

            Class.constant.storage = (function () {
                var storage = {};

                var clear = function () {
                    Object.keys(storage).forEach(function (key) {
                        delete storage[ key ];
                    });
                };

                var getItem = function (key) {

                    return storage[ key ];
                };

                var key = function (index) {

                    return Object.keys(storage)[ index ];
                };

                var removeItem = function (key) {
                    delete storage[ key ];
                };

                var setItem = function (key, value) {
                    storage[ key ] = value;
                };

                var result = {
                    clear: clear,
                    getItem: getItem,
                    key: key,
                    removeItem: removeItem,
                    setItem: setItem
                };

                Object.defineProperty(result, 'length', {
                    get: function () {
                        return Object.keys(storage).length;
                    },
                    set: function () {
                    }
                });

                return result;

            })();

        }, me.done);

        return false;
    }, function () {
        var storage = this.Class;

        //check value processing
        throws(function () {
            storage.has([]);
        });

        //check empty storage
        strictEqual(storage.has('0'), false);

        //check simple
        storage.add('a', 'b');
        storage.add('c', 'd');
        strictEqual(storage.has('b'), true);
        strictEqual(storage.has('c'), false);
    });

    test('keyOf', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.storage.WebStorage';

            Class.constant.storage = (function () {
                var storage = {};

                var clear = function () {
                    Object.keys(storage).forEach(function (key) {
                        delete storage[ key ];
                    });
                };

                var getItem = function (key) {

                    return storage[ key ];
                };

                var key = function (index) {

                    return Object.keys(storage)[ index ];
                };

                var removeItem = function (key) {
                    delete storage[ key ];
                };

                var setItem = function (key, value) {
                    storage[ key ] = value;
                };

                var result = {
                    clear: clear,
                    getItem: getItem,
                    key: key,
                    removeItem: removeItem,
                    setItem: setItem
                };

                Object.defineProperty(result, 'length', {
                    get: function () {
                        return Object.keys(storage).length;
                    },
                    set: function () {
                    }
                });

                return result;

            })();

        }, me.done);

        return false;
    }, function () {
        var storage = this.Class;

        //non-string value throws
        throws(function () {

            return storage.keyOf(1);
        });

        //add values
        storage.add('x', '1');
        storage.add('y', '1');
        storage.add('c', '2');
        storage.add('d', '2');

        //test
        strictEqual(storage.keyOf('1'), 'x');
        strictEqual(storage.keyOf('2', xs.storage.WebStorage.Reverse), 'd');
        strictEqual(storage.keyOf('c'), undefined);
    });

    test('at', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.storage.WebStorage';

            Class.constant.storage = (function () {
                var storage = {};

                var clear = function () {
                    Object.keys(storage).forEach(function (key) {
                        delete storage[ key ];
                    });
                };

                var getItem = function (key) {

                    return storage[ key ];
                };

                var key = function (index) {

                    return Object.keys(storage)[ index ];
                };

                var removeItem = function (key) {
                    delete storage[ key ];
                };

                var setItem = function (key, value) {
                    storage[ key ] = value;
                };

                var result = {
                    clear: clear,
                    getItem: getItem,
                    key: key,
                    removeItem: removeItem,
                    setItem: setItem
                };

                Object.defineProperty(result, 'length', {
                    get: function () {
                        return Object.keys(storage).length;
                    },
                    set: function () {
                    }
                });

                return result;

            })();

        }, me.done);

        return false;
    }, function () {
        var storage = this.Class;

        //check storage filled
        throws(function () {
            storage.at(0);
        });

        //incorrect key
        throws(function () {
            storage.at([]);
        });

        //add values
        storage.add('x', '1');
        storage.add('y', '1');
        storage.add('c', '2');
        storage.add('d', '2');

        //check simple array list
        strictEqual(storage.at('x'), '1');
        strictEqual(storage.at('c'), '2');
    });

    test('add', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.storage.WebStorage';

            Class.constant.storage = (function () {
                var storage = {};

                var clear = function () {
                    Object.keys(storage).forEach(function (key) {
                        delete storage[ key ];
                    });
                };

                var getItem = function (key) {

                    return storage[ key ];
                };

                var key = function (index) {

                    return Object.keys(storage)[ index ];
                };

                var removeItem = function (key) {
                    delete storage[ key ];
                };

                var setItem = function (key, value) {
                    storage[ key ] = value;
                };

                var result = {
                    clear: clear,
                    getItem: getItem,
                    key: key,
                    removeItem: removeItem,
                    setItem: setItem
                };

                Object.defineProperty(result, 'length', {
                    get: function () {
                        return Object.keys(storage).length;
                    },
                    set: function () {
                    }
                });

                return result;

            })();

        }, me.done);

        return false;
    }, function () {
        var storage = this.Class;

        //check object storage error handling
        //throws if no arguments
        throws(function () {
            storage.add();
        });
        //throws if not enough arguments
        throws(function () {
            storage.add('1');
        });
        //throws if key is not a string
        throws(function () {
            storage.add(1, '1');
        });
        //throws if value is not a string
        throws(function () {
            storage.add('1', 1);
        });
        //throws if adding with existent key
        throws(function () {
            storage.add('1', '1');
            storage.add('1', '2');
        });

        //test
        storage.add('a', '1');
        strictEqual(storage.at('a'), '1');

        //test events
        storage.remove();

        var log = {
            addBefore: [],
            add: []
        };

        //add:before - add only values, that are greater than five
        storage.events.on(xs.storage.event.AddBefore, function (event) {
            log.addBefore.push(event.value + ':' + event.key);

            return Number(event.value) > 5 && Number(event.value) < 10;
        });

        //add - post-processing added values
        storage.events.on(xs.storage.event.Add, function (event) {
            log.add.push(event.value + ':' + event.key);
        });

        storage.add('a', '4');
        storage.add('b', '6');
        storage.add('c', '6');
        storage.add('d', '8');
        storage.add('e', '8');
        storage.add('f', '8');
        storage.add('g', '10');
        strictEqual(JSON.stringify(storage.toSource()), '{"b":"6","c":"6","d":"8","e":"8","f":"8"}');

        strictEqual(JSON.stringify(log.addBefore), JSON.stringify([
            '4:a',
            '6:b',
            '6:c',
            '8:d',
            '8:e',
            '8:f',
            '10:g'
        ]));

        strictEqual(JSON.stringify(log.add), JSON.stringify([
            '6:b',
            '6:c',
            '8:d',
            '8:e',
            '8:f'
        ]));
    });

    test('set', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.storage.WebStorage';

            Class.constant.storage = (function () {
                var storage = {};

                var clear = function () {
                    Object.keys(storage).forEach(function (key) {
                        delete storage[ key ];
                    });
                };

                var getItem = function (key) {

                    return storage[ key ];
                };

                var key = function (index) {

                    return Object.keys(storage)[ index ];
                };

                var removeItem = function (key) {
                    delete storage[ key ];
                };

                var setItem = function (key, value) {
                    storage[ key ] = value;
                };

                var result = {
                    clear: clear,
                    getItem: getItem,
                    key: key,
                    removeItem: removeItem,
                    setItem: setItem
                };

                Object.defineProperty(result, 'length', {
                    get: function () {
                        return Object.keys(storage).length;
                    },
                    set: function () {
                    }
                });

                return result;

            })();

        }, me.done);

        return false;
    }, function () {
        var storage = this.Class;

        //throws if not enough arguments
        throws(function () {
            storage.set(1);
        });
        //throws if key is incorrect
        throws(function () {
            storage.set([], '1');
        });
        //throws if value is incorrect
        throws(function () {
            storage.set('a', 1);
        });

        //throws if key (key) is missing
        throws(function () {
            storage.set('b', 'a');
        });

        //complex test
        storage.add('a', 'x');
        strictEqual(storage.at('a'), 'x');
        storage.set('a', '5');
        strictEqual(storage.at('a'), '5');


        //test events
        storage.remove();
        storage.add('a', '10');
        storage.add('b', '8');
        storage.add('c', '7');
        storage.add('d', '8');
        storage.add('e', '6');
        storage.add('f', '4');
        storage.add('g', '5');

        var log = {
            setBefore: [],
            set: []
        };

        //set:before - set only values, that are greater than five
        storage.events.on(xs.storage.event.SetBefore, function (event) {
            log.setBefore.push(event.old + ':' + event.new + ':' + event.key);

            return Number(event.new) > 5 && Number(event.new) < 10;
        });

        //set - post-processing of set values
        storage.events.on(xs.storage.event.Set, function (event) {
            log.set.push(event.old + ':' + event.new + ':' + event.key);
        });

        storage.set('c', '6');
        storage.set('a', '3');
        storage.set('d', '6');
        storage.set('g', '10');
        storage.set('b', '5');
        storage.set('f', '8');
        storage.set('e', '8');
        strictEqual(JSON.stringify(storage.toSource()), '{"a":"10","b":"8","c":"6","d":"6","e":"8","f":"8","g":"5"}');

        strictEqual(JSON.stringify(log.setBefore), JSON.stringify([
            '7:6:c',
            '10:3:a',
            '8:6:d',
            '5:10:g',
            '8:5:b',
            '4:8:f',
            '6:8:e'
        ]));

        strictEqual(JSON.stringify(log.set), JSON.stringify([
            '7:6:c',
            '8:6:d',
            '4:8:f',
            '6:8:e'
        ]));
    });

    test('removeAt', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.storage.WebStorage';

            Class.constant.storage = (function () {
                var storage = {};

                var clear = function () {
                    Object.keys(storage).forEach(function (key) {
                        delete storage[ key ];
                    });
                };

                var getItem = function (key) {

                    return storage[ key ];
                };

                var key = function (index) {

                    return Object.keys(storage)[ index ];
                };

                var removeItem = function (key) {
                    delete storage[ key ];
                };

                var setItem = function (key, value) {
                    storage[ key ] = value;
                };

                var result = {
                    clear: clear,
                    getItem: getItem,
                    key: key,
                    removeItem: removeItem,
                    setItem: setItem
                };

                Object.defineProperty(result, 'length', {
                    get: function () {
                        return Object.keys(storage).length;
                    },
                    set: function () {
                    }
                });

                return result;

            })();

        }, me.done);

        return false;
    }, function () {
        var storage = this.Class;

        //throws if key is incorrect
        throws(function () {
            storage.removeAt([]);
        });

        //throws if key (key) is missing
        throws(function () {
            storage.removeAt('b');
        });

        //test simple
        storage.add('a', '1');
        storage.add('b', '2');
        storage.add('c', '3');

        storage.removeAt('b');
        strictEqual(storage.keys().toString(), 'a,c');
        strictEqual(storage.values().toString(), '1,3');


        //test events
        storage.remove();
        storage.add('a', '4');
        storage.add('b', '6');
        storage.add('c', '6');
        storage.add('d', '8');
        storage.add('e', '8');
        storage.add('f', '8');
        storage.add('g', '10');

        var str = '';

        var log = {
            removeBefore: [],
            remove: []
        };

        //remove:before - remove only values, that are greater than five
        storage.events.on(xs.storage.event.RemoveBefore, function (event) {
            log.removeBefore.push(event.value + ':' + event.key);

            return Number(event.value) > 5 && Number(event.value) < 10;
        });

        //remove - post-processing removed values
        storage.events.on(xs.storage.event.Remove, function (event) {
            log.remove.push(event.value + ':' + event.key);

            str += event.value + event.key + ':';
        });

        //clear - when all items removed
        storage.events.on(xs.storage.event.Clear, function () {
            str += '!!!';
        });

        storage.removeAt('f');
        storage.removeAt('b');
        storage.removeAt('g');
        storage.removeAt('a');
        storage.removeAt('d');
        storage.removeAt('a');
        storage.removeAt('a');
        strictEqual(JSON.stringify(storage.toSource()), '{"a":"4","c":"6","e":"8","g":"10"}');

        strictEqual(str, '8f:6b:8d:');

        strictEqual(JSON.stringify(log.removeBefore), JSON.stringify([
            '8:f',
            '6:b',
            '10:g',
            '4:a',
            '8:d',
            '4:a',
            '4:a'
        ]));

        strictEqual(JSON.stringify(log.remove), JSON.stringify([
            '8:f',
            '6:b',
            '8:d'
        ]));
    });

    test('remove', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.storage.WebStorage';

            Class.constant.storage = (function () {
                var storage = {};

                var clear = function () {
                    Object.keys(storage).forEach(function (key) {
                        delete storage[ key ];
                    });
                };

                var getItem = function (key) {

                    return storage[ key ];
                };

                var key = function (index) {

                    return Object.keys(storage)[ index ];
                };

                var removeItem = function (key) {
                    delete storage[ key ];
                };

                var setItem = function (key, value) {
                    storage[ key ] = value;
                };

                var result = {
                    clear: clear,
                    getItem: getItem,
                    key: key,
                    removeItem: removeItem,
                    setItem: setItem
                };

                Object.defineProperty(result, 'length', {
                    get: function () {
                        return Object.keys(storage).length;
                    },
                    set: function () {
                    }
                });

                return result;

            })();

        }, me.done);

        return false;
    }, function () {
        var storage = this.Class;

        //check object storage error handling
        //throws if non-string value given
        throws(function () {
            storage.remove([]);
        });
        //throws if flags given and are incorrect
        throws(function () {
            storage.remove('a', null);
        });
        //throws if value missing in array
        throws(function () {
            storage.remove('a');
        });

        //test
        storage.add('a', '3');
        storage.add('b', 'x');
        storage.add('c', '3');
        storage.add('d', 'x');
        storage.add('e', '2');
        storage.add('f', 'x');
        storage.add('g', '2');
        storage.add('h', 'x');

        storage.remove('x');
        strictEqual(JSON.stringify(storage.keys()), '["a","c","d","e","f","g","h"]');
        strictEqual(JSON.stringify(storage.values()), '["3","3","x","2","x","2","x"]');

        storage.remove('x', xs.storage.WebStorage.Reverse);
        strictEqual(JSON.stringify(storage.keys()), '["a","c","d","e","f","g"]');
        strictEqual(JSON.stringify(storage.values()), '["3","3","x","2","x","2"]');

        storage.remove('x', xs.storage.WebStorage.All);
        strictEqual(JSON.stringify(storage.keys()), '["a","c","e","g"]');
        strictEqual(JSON.stringify(storage.values()), '["3","3","2","2"]');


        //test events
        storage.remove();
        storage.add('a', '4');
        storage.add('b', '6');
        storage.add('c', '6');
        storage.add('d', '8');
        storage.add('e', '8');
        storage.add('f', '8');
        storage.add('g', '10');

        var str = '';

        var log = {
            removeBefore: [],
            remove: []
        };

        //remove:before - remove only values, that are greater than five
        storage.events.on(xs.storage.event.RemoveBefore, function (event) {
            log.removeBefore.push(event.value + ':' + event.key);

            return event.value > 5 && event.value < 10;
        });

        //remove - post-processing removed values
        storage.events.on(xs.storage.event.Remove, function (event) {
            log.remove.push(event.value + ':' + event.key);

            str += event.value + event.key + ':';
        });

        //clear - when all items removed
        storage.events.on(xs.storage.event.Clear, function () {
            str += '!!!';
        });

        storage.remove('4', xs.storage.WebStorage.All);
        storage.remove('6', xs.storage.WebStorage.All);
        storage.remove('8');
        storage.remove('8', xs.storage.WebStorage.Reverse);
        storage.remove('10');
        strictEqual(JSON.stringify(storage.toSource()), '{"a":"4","e":"8","g":"10"}');

        //off event.RemoveBefore and event.Remove
        storage.events.off(xs.storage.event.RemoveBefore);
        storage.events.off(xs.storage.event.Remove);
        storage.remove();

        strictEqual(str, '6b:6c:8d:8f:!!!');

        strictEqual(JSON.stringify(log.removeBefore), JSON.stringify([
            '4:a',
            '6:b',
            '6:c',
            '8:d',
            '8:f',
            '10:g'
        ]));

        strictEqual(JSON.stringify(log.remove), JSON.stringify([
            '6:b',
            '6:c',
            '8:d',
            '8:f'
        ]));
    });

    test('removeBy', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.storage.WebStorage';

            Class.constant.storage = (function () {
                var storage = {};

                var clear = function () {
                    Object.keys(storage).forEach(function (key) {
                        delete storage[ key ];
                    });
                };

                var getItem = function (key) {

                    return storage[ key ];
                };

                var key = function (index) {

                    return Object.keys(storage)[ index ];
                };

                var removeItem = function (key) {
                    delete storage[ key ];
                };

                var setItem = function (key, value) {
                    storage[ key ] = value;
                };

                var result = {
                    clear: clear,
                    getItem: getItem,
                    key: key,
                    removeItem: removeItem,
                    setItem: setItem
                };

                Object.defineProperty(result, 'length', {
                    get: function () {
                        return Object.keys(storage).length;
                    },
                    set: function () {
                    }
                });

                return result;

            })();

        }, me.done);

        return false;
    }, function () {
        var storage = this.Class;

        //throws if fn is not a function
        throws(function () {
            storage.removeBy([]);
        });

        //throws if flags given and are incorrect
        throws(function () {
            storage.remove([], null);
        });

        //test
        storage.add('a', '3');
        storage.add('b', 'x');
        storage.add('c', '3');
        storage.add('d', 'x');
        storage.add('e', '2');
        storage.add('f', 'x');
        storage.add('g', '2');
        storage.add('h', 'x');

        storage.removeBy(function (value) {
            return value === 'x';
        });
        strictEqual(JSON.stringify(storage.keys()), '["a","c","d","e","f","g","h"]');
        strictEqual(JSON.stringify(storage.values()), '["3","3","x","2","x","2","x"]');

        storage.removeBy(function (value) {
            return value === 'x';
        }, xs.storage.WebStorage.Reverse);
        strictEqual(JSON.stringify(storage.keys()), '["a","c","d","e","f","g"]');
        strictEqual(JSON.stringify(storage.values()), '["3","3","x","2","x","2"]');

        storage.removeBy(function (value) {
            return value === 'x';
        }, xs.storage.WebStorage.All);
        strictEqual(JSON.stringify(storage.keys()), '["a","c","e","g"]');
        strictEqual(JSON.stringify(storage.values()), '["3","3","2","2"]');


        //test events
        storage.remove();
        storage.add('a', '4');
        storage.add('b', '6');
        storage.add('c', '6');
        storage.add('d', '8');
        storage.add('e', '8');
        storage.add('f', '8');
        storage.add('g', '10');

        var str = '';

        var log = {
            removeBefore: [],
            remove: []
        };

        //remove:before - remove only values, that are greater than five
        storage.events.on(xs.storage.event.RemoveBefore, function (event) {
            log.removeBefore.push(event.value + ':' + event.key);

            return event.value > 5 && event.value < 10;
        });

        //remove - post-processing removed values
        storage.events.on(xs.storage.event.Remove, function (event) {
            log.remove.push(event.value + ':' + event.key);

            str += event.value + event.key + ':';
        });

        //clear - when all items removed
        storage.events.on(xs.storage.event.Clear, function () {
            str += '!!!';
        });

        storage.removeBy(function (value) {
            return value === '4';
        }, xs.storage.WebStorage.All);
        storage.removeBy(function (value) {
            return value === '6';
        }, xs.storage.WebStorage.All);
        storage.removeBy(function (value) {
            return value === '8';
        });
        storage.removeBy(function (value) {
            return value === '8';
        }, xs.storage.WebStorage.Reverse);
        storage.removeBy(function (value) {
            return value === '10';
        });
        strictEqual(JSON.stringify(storage.toSource()), '{"a":"4","e":"8","g":"10"}');

        //off event.RemoveBefore and event.Remove
        storage.events.off(xs.storage.event.RemoveBefore);
        storage.events.off(xs.storage.event.Remove);
        storage.removeBy(function () {
            return true;
        }, xs.storage.WebStorage.All);

        strictEqual(str, '6b:6c:8d:8f:!!!');

        strictEqual(JSON.stringify(log.removeBefore), JSON.stringify([
            '4:a',
            '6:b',
            '6:c',
            '8:d',
            '8:f',
            '10:g'
        ]));

        strictEqual(JSON.stringify(log.remove), JSON.stringify([
            '6:b',
            '6:c',
            '8:d',
            '8:f'
        ]));
    });

    test('each', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.storage.WebStorage';

            Class.constant.storage = (function () {
                var storage = {};

                var clear = function () {
                    Object.keys(storage).forEach(function (key) {
                        delete storage[ key ];
                    });
                };

                var getItem = function (key) {

                    return storage[ key ];
                };

                var key = function (index) {

                    return Object.keys(storage)[ index ];
                };

                var removeItem = function (key) {
                    delete storage[ key ];
                };

                var setItem = function (key, value) {
                    storage[ key ] = value;
                };

                var result = {
                    clear: clear,
                    getItem: getItem,
                    key: key,
                    removeItem: removeItem,
                    setItem: setItem
                };

                Object.defineProperty(result, 'length', {
                    get: function () {
                        return Object.keys(storage).length;
                    },
                    set: function () {
                    }
                });

                return result;

            })();

        }, me.done);

        return false;
    }, function () {
        var storage = this.Class;

        //init test variables
        var sum;

        //throws if fn is not a function
        throws(function () {
            storage.each(null);
        });

        //throws if flags given and are incorrect
        throws(function () {
            storage.each(xs.noop, null);
        });

        //test
        storage.add('x', '1');
        storage.add('b', '2');
        //direct
        sum = '';
        storage.each(function (value) {
            sum += value;
        });
        strictEqual(sum, '12');
        //reverse
        sum = '';
        storage.each(function (value) {
            sum += value;
        }, xs.storage.WebStorage.Reverse);
        strictEqual(sum, '21');

        //test empty
        storage.remove();
        //direct
        sum = '';
        storage.each(function (value) {
            sum += value;
        });
        strictEqual(sum, '');
        //reverse
        sum = '';
        storage.each(function (value) {
            sum += value;
        }, xs.storage.WebStorage.Reverse);
        strictEqual(sum, '');
    });

    test('find', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.storage.WebStorage';

            Class.constant.storage = (function () {
                var storage = {};

                var clear = function () {
                    Object.keys(storage).forEach(function (key) {
                        delete storage[ key ];
                    });
                };

                var getItem = function (key) {

                    return storage[ key ];
                };

                var key = function (index) {

                    return Object.keys(storage)[ index ];
                };

                var removeItem = function (key) {
                    delete storage[ key ];
                };

                var setItem = function (key, value) {
                    storage[ key ] = value;
                };

                var result = {
                    clear: clear,
                    getItem: getItem,
                    key: key,
                    removeItem: removeItem,
                    setItem: setItem
                };

                Object.defineProperty(result, 'length', {
                    get: function () {
                        return Object.keys(storage).length;
                    },
                    set: function () {
                    }
                });

                return result;

            })();

        }, me.done);

        return false;
    }, function () {
        var storage = this.Class;

        //init test variables
        var found;

        //throws if fn is not a function
        throws(function () {
            storage.find(null);
        });

        //throws if flags given and are incorrect
        throws(function () {
            storage.find(xs.noop, null);
        });

        var scope = {
            sum: function (x, y) {
                return x + y;
            },
            first: function (x) {
                return x[ 0 ];
            }
        };

        //for Object
        storage.add('aa', '1');
        storage.add('c', '2');
        storage.add('ab', '3');
        //direct
        found = storage.find(function (value, key) {
            return this.first(key) === 'a';
        }, 0, scope);
        strictEqual(found, storage.at('aa'));
        //reverse
        found = storage.find(function (value, key) {
            return this.first(key) === 'a';
        }, xs.storage.WebStorage.Reverse, scope);
        strictEqual(found, storage.at('ab'));
        //all
        found = storage.find(function (value, key) {
            return this.first(key) === 'a';
        }, xs.storage.WebStorage.All, scope);
        strictEqual(found.at('aa'), storage.at('aa'));
        strictEqual(found.at('ab'), storage.at('ab'));
    });

    test('toSource', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.storage.WebStorage';

            Class.constant.storage = (function () {
                var storage = {};

                var clear = function () {
                    Object.keys(storage).forEach(function (key) {
                        delete storage[ key ];
                    });
                };

                var getItem = function (key) {

                    return storage[ key ];
                };

                var key = function (index) {

                    return Object.keys(storage)[ index ];
                };

                var removeItem = function (key) {
                    delete storage[ key ];
                };

                var setItem = function (key, value) {
                    storage[ key ] = value;
                };

                var result = {
                    clear: clear,
                    getItem: getItem,
                    key: key,
                    removeItem: removeItem,
                    setItem: setItem
                };

                Object.defineProperty(result, 'length', {
                    get: function () {
                        return Object.keys(storage).length;
                    },
                    set: function () {
                    }
                });

                return result;

            })();

        }, me.done);

        return false;
    }, function () {
        var storage = this.Class;

        //check empty
        strictEqual(JSON.stringify(storage.toSource()), '{}');

        //check simple
        storage.add('x', '1');
        storage.add('b', '2');
        strictEqual(JSON.stringify(storage.toSource()), '{"x":"1","b":"2"}');
    });

});