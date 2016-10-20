/**
 * Created by Artiom on 4/10/16.
 */
administradorPatentes.factory('localStorageFactory', ['$http', '$q', 'APP_CONFIG', 'localStorageService', function($http, $q, APP_CONFIG, localStorageService){

	var localStorageFactory = {
		getRates: function(){
			var deferred = $q.defer();
			var url = APP_CONFIG.SERVER_URL + '/rates/document/12';
			$http.get(url).then(function(response){
				localStorageService.set('tarifas', response.data.data);
				deferred.resolve();
			}, function(response){
				deferred.reject();
			});
			return deferred.promise;
		},
		getShipTypes: function(){
			var deferred = $q.defer();
			var url = APP_CONFIG.API_ENDPOINT + '/ws-embarcaciones.php';
			$http.get(url).then(function(response){
				localStorageService.set('embarcaciones', response.data);
				deferred.resolve();
			}, function(response){
				deferred.reject();
			});
			return deferred.promise;
		}

	};

	return localStorageFactory
}]);