/**
 * Created by Artiom on 4/10/16.
 */
administradorPasavantes.factory('Pasavante', ['$http', 'APP_CONFIG', '$q', 'Tarifa', function($http, APP_CONFIG, $q, Tarifa){

	function Pasavante(pasavanteData){
		if (pasavanteData){
			this.setData(pasavanteData);
		} else {
			this.TERMINALES = [{
				ID_TERMINAL: 0,
				TARIFAS: []
			}]
		}
	}

	Pasavante.prototype = {
		setData: function(pasavanteData){
			angular.extend(this, pasavanteData);
			this.DETALLE = false;
			for (var i = 0; i < this.TERMINALES.length; i ++){
				this.TERMINALES[i].VALOR_TOTAL = 0;
				for (var j = 0; j < this.TERMINALES[i].TARIFAS.length; j++){
					this.TERMINALES[i].TARIFAS[j] = new Tarifa(this.TERMINALES[i].TARIFAS[j]);
					this.TERMINALES[i].VALOR_TOTAL += this.TERMINALES[i].TARIFAS[j].VALOR;
				}
			}
		},
		resetTarifasId: function(){
			for (var i = 0; i < this.TERMINALES[0].TARIFAS.length; i++){
				this.TERMINALES[0].TARIFAS[i].ID = undefined;
			}
		},
		setTipoNavegacion: function(idTipoNavegacion){
			this.ID_TIPO_NAVEGACION = idTipoNavegacion;

			this.resetTarifasId();
		},
		setMuelle: function(idMuelle){
			this.TERMINALES[0].ID_TERMINAL = idMuelle;

			this.resetTarifasId();
		},
		addRate: function(){
			this.TERMINALES[0].TARIFAS.push(new Tarifa());
		},
		removeRate: function(index){
			this.TERMINALES[0].TARIFAS.splice(index, 1);
		},
		saveChanges: function(){
			var deferred = $q.defer();
			var pasavante = this;
			if (this.TERMINALES[0].TARIFAS.length > 0){
				var ajaxCalls = [];
				//Siempre se va a guardar de a un solo sitio
				for (var i = 0; i < this.TERMINALES[0].TARIFAS.length; i++){
					ajaxCalls.push(this.TERMINALES[0].TARIFAS[i].savePasavante(this.ID_TIPO_NAVEGACION, this.TERMINALES[0].ID_TERMINAL));
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
					if (success == pasavante.TERMINALES[0].TARIFAS.length){
						//Todas se guardaron correctamente
						result = {
							status: 'OK'
						};
						deferred.resolve(result);
					} else {
						//Algunas tuvieron error
						result = {
							status: 'ERROR',
							data: pasavante.TERMINALES[0].TARIFAS.length - success
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

	return Pasavante;
}]);