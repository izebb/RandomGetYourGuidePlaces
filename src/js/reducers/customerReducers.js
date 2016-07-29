/**
 * Flux Reducer Objects
 * 
 */

var CONSTANTS = require('../constants/actionConstants');


module.exports = function(state, action) {
    var state = state || {};
    var _state = Object.create(state);
    switch (action.type) {
        case CONSTANTS.REQUEST_CUSTOMER:
            _state.customer = {};
            _state.isFetching = action.isFetching;
            return _state;
        case CONSTANTS.RECEIVE_CUSTOMER:
            _state.customer = action.customer;
            _state.isFetching = action.isFetching;
            return _state;
        case CONSTANTS.FETCH_CUSTOMER_ERROR:
            _state.error = action.error;
            _state.isFetching = action.isFetching;
            return _state;
        default:
            return state;
    }
}   
