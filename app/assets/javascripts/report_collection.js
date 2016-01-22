"use strict"

var markers = [];
var last_clicked_species = null;
var touch_start = 0;

$(function(){
  $('.col-xs-4').bind('scroll', function() {
    var species_list = $('#notice').height(); + $('#notice').offset().top;
    var position = $('.filter-species').height();
    var scroll_length = species_list + 10;
    if ($('.col-xs-4').scrollTop()>scroll_length ) {
      $(".filter-species").addClass('filter-species-fixed');
      $(".filter-species-fixed").removeClass('filter-species');
    } else {
      $(".filter-species-fixed").addClass('filter-species');
      $(".filter-species").removeClass("filter-species-fixed");
    }
  });
});

$(document).on('click','#bird-bio-btn',function(){
  $(this).addClass('active');
  $('#bird-map-btn').removeClass('active');
  $('#wikipedia-info').show();
  $('#wikipedia-info-background').show();
  $('#map').hide();
})

$(document).on('click','#bird-map-btn',function(){
  $(this).addClass('active');
  $('#bird-bio-btn').removeClass('active');
  $('#wikipedia-info').hide();
  $('#wikipedia-info-background').hide();
  google.maps.event.trigger(map, 'resize');
  $('#map').show();
})

$(document).on('click','#view-button',function(event){
  toggleBio();
})

$(document).on('click','#nearest-sighting-button',function(){
  findNearestBird();
})

$(document).on('keyup','#search', function(){
  var search = $(this).val();
  var species_list = $('li.list-group-item');
  var no_birds_found = true;
  for (var i = 0; i < species_list.length; i++) {
    var name = $(species_list[i]).text();
    var str = new RegExp(search,'i');
    if ( str.test(name) ) {
      $(species_list[i]).show();
      no_birds_found = false;
    } else {
      $(species_list[i]).hide();
    }
  }

  if (no_birds_found) {
    $('#bird-not-found').show();
  } else {
    $('#bird-not-found').hide();
  }
});

$(document).on('touchstart', function(event){
  touch_start = event.originalEvent.touches[0].pageY;
})

$(document).on('click ','li.select-species', function(event){
  // if (event.type!="click" && Math.abs(event.originalEvent.changedTouches[0].pageY - touch_start)>10) {
  //   return;
  // }
  if (last_clicked_species && this === last_clicked_species[0]) {
    toggleBio();
    return;
  }

  $('#view-title').slideDown(0);
  if ($('#view-button').text() == '(Hide Bio)') {
    $('#wikipedia-info').show();
    $('#wikipedia-info-background').show();
  }
  if (last_clicked_species) { last_clicked_species.removeClass('active'); }
  $(this).addClass('active');

  var species = $(this).data().species;

  $('#view-title h3').text( $(this).text().trim() );
  displayEBirdSpeciesData(species);
  displayWikipediaSpeciesData(species,this);

  last_clicked_species = $(this);
})

$(document).change('#bird-select', function(){
  var species = $( "select option:selected" ).val();
  var self = $("ul").find("[data-species='" + species + "']");
  $(self).siblings().removeClass('active');
  $(self).addClass('active');

  $('.mobile-button').show();

  displayEBirdSpeciesData(species);
  displayWikipediaSpeciesData(species,self);
})

// $(document).on('click','#info-link', function(event) {
//   if ($('#info').css("display")=="none") {
//     $('#info').show();
//     $('.container').addClass('make-background');
//   } else {
//     $('#info').hide();
//     $('.container').removeClass('make-background');
//   }
//   event.stopPropagation();
// })

$(document).on('click',window,function(event){
  if (event.target.id == "info-link" && $('#info').css("display")=="none") {
     $('#info').show();
     $('.container').addClass('make-background');
     return
   } else if ($('#info').css("display")=="block") {
    $('#info').hide();
    $('.container').removeClass('make-background');
  }
})

$(document).on('click','.navbar button', function(event) {
  var input = $(this).parent().find('input:text').val();
  if (input == "") { event.preventDefault(); }

  if ( $(window).width() < 550 ) {
    if ($('.location-search input').css('display') == "none" ) {
      $('.location-search').addClass('location-search-widen');
    } else {
      $('.location-search').removeClass('location-search-widen');
    }
    $(this).parent().siblings().toggle();
    $('.location-search input').toggle();
  }
})

$(window).resize(function() {
  setMapSize();
})

$(function() {
  if ( $('#notice').text().indexOf("No birds") != -1 ) {
    $('.filter-species').hide();
  }
})

function toggleBio() {
  if ($('#view-button').text() == '(Hide Bio)') {
    $('#wikipedia-info').slideUp(0);
    $('#wikipedia-info-background').addClass('reduce-background');
    $('#view-button').text("(Show Bio)");

  } else {
    $('#wikipedia-info').slideDown(0);
    $('#wikipedia-info-background').slideDown(0);
    $('#wikipedia-info-background').removeClass('reduce-background');
    $('#view-button').text("(Hide Bio)");
  }
}

