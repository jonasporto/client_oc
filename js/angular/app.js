  // create the module and name it ondecomerApp
    var ondecomerApp = angular.module('ondecomerApp', ['ngRoute','ngAnimate']);
    var results = '', coords = {},paginate = '',bookmark = [], results_window_scroll_top = '' ,details = '',
     user_location = 0 , aux_location = 0 , url = '', display = 0 ,user = '',routeParams, last_location = localStorage.getObj('last_location');
    var resul;
    
    // configure our routes
    ondecomerApp.config(function($routeProvider) {
        
        $routeProvider
            // route for the root page
            .when('/', {
                templateUrl : 'pages/option_search.html',
                controller  : 'defaultController'
            })
            .when('/offers', {
                templateUrl : 'pages/offers.html',
                controller  : 'defaultController'
            })

            .when('/maps/:type/:latitude/:longitude', {
                templateUrl : 'pages/maps.html',
                controller  : 'mapsController'
            })

            // list All
            .when('/list/:type/:latitude/:longitude', {
                templateUrl : 'pages/results.html',
                controller  : 'listController'
            })
            // details
            .when('/list/id/:id', {
                templateUrl : 'pages/results.html',
                controller  : 'listController'
            })
            .when('/signup', {
                templateUrl : 'pages/signup.html',
                controller  : 'signupController'
            })

            .when('/search', {
                templateUrl : 'pages/option_search.html',
                controller  : 'searchLocationController'
            })
        
            .when('/address', {
                templateUrl : 'pages/address.html',
                controller  : 'addressController'
            })

            .when('/address/:action', {
                templateUrl : 'pages/address.html',
                controller  : 'addressController'
            })

             // route for the profile page
            .when('/profile', {
                templateUrl : 'pages/profile.html',
                controller  : 'profileController'
            })

             // route for the settings page
            .when('/settings', {
                templateUrl : 'pages/profile.html',
                controller  : 'settingsController'
            })


             // route for the email page
            .when('/email', {
                templateUrl : 'pages/profile.html',
                controller  : 'emailController'
            })


             // route for the events page
            .when('/events', {
                templateUrl : 'pages/profile.html',
                controller  : 'eventsController'
            })

            // route for the location page
            .when('/localizacao', {
                templateUrl : 'pages/maps.html'
            //    controller  : 'searchLocationController'
            })

            .when('/form', {
                templateUrl : 'pages/form.html',
                controller  : 'formController'
            })

             .when('/login', {
                templateUrl : 'pages/login.html',
                controller  : 'loginController'
            })

            .when('/iframe', {
                templateUrl : 'pages/iframe.html',
                controller  : 'iframeController'
            })

            .when('/bookmark', {
                templateUrl : 'pages/bookmark.html',
                controller  : 'bookmarkController'
            })

            .when('/deals', {
                templateUrl : 'pages/deals.html',
                controller  : 'dealsController'
            })


            .when('/teste/:id/:name/',{
                templateUrl : 'pages/testeparam.html',
                controller  : 'testeController'
            });

//            .otherwise({redirectTo: '/'});
    });

function beforeRouteListener(obj){
    
    var header = $('.header');
    var view_container = $('.view');

    if (location.href.indexOf('list/id') != -1) {
    
        header.addClass('background-transparent');
        view_container.addClass('margin-zero');

        } else {
        
        header.removeClass('background-transparent')
              .removeAttr('style');
              
        view_container.removeClass('margin-zero');
    }
}

function scrollToElement(){
    
    if (location.href.indexOf('list/geolocation') != -1 && details) {
    
        setTimeout(function(){

            /*var element_id = '#' + details.Establishment.id;
            element_id = $(element_id);
            */
            $(window).scrollTop(results_window_scroll_top);
            
            /*
             $('html, body').animate({
                scrollTop: element_id.offset().top - 60
            }, 1);
             
            element_id.parent().css({ border : '1px dotted red', 'padding-top':'5px'});
             setTimeout(function(){
                element_id.parent().css({ border : 'none', padding : '0'});
                    }, 2000);*/

        }, 1000);
        
    }

}


