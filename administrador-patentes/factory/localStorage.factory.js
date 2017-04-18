/**
 * Created by Artiom on 4/10/16.
 */
administradorPatentes.factory('localStorageFactory', ['$http', '$q', 'APP_CONFIG', 'localStorageService', function($http, $q, APP_CONFIG, localStorageService){

	const localStorageFactory = {
		getRates: function(){
			const deferred = $q.defer();
			const url = APP_CONFIG.SERVER_URL + '/rates/document/12';
			$http.get(url).then((response) => {
				localStorageService.set('tarifas', response.data.data);
				deferred.resolve();
			}).catch((response) => {
				deferred.reject();
			});
			return deferred.promise;
		},
		getShipTypes: function(){
			const deferred = $q.defer();
			const url = APP_CONFIG.API_ENDPOINT + '/ws-embarcaciones.php';
			$http.get(url).then((response) => {
				localStorageService.set('embarcaciones', response.data);
				deferred.resolve();
			}).catch((response) => {
				deferred.reject();
			});
			return deferred.promise;
		}

	};

	return localStorageFactory
}]);