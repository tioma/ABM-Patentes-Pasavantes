/**
 * Created by Artiom on 4/10/16.
 */
administradorPatentes.factory('Patente', ['$http', 'APP_CONFIG', '$q', 'Tarifa', function($http, APP_CONFIG, $q, Tarifa){

	class Patente {
		constructor(patenteData){
			this.ID_TIPO_EMBARCACION = 0;
			this.TARIFAS = [];
			if (patenteData)
				this.setData(patenteData);
		}

		setData(patenteData){
			angular.extend(this, patenteData);
			this.VALOR_TOTAL = 0;
			this.DETALLE = false;
			for (var i = 0; i < this.TARIFAS.length; i++){
				this.TARIFAS[i] = new Tarifa(this.TARIFAS[i]);
				this.VALOR_TOTAL += this.TARIFAS[i].VALOR_TARIFA;
			}
		}

		addRate(){
			this.TARIFAS.push(new Tarifa());
		}

		removeRate(index){
			this.TARIFAS.splice(index, 1);
		}

		saveChanges(){
			const deferred = $q.defer();
			if (this.TARIFAS.length > 0){
				var ajaxCalls = [];
				for (let tarifa of this.TARIFAS){
					ajaxCalls.push(tarifa.savePatente(this.ID_TIPO_EMBARCACION));
				}
				$q.all(ajaxCalls).then(responses => {
					let success = 0;
					let result = {};
					responses.forEach(response => {
						if (response) success++;
					});
					if (success == 0){
						result = {
							status: 'ERROR',
							message: 'Se produjo un error al intentar guardar las tarifas.'
						};
						deferred.reject(result)
					}
					if (success == this.TARIFAS.length){
						//Todas se guardaron correctamente
						result = {
							status: 'OK'
						};
						deferred.resolve(result);
					} else {
						//Algunas tuvieron error
						result = {
							status: 'ERROR',
							data: this.TARIFAS.length - success
						};
						deferred.resolve(result);
					}
				});
			} else {
				const response = {
					status: 'NORATES',
					message: 'Debe seleccionar una tarifa para guardar.'
				};
				deferred.reject(response);
			}
			return deferred.promise;
		}

		set arboladura(idArboladura){
			this.ID_TIPO_EMBARCACION = idArboladura;

			for (var i = 0; i < this.TARIFAS.length; i++){
				this.TARIFAS[i].ID = undefined;
			}
		}

		get arboladura(){
			return this.ID_TIPO_EMBARCACION;
		}
	}

	return Patente;
}]);