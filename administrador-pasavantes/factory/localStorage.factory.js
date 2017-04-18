/**
 * Created by Artiom on 4/10/16.
 */
administradorPasavantes.factory('localStorageFactory', ['$http', '$q', 'APP_CONFIG', 'localStorageService', function($http, $q, APP_CONFIG, localStorageService){

	const localStorageFactory = {
		getRates: function(){
			const deferred = $q.defer();
			const url = `${APP_CONFIG.SERVER_URL}/rates/document/11`;
			$http.get(url).then(response => {
				localStorageService.set('tarifas', response.data.data);
				deferred.resolve();
			}).catch(error => {
				deferred.reject();
			});
			return deferred.promise;
		},
		getTraffic: function(){
			const deferred = $q.defer();
			const url = `${APP_CONFIG.API_ENDPOINT}/ws-trafico.php`;
			$http.get(url).then(response => {
				localStorageService.set('trafico', response.data);
				deferred.resolve();
			}).catch(error => {
				deferred.reject();
			});
			return deferred.promise;
		},
		getHarbors: function(){
			const deferred = $q.defer();
			const url = `${APP_CONFIG.API_ENDPOINT}/ws-sitios.php`;
			$http.get(url).then(response => {
				localStorageService.set('muelles', response.data);
				deferred.resolve();
			}).catch(error => {
				deferred.reject();
			});
			return deferred.promise;
		}
	};

	return localStorageFactory
}]);