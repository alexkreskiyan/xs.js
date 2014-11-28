function speed ( fn, n ) {
    var start = Date.now();
    for ( var i = 0; i < n; i++ ) {
        fn();
    }
    var duration = Date.now() - start;
    console.log('duration: ', duration, 'ms for ', n, 'operations');
    console.log('median: ', duration / n, 'ms per operation');
    console.log('mark: about', n / duration, 'operation per ms');
}
'use strict';
function xsDrawColorColors () {
    return [
        {
            name: 'white',
            rgb: {red: 255, green: 255, blue: 255},
            hsl: {hue: 0, saturation: 0, lightness: 1}
        },
        {
            name: 'silver',
            rgb: {red: 192, green: 192, blue: 192},
            hsl: {hue: 0, saturation: 0, lightness: 0.75}
        },
        {
            name: 'gray',
            rgb: {red: 128, green: 128, blue: 128},
            hsl: {hue: 0, saturation: 0, lightness: 0.5}
        },
        {
            name: 'black',
            rgb: {red: 0, green: 0, blue: 0},
            hsl: {hue: 0, saturation: 0, lightness: 0}
        },
        {
            name: 'maroon',
            rgb: {red: 128, green: 0, blue: 0},
            hsl: {hue: 0, saturation: 1, lightness: 0.25}
        },
        {
            name: 'red',
            rgb: {red: 255, green: 0, blue: 0},
            hsl: {hue: 0, saturation: 1, lightness: 0.5}
        },
        {
            name: 'orange',
            rgb: {red: 255, green: 166, blue: 0},
            hsl: {hue: 39, saturation: 1, lightness: 0.5}
        },
        {
            name: 'yellow',
            rgb: {red: 255, green: 255, blue: 0},
            hsl: {hue: 60, saturation: 1, lightness: 0.5}
        },
        {
            name: 'olive',
            rgb: {red: 128, green: 128, blue: 0},
            hsl: {hue: 60, saturation: 1, lightness: 0.25}
        },
        {
            name: 'lime',
            rgb: {red: 0, green: 255, blue: 0},
            hsl: {hue: 120, saturation: 1, lightness: 0.5}
        },
        {
            name: 'green',
            rgb: {red: 0, green: 128, blue: 0},
            hsl: {hue: 120, saturation: 1, lightness: 0.25}
        },
        {
            name: 'aqua',
            rgb: {red: 0, green: 255, blue: 255},
            hsl: {hue: 180, saturation: 1, lightness: 0.5}
        },
        {
            name: 'blue',
            rgb: {red: 0, green: 0, blue: 255},
            hsl: {hue: 240, saturation: 1, lightness: 0.5}
        },
        {
            name: 'navy',
            rgb: {red: 0, green: 0, blue: 128},
            hsl: {hue: 240, saturation: 1, lightness: 0.25}
        },
        {
            name: 'teal',
            rgb: {red: 0, green: 128, blue: 128},
            hsl: {hue: 180, saturation: 1, lightness: 0.25}
        },
        {
            name: 'fuchsia',
            rgb: {red: 255, green: 0, blue: 255},
            hsl: {hue: 300, saturation: 1, lightness: 0.5}
        },
        {
            name: 'purple',
            rgb: {red: 128, green: 0, blue: 128},
            hsl: {hue: 300, saturation: 1, lightness: 0.25}
        }
    ];
}
module('xs.draw.Color');
test('conversion', function () {
    var tests = xsDrawColorColors();
    var Color = xs.draw.Color;
    xs.Array.each(tests, function ( test ) {
        var rgb = xs.Object.clone(test.rgb);
        var hsl = xs.Object.clone(test.hsl);
        strictEqual(JSON.stringify(xs.Object.pick(Color.toHsl(rgb), 'hue', 'saturation', 'lightness')), JSON.stringify(test.hsl), 'test convertion to HSL for ' +
            test.name);
        strictEqual(JSON.stringify(xs.Object.pick(Color.toRgb(hsl), 'red', 'green', 'blue')), JSON.stringify(test.rgb), 'test convertion to RGB for ' +
            test.name);
    });
});
test('fromRgb factory', function () {
    var Color = xs.draw.Color;

    var tests = xsDrawColorColors();
    var test = tests.pop().rgb, color;

    //array
    color = Color.fromRgb([
        test.red,
        test.green,
        test.blue
    ]);
    strictEqual(JSON.stringify(xs.Object.pick(color, 'red', 'green', 'blue')), JSON.stringify(test), 'test rgb factory for ' +
        test.name + ' creating from array');
    //object
    color = Color.fromRgb(test);
    strictEqual(JSON.stringify(xs.Object.pick(color, 'red', 'green', 'blue')), JSON.stringify(test), 'test rgb factory for ' +
        test.name + ' creating from object');
    //list
    color = Color.fromRgb(test.red, test.green, test.blue);
    strictEqual(JSON.stringify(xs.Object.pick(color, 'red', 'green', 'blue')), JSON.stringify(test), 'test rgb factory for ' +
        test.name + ' creating from list');
});
test('fromHsl factory', function () {
    var Color = xs.draw.Color;

    var tests = xsDrawColorColors();
    var test = tests.pop().hsl, color;

    //array
    color = Color.fromHsl([
        test.hue,
        test.saturation,
        test.lightness
    ]);
    strictEqual(JSON.stringify(xs.Object.pick(color, 'hue', 'saturation', 'lightness')), JSON.stringify(test), 'test hsl factory for ' +
        test.name + ' creating from array');
    //object
    color = Color.fromHsl(test);
    strictEqual(JSON.stringify(xs.Object.pick(color, 'hue', 'saturation', 'lightness')), JSON.stringify(test), 'test hsl factory for ' +
        test.name + ' creating from object');
    //list
    color = Color.fromHsl(test.hue, test.saturation, test.lightness);
    strictEqual(JSON.stringify(xs.Object.pick(color, 'hue', 'saturation', 'lightness')), JSON.stringify(test), 'test hsl factory for ' +
        test.name + ' creating from list');
});
test('fromCss factory', function () {
    var Color = xs.draw.Color, test;

    var successTests = {
        'aqua': {
            fields: [
                'red',
                'blue',
                'green'
            ],
            value: {
                red: 0,
                blue: 255,
                green: 255
            }
        },
        '#f88': {
            fields: [
                'red',
                'blue',
                'green'
            ],
            value: {
                red: 255,
                blue: 136,
                green: 136
            }
        },
        '#ff8080': {
            fields: [
                'red',
                'blue',
                'green'
            ],
            value: {
                red: 255,
                blue: 128,
                green: 128
            }
        },
        'rgb(255,128,128)': {
            fields: [
                'red',
                'blue',
                'green',
                'alpha'
            ],
            value: {
                red: 255,
                blue: 128,
                green: 128,
                alpha: 1
            }
        },
        'rgba(255,128,128)': {
            fields: [
                'red',
                'blue',
                'green',
                'alpha'
            ],
            value: {
                red: 255,
                blue: 128,
                green: 128,
                alpha: 1
            }
        },
        'rgb(255,128,128,0.3)': {
            fields: [
                'red',
                'blue',
                'green',
                'alpha'
            ],
            value: {
                red: 255,
                blue: 128,
                green: 128,
                alpha: 1
            }
        },
        'rgba(255,128, 128,.3)': {
            fields: [
                'red',
                'blue',
                'green',
                'alpha'
            ],
            value: {
                red: 255,
                blue: 128,
                green: 128,
                alpha: 0.3
            }
        },
        'hsl(360,30%,80%)': {
            fields: [
                'hue',
                'saturation',
                'lightness',
                'alpha'
            ],
            value: {
                hue: 360,
                saturation: 0.3,
                lightness: 0.8,
                alpha: 1
            }
        },
        'hsla(360,30%,80%)': {
            fields: [
                'hue',
                'saturation',
                'lightness',
                'alpha'
            ],
            value: {
                hue: 360,
                saturation: 0.3,
                lightness: 0.8,
                alpha: 1
            }
        },
        'hsl(360,30%,80%,.4)': {
            fields: [
                'hue',
                'saturation',
                'lightness',
                'alpha'
            ],
            value: {
                hue: 360,
                saturation: 0.3,
                lightness: 0.8,
                alpha: 1
            }
        },
        'hsla(360,30%,80%,.4)': {
            fields: [
                'hue',
                'saturation',
                'lightness',
                'alpha'
            ],
            value: {
                hue: 360,
                saturation: 0.3,
                lightness: 0.8,
                alpha: .4
            }
        }
    };

    xs.Object.each(successTests, function ( test, css ) {
        strictEqual(JSON.stringify(xs.Object.pick(Color.fromCSS(css), test.fields)), JSON.stringify(test.value), 'test css factory for ' +
            css);
    });

    var failedTests = [
        'aquas', //unknown name of color
        '#gf8080', //incorrect hex letter
        'ff8080', //hex without sharp
        '#ff80080', //hex with incorrect length
        '#ff880', //hex with incorrect length
        'rgb(255,128.128)', //symbol loss
        'rfb(255,128,128)', //symbol incorrect
        'rgba(256,128,128)', //wrong color range
        'rgbs(255,128,128)', //wrong text
        'rgba(255,128,128,112.3)', //wrong alpha format
        'hsl(360,30%.50%)', //symbol loss
        'hdl(360,40%,30%)', //symbol incorrect
        'hsla(256,100%,120%)', //wrong range
        'hsla(366,100%,100%)', //wrong range
        'hsls(360,10%,10%)', //wrong text
        'hsla(360,10%,10%,112.3)' //wrong alpha format
    ];

    xs.Object.each(failedTests, function ( test ) {
        strictEqual(Color.fromCSS(test), false, 'test css factory for ' + test);
    });
});
test('factory', function () {

    //from Rgb section
    var Color = xs.draw.Color, color, test;
    var tests = xsDrawColorColors();

    //rgb section
    test = tests.pop().rgb;

    //array
    color = Color.from([
        test.red,
        test.green,
        test.blue
    ]);
    strictEqual(JSON.stringify(xs.Object.pick(color, 'red', 'green', 'blue')), JSON.stringify(test), 'test rgb factory for ' +
        test.name + ' creating from array');
    //object
    color = Color.from(test);
    strictEqual(JSON.stringify(xs.Object.pick(color, 'red', 'green', 'blue')), JSON.stringify(test), 'test rgb factory for ' +
        test.name + ' creating from object');
    //list
    color = Color.from(test.red, test.green, test.blue);
    strictEqual(JSON.stringify(xs.Object.pick(color, 'red', 'green', 'blue')), JSON.stringify(test), 'test rgb factory for ' +
        test.name + ' creating from list');

    //hsl section
    test = tests.pop().hsl;

    //array
    color = Color.from([
        test.hue,
        test.saturation,
        test.lightness
    ]);
    strictEqual(JSON.stringify(xs.Object.pick(color, 'hue', 'saturation', 'lightness')), JSON.stringify(test), 'test hsl factory for ' +
        test.name + ' creating from array');
    //object
    color = Color.from(test);
    strictEqual(JSON.stringify(xs.Object.pick(color, 'hue', 'saturation', 'lightness')), JSON.stringify(test), 'test hsl factory for ' +
        test.name + ' creating from object');
    //list
    color = Color.from(test.hue, test.saturation, test.lightness);
    strictEqual(JSON.stringify(xs.Object.pick(color, 'hue', 'saturation', 'lightness')), JSON.stringify(test), 'test hsl factory for ' +
        test.name + ' creating from list');

    //css factory section
    var successTests = {
        'aqua': {
            fields: [
                'red',
                'blue',
                'green'
            ],
            value: {
                red: 0,
                blue: 255,
                green: 255
            }
        },
        '#f88': {
            fields: [
                'red',
                'blue',
                'green'
            ],
            value: {
                red: 255,
                blue: 136,
                green: 136
            }
        },
        '#ff8080': {
            fields: [
                'red',
                'blue',
                'green'
            ],
            value: {
                red: 255,
                blue: 128,
                green: 128
            }
        },
        'rgb(255,128,128)': {
            fields: [
                'red',
                'blue',
                'green',
                'alpha'
            ],
            value: {
                red: 255,
                blue: 128,
                green: 128,
                alpha: 1
            }
        },
        'rgba(255,128,128)': {
            fields: [
                'red',
                'blue',
                'green',
                'alpha'
            ],
            value: {
                red: 255,
                blue: 128,
                green: 128,
                alpha: 1
            }
        },
        'rgb(255,128,128,0.3)': {
            fields: [
                'red',
                'blue',
                'green',
                'alpha'
            ],
            value: {
                red: 255,
                blue: 128,
                green: 128,
                alpha: 1
            }
        },
        'rgba(255,128, 128,.3)': {
            fields: [
                'red',
                'blue',
                'green',
                'alpha'
            ],
            value: {
                red: 255,
                blue: 128,
                green: 128,
                alpha: 0.3
            }
        },
        'hsl(360,30%,80%)': {
            fields: [
                'hue',
                'saturation',
                'lightness',
                'alpha'
            ],
            value: {
                hue: 360,
                saturation: 0.3,
                lightness: 0.8,
                alpha: 1
            }
        },
        'hsla(360,30%,80%)': {
            fields: [
                'hue',
                'saturation',
                'lightness',
                'alpha'
            ],
            value: {
                hue: 360,
                saturation: 0.3,
                lightness: 0.8,
                alpha: 1
            }
        },
        'hsl(360,30%,80%,.4)': {
            fields: [
                'hue',
                'saturation',
                'lightness',
                'alpha'
            ],
            value: {
                hue: 360,
                saturation: 0.3,
                lightness: 0.8,
                alpha: 1
            }
        },
        'hsla(360,30%,80%,.4)': {
            fields: [
                'hue',
                'saturation',
                'lightness',
                'alpha'
            ],
            value: {
                hue: 360,
                saturation: 0.3,
                lightness: 0.8,
                alpha: .4
            }
        }
    };

    xs.Object.each(successTests, function ( test, css ) {
        strictEqual(JSON.stringify(xs.Object.pick(Color.from(css), test.fields)), JSON.stringify(test.value), 'test css factory for ' +
            css);
    });

    var failedTests = [
        'aquas', //unknown name of color
        '#gf8080', //incorrect hex letter
        'ff8080', //hex without sharp
        '#ff80080', //hex with incorrect length
        '#ff880', //hex with incorrect length
        'rgb(255,128.128)', //symbol loss
        'rfb(255,128,128)', //symbol incorrect
        'rgba(256,128,128)', //wrong color range
        'rgbs(255,128,128)', //wrong text
        'rgba(255,128,128,112.3)', //wrong alpha format
        'hsl(360,30%.50%)', //symbol loss
        'hdl(360,40%,30%)', //symbol incorrect
        'hsla(256,100%,120%)', //wrong range
        'hsla(366,100%,100%)', //wrong range
        'hsls(360,10%,10%)', //wrong text
        'hsla(360,10%,10%,112.3)' //wrong alpha format
    ];

    xs.Object.each(failedTests, function ( test ) {
        strictEqual(Color.from(test), false, 'test css factory for ' + test);
    });
});
test('creation', function () {
    var color = xs.draw.Color.toRgb({hue: 260, saturation: 0.5, lightness: 0.8});

    //from color object
    strictEqual(JSON.stringify(xs.Object.pick(xs.create('xs.draw.Color', color), 'hue', 'saturation', 'lightness', 'red', 'green', 'blue')), JSON.stringify(color), 'creted from color object');

    //from object
    strictEqual(JSON.stringify(xs.Object.pick(xs.create('xs.draw.Color', {hue: 260, saturation: 0.5, lightness: 0.8}), 'hue', 'saturation', 'lightness', 'red', 'green', 'blue')), JSON.stringify(color), 'created from color object');
});
test('sync', function () {
    var Color = xs.draw.Color;

    var color1 = {
        red: 196,
        green: 179,
        blue: 230,
        hue: 260,
        saturation: 0.5,
        lightness: 0.8
    };

    var color2 = {
        red: 16,
        green: 87,
        blue: 16,
        hue: 120,
        saturation: 0.7,
        lightness: 0.2
    };

    var color = xs.create('xs.draw.Color', color1);

    color.red = color2.red;
    strictEqual(JSON.stringify(xs.Object.pick(color, 'hue', 'saturation', 'lightness')), JSON.stringify(xs.Object.pick(Color.toHsl({
        red: color2.red,
        green: color.green,
        blue: color.blue
    }), 'hue', 'saturation', 'lightness')), 'red sync');

    color.green = color2.green;
    strictEqual(JSON.stringify(xs.Object.pick(color, 'hue', 'saturation', 'lightness')), JSON.stringify(xs.Object.pick(Color.toHsl({
        red: color2.red,
        green: color2.green,
        blue: color.blue
    }), 'hue', 'saturation', 'lightness')), 'green sync');

    color.blue = color2.blue;
    strictEqual(JSON.stringify(xs.Object.pick(color, 'hue', 'saturation', 'lightness')), JSON.stringify(xs.Object.pick(Color.toHsl({
        red: color2.red,
        green: color2.green,
        blue: color2.blue
    }), 'hue', 'saturation', 'lightness')), 'blue sync');

    color.hue = color2.hue;
    strictEqual(JSON.stringify(xs.Object.pick(color, 'red', 'green', 'blue')), JSON.stringify(xs.Object.pick(Color.toRgb({
        hue: color2.hue,
        saturation: color.saturation,
        lightness: color.lightness
    }), 'red', 'green', 'blue')), 'hue sync');

    color.saturation = color2.saturation;
    strictEqual(JSON.stringify(xs.Object.pick(color, 'red', 'green', 'blue')), JSON.stringify(xs.Object.pick(Color.toRgb({
        hue: color2.hue,
        saturation: color2.saturation,
        lightness: color.lightness
    }), 'red', 'green', 'blue')), 'saturation sync');

    color.lightness = color2.lightness;
    strictEqual(JSON.stringify(xs.Object.pick(color, 'red', 'green', 'blue')), JSON.stringify(xs.Object.pick(Color.toRgb({
        hue: color2.hue,
        saturation: color2.saturation,
        lightness: color2.lightness
    }), 'red', 'green', 'blue')), 'lightness sync');
});
test('toRgb formatting', function () {
    var data = {
        red: 196,
        green: 179,
        blue: 230,
        hue: 260,
        saturation: 0.5,
        lightness: 0.8,
        alpha: 0.8
    };

    var color = xs.create('xs.draw.Color', data);

    strictEqual(JSON.stringify(color.toRgb()), JSON.stringify({red: data.red, green: data.green, blue: data.blue, alpha: data.alpha}), 'empty args');
    strictEqual(JSON.stringify(color.toRgb({alpha: false})), JSON.stringify({red: data.red, green: data.green, blue: data.blue}), 'without alpha');
    strictEqual(JSON.stringify(color.toRgb({format: 'array'})), JSON.stringify([
        data.red,
        data.green,
        data.blue,
        data.alpha
    ]), 'as array');
    strictEqual(JSON.stringify(color.toRgb({format: 'array', alpha: false})), JSON.stringify([
        data.red,
        data.green,
        data.blue
    ]), 'as array without alpha');
});
test('toHsl formatting', function () {
    var data = {
        red: 196,
        green: 179,
        blue: 230,
        hue: 260,
        saturation: 0.5,
        lightness: 0.8,
        alpha: 0.8
    };

    var color = xs.create('xs.draw.Color', data);

    strictEqual(JSON.stringify(color.toHsl()), JSON.stringify({hue: data.hue, saturation: data.saturation, lightness: data.lightness, alpha: data.alpha}), 'empty args');
    strictEqual(JSON.stringify(color.toHsl({alpha: false})), JSON.stringify({hue: data.hue, saturation: data.saturation, lightness: data.lightness}), 'without alpha');
    strictEqual(JSON.stringify(color.toHsl({format: 'array'})), JSON.stringify([
        data.hue,
        data.saturation,
        data.lightness,
        data.alpha
    ]), 'as array');
    strictEqual(JSON.stringify(color.toHsl({format: 'array', alpha: false})), JSON.stringify([
        data.hue,
        data.saturation,
        data.lightness
    ]), 'as array without alpha');
});
test('toCss formatting', function () {
    var data = {
        red: 255,
        green: 0,
        blue: 255,
        hue: 300,
        saturation: 1,
        lightness: 0.5,
        alpha: 1
    };

    var color = xs.create('xs.draw.Color', data);

    var tests = [
        {
            options: {model: 'rgb', alpha: true, hex: true, name: true},
            value: 'fuchsia'
        },
        {
            options: {model: 'rgb', alpha: true, hex: true, name: false},
            value: '#ff00ff'
        },
        {
            options: {model: 'rgb', alpha: true, hex: false, name: true},
            value: 'fuchsia'
        },
        {
            options: {model: 'rgb', alpha: true, hex: false, name: false},
            value: 'rgba(255, 0, 255, 1)'
        },
        {
            options: {model: 'rgb', alpha: false, hex: true, name: true},
            value: 'fuchsia'
        },
        {
            options: {model: 'rgb', alpha: false, hex: true, name: false},
            value: '#ff00ff'
        },
        {
            options: {model: 'rgb', alpha: false, hex: false, name: true},
            value: 'fuchsia'
        },
        {
            options: {model: 'rgb', alpha: false, hex: false, name: false},
            value: 'rgb(255, 0, 255)'
        },
        {
            options: {model: 'hsl', alpha: true, hex: true, name: true},
            value: 'fuchsia'
        },
        {
            options: {model: 'hsl', alpha: true, hex: true, name: false},
            value: '#ff00ff'
        },
        {
            options: {model: 'hsl', alpha: true, hex: false, name: true},
            value: 'fuchsia'
        },
        {
            options: {model: 'hsl', alpha: true, hex: false, name: false},
            value: 'hsla(300, 100%, 50%, 1)'
        },
        {
            options: {model: 'hsl', alpha: false, hex: true, name: true},
            value: 'fuchsia'
        },
        {
            options: {model: 'hsl', alpha: false, hex: true, name: false},
            value: '#ff00ff'
        },
        {
            options: {model: 'hsl', alpha: false, hex: false, name: true},
            value: 'fuchsia'
        },
        {
            options: {model: 'hsl', alpha: false, hex: false, name: false},
            value: 'hsl(300, 100%, 50%)'
        }
    ];

    xs.each(tests, function ( test ) {
        strictEqual(color.toCss(test.options), test.value, 'toCss format ok');
    });
});