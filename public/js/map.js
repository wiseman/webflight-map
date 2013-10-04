(function(window, document) {
    console.log('Loading map view plugin');

    var bingKey = ('AnFxXUB376BgaEQMj947c43V45ipmMvdcoY-' +
                   'TAE4-Y23mu1yFLHF0k2BMJP-MU1B');

    var MapView = function(cockpit) {
        console.log('Initializing map view plugin');
        $('#cockpit').append('<div id="map"></div>');
        this.lastPos = null;

        var initialPos = [34.090359093568644, -118.276604];
        var initialZoom = 21;
        this.map = L.map('map').setView(initialPos, initialZoom);
        this.bingLayer = new L.BingLayer(
            bingKey,
            {
                type: 'AerialWithLabels',
                maxZoom: 21
            });
        this.bingLayer.addTo(this.map);
        L.Icon.Default.imagePath = 'http://cdn.leafletjs.com/leaflet-0.6.4/images';
        this.marker = L.marker(initialPos).addTo(this.map);

        // Update when drone telemetry comes in.
        cockpit.socket.on('navdata', this.handleNavdata_.bind(this));
    };

    MapView.prototype.handleNavdata_ = function(navdata) {
        if (navdata.gps && navdata.gps.lat_fuse && navdata.gps.lon_fuse) {
            var pos = [navdata.gps.lat_fuse, navdata.gps.lon_fuse];
            if (!this.lastPos || pos[0] != this.lastPos[0] || pos[1] != this.lastPos[1]) {
                console.log('updating ' + pos);
                this.lastPos = pos;
                this.marker.setLatLng(pos);
                this.map.panTo(pos);
            }
        }
    };

    window.Cockpit.plugins.push(MapView);
}(window, document));

