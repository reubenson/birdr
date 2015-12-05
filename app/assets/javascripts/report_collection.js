markers = [];

$(document).on('keyup','#search', function(){
  var search = $(this).val();
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
});

$(document).on('click','li.select_species', function(){
  $(this).siblings().removeClass('active');
  $(this).addClass('active');

  var latitude = $('#species-list').data().lat;
  var longitude = $('#species-list').data().lng;
  var species = $(this).data().species;
  $.ajax({
    url: "http://ebird.org/ws1.1/data/obs/geo_spp/recent?lng="+longitude+
      "&lat="+latitude+"&dist=30&back=30&sci="+species+"&fmt=json"
  }).success(function(data){
    deleteMarkers();
    var i = 0;
    var animation_length = 1500.0; // 1500 ms
    var drop_length = Math.min(100,animation_length/data.length);
    data.forEach(function(report){
      var myLatlng = new google.maps.LatLng(report.lat,report.lng);
      addMarkerWithTimeout(myLatlng, i * drop_length+(Math.random()*20-10));
      i+=1;
    })
  })

  var common_name = $(this).text().toLowerCase();
  makeWikipediaAPIRequest(common_name);
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

function makeWikipediaAPIRequest(species){
  var url = "https://en.wikipedia.org/w/api.php?action=query&titles="+species+"&prop=extracts&exsentences=8&explaintext=&format=json";
  $.ajax(url, {
    dataType: "JSONP"
    // headers: {
    //  origin: 'http://brdr.heroku.com',
    //  content_type: "application/json; charset=UTF-8"
    // }
  }).success(function(data){
    var page_id = Object.keys(data.query.pages)[0];
    var wikipedia_text = data.query.pages[page_id].extract;
    var wikipedia_url = "https://en.wikipedia.org/?curid="+page_id;

    $('#wikipedia').append(wikipedia_text);
    $('#wikipedia').append("<a href='"+wikipedia_url+"'>(Sourced from Wikipedia)</a>");
  });
}