ondecomerApp.controller('defaultController', function($scope,$http) {

    $scope.user = user = localStorage.getObj('user') || '';

    var hammer = new Hammer(body);
    
    hammer.on("swipeleft swiperight panleft panright", function(ev) {
        
        if(ev.type == 'swiperight'){

            $('.menu-sidebar, .overlay').addClass('expanded');

        }else if(ev.type == 'swipeleft'){
    
            $('.menu-sidebar, .overlay').removeClass('expanded');
        }
    

    });

    $scope.upload = function(){
        
       var input = document.getElementById("take-picture");

       var i = 0, len = input.files.length, img, reader, file, formdata = new FormData(), 
       query_string = "establishment_id=" + details.Establishment.id
                    + "&user_id=" + $scope.user.User.id;

        for ( ; i < len; i++ ) {
          file = input.files[i];
          if (!!file.type.match(/image.*/)) {
            formdata.append("images[]", file);
          } 
        }
        
        /**  não consegui fazer funcionar com o $http.post do angular
        *    erro: de formdata.append não implementa a interface FormData.
        */
        $.ajax({
           url: SERVICE_URL + '/oc/api/uploadUserFilesToEstablishment/media-type:json?' + query_string,
           type: 'POST',
           data: formdata,
           processData: false,
           contentType: false,
           success: function (res) {
               $('#preview').modal('hide');
               showToast('Imagem enviada');
           }
        });
    }

    

    $scope.$on("$routeChangeSuccess", function(event, current, previous) {
    
    if (current.$$route.originalPath == '/list/:type/:latitude/:longitude') {
            
        setTimeout(function(){
            initswiper();
        },3000);
    
    }
       /*
        $scope.animationStyle = '';

        if(previous || current){
        if ( (previous.$$route.originalPath == '/list/:type/:latitude/:longitude') && (current.$$route.originalPath == '/list/id/:id')) {
             $scope.animationStyle = 'at-view-slide-in-right at-view-slide-out-right';
        }else if((current.$$route.originalPath == '/list/:type/:latitude/:longitude') && (previous.$$route.originalPath == '/list/id/:id')){
             $scope.animationStyle = 'at-view-slide-in-left at-view-slide-out-left';
            

        }

    }
*/
  /*  if(current.$$route.originalPath == '/list/id/:id'){
            $rootScope.isBookmarked();
     }*/
       //$scope.$apply();
    });
  

    $scope.updateQueryPosition = function(){
       
        $scope.user_location = user_location = aux_location;
        
        if ( aux_location != 0 ) {
            closeMenu();
            return ( window.location.href = ROOTPATH + '#/list/geolocation/' + 
                $scope.user_location.latitude + '/' + 
                $scope.user_location.longitude 
            );
        }
        
        alert('nenhum resultado, tente um endereço diferente.');
        
        return;
    };

    $scope.setQueryPosition = function(){
        return $('#menu-right').trigger('open');
    };

    $scope.logoutUser = function(){

        $.post(routes.service.logout).done(function(data){
            localStorage.removeItem('user');
            delete $scope.user;
            return window.location.href = ROOTPATH + '#/login';   
        });
    }

    $scope.hasHistory = function(){
        return history.length > 1 && location.hash != '#/';
    }

});

  window.onbeforeunload=function(){
    console.log('change');
  };


