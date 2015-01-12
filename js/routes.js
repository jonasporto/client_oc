
var routes = {

	service : { signUp: SERVICE_URL + '/oc/users/add/media-type:json', 
				signIn: SERVICE_URL + '/oc/users/loginByEmailOrUsername/media-type:json',
				logout: SERVICE_URL + '/oc/users/logout/media-type:json',
                rateEstablishment : SERVICE_URL + '/oc/api/rateEstablishment/media-type:json'
			},

	client : { main: ROOTPATH,
			   signIn: '/#/login',
			   signUp: '/#/signup'
			}
};
