/**
 * Label contain customer title, customer title
 * @param String name  
 * @param String  title
 * @return Function function that contains dom object
 */

var re = require('../utils/re');

function Labels(name, title) {
    var _label = re('section',
        re('h1', title, {
            className: 'customer-title'

        }),
        re('h3', name, {
            className: 'customer-name'
        }), {
            className: "customer-details"
        });
    return _label;
}


module.exports = Labels;
