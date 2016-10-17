/**
 * Created by Artiom on 4/10/16.
 */
administradorPatentes.factory('Tarifa', ['$http', 'APP_CONFIG', '$q', function($http, APP_CONFIG, $q){

	function Tarifa(tarifaData){
		this.MINIMO = false;
		this.DESDE_OPENED = false;
		this.HASTA_OPENED = false;
		this.DESDE_OPTIONS = {};
		this.HASTA_OPTIONS = {
			minDate: new Date()
		};
		this.STATUS = '';
		if (tarifaData) this.setData(tarifaData);
	}

	Tarifa.prototype = {
		setData: function(tarifaData){
			angular.extend(this, tarifaData);
			this.MINIMO = (this.MINIMO == 1);
			if (this.FECHA_FIN != null) this.FECHA_FIN = new Date(this.FECHA_FIN);
			if (this.FECHA_INICIO != null) this.FECHA_INICIO = new Date(this.FECHA_INICIO);
		},
		getValor: function(){
			var deferred = $q.defer();
			var url = APP_CONFIG.SERVER_URL + '/rates/' + this.ID_TARIFA;
			var tarifa = this;
			$http.get(url).then(function(response){
				if (response.data.data[0].VALORES.length == 0){
					tarifa.VALOR = 0;
				} else {
					tarifa.VALOR = response.data.data[0].VALORES[0].VALOR_TARIFA;
				}
				deferred.resolve();
			}, function(response){
				deferred.reject(response.data)
			});
			return deferred.promise;
		},
		formatData: function(){
			return this.CODIGO_TARIFA + ' - ' + this.DESCRI_TARIFA;
		},
		disable: function(){
			var deferred = $q.defer();
			var url = APP_CONFIG.SERVER_URL + '/pasavantes/pasavante/disable/' + this.ID;
			var tarifa = this;
			$http.put(url).then(function(response){
				//console.log(response);
				if (response.data.status == 'OK'){
					tarifa.FECHA_FIN = new Date();
					deferred.resolve(response.data);
				} else {
					deferred.reject(response.data);
				}
			}, function(response){
				deferred.reject(response.data)
			});
			return deferred.promise;
		},
		buildAdapterObject: function(navegacion){
			var adapterObject = {};
			adapterObject.id_tipo_navegacion = parseInt(navegacion);
			adapterObject.id_tarifa = this.ID_TARIFA;
			if (this.FECHA_INICIO) adapterObject.fecha_inicio = this.FECHA_INICIO;
			if (this.FECHA_FIN) adapterObject.fecha_fin = this.FECHA_FIN;
			if (this.MINIMO) adapterObject.minimo = 1;
			return adapterObject;
		},
		enable: function(navegacion){
			var deferred = $q.defer();
			var url = APP_CONFIG.SERVER_URL + '/pasavantes/pasavante/dates/' + this.ID;
			var adapterObject = {};
			adapterObject.id_tipo_navegacion = parseInt(navegacion);
			if (this.FECHA_INICIO) adapterObject.fecha_inicio = this.FECHA_INICIO;
			if (this.MINIMO) adapterObject.minimo = 1;
			var tarifa = this;
			$http.put(url, adapterObject).then(function(response){
				if (response.data.status == 'OK'){
					tarifa.FECHA_FIN = null;
					deferred.resolve(response.data);
				} else {
					deferred.reject(response.data);
				}
			}, function(response){
				deferred.reject(response.data);
			});
			return deferred.promise;
		},
		savePatente: function(navegacion){
			var deferred = $q.defer();
			var tarifa = this;
			var adapterObject = this.buildAdapterObject(navegacion);
			if (this.ID){
				//console.log('se updatea');
				this.updateRate(adapterObject).then(function(response){
					if (response.data.status == 'OK'){
						tarifa.STATUS = 'OK';
						deferred.resolve(true);
					} else {
						tarifa.STATUS = 'ERROR';
						deferred.resolve(false);
					}
				}, function(response){
					//console.log(response);
					tarifa.STATUS = 'ERROR';
					tarifa.ERROR = response.data.message;
					deferred.resolve(false);
				})
			} else {
				//console.log('esta se agrega');
				this.addRate(adapterObject).then(function(response){
					if (response.data.status == 'OK'){
						tarifa.STATUS = 'OK';
						tarifa.ID = response.data.data.ID;
						deferred.resolve(true);
					} else {
						tarifa.STATUS = 'ERROR';
						deferred.resolve(false);
					}
				}, function(response){
					tarifa.STATUS = 'ERROR';
					//console.log(response);
					tarifa.ERROR = response.data.message;
					deferred.resolve(false)
				});
			}
			return deferred.promise;
		},
		addRate: function(adapterObject){
			var url = APP_CONFIG.SERVER_URL + '/pasavantes/pasavante';
			return $http.post(url, adapterObject);
		},
		updateRate: function(adapterObject){
			var url = APP_CONFIG.SERVER_URL + '/pasavantes/pasavante/dates/' + this.ID;
			return $http.put(url, adapterObject);
		}
	};

	return Tarifa;

}]);