var geocoder;
var map;
var marker;
var WRAPPER_ID = 'autocomplete-address'

  var autoComplete = function(){

    var options = { types: ['geocode'],
      componentRestrictions: { country: 'br'}
    };
    autocomplete = new google.maps.places.Autocomplete((document.getElementById(WRAPPER_ID)),options);
    google.maps.event.addListener(autocomplete, 'place_changed',codeAddress);
  };


  var getCurrentPosition = function(){

    var geocoder = new google.maps.Geocoder();

    navigator.geolocation.getCurrentPosition(function(GEO){
    
      lat = GEO.coords.latitude;
      lng = GEO.coords.longitude;
      
      aux_location = { native:true , latitude:lat , longitude:lng }

      latLng = new google.maps.LatLng(lat,lng);

      geocoder.geocode( { 'latLng': latLng}, function(results, status) {
        managerResults(results,status);
      });

    });
  };

  var codeAddress = function () {
    
    var geocoder = new google.maps.Geocoder();
  
    var address = document.getElementById(WRAPPER_ID).value;

    geocoder.geocode( { 'address': address}, function(results, status) {
    
      lat = results[0].geometry.location.k;
      lng = results[0].geometry.location.B;
      
      aux_location = { native:false , latitude:lat , longitude:lng }

      managerResults(results,status);

    });
  };


  function managerResults(results,status){

    if ( status == google.maps.GeocoderStatus.OK ) {
      
      map = new google.maps.Map(document.getElementById('map'), {
      
        zoom: 16,/*
        streetViewControl: false,*/
      
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          mapTypeIds:[google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.ROADMAP] 
        },

        center: results[0].geometry.location,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      map.setCenter(results[0].geometry.location);
      
      marker = new google.maps.Marker({
      
        map: map,
        position: results[0].geometry.location,
        draggable: true,
        icon : "http://localhost/layout/img/icons/maps/target.png",
        title: ''
      
      });

      updateMarkerPosition(results[0].geometry.location);
      geocodePosition(results[0].geometry.location);

      google.maps.event.addListener(marker, 'dragend', function() {
        
        updateMarkerStatus('a');
        geocodePosition(marker.getPosition());
        map.panTo(marker.getPosition()); 
      
      });
     
      google.maps.event.addListener(map, 'click', function(e) {
      
        updateMarkerPosition(e.latLng);
        geocodePosition(marker.getPosition());
        marker.setPosition(e.latLng);
        map.panTo(marker.getPosition()); 
      
      }); 
      
    } else {

      alert('Não foi possivel obter sua localização : ' + status);

    }
  
  };

  function geocodePosition(pos) {
  
    geocoder.geocode({ latLng: pos }, function(responses) {

      if ( responses && responses.length > 0 ) {

        updateMarkerAddress(responses[0].formatted_address);
    
      } else {

        updateMarkerAddress('Não foi possivel determinar este endereço.');
    
      }
  
    });
  }

  function updateMarkerStatus(str){}
  function updateMarkerPosition(latLng){}

  function updateMarkerAddress(str) {
    $('.address,#autocomplete-address').val(str);
  }

  function listEstablishment(GEO){
  
    GEO = storage.getData('geo');
  
    $('.list').html('');

    $.getJSON('http://localhost/ondecomerapp/api/listEstablishment/geolocation/' + GEO.latitude + '/' +  GEO.longitude)
      .done( function (data) {
        data.forEach(function(res){

          list = [];
          list.push('<span class="title">' + res.Establishment.name + '</span>');
        
          res.Category.forEach(function(res){
              list.push('<span class="category">' + res.title + '</span>')
          });
           
           distance = (google.
                       maps.
                       geometry.
                       spherical.
                       computeDistanceBetween(new google.maps.LatLng(res.Address[0].Coordinate[0].lat,res.Address[0].Coordinate[0].lng),
                                              new google.maps.LatLng(GEO.latitude,GEO.longitude))/ 1000).toFixed(3);
           
                      

           street = res.Address[0].street_address;
           city = res.Address[0].city; 
           state =  res.Address[0].state;


          list.push(
            '<span class="address">' + street  + city  + state + '</span>'
          );


          list.push(  
            '<span class="distance glyphicon glyphicon-map-marker" lat="'+res.Address[0].Coordinate[0].lat+'" lat="'+res.Address[0].Coordinate[0].lng+'">' + distance +''+ d + '</span>'
          );

          if ( res.Telephone[0] ) { 
            list.push('<span class="tel"><a href="tel:'+ res.Telephone[0].telephone_number.replace(/-|\(|\)| /g,'')+'">' + res.Telephone[0].telephone_number + '</a></span>');
          }
          
          $('.list').append($('<li/>').append(list));
       
       });
    
    }).fail(function(data){
        console.log('fail:',data);
    });

  }


  function listOnMaps(){

    if(!user_location){    
      return window.location.href = '#/localizacao' ;
    }

    //$('#map').width($('#map').parent().width()).height($('#map').parent().height());
  
    var userlatlng = new google.maps.LatLng(user_location.latitude,user_location.longitude);

    var map = new google.maps.Map(document.getElementById('map'), {
                      zoom: 16,
                      center: userlatlng,
                      zoomControl: false
    });
    
    google.maps.event.trigger(map, 'resize');

    var marker = [];

    var content = [];

    var infowindow = new google.maps.InfoWindow();

    results.forEach( function( rs, i ){
    
      lat = rs.Address[0].Coordinate[0];
      lng = rs.Address[0].Coordinate[0];

      if ( lat && lng != undefined ) {

        latlng = new google.maps.LatLng(rs.Address[0].Coordinate[0].lat,rs.Address[0].Coordinate[0].lng);

        marker[i] = new google.maps.Marker({
                  position:latlng,          
                  map: map,
                  icon : "http://localhost/layout/img/icons/maps/restaurant.png"
        });


        content[i] = 

        '<div ng-click="select(rs.Establishment.id) class="media text-popover">' + 

          '<span class="pull-right">'+
            '<span class="marker glyphicon glyphicon-map-marker">  </span>'+
            '<span class="distance-text" >'+dist(rs.Address[0].Coordinate[0].lat,rs.Address[0].Coordinate[0].lng)+'</span>'+
          '</span>'+  
          
          '<div class="media-body">'+
            '<h4 class="media-heading">'+rs.Establishment.name +'</h4>'+
                '<small class="description">Restaurantes de Massas e Vinho</small><br/>'+
                '<small class="description">'+rs.Address[0].city +'-'+ rs.Address[0].state +'</small>'+
          '</div>'+
        '</div>';


        google.maps.event.addListener(marker[i], 'click',function() {
          infowindow.setContent(content[i]);
          infowindow.open(map, marker[i]);
        });
    }
  });

  marker[marker.length] = new google.maps.Marker({
              position:userlatlng,          
              map: map,
              icon : "http://localhost/layout/img/icons/maps/target.png"
  });

    content[marker.length] = 'Voce está aqui';


        google.maps.event.addListener(marker[marker.length], 'click',function() {
          infowindow.setContent(content[marker.length]);
          infowindow.open(map, marker[marker.length]);
        });
    
  

}

function dist(lat,lng){
       
         d =  (google.maps.geometry.spherical.computeDistanceBetween(
             new google.maps.LatLng(user_location.latitude,user_location.longitude),
             new google.maps.LatLng(lat,lng))/ 1000).toFixed(3);
       
        if(d > 1){
            return d + ' Km';
        }
        else if(distance < 1){
            return d +' m';
        }

}