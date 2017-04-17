/**
 * Created by Artiom on 4/10/16.
 */
administradorPatentes.factory('Patente', ['$http', 'APP_CONFIG', '$q', 'Tarifa', 'dialogsService', function($http, APP_CONFIG, $q, Tarifa, dialogsService){

	class Patente {
		constructor(patenteData){
			this.ID_TIPO_EMBARCACION = 0;
			this.TARIFAS = [];
			this.VALOR_MINIMO = 0;
			if (patenteData)
				this.setData(patenteData);
		}

		setData(patenteData){
			angular.extend(this, patenteData);
			this.VALOR_TOTAL = 0;
			this.DETALLE = false;
			let i = 0;
			for (let tarifa of this.TARIFAS){
				tarifa = new Tarifa(tarifa);
				if (tarifa.MINIMO){
					this.VALOR_MINIMO = tarifa.VALOR_TARIFA;
				} else {
					this.VALOR_TOTAL += tarifa.VALOR_TARIFA;
				}
				this.TARIFAS[i] = tarifa;
				i++
			}
		}

		addRate(){
			this.TARIFAS.push(new Tarifa());
		}

		removeRate(index){
			const deferred = $q.defer();
			const confirm = dialogsService.confirm('Dar de baja tarifa', 'Se dará de baja la tarifa seleccionada. ¿Confirma la operación?');
			confirm.result.then(() =>{
				if (this.TARIFAS[index].ID){
					this.TARIFAS[index].disable().then((data) => {
						//console.log(data);
						this.TARIFAS.splice(index, 1);
						deferred.resolve();
					}).catch((error) => {
						deferred.reject(error)
					})
				} else {
					this.TARIFAS.splice(index, 1);
					deferred.resolve();
				}
			});
			return deferred.promise;

		}

		saveChanges(){
			const deferred = $q.defer();
			if (this.TARIFAS.length > 0){
				let ajaxCalls = [];
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

			for (let tarifa of this.TARIFAS){
				tarifa.ID = undefined;
			}
		}

		get arboladura(){
			return this.ID_TIPO_EMBARCACION;
		}
	}

	return Patente;
}]);