// var markers = [];

$(function(){
  // jQuery('.gm-style').removeClass('gm-style');
  // debugger;
})

$(document).on('click','li.select_species', function(){
  var longitude = -73.96;
  var latitude = 40.65;
  var species = $(this).data().species;
  $.ajax({
    url: "http://ebird.org/ws1.1/data/obs/geo_spp/recent?lng="+longitude+
      "&lat="+latitude+"&dist=30&back=30&sci="+species+"&fmt=json",
  }).success(function(data){
    // debugger;
    deleteMarkers();
    // debugger;
    // var myLatlng = new google.maps.LatLng(latitude,longitude);
    // var mapOptions = {
        //  zoom: 10,
        // center: myLatlng
    // };
    // var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    data.forEach(function(report){
      // debugger;
      var myLatlng = new google.maps.LatLng(report.lat,report.lng);
      var marker = new google.maps.Marker({
          position: myLatlng,
          // title: "Observed on date"+<%= report.obs_dt.to_s || " " %>
          title: ""+report.comName+" (Observed on "+report.obsDt+")"
      });
      // debugger;
      marker.setMap(map);
      markers.push(marker);
    })
  })
})

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
