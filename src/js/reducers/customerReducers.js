var CONSTANTS = require('../constants/actionConstants');


module.exports = function(state, action) {
    var state = state || {};
        	console.log(action);
    switch (action.type) {
        case CONSTANTS.REQUEST_CUSTOMER:
            return {
            	 customer:{}
        		isFetching: action.isFetching
            };
        case CONSTANTS.RECEIVE_CUSTOMER:
            return  {
            	 customer: action.customer,
        		isFetching: action.isFetching
            };
        case CONSTANTS.FETCH_CUSTOMER_ERROR:
            return  {
            	 error: action.error,
        		isFetching: action.isFetching
            };

        default:
            return state;
    }
}
