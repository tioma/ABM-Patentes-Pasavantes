/**
 * Created by Artiom on 4/10/16.
 */
administradorPasavantes.factory('pasavantesFactory', ['$http', '$q', 'APP_CONFIG', 'Pasavante', 'Tarifa', 'localStorageService', function($http, $q, APP_CONFIG, Pasavante, Tarifa, localStorageService){

	var pasavantesFactory = {
		muelles: localStorageService.get('muelles'),
		trafico: localStorageService.get('trafico'),
		tarifas: localStorageService.get('tarifas'),
		getPasavantes: function(){
			var deferred = $q.defer();
			var url = APP_CONFIG.SERVER_URL + '/pasavantes';
			$http.get(url).then(function(response){
				//console.log(response);
				if (response.data.status == 'OK'){
					var pasavantesArray = [];
					response.data.data.forEach(function(pasavanteData){
						var nuevoPasavante = new Pasavante(pasavanteData);

						pasavantesArray.push(nuevoPasavante)
					});
					deferred.resolve(pasavantesArray);
				} else {
					deferred.reject(response.data);
				}
			}, function(response){
				console.log(response);
				deferred.reject(response.data);
			});
			return deferred.promise
		}
	};

	return pasavantesFactory;
}]);