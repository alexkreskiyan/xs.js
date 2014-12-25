(function (root, ns) {

    //framework shorthand
    var xs = root[ns];
    xs.define(xs.Class, ns + '.draw.Color', function () {
        var Color = function () {
            this.red = 0;
            this.green = 0;
            this.blue = 0;
            this.hue = 0;
            this.saturation = 0;
            this.lightness = 0;
            this.alpha = 1;
        };

        var knownColors = {
            transparent: {alpha: 0},
            white: {red: 255, green: 255, blue: 255, alpha: 1},
            silver: {red: 192, green: 192, blue: 192, alpha: 1},
            gray: {red: 128, green: 128, blue: 128, alpha: 1},
            black: {red: 0, green: 0, blue: 0, alpha: 1},
            maroon: {red: 128, green: 0, blue: 0, alpha: 1},
            red: {red: 255, green: 0, blue: 0, alpha: 1},
            orange: {red: 255, green: 166, blue: 0, alpha: 1},
            yellow: {red: 255, green: 255, blue: 255, alpha: 1},
            olive: {red: 128, green: 128, blue: 0, alpha: 1},
            lime: {red: 0, green: 255, blue: 0, alpha: 1},
            green: {red: 0, green: 128, blue: 0, alpha: 1},
            aqua: {red: 0, green: 255, blue: 255, alpha: 1},
            blue: {red: 0, green: 0, blue: 255, alpha: 1},
            navy: {red: 0, green: 0, blue: 128, alpha: 1},
            teal: {red: 0, green: 128, blue: 128, alpha: 1},
            fuchsia: {red: 255, green: 0, blue: 255, alpha: 1},
            purple: {red: 128, green: 0, blue: 128, alpha: 1}
        };

        var hue2rgb = function (p, q, t) {
            if (t < 0) {
                t += 360;
            } else if (t > 360) {
                t -= 360;
            }
            if (t < 60) {
                return p + (q - p) * t / 60;
            }
            if (t < 180) {
                return q;
            }
            if (t < 240) {
                return p + (q - p) * (240 - t) / 60;
            }
            return p;
        };

        var tryRgbArray = function (value) {
            if (!xs.isArray(value) || !xs.isNumeric(value[0]) || !xs.isNumeric(value[1]) || !xs.isNumeric(value[2])) {
                return false;
            }

            value[0] = +value[0];
            value[1] = +value[1];
            value[2] = +value[2];

            if (value[0] < 0 || value[0] > 255 || value[1] < 0 || value[1] > 255 || value[2] < 0 || value[2] > 255) {
                return false;
            }

            var color = new Color();

            color.red = value[0];
            color.green = value[1];
            color.blue = value[2];
            xs.isNumeric(value[3]) && (color.alpha = +value[3]);

            return color;
        };

        var tryRgbObject = function (value) {
            if (!xs.isObject(value) || !xs.isNumeric(value.red) || !xs.isNumeric(value.green) || !xs.isNumeric(value.blue)) {
                return false;
            }

            value.red = +value.red;
            value.green = +value.green;
            value.blue = +value.blue;

            if (value.red < 0 || value.red > 255 || value.green < 0 || value.green > 255 || value.blue < 0 || value.blue > 255) {
                return false;
            }

            var color = new Color();

            color.red = value.red;
            color.green = value.green;
            color.blue = value.blue;
            xs.isNumeric(value.alpha) && (color.alpha = +value.alpha);

            return color;
        };

        var tryRgbList = function (red, green, blue, alpha) {
            if (!xs.isNumeric(red) || !xs.isNumeric(green) || !xs.isNumeric(blue)) {
                return false;
            }

            red = +red;
            green = +green;
            blue = +blue;

            if (red < 0 || red > 255 || green < 0 || green > 255 || blue < 0 || blue > 255) {
                return false;
            }

            var color = new Color();

            color.red = red;
            color.green = green;
            color.blue = blue;
            xs.isNumeric(alpha) && (color.alpha = +alpha);

            return color;
        };

        var rgbRe = /^(rgb[a]?)\(([0-9]{1,3}),\s?([0-9]{1,3}),\s?([0-9]{1,3})(?:,\s?([0-9\.]{1,4}))?\)$/i;
        var tryRgbCss = function (css) {
            var value = rgbRe.exec(css);
            if (!value) {
                return false;
            }
            var color = new Color(), type = value[1], red = +value[2], green = +value[3], blue = +value[4], alpha = +value[5];

            if (red < 0 || red > 255 || green < 0 || green > 255 || blue < 0 || blue > 255) {
                return false;
            }

            color.red = red;
            color.green = green;
            color.blue = blue;
            type === 'rgba' && xs.isNumeric(alpha) && (color.alpha = alpha > 1 ? 1 : alpha < 0 ? 0 : alpha);

            return color;
        };

        var tryHslArray = function (value) {
            if (!xs.isArray(value) || !xs.isNumeric(value[0]) || !xs.isNumeric(value[1]) || !xs.isNumeric(value[2])) {
                return false;
            }

            value[0] = +value[0];
            value[1] = +value[1];
            value[2] = +value[2];

            if (value[0] < 0 || value[0] > 360 || value[1] < 0 || value[1] > 1 || value[2] < 0 || value[2] > 1) {
                return false;
            }

            var color = new Color();

            color.hue = value[0];
            color.saturation = value[1];
            color.lightness = value[2];
            xs.isNumeric(value[3]) && (color.alpha = +value[3]);

            return color;
        };

        var tryHslObject = function (value) {
            if (!xs.isObject(value) || !xs.isNumeric(value.hue) || !xs.isNumeric(value.saturation) || !xs.isNumeric(value.lightness)) {
                return false;
            }

            value.hue = +value.hue;
            value.saturation = +value.saturation;
            value.lightness = +value.lightness;

            if (value.hue < 0 || value.hue > 360 || value.saturation < 0 || value.saturation > 1 || value.lightness < 0 || value.lightness > 1) {
                return false;
            }

            var color = new Color();

            color.hue = value.hue;
            color.saturation = value.saturation;
            color.lightness = value.lightness;
            xs.isNumeric(value.alpha) && (color.alpha = +value.alpha);

            return color;
        };

        var tryHslList = function (hue, saturation, lightness, alpha) {
            if (!xs.isNumeric(hue) || !xs.isNumeric(saturation) || !xs.isNumeric(lightness)) {
                return false;
            }

            hue = +hue;
            saturation = +saturation;
            lightness = +lightness;

            if (hue < 0 || hue > 360 || saturation < 0 || saturation > 1 || lightness < 0 || lightness > 1) {
                return false;
            }

            var color = new Color();

            color.hue = hue;
            color.saturation = saturation;
            color.lightness = lightness;
            xs.isNumeric(alpha) && (color.alpha = +alpha);

            return color;
        };

        var hslRe = /^(hsl[a]?)\(([0-9]{1,3}),\s?([0-9]{1,3})%,\s?([0-9]{1,3})%(?:,\s?([0-9\.]{1,4}))?\)$/i;
        var tryHslCss = function (css) {
            var value = hslRe.exec(css);
            if (!value) {
                return false;
            }
            var color = new Color(), type = value[1], hue = +value[2], saturation = +value[3] / 100, lightness = +value[4] / 100, alpha = +value[5];

            if (hue < 0 || hue > 360 || saturation < 0 || saturation > 1 || lightness < 0 || lightness > 1) {
                return false;
            }

            color.hue = hue;
            color.saturation = saturation;
            color.lightness = lightness;
            type === 'hsla' && xs.isNumeric(alpha) && (color.alpha = alpha > 1 ? 1 : alpha < 0 ? 0 : alpha);

            return color;
        };

        var hexRe = /^#(?:([0-9a-fA-F]{3})|([0-9a-fA-F]{6}))$/i;
        var tryHex = function (hex) {
            if (!hexRe.test(hex)) {
                return false;
            }
            //get hex color value
            hex = hex.substr(1);

            var color = new Color();
            if (hex.length == 3) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            color.red = parseInt(hex.substr(0, 2), 16);
            color.green = parseInt(hex.substr(2, 2), 16);
            color.blue = parseInt(hex.substr(4, 2), 16);

            return color;
        };

        var tryName = function (name) {
            var color = knownColors[name];
            return color ? xs.extend(new Color(), color) : false;
        };

        /**
         * [r,g,b,[a]]
         * {r:0,g:0,b:0,a:0}
         * r,g,b,a,
         */
        var toRgb = function (color) {
            var hue = color.hue, saturation = color.saturation, lightness = color.lightness;

            if (saturation == 0) {
                color.red = color.green = color.blue = Math.ceil(lightness * 255);
                return color;
            }

            var q, p;
            if (lightness < 0.5) {
                q = lightness * (saturation + 1);
            } else {
                q = lightness + saturation - lightness * saturation;
            }

            p = 2 * lightness - q;

            color.red = Math.ceil(hue2rgb(p, q, hue + 120) * 255);
            color.green = Math.ceil(hue2rgb(p, q, hue) * 255);
            color.blue = Math.ceil(hue2rgb(p, q, hue - 120) * 255);

            return color;
        };
        var toHsl = function (color) {
            var range = 255, red = color.red, green = color.green, blue = color.blue, max = Math.max(red, green, blue), min = Math.min(red, green, blue);

            color.hue = color.saturation = 0;
            color.lightness = +(((max + min) / (2 * range)).toFixed(2));

            if (max == min) {// achromatic
                return color;
            }

            var diff = max - min;
            switch (max) {
                case red:
                    color.hue = (green - blue) / diff + (green < blue ? 6 : 0);
                    break;
                case green:
                    color.hue = (blue - red) / diff + 2;
                    break;
                case blue:
                    color.hue = (red - green) / diff + 4;
                    break;
            }
            color.hue = Math.round(60 * color.hue);

            color.saturation = +((diff / (range - Math.abs(range - max - min))).toFixed(2));
            return color;
        };
        /**
         * converts color to css representation
         * @param color
         * @param options allowed: model:rgb|hsl, alpha:boolean,name:boolean:hex:boolean
         */
        var toCSS = function (color, options) {
            options || (options = {});
            //default options
            xs.Object.defaults(options, {
                name: true,
                hex: true,
                model: 'rgb',
                alpha: true
            });

            if (options.name) {
                var name = xs.Object.find(knownColors, function (known) {
                    if (known.hasOwnProperty('red') && known.red !== color.red) {
                        return false;
                    }
                    if (known.hasOwnProperty('green') && known.green !== color.green) {
                        return false;
                    }
                    if (known.hasOwnProperty('blue') && known.blue !== color.blue) {
                        return false;
                    }
                    return !(known.hasOwnProperty('alpha') && known.alpha !== color.alpha);

                });
                if (name) {
                    return xs.Object.keyOf(knownColors, name);
                }
            }

            if (options.hex) {
                var red = color.red.toString(16), green = color.green.toString(16), blue = color.blue.toString(16);
                return '#' + (red.length == 1 ? '0' + red : red) + (green.length == 1 ? '0' + green : green) + (blue.length == 1 ? '0' + blue : blue);
            }

            var info;
            if (options.model.toLowerCase().substr(0, 3) == 'rgb') {
                info = xs.Object.pick(color, 'red', 'green', 'blue', 'alpha');
                return xs.translate(options.alpha ? 'rgba(red, green, blue, alpha)' : 'rgb(red, green, blue)', info);
            } else {
                info = xs.Object.pick(color, 'hue', 'saturation', 'lightness', 'alpha');
                info.saturation *= 100;
                info.lightness *= 100;
                return xs.translate(options.alpha ? 'hsla(hue, saturation%, lightness%, alpha)' : 'hsl(hue, saturation%, lightness%)', info);
            }
        };

        /**
         * name
         * hex
         * 'rgb(0-255,0-255,0-255)'
         * 'rgba(0-255,0-255,0-255,[0].[0-9]+)'
         * 'hsl(0-360,0-100%,0-100%)'
         * 'hsla(0-360,0-100%,0-100%,[0].[0-9]+)'
         */
        var fromCSS = function (value) {
            var name = tryName(value);
            if (name) {
                return toHsl(name);
            }

            var hex = tryHex(value);
            if (hex) {
                return toHsl(hex);
            }

            var rgb = tryRgbCss(value);
            if (rgb) {
                return toHsl(rgb);
            }

            var hsl = tryHslCss(value);
            if (hsl) {
                return toRgb(hsl);
            }
            return false;
        };

        /**
         * [r,g,b,[a]]
         * {r:0,g:0,b:0,a:0}
         * r,g,b,a
         */
        var fromRgb = function () {
            var args = xs.Array.clone(arguments), len = args.length, info = args[0], color;

            if (len == 1) {
                if (xs.isArray(info)) {
                    color = tryRgbArray(info);
                    return color ? toHsl(color) : color;
                } else {
                    color = tryRgbObject(info);
                    return color ? toHsl(color) : color;
                }
            } else {
                color = tryRgbList.apply(this, args);
                return color ? toHsl(color) : color;
            }
        };

        /**
         * [h,s,l,[a]]
         * {h:0,s:0,l:0,a:0}
         * h,s,l,a
         */
        var fromHsl = function () {
            var args = xs.Array.clone(arguments), len = args.length, info = args[0], color;

            if (len == 1) {
                if (xs.isArray(info)) {
                    color = tryHslArray(info);
                    return color ? toRgb(color) : color;
                } else {
                    color = tryHslObject(info);
                    return color ? toRgb(color) : color;
                }
            } else {
                color = tryHslList.apply(this, args);
                return color ? toRgb(color) : color;
            }
        };

        var parse = function () {
            var args = arguments, len = args.length, info = args[0];

            if (len == 1 && xs.isString(info)) {
                return fromCSS(info);
            }
            var hsl = fromHsl.apply(this, args);
            if (hsl) {
                return hsl;
            } else {
                var rgb = fromRgb.apply(this, args);
                return rgb ? rgb : new Color();
            }
        };

        var sync = function (from) {
            var me = this;
            var color = {
                red: me.__get('red'),
                green: me.__get('green'),
                blue: me.__get('blue'),
                hue: me.__get('hue'),
                saturation: me.__get('saturation'),
                lightness: me.__get('lightness')
            };

            if (from == 'rgb') {
                toHsl(color);
            } else {
                toRgb(color);
            }

            me.__set('red', color.red);
            me.__set('green', color.green);
            me.__set('blue', color.blue);
            me.__set('hue', color.hue);
            me.__set('saturation', color.saturation);
            me.__set('lightness', color.lightness);
            me.trigger('change');
        };

        return {
            mixins: {
                observable: 'xs.util.Observable'
            },
            const: {
                knownColors: knownColors
            },
            static: {
                methods: {
                    toRgb: toRgb,
                    toHsl: toHsl,
                    fromRgb: function () {
                        var color = fromRgb.apply(this, arguments);
                        return color ? xs.create(ns + '.draw.Color', color) : color;
                    },
                    fromHsl: function () {
                        var color = fromHsl.apply(this, arguments);
                        return color ? xs.create(ns + '.draw.Color', color) : color;
                    },
                    fromCSS: function () {
                        var color = fromCSS.apply(this, arguments);
                        return color ? xs.create(ns + '.draw.Color', color) : color;
                    },
                    from: function () {
                        var color = parse.apply(this, arguments);
                        return color ? xs.create(ns + '.draw.Color', color) : color;
                    }
                }
            },
            /**
             * Tries creation in next order:
             * Color (internal)
             * name
             * hex
             * css
             * object
             * array
             * list
             */
            constructor: function () {
                var me = this, color = arguments[0];
                //if given as color
                if ((color instanceof Color) || (color = parse.apply(me, arguments))) {
                    me.__set('red', color.red);
                    me.__set('green', color.green);
                    me.__set('blue', color.blue);
                    me.__set('hue', color.hue);
                    me.__set('saturation', color.saturation);
                    me.__set('lightness', color.lightness);
                    me.__set('alpha', color.alpha);
                } else {
                    me.__set('red', 0);
                    me.__set('green', 0);
                    me.__set('blue', 0);
                    me.__set('hue', 0);
                    me.__set('saturation', 0);
                    me.__set('lightness', 0);
                    me.__set('alpha', 1);
                }
                me.mixins.observable.constructor.call(me);
            },
            properties: {
                red: {
                    set: function (value) {
                        var me = this;
                        if (!xs.isNumeric(value)) {
                            return;
                        }

                        value = +value;
                        if (value < 0 || value > 255 || value == me.__get('red')) {
                            return;
                        }

                        this.__set('red', value);
                        sync.call(me, 'rgb');
                    }
                },
                green: {
                    set: function (value) {
                        var me = this;
                        if (!xs.isNumeric(value)) {
                            return;
                        }

                        value = +value;
                        if (value < 0 || value > 255 || value == me.__get('green')) {
                            return;
                        }

                        this.__set('green', value);
                        sync.call(me, 'rgb');
                    }
                },
                blue: {
                    set: function (value) {
                        var me = this;
                        if (!xs.isNumeric(value)) {
                            return;
                        }

                        value = +value;
                        if (value < 0 || value > 255 || value == me.__get('blue')) {
                            return;
                        }

                        this.__set('blue', value);
                        sync.call(me, 'rgb');
                    }
                },
                hue: {
                    set: function (value) {
                        var me = this;
                        if (!xs.isNumeric(value)) {
                            return;
                        }

                        value = +value;
                        if (value < 0 || value > 360 || value == me.__get('hue')) {
                            return;
                        }

                        this.__set('hue', value);
                        sync.call(me, 'hsl');
                    }
                },
                saturation: {
                    set: function (value) {
                        var me = this;
                        if (!xs.isNumeric(value)) {
                            return;
                        }

                        value = +value;
                        if (value < 0 || value > 1 || value == me.__get('saturation')) {
                            return;
                        }

                        this.__set('saturation', value);
                        sync.call(me, 'hsl');
                    }
                },
                lightness: {
                    set: function (value) {
                        var me = this;
                        if (!xs.isNumeric(value)) {
                            return;
                        }

                        value = +value;
                        if (value < 0 || value > 1 || value == me.__get('lightness')) {
                            return;
                        }

                        this.__set('lightness', value);
                        sync.call(me, 'hsl');
                    }
                },
                alpha: {
                    set: function (value) {
                        var me = this;
                        if (!xs.isNumeric(value)) {
                            return;
                        }

                        value = +value;
                        if (value < 0 || value > 1 || value == me.__get('alpha')) {
                            return;
                        }

                        this.__set('alpha', value);

                        me.trigger('change');
                    }
                }
            },
            methods: {
                /**
                 * format: array|object(default)
                 */
                toRgb: function (options) {
                    var me = this;
                    options || (options = {});

                    xs.isString(options.format) || (options.format = 'object');
                    xs.isBoolean(options.alpha) || (options.alpha = true);

                    if (options.format.toLowerCase() == 'array') {
                        if (options.alpha) {
                            return [
                                me.red,
                                me.green,
                                me.blue,
                                me.alpha
                            ];
                        } else {
                            return [
                                me.red,
                                me.green,
                                me.blue
                            ];
                        }
                    } else {
                        if (options.alpha) {
                            return xs.Object.pick(me, 'red', 'green', 'blue', 'alpha');
                        } else {
                            return xs.Object.pick(me, 'red', 'green', 'blue');
                        }
                    }
                },
                /**
                 * format: array|object(default)
                 */
                toHsl: function (options) {
                    var me = this;
                    options || (options = {});

                    xs.isString(options.format) || (options.format = 'object');
                    xs.isBoolean(options.alpha) || (options.alpha = true);

                    if (options.format.toLowerCase() == 'array') {
                        if (options.alpha) {
                            return [
                                me.hue,
                                me.saturation,
                                me.lightness,
                                me.alpha
                            ];
                        } else {
                            return [
                                me.hue,
                                me.saturation,
                                me.lightness
                            ];
                        }
                    } else {
                        if (options.alpha) {
                            return xs.Object.pick(me, 'hue', 'saturation', 'lightness', 'alpha');
                        } else {
                            return xs.Object.pick(me, 'hue', 'saturation', 'lightness');
                        }
                    }
                },
                /**
                 *
                 * @param options
                 */
                toCss: function (options) {
                    return toCSS.call(this, this, options);
                }
            }
        }
    });
})(window, 'xs');