ondecomerApp.controller('listController', function($scope, $http, $routeParams) {

    $scope.display = 0;

    $scope.bookmark = bookmark;

    document.onscroll = function() {

        var header = $('.header');

        var window_scroll_top = $(window).scrollTop();
        
        // side menu expandido ou overlay ?
        var expanded_el = !!$('.expanded').length;

        // -*- comportamento de scroll para pagina detalhes estabelecimentos -*-
        if ( location.href.indexOf('list/id') != -1 && !expanded_el) {
        
            // transparencia header
            if ( window_scroll_top  > 0) {
             
                header.addClass('background-default')
                      .removeClass('background-transparent');
            
                $('.content').removeClass('menu-padding');
             
                opacity = window_scroll_top * 4 / 250;
                console.log(opacity);
                if ( opacity >= 1 ) opacity = 1;
             
                header.css('background-color','rgba(213, 0, 0, '+opacity+')');

            } else {
             
                $('.content').addClass('menu-padding');
                
                header.removeClass('background-default')
                      .addClass('background-transparent');
            }
            return true;
        }

        // -*- comportamento do paginate results.html -*-
        if($('.item-results').length == 0) return;
        
        var result_last_item = $('.item-results')[$('.item-results').length - 1]
        
        var end_of_the_list = (Math.floor((result_last_item.offsetTop - result_last_item.offsetHeight)/100) 
                            - Math.ceil(window_scroll_top / 100)) <= 2;
        
        if (end_of_the_list && !$scope.started_request) {
            $scope.loadMoreResults();
        }

        return true;
    }

   

    $scope.user = localStorage.getObj('user') || '';
    $scope.rate = {};

    routeParams = $routeParams;
    // busca por geolocation
    if ( $routeParams.latitude ) {
        
        $scope.url = ( SERVICE_URL + '/oc/api/listEstablishment/' + 
            $routeParams.type + '/' + 
            $routeParams.latitude + '/' + 
            $routeParams.longitude 
        );
        
        $scope.results = results;
        $scope.paginate = paginate;
            
            
        if(!results){
            
            $http.get( $scope.url ).success( function( data ){
                $scope.display = 1;
                $scope.results = results = data.results;
                $scope.paginate = paginate = data.paginate;
                beforeRouteListener();

            });
        
        } else {

            $scope.display = 1;
            beforeRouteListener();

        }  
        
        
   
    }
    $scope.onlyNumber = function(string){
        return string.toString().replace(/[^0-9]/gi,'');
    }

    $scope.callIt = function(string){
        location.href = 'tel:+' + $scope.onlyNumber(string);
    }

    $scope.select = function(rs){
        $scope.details = details = rs;
        results_window_scroll_top = $(window).scrollTop();
        window.location.href = ROOTPATH + '#/list/id/' + rs.Establishment.id;
    }


    $scope.loadMoreResults = function(){

        if ( $scope.paginate.nextPage && mySwiper.activeIndex == 0) {
            //$scope.display = 4;
            $scope.started_request = true;
            //el_results = $('.results');

            //el_results.height(el_results.height() + 1000);

            //$scope.loading = 'carregando';

            var page = parseInt($scope.paginate.page) + 1;
      
            $http
                .get( $scope.url + '/page:'+ page)
                .success( function( data ){
                    $scope.display = 1;
                    data.results.forEach(function(result){
                    
                        $scope.results.push(result);

                    });

                    results = $scope.results;
                    
                    $scope.paginate = paginate = data.paginate;
                    //$scope.loading = '';
                    $scope.started_request = false;
            });

        }
            
    }
    
    // busca por id
    if ( !$routeParams.latitude && $routeParams.id) {
        
        $(window).scrollTop(0);

        if (details) {
            $scope.details = details;
            $scope.display = 3;
            beforeRouteListener();
        
        }else{

            $scope.url = ( SERVICE_URL + '/oc/api/listEstablishment/id/' + $routeParams.id ); 
            $http.get( $scope.url ).success( function( data ){
                  $scope.details = details = data.results[0];
                  $scope.display = 3;
                  beforeRouteListener();
            });
        }
    }
    
    

    $scope.distance = function(lat,lng){
        distance =  (google.maps.geometry.spherical.computeDistanceBetween(
             new google.maps.LatLng($routeParams.latitude, $routeParams.longitude),
             new google.maps.LatLng(lat,lng)) / 1000).toFixed(3);
       
        if (distance > 1) {
            return distance + ' Km';
        }

        else if ( distance < 1 ) {
            return distance +' m';
        }
    }
    
    $scope.name = '';

    $scope.listByName = function(){    
        $scope.type = 'name';
        $scope.url = ( SERVICE_URL + '/oc/api/listEstablishment/' + $scope.type + '/' +$scope.name );
        $http.get( $scope.url ).success( function( data ){
            $scope.results = results = data.results;
            detailspage();
        });
    }
    
    $scope.rates = ['a','b'];
    
    $scope.replace = function(param){
        return param.replace(/-|\(|\)| /g,'');
    }


    $scope.tab = 'feed';
    
    $scope.change = function (page) {
        $scope.tab = page;
    };

    $scope.comment = function (id) {

        $scope.comment.description = '';
        $scope.comment.establishment_id = id;
        console.log('ididid',id);
        if ( $scope.user ) {
            $scope.comment.user_id = $scope.user.User.id;
            $('#commentModal').modal('show');
        
        } else {

            routes.client.loginRedirect = location.href;
            routes.client.history = history.length;
            location.href = ROOTPATH + '#/login';
        }
    };

    $scope.answerComment = function (rate_id, id) {

        $scope.comment.description = '';
        $scope.comment.establishment_id = id;
        $scope.rate.parent_id = rate_id;
        
        if ( $scope.user ) {
            $scope.comment.user_id = $scope.user.User.id;
            $('#commentModal').modal('show');
        
        } else {

            routes.client.loginRedirect = location.href;
            routes.client.history = history.length;
            location.href = ROOTPATH + '#/login';
        }
    };


   
    $scope.saveCommentAndRate = function(){
        
        data = { Comment : { description : $scope.comment.description },
                 CommentEstablishment : { establishment_id : $scope.comment.establishment_id },
                 CommentUser : { user_id : $scope.comment.user_id },
                 
                 Rate : { grade : $('.rate-establishment.stars .glyphicon-star').length,
                 parent_id : $scope.rate.parent_id,
                 description : $scope.comment.description },
                 
                 EstablishmentRate : { establishment_id : $scope.comment.establishment_id,
                                       user_id : $scope.comment.user_id  },
                 
                 RateUser : { user_id : $scope.comment.user_id }
        };
        
        $http({
              method  : 'POST',
              url     : SERVICE_URL + '/oc/api/saveCommentAndRate/media-type:json',
              data    : $.param({ data: data }),
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
         })

        .success( function( data ){
                $('#commentModal').modal('hide');
        });

      

    }

    $scope.toBookmark = function(estab_id){

       

        if (!$scope.user ) {
           
            routes.client.loginRedirect = location.href;
            routes.client.history = history.length;
            location.href = ROOTPATH + '#/login';
        
        } else {

            data = { Bookmark : { 
                    user_id : $scope.user.User.id,
                    establishment_id : estab_id

            }};
            
            bookmark.push(estab_id);
            $scope.bookmark = bookmark;
            $http({
                  method  : 'POST',
                  url     : SERVICE_URL + '/oc/api/saveBookmark/media-type:json',
                  data    : $.param({ data: data }),
                  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
             })

            .success( function( data ){
                console.log('bookmark salvo');
            });

        }

    }
  
    scrollToElement();

    geolocation = '/geolocation/' + last_location.k + '/' + last_location.B;
    
    $http.get(SERVICE_URL + '/oc/api/listDeal' + geolocation)
        .success(function(deals){
            $scope.deals = deals;
        });

});


