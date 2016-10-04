/**
 * Created by Artiom on 4/10/16.
 */
administradorPasavantes.factory('pasavantesFactory', ['$http', '$q', 'APP_CONFIG', 'Pasavante', 'Tarifa', function($http, $q, APP_CONFIG, Pasavante, Tarifa){

	var pasavanteFactory = {
		getPasavantes: function(){
			var deferred = $q.defer();
			var url = APP_CONFIG + '/pasavantes';
			$http.get(url).then(function(response){

			}, function(response){

			})
		}
	}

	return pasavanteFactory;
}]);