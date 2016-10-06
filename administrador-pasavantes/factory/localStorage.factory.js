/**
 * Created by Artiom on 4/10/16.
 */
administradorPasavantes.factory('localStorageFactory', ['$http', '$q', 'APP_CONFIG', 'localStorageService', function($http, $q, APP_CONFIG, localStorageService){

	var localStorageFactory = {
		getRates: function(){
			var deferred = $q.defer();
			var url = APP_CONFIG.SERVER_URL + '/rates/document/11';
			$http.get(url).then(function(response){
				localStorageService.set('tarifas', response.data.data);
				deferred.resolve();
			}, function(response){
				deferred.reject();
			});
			return deferred.promise;
		},
		getTraffic: function(){
			var deferred = $q.defer();
			var url = APP_CONFIG.API_ENDPOINT + '/ws-trafico.php';
			$http.get(url).then(function(response){
				localStorageService.set('trafico', response.data);
				deferred.resolve();
			}, function(response){
				deferred.reject();
			});
			return deferred.promise;
		},
		getHarbors: function(){
			var deferred = $q.defer();
			var url = APP_CONFIG.API_ENDPOINT + '/ws-sitios.php';
			$http.get(url).then(function(response){
				localStorageService.set('muelles', response.data);
				deferred.resolve();
			}, function(response){
				deferred.reject();
			});
			return deferred.promise;
		}
	};

	return localStorageFactory
}]);