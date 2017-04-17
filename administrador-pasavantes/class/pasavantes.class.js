/**
 * Created by Artiom on 4/10/16.
 */
administradorPasavantes.factory('Pasavante', ['$http', 'APP_CONFIG', '$q', 'Tarifa', function($http, APP_CONFIG, $q, Tarifa){

	class Pasavante {
		constructor(pasavanteData){
			this.ID_TIPO_NAVEGACION = 0;
			this.TERMINALES = [{
				ID_TERMINAL: 0,
				TARIFAS: []
			}];
			this.VALOR_MINIMO = 0;

			if (pasavanteData)
				this.setData(pasavanteData);
		}

		setData(pasavanteData){
			angular.extend(this, pasavanteData);
			this.DETALLE = false;

			for (let terminal of this.TERMINALES){
				let j = 0;
				terminal.VALOR_TOTAL = 0;
				for (let tarifa of terminal.TARIFAS){
					tarifa = new Tarifa(tarifa);
					if (tarifa.MINIMO){
						terminal.VALOR_MINIMO = tarifa.VALOR_TARIFA;
					} else {
						terminal.VALOR_TOTAL += tarifa.VALOR_TARIFA;
					}
					terminal.TARIFAS[j] = tarifa;
					j++
				}
			}
		}

		resetTarifaId(){
			for (let tarifa of this.TERMINALES[0].TARIFAS){
				tarifa.ID = undefined;
			}
		}

		addRate(){
			this.TERMINALES[0].TARIFAS.push(new Tarifa());
		}

		removeRate(index){
			if (this.TERMINALES[0].TARIFAS[index].ID){
				this.TERMINALES[0].TARIFAS[index].FECHA_FIN = new Date();
				this.TERMINALES[0].TARIFAS[index].FECHA_FIN.setHours(0, 0);
				this.TERMINALES[0].TARIFAS[index].MINIMO = false;
			} else {
				this.TERMINALES[0].TARIFAS.splice(index, 1);
			}
		}

		saveChanges(){
			const deferred = $q.defer();
			if (this.TERMINALES[0].TARIFAS.length > 0){
				let ajaxCalls = [];
				//Siempre se va a guardar de a un solo sitio
				for (let tarifa of this.TERMINALES[0].TARIFAS){
					ajaxCalls.push(tarifa.savePasavante(this.ID_TIPO_NAVEGACION, this.TERMINALES[0].ID_TERMINAL));
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
						deferred.reject(result);
					}
					if (success == this.TERMINALES[0].TARIFAS.length){
						//Todas se guardaron correctamente
						result = {
							status: 'OK'
						};
						deferred.resolve(result);
					} else {
						//Algunas tuvieron error
						result = {
							status: 'ERROR',
							data: this.TERMINALES[0].TARIFAS.length - success
						};
						deferred.resolve(result);
					}
				})
			} else {
				const response = {
					status: 'NORATES',
					message: 'Debe seleccionar una tarifa para guardar.'
				};
				deferred.reject(response);
			}
			return deferred.promise;
		}

		set tipoNavegacion(idTipoNavegacion){
			this.ID_TIPO_NAVEGACION = idTipoNavegacion;
			this.resetTarifaId();
		}

		set muelle(idMuelle){
			this.TERMINALES[0].ID_TERMINAL = idMuelle;
			this.resetTarifaId();
		}

	}

	return Pasavante;
}]);