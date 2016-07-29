var re = require('../utils/re')

function _Maps() {
    var lon, lat, node;

    function Maps(longitude, latitude) {
        lon = longitude;
        lat = latitude;
        return node = re('section', {
            className: "map",
            id: 'Map'

        });
    }
    Maps.onMounted = function(data) {
        google.load('maps', '3', {
            other_params: 'sensor=false',
            callback: function() {
                var map = new google.maps.Map(document.getElementById('Map'), {
                    center: { lat: lat, lng: lon },
                    zoom: 9
                });
                var marker = new google.maps.Marker({
                    position: { lat: lat, lng: lon },
                    map: map,
                    title: 'Hello World!'
                });
                var infowindow = new google.maps.InfoWindow({
                    content: "<h5>"+data+"</h5>"
                });
                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                });
            }
        });
    }
    return Maps
}


module.exports = _Maps();
