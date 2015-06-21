'use strict';

var database = require('./db');
var Promise = require('promise');
var pool = require('./pool');

var add = function (data) {
    return new Promise(function (resolve, reject) {
        pool.run(data.dbName, 'get', 'SELECT COUNT(*) AS count FROM log WHERE user=$user AND device=$device AND test=$test AND stage=$stage AND userAgent=$userAgent', {
            $user: data.user,
            $device: data.device,
            $test: data.test,
            $stage: data.stage,
            $userAgent: data.userAgent.userAgent
        }).then(function (row) {

            if (row.count >= 100) {

                return resolve();
            }

            var sql = 'INSERT INTO log VALUES (' + Object.keys(database.log.fields).map(function (name) {
                    return '$' + name;
                }).join(', ') + ')';
            pool.run(data.dbName, 'run', sql, {
                $user: data.user,
                $device: data.device,
                $time: data.time,
                $test: data.test,
                $stage: data.stage,
                $name: data.name,
                $userAgent: data.userAgent.userAgent,
                $browserName: data.userAgent.browser.name,
                $browserVersion: data.userAgent.browser.version,
                $browserMajor: data.userAgent.browser.major,
                $browserMinor: data.userAgent.browser.minor,
                $cpu: data.userAgent.cpu.architecture,
                $engineName: data.userAgent.engine.name,
                $engineVersion: data.userAgent.engine.version,
                $engineMajor: data.userAgent.engine.major,
                $engineMinor: data.userAgent.engine.minor,
                $osName: data.userAgent.os.name,
                $osVersion: data.userAgent.os.version,
                $event: JSON.stringify(data.event)
            }).then(resolve, reject);
        }, reject);
    });

};

module.exports = {
    add: add
};