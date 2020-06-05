	window.onload  = function() {
}

var map;
var markers = [];
var infoWindow;

function initMap() {
    var limerick = {lat: 52.6608187, lng: -8.6549366};
    map = new google.maps.Map(document.getElementById('map'), {
      center: limerick,
      zoom: 13,
      mapTypeId: 'roadmap',
      styles: [
            {elementType: 'geometry', stylers: [{color: '#2F4F4F'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#BC13FE'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#BC13FE'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#0892D0'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
        });
    infoWindow = new google.maps.InfoWindow();
    searchStores()
}

function searchStores() {
  var foundStores = [];
  var eirCodeuser = document.getElementById('eir-code-input').value;

  if (eirCodeuser) {
    for (var store of stores) {
      var code = store['addressLines'][1].slice(-7);
      if (code == eirCodeuser) {
          foundStores.push(store);
        }
      }
    } else {
      foundStores = stores;
  }
clearLocations();
displayStores(foundStores);
showStoreMarkers(foundStores);
onClickSelect();
}

function onClickSelect() {
  var storeElements = document.querySelectorAll('.store-container');
  storeElements.forEach(function(elem, index) {
    elem.addEventListener('click', function() {
      new google.maps.event.trigger(markers[index], 'click');
    })
  })
  }

  function clearLocations(){
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
}

function displayStores(stores) {
  var storesHtml = '';
  var index = 1;
  for(var store of stores) {
    var name = store['name']
    var address = store['addressLines'];
    var phone = store['phoneNumber'];
    storesHtml += `
    <div class="store-container">
                    <div class="store-info-container">
                        <div class="store-address">
                         <span>${name}</span>
                                <span>${address[0]}</span>
                                    <span>${address[1]}</span>
                                        </div>
                                            <div class="store-phone-number">
                                            <i class="fas fa-phone-alt"></i>
                                                <span>${phone}</span>
                                                    </div>
                                                        </div>
                                                            <div class="store-letter-container">
                                                                <div class="store-letter">${index}</div>
                                                                    </div>
                                                                        </div>
                                                                          <hr>
    `
    document.querySelector('.store-list').innerHTML = storesHtml;
    index += 1;
  }
}

function showStoreMarkers(stores) {
  var bounds = new google.maps.LatLngBounds();
  for (var store of stores) {

    var latlng = new google.maps.LatLng(
                  store['coordinates']['latitude'],
                  store['coordinates']['longitude']);
    var name = store['name'];
    var address = store['addressLines'][0]
    var phone = store['phoneNumber']
    var type = store['type']
    bounds.extend(latlng);
    createMarker(latlng, name, address, phone);
  }

    // map.fitBounds(bounds);
}

function createMarker(latlng, name, address, phone) {
  var html = `
  <div class='info-window-container'>
    <div class='info-container'>
      <div class='info-window-title'>${name}</div>
        <hr>
          <div class='location-container'>
            <div class='symbol-container'><i class='fas fa-location-arrow'></i></div><div class='address'>${address}</div></div>
              <div class='phone-container'>
                <div class='symbol-container'><i class='fas fa-phone-alt'></i></div><div class='number'>${phone}</div></div>
                  </div>
                    </div>`
  var image = 'images/pin.png'
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    icon: image,
  });
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}
