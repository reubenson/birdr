"use strict"

var markers = [];
var last_clicked_species = null;

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

  var common_name = $(this).text().trim().toLowerCase();
  makeWikipediaAPIRequestAndAppendInfo(common_name,this);
  $(this).find('.wikipedia-info').slideDown(1000, function(){
    self = this;
    hidePreviousSelection(self);
  });
})

function hidePreviousSelection(self){
  if (last_clicked_species) {
    $(last_clicked_species).slideUp(300,function(){
      scrollToTop(self);
    });
  }
  last_clicked_species = $(self).parent();
}

function scrollToTop(self) {
  var scroll_position = $(self).prev().prev().offset().top;
  $(document).scrollTop(scroll_position-65);
}

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

function makeWikipediaAPIRequestAndAppendInfo(species,current_el){
  // https://en.wikipedia.org/wiki/Special:ApiSandbox#action=query
  var user_agent = "brdr/1.0 (http://brdr.herokuapp.com/; reubenson@gmail.com)"
  var url = "https://en.wikipedia.org/w/api.php?action=query&titles="+species+"&prop=extracts&exchars=500&explaintext=&format=json";
  $.ajax({
    url: url,
    dataType: "JSONP",
    headers: { 'Api-User-Agent': user_agent }
  }).success(function(data){
    var page_id = Object.keys(data.query.pages)[0];
    var wikipedia_text = data.query.pages[page_id].extract;
    wikipedia_text = wikipedia_text.replace("== Description ==","")
    var wikipedia_url = "https://en.wikipedia.org/?curid="+page_id;

    var wiki_text = wikipedia_text+
                "<a href='"+wikipedia_url+"' target='_blank'> (Read more on Wikipedia)</a>";

    var wiki_el = $(current_el).find('.wikipedia-info').find('.wikipedia-text');
    $(wiki_el).html(wiki_text);
  });

  var img_api_url = "https://en.wikipedia.org/w/api.php?action=query&titles="
  +species+"&generator=images&gimlimit=1&prop=imageinfo&iiprop=url&iiurlwidth=600&format=json"
  $.ajax({
    url: img_api_url,
    dataType: "JSONP",
    headers: { 'Api-User-Agent': user_agent }
  }).success(function(data){
    var img_url = data.query.pages["-1"].imageinfo[0].thumburl;
    var description_url = data.query.pages["-1"].imageinfo[0].descriptionurl;
    var img_html = "<a href='"+description_url+"' target='_blank'><img src='"+img_url+"'>"+"</a>"

    var wiki_el = $(current_el).find('.wikipedia-info').find('.wikipedia-img');
    $(wiki_el).html(img_html);
  });
}

$(document).on('scroll', function(){
  var species_list = $('#notice').height(); + $('#notice').offset().top;

  var position = $('.filter-species').height();
  var scroll_length = species_list + 10;

  if ($(document).scrollTop()>scroll_length ) {
    $(".filter-species").addClass('filter-species-fixed');
    $(".filter-species-fixed").removeClass('filter-species');
    // $("#filter-species").css("width","52.5%");
    // console.log($(document).scrollTop());
  } else {
    // debugger;
    // console.log($(document).scrollTop());
    $(".filter-species-fixed").addClass('filter-species');
    $(".filter-species").removeClass("filter-species-fixed");
    // $("#filter-species").css("width","95%");
  }
})
