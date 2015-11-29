// var markers = [];

$(document).on('keyup','#search', function(){
  var search = $(this).val();
  if (search.length>=0) {
    var species_list = $('li.list-group-item');
    for (var i = 0; i < species_list.length; i++) {
      var name = $(species_list[i]).text();
      var str = new RegExp(search,'i');
      if ( str.test(name) ) {
        $(species_list[i]).show();
      } else {
        $(species_list[i]).hide();
      }
    }
  }
});

$(document).on('click','li.select_species', function(){
  $(this).siblings().removeClass('active');
  $(this).addClass('active');
  // debugger;
  var longitude = -73.96;
  var latitude = 40.65;
  var species = $(this).data().species;
  $.ajax({
    url: "http://ebird.org/ws1.1/data/obs/geo_spp/recent?lng="+longitude+
      "&lat="+latitude+"&dist=30&back=30&sci="+species+"&fmt=json",
  }).success(function(data){
    deleteMarkers();
    // var myLatlng = new google.maps.LatLng(latitude,longitude);
    // var mapOptions = {
        //  zoom: 10,
        // center: myLatlng
    // };
    var i = 0;
    data.forEach(function(report){
      var myLatlng = new google.maps.LatLng(report.lat,report.lng);
      addMarkerWithTimeout(myLatlng, i * 100);
      i+=1;
    })
  })
})

function addMarkerWithTimeout(position, timeout) {
  window.setTimeout(function() {
    markers.push(new google.maps.Marker({
      position: position,
      map: map,
      animation: google.maps.Animation.DROP
    }));
  }, timeout);
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
  setMapOnAll(null);
}

function deleteMarkers() {
  clearMarkers();
  markers = [];
}
