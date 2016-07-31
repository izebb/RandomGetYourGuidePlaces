var re = require('../utils/re');
var Background = require('./Background');
var Labels = require('./Labels');
var Maps = require('./Maps');


/**
 * Collection View aggregate all the view object
 *     
 */
function RandomPlace(data, node) {
    var customer = data.customer;
    var _dom;
    if (!data.isFetching) {
        _dom = re('div',
            Labels(customer.customerFirstName, customer.activityTitle),
            Maps(customer.activityCoordinateLongitude, customer.activityCoordinateLatitude),
            Background(customer.activityPictureUrl), {
                className: 'customer'
            }
        )
    } else {
        _dom = re('div',
            re('div', 'Loading...', {
                className: 'loader'
            }), {
                className: 'customer'
            }
        )
    }
    re.render(node, _dom);
    if (!data.isFetching) {
        Maps.onMounted(customer.activityTitle);

    }

}

module.exports = RandomPlace;
