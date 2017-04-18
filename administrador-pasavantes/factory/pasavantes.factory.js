/**
 * Created by Artiom on 4/10/16.
 */
administradorPasavantes.factory('pasavantesFactory', ['$http', '$q', 'APP_CONFIG', 'Pasavante', 'Tarifa', 'localStorageService', function($http, $q, APP_CONFIG, Pasavante, Tarifa, localStorageService){

	const pasavantesFactory = {
		muelles: localStorageService.get('muelles'),
		trafico: localStorageService.get('trafico'),
		tarifas: localStorageService.get('tarifas'),
		getPasavantes: function(){
			const deferred = $q.defer();
			const url = `${APP_CONFIG.SERVER_URL}/pasavantes`;
			$http.get(url).then((response) => {
				if (response.data.status == 'OK'){
					let pasavantesArray = [];
					response.data.data.forEach(pasavanteData => {
						let nuevoPasavante = new Pasavante(pasavanteData);
						pasavantesArray.push(nuevoPasavante)
					});
					deferred.resolve(pasavantesArray);
				} else {
					deferred.reject(response.data);
				}
			}).catch((response) => {
				deferred.reject(response.data);
			});
			return deferred.promise
		}
	};

	return pasavantesFactory;
}]);