function EventEmitter(reducer) {
    this.emitters = {};
    this.reducer = reducer;
    this.state = this.reducer(null, {type: null});
}


EventEmitter.prototype.getState = function() {
   return this.state;
}


EventEmitter.prototype.dispatch = function(evtType, action) {
    for (var i = 0; i < this.emitters[evtType].length; i++) {
        var _emit = this.emitters[evtType][i];
        this.state = this.reducer(this.getState(), action);
        _emit(this.state);
    }
}

EventEmitter.prototype.on = function(evt) {
    this.emitters[evt] = this.emitters[evt] || [];
    for (var i = 1; i < arguments.length; i++) {
        this.emitters[evt].push(arguments[i]);
    }
}

module.exports = EventEmitter;