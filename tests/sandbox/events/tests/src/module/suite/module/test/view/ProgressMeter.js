xs.define(xs.Class, 'ns.view.ProgressMeter', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite.module.test';

    Class.extends = 'xs.view.Element';

    Class.constructor = function (config) {
        var me = this;

        //assert, that config is an object
        self.assert.object(config, 'constructor - given config `$config` is not an object', {
            $config: config
        });

        //assert, that config.foreground is a string
        self.assert.string(config.foreground, 'constructor - given config.foreground `$foreground` is not a string', {
            $foreground: config.foreground
        });

        //assert, that config.background is a string
        self.assert.string(config.background, 'constructor - given config.background `$background` is not a string', {
            $background: config.background
        });

        //assert, that config.total is a number
        self.assert.number(config.total, 'constructor - given config.total `$total` is not a number', {
            $total: config.total
        });

        //assert, that config.total is a non-negative integer
        self.assert.ok(config.total >= 0 && Math.round(config.total) === config.total, 'constructor - given config.total `$total` is not a positive integer', {
            $total: config.total
        });


        //call parent constructor
        self.parent.call(me, document.createElement('div'));

        //add classes
        me.classes.add('progress');

        //save foreground
        me.private.foreground = config.foreground;

        //save background
        me.private.background = config.background;

        //save total
        me.private.total = config.total;

        //set current
        me.current = me.private.total > 0 ? 1 : 0;

        //set zero progress
        me.progress = 0;
    };

    Class.property.current = {
        set: function (current) {
            var me = this;

            //assert, that current is a number
            self.assert.number(current, 'current:set - given current `$current` is not a number', {
                $current: current
            });

            //assert, that current is a non-negative integer
            self.assert.ok(current >= 0 && Math.round(current) === current, 'current:set - given current `$current` is not a positive integer', {
                $current: current
            });

            //assert, that current is less or equal to total
            self.assert.ok(current <= me.private.total, 'current:set - given current `$current` is greater than `$total`', {
                $current: current,
                $total: me.private.total
            });

            me.private.current = current;

            updateLabel.call(me);
        }
    };

    Class.property.progress = {
        set: function (progress) {
            var me = this;

            //assert, that progress is a number
            self.assert.number(progress, 'constructor - given progress `$progress` is not a number', {
                $progress: progress
            });

            //assert, that progress is a non-negative integer
            self.assert.ok(progress >= 0 && Math.round(progress) === progress, 'constructor - given progress `$progress` is not a positive integer', {
                $progress: progress
            });

            //assert, that progress is less or equal to total
            self.assert.ok(progress <= me.private.total, 'progress:set - given progress `$progress` is greater than `$total`', {
                $progress: progress,
                $total: me.private.total
            });

            me.private.progress = progress;

            updateLabel.call(me);

            //evaluate percentage
            var percentage = Math.round(me.private.progress / me.private.total * 100);

            //update bar
            me.private.el.style.backgroundImage = xs.translate('linear-gradient(to right, $foreground, $foreground $percentage%, $background $percentage%, $background)', {
                $foreground: me.private.foreground,
                $background: me.private.background,
                $percentage: percentage
            });
        }
    };

    var updateLabel = function () {
        var me = this;

        me.private.el.innerHTML = me.private.current + ' / ' + me.private.total + ' / ' + me.private.progress;
    };

});