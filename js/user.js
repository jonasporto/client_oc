function addUserAndAuthenticate () {
 
  var data = dataAuth();
  
  if (!data) {
    return data;
  }

  localStorage.setObj('user',data);
   
  $.post(routes.service.signUp, { data : data })

    .done(function (data) {
      
        if (data = JSON.parse(data)) {

          if (data.error) {
            return showToast('SERVER alert: ' + data.error.msg );
          }

        }
        
        return loginRedirect(routes.client.loginRedirect);
    })

    .fail(function(){
      return showToast('Erro ao tentar cadastrar usuário');
    });

}

function loginWithEmailAndPassword (){

  var data = getCredentials();
  localStorage.setObj('user',data);

}

function  loginUser(){

	var data = localStorage.getObj('user') || dataAuth();

    localStorage.setObj('user',data);

     $.post(routes.login,{data:data}).done(function(data){
     
  	 });
}

function loginRedirect(url){

  if ( routes.client.history ) {
    var go = history.length - routes.client.history;
    return history.go(-(go))
  }


  var to_URL = routes.client.main;
  
  if(url) to_URL = url;

  return window.location.href = to_URL;

}

function isLogged(){

	$.post(isLogged,{data:data}).done(function(data){});
	
	return;  
}

function dataAuth(){

	var data = { User : {  username : $('.username').val(),
                         password : $('.password').val()
                      },
               Email : { address : $('.email').val() }
             };
  
  if (userValidation(data)) return false;
  
  return data;	
}


function userValidation(data){

  if ( ! data.Email.address ) {
   return showToast('O campo email não pode ficar vazio'); 
  
  } else if (! validateEmail(data.Email.address) ) {
    return showToast('Digite um email válido'); 
    
  }

  if(! data.User.username){
    return showToast('O campo username não pode ficar vazio');
  }

  if(! data.User.password){
   return showToast('O campo senha não pode ficar vazio'); 
  }
}

function userLogin(){


  var data = { User : { identify : $('.user-identify').val() , password : $('.user-password').val() }};

   $.post(routes.service.signIn, { data : data })

    .done(function (data) {
       
        if (data = JSON.parse(data)) {
   
          if (data.error) {
            return showToast('SERVER alert: ' + data.error.msg );
          }
          
          localStorage.setObj('user',data);

        }
        return loginRedirect(routes.client.loginRedirect);
    })

    .fail(function(){
      return showToast('Erro ao tentar cadastrar usuário');
    });


}

function validateEmail (email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

function rateEstablishment(data){

  $.post(routes.service.rateEstablishment, { data : data }).done(function(data){
  })

}

function userRateDishes(data){
  
}
