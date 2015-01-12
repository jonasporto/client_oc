alert('cu');

function listmap(){

console.log('listmap',results);

var latlng = new google.maps.LatLng(-22.5977636,-42.0035325);

var map = new google.maps.Map(document.getElementById('map'), {
                  zoom: 2,
                  center: latlng,
                  zoomControl: false
});

marker[]

var infowindow = new google.maps.InfoWindow();


results.forEach(function(rs,i){
console.log('foreach',i);
latlng = new google.maps.LatLng(rs[i].Address[0].Coordinate[0].lat,rs[i].Address[0].Coordinate[0].lng);

marker[i] = new google.maps.Marker({
          position:latlng,          
          map: map
});


content = '<div class="media text-popover">' + 
  
    '<span class="pull-right">'+
    '<span class="marker glyphicon glyphicon-map-marker">  </span>'+
   '<span class="distance-text" >500KM</span>'+
  '</span>'+  
    '<div class="media-body">'+
    '<h4 class="media-heading">{{rs.Establishment.name || "Nome não definido"}} </h4>'+
        '<small class="description">Restaurantes de Massas e Vinho</small><br/>'+
        '<small class="description">{{rs.Address[0].city}} - {{rs.Address[0].state}}</small>'+
    '</div>'+
    '</div>';


    google.maps.event.addListener(marker[i], 'click',function() {
      infowindow.setContent(content);
      infowindow.open(map, marker[i]);
    });

});

}