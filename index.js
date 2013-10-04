var defaults = require('defaults');

var defaultOptions = {
    pushInterval: 200
};


function Map(name, deps, options) {
    options = defaults(options, defaultOptions);
    this.positionPushInterval = 200;  // ms
    this.positionDirty = false;
    this.dronePosition = null;
    this.sockets = deps.sockets;
    //deps.client.on('navdata', this._handleNavData.bind(this));
    //setInterval(this._maybePushPosition.bind(this), options.pushInterval);
}


Map.prototype._handleNavData = function(navdata) {
    if (navdata.gps) {
        this.dronePosition = {
            latitude: navdata.gps.latitude,
            longitude: navdata.gps.longitude
        };
        this.positionDirty = true;
    }
};


Map.prototype._maybePushPosition = function() {
    if (this.positionDirty) {
        this.sockets.emit('gpsposition', dronePosition);
        this.positionDirty = false;
    }
}


function map(name, deps) {
    m = new Map(name, deps);
}


module.exports = map;