ondecomerApp.controller('bookmarkController', function($scope,$http){

    $scope.user = user = localStorage.getObj('user') || '';
    $scope.url = SERVICE_URL + '/oc/api/findBookmarkUser/' + $scope.user.User.id;
    
    $http.get($scope.url)
                .success( function( data ){
        $scope.bookmark = data;
    });

    $scope.select = function(rs){
    // limpa details para forçar uma requisição pelo conteudo
      details = '';
      results_window_scroll_top = $(window).scrollTop();
        window.location.href = ROOTPATH + '#/list/id/' + rs.Establishment.id;
    }

    $scope.removeBookmark = function(establishment_id){
        
        data = {
            Bookmark : {
                user_id : $scope.user.User.id,
                establishment_id : establishment_id
            }
        }

        $http({
              method  : 'POST',
              url     : SERVICE_URL + '/oc/api/removeBookmark/media-type:json',
              data    : $.param({ data: data }),
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
         })

        .success( function( data ){
            $scope.bookmark = data;
        });

    }

    



});

ondecomerApp.controller('searchLocationController', function($scope){});
ondecomerApp.controller('mapsController', function($scope,$routeParams){
    routeParams = $routeParams;
});
ondecomerApp.controller('profileController', function($scope){});
ondecomerApp.controller('settingsController', function($scope){});
ondecomerApp.controller('emailController', function($scope){});
ondecomerApp.controller('eventsController', function($scope){});
ondecomerApp.controller('loginController', function($scope){});
ondecomerApp.controller('signupController', function($scope){});


