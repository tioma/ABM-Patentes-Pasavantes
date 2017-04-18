/**
 * Created by Artiom on 4/10/16.
 */
administradorPatentes.factory('patentesFactory', ['$http', '$q', 'APP_CONFIG', 'Patente', function($http, $q, APP_CONFIG, Patente){

	const patentesFactory = {
		getPatentes: function(){
			const deferred = $q.defer();
			const url = `${APP_CONFIG.SERVER_URL}/patentes`;
			$http.get(url).then(response => {
				if (response.data.status == 'OK'){
					let patentesArray = [];
					response.data.data.forEach(patenteData => {
						let nuevoPatente = new Patente(patenteData);
						patentesArray.push(nuevoPatente)
					});
					deferred.resolve(patentesArray);
				} else {
					deferred.reject(response.data);
				}
			}).catch((response) => {
				deferred.reject(response.data);
			});
			return deferred.promise
		}
	};

	return patentesFactory;
}]);