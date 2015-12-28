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

$(document).on('click touchend','#bird-bio-btn',function(){
  $(this).addClass('active');
  $('#bird-map-btn').removeClass('active');
  $('#wikipedia-info').show();
  $('#wikipedia-info-background').show();
  $('#map').hide();
})

$(document).on('click touchend','#bird-map-btn',function(){
  $(this).addClass('active');
  $('#bird-bio-btn').removeClass('active');
  $('#wikipedia-info').hide();
  $('#wikipedia-info-background').hide();
  google.maps.event.trigger(map, 'resize');
  $('#map').show();
})

$(document).on('click touchend','#view-button',function(){
  if ($('#view-button').text() == '-') {
    $('#wikipedia-info').slideUp(200);
    $('#wikipedia-info-background').addClass('reduce-background');
    $('#view-button').text("+");
  } else {
    $('#wikipedia-info').slideDown(500);
    $('#wikipedia-info-background').slideDown(500);
    $('#wikipedia-info-background').removeClass('reduce-background');
    $('#view-button').text("-");
  }
})

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

$(document).on('touchstart', function(event){
  touch_start = event.originalEvent.touches[0].pageY;
})

$(document).on('click touchend','li.select_species', function(event){
  if (event.type!="click" && Math.abs(event.originalEvent.changedTouches[0].pageY - touch_start)>10) {
    return;
  }

  if ($('#view-button').text() == '-') {
    $('#wikipedia-info').show();
    $('#wikipedia-info-background').show();
  }
  $('#view-title').slideDown(200);

  $(this).siblings().removeClass('active');
  $(this).addClass('active');

  var species = $(this).data().species;

  $('#view-title h3').text( $(this).text().trim() );
  displayEBirdSpeciesData(species);
  displayWikipediaSpeciesData(species,this);
})

$(document).change('#bird-select', function(){
  var species = $( "select option:selected" ).val();
  var self = $("ul").find("[data-species='" + species + "']");
  $(self).siblings().removeClass('active');
  $(self).addClass('active');

  // var species = $(this).data().species;
  $('.mobile-button').show();

  displayEBirdSpeciesData(species);
  displayWikipediaSpeciesData(species,self);
})

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
      addMarkerWithTimeout(myLatlng, i * drop_length+(Math.random()*20-10));
      i+=1;
    })
  })
}

function displayWikipediaSpeciesData(species,self) {
  var common_name = $(self).text().trim().toLowerCase();
  // $(self).find('.wikipedia-info').slideDown(1000, function(){
  //   hidePreviousSelection(this);
  // });
  // $(self).find('#wikipedia-info').slideDown(1000, function(){
    // hidePreviousSelection(this);
    makeWikipediaAPIRequestAndAppendInfo(common_name,self);
  // });
}

function hidePreviousSelection(self){
  if (last_clicked_species) {
    $(last_clicked_species).find('.wikipedia-info').slideUp(300,function(){
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
  var user_agent = "brdr/1.0 (http://brdr.herokuapp.com/; reubenson@gmail.com)"

  retrieveWikipediaImage(species,current_el,user_agent);
  // debugger;
  retrieveWikipediaText(species,current_el,user_agent);
}

function retrieveWikipediaImage(species,current_el,user_agent){
  // https://en.wikipedia.org/wiki/Special:ApiSandbox#action=query
  var img_api_url = "https://en.wikipedia.org/w/api.php?action=query&titles="
  +species+"&prop=pageimages&format=json&redirects"

  $.ajax({
    url: img_api_url,
    dataType: "JSONP",
    headers: { 'Api-User-Agent': user_agent }
  }).success(function(data){
    var page_id = Object.keys(data.query.pages)[0];
    var thumb_url = data.query.pages[page_id].thumbnail.source;
    var img_url = thumb_url.replace("/thumb","")
    var splice_index = img_url.length-1;
    while (img_url[splice_index] != '/') { splice_index--; }
    img_url = img_url.slice(0,splice_index);

    var img_html = "<a href='"+img_url+"' target='_blank'><img src='"+img_url+"'>"+"</a>"

    // var wiki_el = $(current_el).find('.wikipedia-info').find('.wikipedia-img');
    var wiki_el = $('#wikipedia-info figure > a');
    $(wiki_el).replaceWith(img_html);
    // $('#wikipedia-info figure').css('background-image','url('+img_url+')');
    $('#wikipedia-info-background').css('background-image','url('+img_url+')');
    // $(wiki_el).html(img_html);
    // debugger;
    // retrieveWikipediaText(species,current_el,user_agent);
  });
}

function retrieveWikipediaText(species,current_el,user_agent){
  var url = "https://en.wikipedia.org/w/api.php?action=query&titles="+species+"&prop=extracts&exchars=500&explaintext=&format=json&redirects";
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

    // var wiki_el = $(current_el).find('.wikipedia-info').find('.wikipedia-text');
    // wiki_el = $('#wikipedia-text');
    var wiki_el = $('#wikipedia-info figcaption');
    $(wiki_el).html(wiki_text);
  });
}
