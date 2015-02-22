/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */

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
        {Operation: 'ns.Operation'},
        {OperationsTypes: 'ns.operation.Types'},
        {IReader: 'ns.reader.IReader'},
        {Reader: 'ns.reader.Reader'},
        {IWriter: 'ns.writer.IWriter'},
        {Writer: 'ns.writer.Writer'}
    ];

    Class.implements = ['ns.proxy.IProxy'];

    Class.abstract = true;

    Class.constant.reader = {};

    Class.constant.writer = {};

    Class.constructor = function (config, reader, writer) {
        var me = this;

        //assert, that config is given and is an object
        self.assert.object(config, 'constructor - given config `$config` is not an object', {
            $config: config
        });

        //if no arguments given - create template reader and writer
        if (arguments.length === 1) {
            //create template reader
            me.private.reader = createReader(self.reader);

            //create template writer
            me.private.writer = createWriter(self.reader);

            return;
        }


        //verify 2 arguments scenario

        if (arguments.length === 2) {

            //assert reader is instanceof Reader or Writer
            self.assert.ok(reader instanceof imports.Reader || reader instanceof imports.Writer, 'constructor - given second argument is nor a `$Reader` neither a `$Writer` instance', {
                $Reader: imports.Reader,
                $Writer: imports.Writer
            });

            //handle reader depending on it's type
            if (reader instanceof imports.Reader) {

                //save reader reference
                me.private.reader = reader;

                //create template writer
                me.private.writer = createWriter(self.reader);
            } else {
                //create template reader
                me.private.reader = createReader(self.reader);

                //save writer reference
                me.private.writer = reader;
            }

            return;
        }


        //verify 3 arguments scenario

        //assert reader is instanceof Reader
        self.assert.ok(reader instanceof imports.Reader, 'constructor - given reader `$reader` is nor an instance of `$Reader`', {
            $reader: reader,
            $Reader: imports.Reader
        });

        //assert writer is instanceof Writer
        self.assert.ok(writer instanceof imports.Writer, 'constructor - given writer `$writer` is nor an instance of `$Writer`', {
            $writer: writer,
            $Writer: imports.Writer
        });

        //save reader reference
        me.private.reader = reader;

        //save writer reference
        me.private.writer = reader;
    };

    Class.property.reader = {
        get: function () {

        },
        set: function (reader) {

        }
    };

    Class.property.writer = {
        get: function () {

        },
        set: function (writer) {

        }
    };

    Class.method.create = function (operation) {
        //assert, that operation is correct instance
        self.assert.instance(operation, imports.Operation, 'create - given object `$operation` is not an `$Operation` instance', {
            $operation: operation,
            $Operation: imports.Operation
        });

        //assert, that operation has correct type
        self.assert.equals(operation.type, imports.OperationsTypes.Create, 'create - given operation type `$type` is not a type `$wanted`', {
            $type: imports.OperationsTypes.keyOf(operation.type),
            $wanted: imports.OperationsTypes.keyOf(imports.OperationsTypes.Create)
        });
    };

    Class.method.createAll = function (operation) {
        //assert, that operation is correct instance
        self.assert.instance(operation, imports.Operation, 'createAll - given object `$operation` is not an `$Operation` instance', {
            $operation: operation,
            $Operation: imports.Operation
        });

        //assert, that operation has correct type
        self.assert.equals(operation.type, imports.OperationsTypes.CreateAll, 'createAll - given operation type `$type` is not a type `$wanted`', {
            $type: imports.OperationsTypes.keyOf(operation.type),
            $wanted: imports.OperationsTypes.keyOf(imports.OperationsTypes.CreateAll)
        });
    };

    Class.method.read = function (operation) {
        //assert, that operation is correct instance
        self.assert.instance(operation, imports.Operation, 'read - given object `$operation` is not an `$Operation` instance', {
            $operation: operation,
            $Operation: imports.Operation
        });

        //assert, that operation has correct type
        self.assert.equals(operation.type, imports.OperationsTypes.Read, 'read - given operation type `$type` is not a type `$wanted`', {
            $type: imports.OperationsTypes.keyOf(operation.type),
            $wanted: imports.OperationsTypes.keyOf(imports.OperationsTypes.Read)
        });
    };

    Class.method.getCount = function (operation) {
        //assert, that operation is correct instance
        self.assert.instance(operation, imports.Operation, 'getCount - given object `$operation` is not an `$Operation` instance', {
            $operation: operation,
            $Operation: imports.Operation
        });

        //assert, that operation has correct type
        self.assert.equals(operation.type, imports.OperationsTypes.GetCount, 'getCount - given operation type `$type` is not a type `$wanted`', {
            $type: imports.OperationsTypes.keyOf(operation.type),
            $wanted: imports.OperationsTypes.keyOf(imports.OperationsTypes.GetCount)
        });
    };

    Class.method.readAll = function (operation) {
        //assert, that operation is correct instance
        self.assert.instance(operation, imports.Operation, 'readAll - given object `$operation` is not an `$Operation` instance', {
            $operation: operation,
            $Operation: imports.Operation
        });

        //assert, that operation has correct type
        self.assert.equals(operation.type, imports.OperationsTypes.ReadAll, 'readAll - given operation type `$type` is not a type `$wanted`', {
            $type: imports.OperationsTypes.keyOf(operation.type),
            $wanted: imports.OperationsTypes.keyOf(imports.OperationsTypes.ReadAll)
        });
    };

    Class.method.update = function (operation) {
        //assert, that operation is correct instance
        self.assert.instance(operation, imports.Operation, 'update - given object `$operation` is not an `$Operation` instance', {
            $operation: operation,
            $Operation: imports.Operation
        });

        //assert, that operation has correct type
        self.assert.equals(operation.type, imports.OperationsTypes.Update, 'update - given operation type `$type` is not a type `$wanted`', {
            $type: imports.OperationsTypes.keyOf(operation.type),
            $wanted: imports.OperationsTypes.keyOf(imports.OperationsTypes.Update)
        });
    };

    Class.method.updateAll = function (operation) {
        //assert, that operation is correct instance
        self.assert.instance(operation, imports.Operation, 'updateAll - given object `$operation` is not an `$Operation` instance', {
            $operation: operation,
            $Operation: imports.Operation
        });

        //assert, that operation has correct type
        self.assert.equals(operation.type, imports.OperationsTypes.UpdateAll, 'updateAll - given operation type `$type` is not a type `$wanted`', {
            $type: imports.OperationsTypes.keyOf(operation.type),
            $wanted: imports.OperationsTypes.keyOf(imports.OperationsTypes.UpdateAll)
        });
    };

    Class.method.delete = function (operation) {
        //assert, that operation is correct instance
        self.assert.instance(operation, imports.Operation, 'delete - given object `$operation` is not an `$Operation` instance', {
            $operation: operation,
            $Operation: imports.Operation
        });

        //assert, that operation has correct type
        self.assert.equals(operation.type, imports.OperationsTypes.Delete, 'delete - given operation type `$type` is not a type `$wanted`', {
            $type: imports.OperationsTypes.keyOf(operation.type),
            $wanted: imports.OperationsTypes.keyOf(imports.OperationsTypes.Delete)
        });
    };

    Class.method.deleteAll = function (operation) {
        //assert, that operation is correct instance
        self.assert.instance(operation, imports.Operation, 'deleteAll - given object `$operation` is not an `$Operation` instance', {
            $operation: operation,
            $Operation: imports.Operation
        });

        //assert, that operation has correct type
        self.assert.equals(operation.type, imports.OperationsTypes.DeleteAll, 'deleteAll - given operation type `$type` is not a type `$wanted`', {
            $type: imports.OperationsTypes.keyOf(operation.type),
            $wanted: imports.OperationsTypes.keyOf(imports.OperationsTypes.DeleteAll)
        });
    };

    var createReader = function (config) {

        //assert that type is specified
        self.assert.ok(config.hasOwnProperty('type'), 'createReader - no type given for reader. Add reader type to Class.constant.reader hash constant with property type, which value must be string, referencing name of imported Class');

        //assert that type is non-empty string
        self.assert.ok(config.type && xs.isString(config.type), 'createReader - given reader type `$type` is not a string', {
            $type: config.type
        });

        //get Reader contract
        var Reader = xs.ContractsManager.get(Class.descriptor.resolveName(config.type));

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
        var Writer = xs.ContractsManager.get(Class.descriptor.resolveName(config.type));

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