function displayEBirdSpeciesData(species) {
  var latitude = $('#species-list').data().lat;
  var longitude = $('#species-list').data().lng;

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
      addMarkerWithTimeout(myLatlng, report.obsDt, i * drop_length+(Math.random()*20-10));
      i+=1;
    })
  })
}

function findNearestBird(species) {
  var searched_name = $('.filter-species input:text').val()

  $.ajax({
    url: "/bird/sci_name",
    data: {searched_name: searched_name}
  }).success(function(data){
    if (data.success) {
      eBirdNearestLocation(data.text);
    } else {
      alert(data.text)
    }
  })
}

function eBirdNearestLocation(species) {
  var latitude = $('#species-list').data().lat;
  var longitude = $('#species-list').data().lng;
  $.ajax({
    url: "http://ebird.org/ws1.1/data/nearest/geo_spp/recent?"+
    "lat=" + latitude + "&" +
    "lng=" + longitude + "&" +
    "sci=" + species +
    "&back=30&maxResults=1&fmt=json"
  }).success(function(data){
    var found_lat = data[0].lat;
    var found_lng = data[0].lng;
    location.href = "/?geocoordinates="+found_lat+','+found_lng
  })
}

function displayWikipediaSpeciesData(species,self) {
  var common_name = $(self).text().trim().toLowerCase();
  makeWikipediaAPIRequestAndAppendInfo(common_name,self);
}

// function hidePreviousSelection(self){
//   if (last_clicked_species) {
//     $(last_clicked_species).find('.wikipedia-info').slideUp(300,function(){
//       scrollToTop(self);
//     });
//   }
//   last_clicked_species = $(self).parent();
// }

// function scrollToTop(self) {
//   var scroll_position = $(self).prev().prev().offset().top;
//   $(document).scrollTop(scroll_position-65);
// }

function addMarkerWithTimeout(position, date, timeout) {
  window.setTimeout(function() {
    markers.push(new google.maps.Marker({
      position: position,
      map: map,
      title: "Observation Date: " + date,
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
  var user_agent = "brdr/1.0 (http://brdr.herokuapp.com/; reubenson@gmail.com)"
  retrieveWikipediaImage(species,current_el,user_agent);
  retrieveWikipediaText(species,current_el,user_agent);
}

function retrieveWikipediaImage(species,current_el,user_agent){
  // https://en.wikipedia.org/wiki/Special:ApiSandbox#action=query
  var img_api_url = "https://en.wikipedia.org/w/api.php?action=query&titles="
  +species+"&prop=pageimages&format=json&redirects"
  // add case to handle redirects to bird page (i.e. for 'redhead')
  $.ajax({
    url: img_api_url,
    dataType: "JSONP",
    headers: { 'Api-User-Agent': user_agent }
  }).success(function(data){
    var page_id = Object.keys(data.query.pages)[0];
    try {
      var thumb_url = data.query.pages[page_id].thumbnail.source;
      var img_width = $('.col-xs-8').width();
      img_width = 400;
      var img_url = thumb_url.replace(/[0-9]+px/,img_width+'px');
      var img_html = "<a href='"+img_url+"' target='_blank'><img src='"+img_url+"'>"+"</a>"
    } catch(err) {
      var img_html = false
    }

    if (img_html) {
      $('#wikipedia-info figure > a').replaceWith(img_html);
      $('#wikipedia-info-background').css('background-image','url('+img_url+')');
    } else {
      $('#wikipedia-info figure > a').replaceWith('<a></a>');
      $('#wikipedia-info-background').css('background-color','black');
    }
  });
}

function retrieveWikipediaText(species,current_el,user_agent){
  var url = "https://en.wikipedia.org/w/api.php?action=query&titles="+species+"&prop=extracts&exchars=500&explaintext=&format=json&redirects";
  // add case to handle redirects to bird page (i.e. for 'redhead')
  $.ajax({
    url: url,
    dataType: "JSONP",
    headers: { 'Api-User-Agent': user_agent }
  }).success(function(data){
    var page_id = Object.keys(data.query.pages)[0];
    var wikipedia_text = data.query.pages[page_id].extract;
    wikipedia_text = wikipedia_text.replace(/==[ \w+.+ ]+==/g,"");
    var wikipedia_url = "https://en.wikipedia.org/?curid="+page_id;

    var wiki_text = wikipedia_text+
      "<a href='"+wikipedia_url+"' target='_blank'> (Read more on Wikipedia)</a>";

    $('#wikipedia-info figcaption').html(wiki_text);
  });
}

function setMapSize() {
  var total_height = $(window).height();
  var unavailable_height = $('.col-xs-4').height();
  var map_height = total_height-unavailable_height;
  if (unavailable_height < total_height) {
    $('#map').height(map_height);
  }
}
