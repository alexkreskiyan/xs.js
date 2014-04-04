function speed(fn, n) {
    var start = Date.now();
    for (var i = 0; i < n; i++) {
        fn();
    }
    var duration = Date.now() - start;
    console.log('duration: ', duration, 'ms for ', n, 'operations');
    console.log('median: ', duration / n, 'ms per operation');
    console.log('mark: about', n / duration, 'operation per ms');
}
'use strict';
function conversionTests() {
    return [
        {
            name: 'white',
            rgb: [255, 255, 255],
            hsl: [0, 0, 1]
        },
        {
            name: 'silver',
            rgb: [192, 192, 192],
            hsl: [0, 0, 0.75]
        },
        {
            name: 'gray',
            rgb: [128, 128, 128],
            hsl: [0, 0, 0.5]
        },
        {
            name: 'black',
            rgb: [0, 0, 0],
            hsl: [0, 0, 0]
        },
        {
            name: 'maroon',
            rgb: [128, 0, 0],
            hsl: [0, 1, 0.25]
        },
        {
            name: 'red',
            rgb: [255, 0, 0],
            hsl: [0, 1, 0.5]
        },
        {
            name: 'orange',
            rgb: [255, 165, 0],
            hsl: [38.8, 1, 0.5]
        },
        {
            name: 'yellow',
            rgb: [255, 255, 0],
            hsl: [60, 1, 0.5]
        },
        {
            name: 'olive',
            rgb: [128, 128, 0],
            hsl: [60, 1, 0.25]
        },
        {
            name: 'lime',
            rgb: [0, 255, 0],
            hsl: [120, 1, 0.5]
        },
        {
            name: 'green',
            rgb: [0, 128, 0],
            hsl: [120, 1, 0.25]
        },
        {
            name: 'aqua',
            rgb: [0, 255, 255],
            hsl: [180, 1, 0.5]
        },
        {
            name: 'blue',
            rgb: [0, 0, 255],
            hsl: [240, 1, 0.5]
        },
        {
            name: 'navy',
            rgb: [0, 0, 128],
            hsl: [240, 1, 0.25]
        },
        {
            name: 'teal',
            rgb: [0, 128, 128],
            hsl: [180, 1, 0.25]
        },
        {
            name: 'fuchsia',
            rgb: [255, 0, 255],
            hsl: [300, 1, 0.5]
        },
        {
            name: 'purple',
            rgb: [128, 0, 128],
            hsl: [300, 1, 0.25]
        }

    ];
}
module('xs.draw.Color');
test('conversion', function () {
    var tests = conversionTests();
    var Color = xs.draw.Color;
    xs.Array.each(tests, function (test) {
        strictEqual(Color.toHSL.apply(Color, test.rgb).toString(), test.hsl.toString(), 'test convertion to HSL for ' + test.name);
        strictEqual(Color.toRGB.apply(Color, test.hsl).toString(), test.rgb.toString(), 'test convertion to RGB for ' + test.name);
    });
});
