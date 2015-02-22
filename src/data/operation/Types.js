/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */

/**
 * xs.data.operation.Types is the Enum with data operation types
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.data.operation.Types
 */
xs.define(xs.Enum, 'xs.data.operation.Types', {
    Create: 0,
    CreateAll: 1,
    Read: 2,
    GetCount: 3,
    ReadAll: 4,
    Update: 5,
    UpdateAll: 6,
    Delete: 7,
    DeleteAll: 8
});