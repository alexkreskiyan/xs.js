/**
 * Proxy is a key element in xs.js data workflow. It's aim is processing data between Stores and data providers
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.data.Proxy
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Proxy', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data';

    Class.imports = [
        {
            IReader: 'ns.reader.IReader'
        },
        {
            IWriter: 'ns.writer.IWriter'
        }
    ];

    Class.abstract = true;

    Class.constructor = function (config) {
        var me = this;

        //assert, that config is given and is an object
        self.assert.object(config, 'constructor - given config `$config` is not an object', {
            $config: config
        });

        //save config
        me.private.config = config;


        //process reader

        //assert reader implements IReader || is object
        self.assert.object(config.reader, 'constructor - given config.reader `$reader` is not an object', {
            $reader: config.reader
        });

        //assert, that config.reader implements IReader
        self.assert.implements(config.reader, imports.IReader, 'constructor - given config.reader`$reader` does not implement `$Interface`', {
            $reader: config.reader,
            $Interface: imports.IReader
        });

        //save reader
        me.private.reader = config.reader;

        //process writer

        //assert writer implements IWriter || is object
        self.assert.object(config.writer, 'constructor - given config.writer `$writer` is not an object', {
            $writer: config.writer
        });

        //assert, that config.writer implements IWriter
        self.assert.implements(config.writer, imports.IWriter, 'constructor - given config.writer`$writer` does not implement `$Interface`', {
            $writer: config.writer,
            $Interface: imports.IWriter
        });

        //save writer
        me.private.writer = config.writer;
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

});