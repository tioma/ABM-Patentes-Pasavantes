/**
 * Created by Artiom on 4/10/16.
 */
administradorPasavantes.factory('Tarifa', ['$http', 'APP_CONFIG', '$q', function($http, APP_CONFIG, $q){

	function Tarifa(tarifaData){
		if (tarifaData) this.setData(tarifaData);
	}

	Tarifa.prototype = {
		setData: function(tarifaData){
			angular.extend(this, tarifaData);
		},
		getValor: function(){
			var deferred = $q.defer();
			var url = APP_CONFIG.SERVER_URL + '/rates/' + this.ID_TARIFA;
			var tarifa = this;
			$http.get(url).then(function(response){
				if (response.data.data[0].VALORES.length == 0){
					tarifa.VALOR = 0;
				} else {
					tarifa.VALOR = response.data.data[0].VALORES[0].VALOR_TARIFA
				}
				deferred.resolve();
			}, function(response){
				deferred.reject(response.data)
			});
			return deferred.promise;
		}
	}

	return Tarifa;

}]);