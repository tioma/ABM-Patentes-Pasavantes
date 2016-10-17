/**
 * Created by Artiom on 4/10/16.
 */
administradorPatentes.factory('Patente', ['$http', 'APP_CONFIG', '$q', 'Tarifa', function($http, APP_CONFIG, $q, Tarifa){

	function Patente(patenteData){
		if (patenteData){
			this.setData(patenteData);
		} else {
			this.TARIFAS = [];
		}
	}

	Patente.prototype = {
		setData: function(patenteData){
			angular.extend(this, patenteData);
			this.VALOR_TOTAL = 0;
			this.DETALLE = false;
			for (var i = 0; i < this.TARIFAS.length; i++){
				this.TARIFAS[i] = new Tarifa(this.TARIFAS[i]);
				this.VALOR_TOTAL += this.TARIFAS[i].VALOR;
			}
		},
		addRate: function(){
			this.TARIFAS.push(new Tarifa());
		},
		removeRate: function(index){
			this.TARIFAS.splice(index, 1);
		},
		saveChanges: function(){
			var deferred = $q.defer();
			var patente = this;
			if (this.TARIFAS.length > 0){
				var ajaxCalls = [];
				for (var i = 0; i < this.TARIFAS.length; i++){
					ajaxCalls.push(this.TARIFAS[i].savePatente(this.ID_TIPO_EMBARCACION));
				}
				$q.all(ajaxCalls).then(function(responses){
					var success = 0;
					var result = {};
					responses.forEach(function(response){
						if (response) success++;
					});
					if (success == 0){
						result = {
							status: 'ERROR',
							message: 'Se produjo un error al intentar guardar las tarifas.'
						};
						deferred.reject(result)
					}
					if (success == patente.TARIFAS.length){
						//Todas se guardaron correctamente
						result = {
							status: 'OK'
						};
						deferred.resolve(result);
					} else {
						//Algunas tuvieron error
						result = {
							status: 'ERROR',
							data: patente.TARIFAS.length - success
						};
						deferred.resolve(result);
					}
				});
			} else {
				var response = {
					status: 'NORATES',
					message: 'Debe seleccionar una tarifa para guardar.'
				};
				deferred.reject(response);
			}
			return deferred.promise;
		}
	};

	return Patente;
}]);