ondecomerApp.controller('addressController', function($scope,$routeParams){
  
    // coloca um marcador no mapa e centraliza o mapa nele
    updateMarkerData = function(latLng){

        console.log('updateMarkerData',latLng);

        coords.lat = latLng.k;
        coords.lng = latLng.B || latLng.D;

        console.log('coords',coords);
        // convert para coords padrão do Gmaps
        latLng =  new google.maps.LatLng(coords.lat,coords.lng);     
    
        if ( !latLng ) return;
        
        marker.setVisible(false);
     
        map.setZoom(16);
        map.setCenter(latLng);
        marker.setPosition(latLng);
        marker.setVisible(true);
        
        google.maps.event.trigger(map, 'resize');

        // dados por extenso do lugar por coordenadas
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { latLng : latLng}, function(results, status) {

             // salva localização no localstorage
            last_location = { native : false , k : results[0].geometry.location.lat() , B : results[0].geometry.location.lng() };
            localStorage.setObj('last_location', last_location);
            place_formatted_address.innerHTML = results[0].formatted_address.toString().replace(', República Federativa do Brasil','').replace(/, [0-9]{5}-[0-9]{3}/,'');
        });
    }

    getNavigationPosition = function(){
        navigator.geolocation.getCurrentPosition(function(GEO){
            console.log('navigator position',GEO);
            var geolocation = { native : true , k : GEO.coords.latitude , B : GEO.coords.longitude };
            updateMarkerData(geolocation);
        });
    }

    goToListPage = function(){
        results = '';
        console.log('goToListPage',last_location);
        location.href = ROOTPATH + '#/list/geolocation/' + last_location.k + '/' + last_location.B;
    }

    clearInputAutoComplete = function(){
        document.getElementById('input-gm-autocomplete').value = '';
        return true;
    }

    
    if(!last_location){ 
        last_location = {k: -22.7585384, B: -43.4882599};
        
    }
    
    var input_autocomplete_id = 'input-gm-autocomplete';
    var input_autocomplete = document.getElementById(input_autocomplete_id);
    input_autocomplete.style.display = 'inline';
    
    var autocomplete_options = { 
    /*types: ['geocode'],
    */  componentRestrictions: { country: 'br'}
    };
    
    var autocomplete = new google.maps.places.Autocomplete(input_autocomplete, autocomplete_options);
  
    var map_options = {
        center: new google.maps.LatLng(last_location.k,last_location.B),
        zoom: 4,
        mapTypeControl: false,
        overviewMapControl:false
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), map_options);
  
    var marker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        icon : ROOTFOLDER + "img/icons/maps/target.png",
        title: ''
    });

    if ($routeParams.action == 'getMyPosition') {
        getNavigationPosition();
    
    } else if ($routeParams.action == 'lastPosition') {
        updateMarkerData(last_location);
    }

    /* events */

    // escolheu em endereço pelo autocomplete ?
    google.maps.event.addListener(autocomplete, 'place_changed', function(){
        updateMarkerData(autocomplete.getPlace().geometry.location);
    });

    // arrastou o marcador ?
    google.maps.event.addListener(marker, 'dragend', function(){
        console.log('dragend',marker);
        updateMarkerData(marker.getPosition());
    });

    // clicou em algum lugar do mapa ?
    google.maps.event.addListener(map, 'click',function(data){
        console.log('click',data);
        updateMarkerData(data.latLng);
    });



});


ondecomerApp.controller('testeController', function($scope,$routeParams){   
       console.log($routeParams);
});


ondecomerApp.directive('starRating', function () {

    return {
        restrict: 'A',
       
        link: function ($scope, element, attrs) {
            
            
            var empty_star = "<span class=\"glyphicon glyphicon-star-empty\"><\/span>",
            filled_star = "<span class=\"glyphicon glyphicon-star\"><\/span>",            
            i = 0, rate = '',
            
            grade = $scope.rate.grade || $scope.rs.RateAverage;

            while ( i < 5 ) {
        
               if ( grade > i ) {
  
                 rate += filled_star;
               
               } else {
                 rate += empty_star;
               }
                i++;
            }
        
        element.html(rate);
        }
    }

});

ondecomerApp.directive('bookmark', function () {

    return {
        restrict: 'EA',
        replace: true,
       
        link: function ($scope, element, attrs) {
            
            
            var not_bookmarked = "<a href=\"javascript:void(0)\""
            + "class=\"pull-right btn btn-default btn-white btn-fab btn-raised mdi-action-bookmark-outline\"></a>",
            is_bookmarked = "<a  href=\"javascript:void(0)\""
            + "class=\"pull-right btn btn-default btn-white btn-fab btn-raised mdi-action-bookmark\"></a>";
        
        opt_bookmark = not_bookmarked;
        if ( $scope.bookmark.indexOf($scope.details.Establishment.id) != -1) opt_bookmark = is_bookmarked;
            element.html(opt_bookmark);
        }
    }

});


ondecomerApp.controller('dealsController', function($scope,$http) {

    geolocation = '/geolocation/' + last_location.k + '/' + last_location.B;
    
    $http.get(SERVICE_URL + '/oc/api/listDeal' + geolocation)
        .success(function(deals){
            $scope.deals = deals;
        });

});

ondecomerApp.filter('parseInt', function() {
    return function(input) {
      return parseInt(input,10);
    }
});

ondecomerApp.filter("sanitize", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}]);

// /$('.swiper-slide,.swipe-wrapper').css({'height':'100%','width':'100%'})
//$('.swiper-slide,.swipe-wrapper').removeAttr('style')