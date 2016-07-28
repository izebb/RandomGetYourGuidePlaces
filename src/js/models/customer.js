var fetch = require('../utils/fetch');

function Customer() {
    this.emitters = {};
}

Customer.prototype.dispatch = function(evtType, value) {
    if (!this.emitters[evtType]) {
        return false;
    }
    for (var i = 0; i < this.emitters[evtType].length; i++) {
        var _emit = this.emitters[evtType][i];
        var index = this.emitters[evtType].indexOf(_emit);
        if (index > -1) {
            this.emitters[evtType].splice(index, 1);
        }
        _emit(value);
    }
}

Customer.prototype.on = function(evt) {
    this.emitters[evt] = this.emitters[evt] || [];
    for (var i = 1; i < arguments.length; i++) {
        this.emitters[evt].push(arguments[i]);
    }
}


Customer.prototype.fetch = function() {
    var that = this;
    fetch({
        method: "GET",
        url: "https://www.getyourguide.com/touring.json?key=2Gr0p7z96D"
    }, function(response) {
        that.dispatch('change', response)

    }, function(error) {
        that.dispatch('error', error)
    });
};




module.exports = Customer;
