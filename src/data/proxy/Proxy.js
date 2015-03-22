/**
 * Proxy is a key element in xs.js data workflow. It's aim is processing data between Stores and data providers
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.data.proxy.Proxy
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.proxy.Proxy', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data';

    Class.imports = [
        {
            'operation.Create': 'ns.operation.Create'
        },
        {
            'operation.Read': 'ns.operation.Read'
        },
        {
            'operation.Update': 'ns.operation.Update'
        },
        {
            'operation.Delete': 'ns.operation.Delete'
        },
        {
            IReader: 'ns.reader.IReader'
        },
        {
            IWriter: 'ns.writer.IWriter'
        }
    ];

    Class.implements = [ 'ns.proxy.IProxy' ];

    Class.abstract = true;

    Class.constant.reader = {};

    Class.constant.writer = {};

    Class.constructor = function (config) {
        var me = this;

        //if no arguments
        if (!arguments.length) {

            //create template reader
            me.private.reader = createReader(self.reader);

            //create template writer
            me.private.writer = createWriter(self.reader);

            return;
        }

        //assert, that config is given and is an object
        self.assert.object(config, 'constructor - given config `$config` is not an object', {
            $config: config
        });

        //save config
        me.private.config = config;

        //process reader
        if (config.hasOwnProperty('reader')) {

            //assert reader implements IReader || is object
            self.assert.object(config.reader, 'constructor - given config.reader `$reader` is not an object', {
                $reader: config.reader
            });

            if (xs.isInstance(config.reader)) {
                //assert, that config.reader implements IReader
                self.assert.implements(config.reader, imports.IReader, 'constructor - given config.reader`$reader` does not implement `$Interface`', {
                    $reader: config.reader,
                    $Interface: imports.IReader
                });

                //save reader
                me.private.reader = config.reader;
            } else {

                //create reader from config
                me.private.reader = createReader(config.reader);
            }

        } else {
            //create template reader
            me.private.reader = createReader(self.reader);
        }

        //process writer
        if (config.hasOwnProperty('writer')) {

            //assert writer implements IWriter || is object
            self.assert.object(config.writer, 'constructor - given config.writer `$writer` is not an object', {
                $writer: config.writer
            });

            if (xs.isInstance(config.writer)) {
                //assert, that config.writer implements IWriter
                self.assert.implements(config.writer, imports.IWriter, 'constructor - given config.writer`$writer` does not implement `$Interface`', {
                    $writer: config.writer,
                    $Interface: imports.IWriter
                });

                //save writer
                me.private.writer = config.writer;
            } else {

                //create writer from config
                me.private.writer = createWriter(config.writer);
            }

        } else {
            //create template writer
            me.private.writer = createWriter(self.writer);
        }
    };

    Class.property.reader = {
        set: function (reader) {
            //assert, that reader implements IReader
            self.assert.implements(reader, imports.IReader, 'constructor - given config.reader`$reader` does not implement `$Interface`', {
                $reader: reader,
                $Interface: imports.IReader
            });

            this.private.reader = reader;
        }
    };

    Class.property.writer = {
        set: function (writer) {
            //assert, that writer implements IWriter
            self.assert.implements(writer, imports.IWriter, 'constructor - given config.writer`$writer` does not implement `$Interface`', {
                $writer: writer,
                $Interface: imports.IWriter
            });

            this.private.writer = writer;
        }
    };

    Class.method.create = function (operation) {
        //assert, that operation is correct instance
        self.assert.instance(operation, imports.operation.Create, 'create - given object `$operation` is not an `$Operation` instance', {
            $operation: operation,
            $Operation: imports.operation.Create
        });
    };

    Class.method.createAll = function (operation) {
    };

    Class.method.read = function (operation) {
        //assert, that operation is correct instance
        self.assert.instance(operation, imports.operation.Read, 'read - given object `$operation` is not an `$Operation` instance', {
            $operation: operation,
            $Operation: imports.operation.Read
        });
    };

    Class.method.getCount = function (operation) {
    };

    Class.method.readAll = function (operation) {
    };

    Class.method.update = function (operation) {
        //assert, that operation is correct instance
        self.assert.instance(operation, imports.operation.Update, 'update - given object `$operation` is not an `$Operation` instance', {
            $operation: operation,
            $Operation: imports.operation.Update
        });
    };

    Class.method.updateAll = function (operation) {
    };

    Class.method.delete = function (operation) {
        //assert, that operation is correct instance
        self.assert.instance(operation, imports.operation.Delete, 'delete - given object `$operation` is not an `$Operation` instance', {
            $operation: operation,
            $Operation: imports.operation.Delete
        });
    };

    Class.method.deleteAll = function (operation) {
    };

    var createReader = function (config) {

        //assert that type is specified
        self.assert.ok(config.hasOwnProperty('type'), 'createReader - no type given for reader. Add reader type to Class.constant.reader hash constant with property type, which value must be string, referencing name of imported Class');

        //assert that type is non-empty string
        self.assert.ok(config.type && xs.isString(config.type), 'createReader - given reader type `$type` is not a string', {
            $type: config.type
        });

        //get Reader contract
        var Reader = xs.ContractsManager.get(self.descriptor.resolveName(config.type));

        //assert that Reader is class
        self.assert.Class(Reader, 'createReader - given reader type `$Reader` is not a class', {
            $Reader: Reader
        });

        //assert that Reader implements IReader interface
        self.assert.ok(Reader.implements(imports.IReader), 'createReader - given reader type `$Reader` does not implement base reader interface `$Interface`', {
            $Reader: Reader,
            $Interface: imports.IReader
        });

        return new Reader(config);
    };

    var createWriter = function (config) {

        //assert that type is specified
        self.assert.ok(config.hasOwnProperty('type'), 'createWriter - no type given for writer. Add writer type to Class.constant.writer hash constant with property type, which value must be string, referencing name of imported Class');

        //assert that type is non-empty string
        self.assert.ok(config.type && xs.isString(config.type), 'createWriter - given writer type `$type` is not a string', {
            $type: config.type
        });

        //get Writer contract
        var Writer = xs.ContractsManager.get(self.descriptor.resolveName(config.type));

        //assert that Writer is class
        self.assert.Class(Writer, 'createWriter - given writer type `$Writer` is not a class', {
            $Writer: Writer
        });

        //assert that Writer implements IWriter interface
        self.assert.ok(Writer.implements(imports.IWriter), 'createWriter - given writer type `$Writer` does not implement base writer interface `$Interface`', {
            $Writer: Writer,
            $Interface: imports.IWriter
        });

        return new Writer(config);
    };

});