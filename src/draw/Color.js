xs.define('xs.draw.Color', {
    const: {
        knownColors: {
            /**
             * white        #ffffff или #fff    rgb(255,255,255)    hsl(0,0%,100%)    Белый
             silver        #c0c0c0    rgb(192,192,192)    hsl(0,0%,75%)    Серый
             gray        #808080    rgb(128,128,128)    hsl(0,0%,50%)    Темно-серый
             black        #000000 или #000    rgb(0,0,0)    hsl(0,0%,0%)    Черный
             maroon        #800000    rgb(128,0,0)    hsl(0,100%,25%)    Темно-красный
             red        #ff0000 или #f00    rgb(255,0,0)    hsl(0,100%,50%)    Красный
             orange        #ffa500    rgb(255,165,0)    hsl(38.8,100%,50%)    Оранжевый
             yellow        #ffff00 или #ff0    rgb(255,255,0)    hsl(60,100%,50%)    Желтый
             olive        #808000    rgb(128,128,0)    hsl(60,100%,25%)    Оливковый
             lime        #00ff00 или #0f0    rgb(0,255,0)    hsl(120,100%,50%)    Светло-зеленый
             green        #008000    rgb(0,128,0)    hsl(120,100%,25%)    Зеленый
             aqua        #00ffff или #0ff    rgb(0,255,255)    hsl(180,100%,50%)    Голубой
             blue        #0000ff или #00f    rgb(0,0,255)    hsl(240,100%,50%)    Синий
             navy        #000080    rgb(0,0,128)    hsl(240,100%,25%)    Темно-синий
             teal        #008080    rgb(0,128,128)    hsl(180,100%,25%)    Сине-зеленый
             fuchsia        #ff00ff или #f0f    rgb(255,0,255)    hsl(300,100%,50%)    Розовый
             purple
             */
        }
    },
    static: {
        methods: {
            /**
             *
             */
            toHSL: function (r, g, b) {
                r /= 255;
                g /= 255;
                b /= 255;
                var max = Math.max(r, g, b), min = Math.min(r, g, b);
                var h, s, l = (max + min) / 2;

                if (max == min) {
                    h = s = 0; // achromatic
                } else {
                    var d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch (max) {
                        case r:
                            h = (g - b) / d + (g < b ? 6 : 0);
                            break;
                        case g:
                            h = (b - r) / d + 2;
                            break;
                        case b:
                            h = (r - g) / d + 4;
                            break;
                    }
                    h /= 6;
                }

                return [+((360 * h).toFixed(1)), +(s.toFixed(2)), +(l.toFixed(2))];
            },
            toRGB: function (h, s, l) {
                var r, g, b;
                s *= 100;
                l *= 100;

                if (s == 0) {
                    r = g = b = l; // achromatic
                } else {
                    var hue2rgb = function (p, q, t) {
                        if (t < 0) t += 1;
                        if (t > 1) t -= 1;
                        if (t < 1 / 6) return p + (q - p) * 6 * t;
                        if (t < 1 / 2) return q;
                        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                        return p;
                    }

                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    var p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1 / 3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1 / 3);
                }

                return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
            },
            /**
             * [r,g,b,[a]]
             * {r:0,g:0,b:0,a:0}
             * r,g,b,a,
             */
            fromRGB: function () {

            },
            /**
             * [h,s,l,[a]]
             * {h:0,s:0,l:0,a:0}
             * h,s,l,a
             */
            fromHSL: function () {

            },
            /**
             * name
             * hex
             * 'rgb(0-255,0-255,0-255)'
             * 'rgba(0-255,0-255,0-255,[0].[0-9]+)'
             * 'hsl(0-360,0-100%,0-100%)'
             * 'hsla(0-360,0-100%,0-100%,[0].[0-9]+)'
             */
            fromCSS: function () {

            }
        }
    },
    properties: {
        r: 0,
        g: 0,
        b: 0,
        a: 0
    },
    methods: {
        /**
         * format: array|object(default)|css string
         */
        toRGB: function (format, useAlpha) {

        },
        /**
         * format: array|object(default)|css string
         */
        toHSL: function (format, useAlpha) {

        },
        toHex: function (tryName) {

        }
    }
});