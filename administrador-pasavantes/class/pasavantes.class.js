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
			this.VALOR_TOTAL = 0;
			this.DETALLE = false;
			var pasavante = this;
			this.TERMINALES.forEach(function(muelle){
				muelle.DETALLE = false;
				muelle.TARIFAS.forEach(function(tarifa){{
					pasavante.VALOR_TOTAL += tarifa.VALOR
				}})
			})
		},
		addRate: function(){
			this.TERMINALES[0].TARIFAS.push(new Tarifa());
		},
		removeRate: function(index){
			this.TERMINALES[0].TARIFAS.splice(index, 1);
		},
		disableRate: function(idRate){
			var deferred = $q.defer();
			var url = APP_CONFIG.SERVER_URL + '/pasavantes/pasavante/disable/' + idRate;
			$http.put(url).then(function(response){
				console.log(response);
				if (response.data.status == 'OK'){
					deferred.resolve(response.data);
				} else {
					deferred.reject(response);
				}
			}, function(response){
				deferred.reject(response)
			});
		},
		saveChanges: function(){
			var deferred = $q.defer();
			if (this.TERMINALES[0].TARIFAS.length > 0){
				var url = APP_CONFIG.SERVER_URL + '/pasavantes/pasavante';
				var ajaxCalls = [];
				var adapterObject = {};
				//Siempre se va a guardar de a un solo sitio
				for (var i = 0; i < this.TERMINALES[0].TARIFAS.length; i++){
					adapterObject.id_tipo_navegacion = parseInt(this.ID_TIPO_NAVEGACION);
					adapterObject.id_terminal = parseInt(this.TERMINALES[0].ID_TERMINAL);
					adapterObject.id_tarifa = this.TERMINALES[0].TARIFAS[i].ID_TARIFA;
					if (this.TERMINALES[0].TARIFAS[i].FECHA_INICIO != '') adapterObject.fecha_inicio = this.TERMINALES[0].TARIFAS[i].FECHA_INICIO;
					if (this.TERMINALES[0].TARIFAS[i].FECHA_FIN != '') adapterObject.fecha_fin = this.TERMINALES[0].TARIFAS[i].FECHA_FIN;
					if (this.TERMINALES[0].TARIFAS[i].MINIMO) adapterObject.minimo = 1;
					console.log(adapterObject);
					ajaxCalls.push($http.post(url, adapterObject));
				}
				$q.all(ajaxCalls).then(function(responses){
					console.log(responses);
					deferred.resolve();
				}, function(response){
					console.log(response);
					deferred.reject(response);
				});

			} else {
				var response = {
					data: 'NORATES',
					message: 'Debe seleccionar una tarifa para guardar.'
				};
				deferred.reject(response);
			}
			return deferred.promise;
		}
	};

	return Pasavante;
}]);