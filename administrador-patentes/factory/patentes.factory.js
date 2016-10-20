/**
 * Created by Artiom on 4/10/16.
 */
administradorPatentes.factory('patentesFactory', ['$http', '$q', 'APP_CONFIG', 'Patente', 'Tarifa', function($http, $q, APP_CONFIG, Patente, Tarifa){

	var patentesFactory = {
		getPatentes: function(){
			var deferred = $q.defer();
			var url = APP_CONFIG.SERVER_URL + '/patentes';
			$http.get(url).then(function(response){
				if (response.data.status == 'OK'){
					var patentesArray = [];
					response.data.data.forEach(function(patenteData){
						var nuevoPatente = new Patente(patenteData);
						patentesArray.push(nuevoPatente)
					});
					deferred.resolve(patentesArray);
				} else {
					deferred.reject(response.data);
				}
			}, function(response){
				deferred.reject(response.data);
			});
			return deferred.promise
		}
	};

	return patentesFactory;
}]);