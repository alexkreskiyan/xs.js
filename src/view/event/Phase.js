/**
 * Enum, that specifies view events phases
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @private
 *
 * @class xs.view.event.Phase
 */
xs.define(xs.Enum, 'xs.view.event.Phase', {
    Capture: 0x1,
    Target: 0x2,
    Bubble: 0x4
});