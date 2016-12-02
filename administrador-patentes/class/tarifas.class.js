/**
 * Created by Artiom on 4/10/16.
 */
administradorPatentes.factory('Tarifa', ['$http', 'APP_CONFIG', '$q', function($http, APP_CONFIG, $q){

	class Tarifa {
		constructor(tarifaData){
			this.MINIMO = false;
			this.DESDE_OPENED = false;
			this.HASTA_OPENED = false;
			this.DESDE_OPTIONS = {};
			this.HASTA_OPTIONS = {
				minDate: new Date()
			};
			this.STATUS = '';
			if (tarifaData)
				this.setData(tarifaData);
		}

		setData(tarifaData){
			angular.extend(this, tarifaData);
			if (this.DESCRIPCION) {
				this.DESCRI_TARIFA = this.DESCRIPCION;
			}
			this.MINIMO = (this.MINIMO == 1);
			if (this.FECHA_FIN != null) this.FECHA_FIN = new Date(this.FECHA_FIN);
			if (this.FECHA_INICIO != null) this.FECHA_INICIO = new Date(this.FECHA_INICIO);
		}

		getValor(){
			const deferred = $q.defer();
			const url = `${APP_CONFIG.SERVER_URL}/rates/${this.ID_TARIFA}`;
			$http.get(url).then(response => {
				if (response.data.data[0].VALORES.length == 0){
					this.VALOR = 0;
				} else {
					this.VALOR = response.data.data[0].VALORES[0].VALOR_TARIFA;
				}
				deferred.resolve();
			}, response => {
				deferred.reject(response.data)
			});
			return deferred.promise;
		}

		disable(){
			const deferred = $q.defer();
			const url = `${APP_CONFIG.SERVER_URL}/patentes/patente/disable/${this.ID}`;
			$http.put(url).then(response => {
				//console.log(response);
				if (response.data.status == 'OK'){
					this.FECHA_FIN = new Date();
					deferred.resolve(response.data);
				} else {
					deferred.reject(response.data);
				}
			}, response => {
				deferred.reject(response.data)
			});
			return deferred.promise;
		}

		buildAdapterObject(embarcacion){
			let adapterObject = {};
			adapterObject.id_tipo_embarcacion = parseInt(embarcacion);
			adapterObject.id_tarifa = this.ID_TARIFA;
			if (this.FECHA_INICIO) adapterObject.fecha_inicio = this.FECHA_INICIO;
			if (this.FECHA_FIN) adapterObject.fecha_fin = this.FECHA_FIN;
			if (this.MINIMO) adapterObject.minimo = 1;
			return adapterObject;
		}

		enable(embarcacion){
			const deferred = $q.defer();
			const url = `${APP_CONFIG.SERVER_URL}/patentes/patente/update/${this.ID}`;
			let adapterObject = {};
			adapterObject.id_tipo_embarcacion = parseInt(embarcacion);
			if (this.FECHA_INICIO) adapterObject.fecha_inicio = this.FECHA_INICIO;
			if (this.MINIMO) adapterObject.minimo = 1;
			$http.put(url, adapterObject).then(response => {
				if (response.data.status == 'OK'){
					this.FECHA_FIN = null;
					deferred.resolve(response.data);
				} else {
					deferred.reject(response.data);
				}
			}, response => {
				deferred.reject(response.data);
			});
			return deferred.promise;
		}

		savePatente(embarcacion){
			const deferred = $q.defer();
			let adapterObject = this.buildAdapterObject(embarcacion);
			if (this.ID){
				//console.log('se updatea');
				this.updateRate(adapterObject).then(response => {
					if (response.data.status == 'OK'){
						this.STATUS = 'OK';
						deferred.resolve(true);
					} else {
						this.STATUS = 'ERROR';
						deferred.resolve(false);
					}
				}, response => {
					//console.log(response);
					this.STATUS = 'ERROR';
					this.ERROR = response.data.message;
					deferred.resolve(false);
				})
			} else {
				//console.log('esta se agrega');
				this.addRate(adapterObject).then(response => {
					if (response.data.status == 'OK'){
						this.STATUS = 'OK';
						this.ID = response.data.data.ID;
						deferred.resolve(true);
					} else {
						this.STATUS = 'ERROR';
						deferred.resolve(false);
					}
				}, response => {
					this.STATUS = 'ERROR';
					//console.log(response);
					this.ERROR = response.data.message;
					deferred.resolve(false)
				});
			}
			return deferred.promise;
		}

		addRate(adapterObject){
			var url = APP_CONFIG.SERVER_URL + '/patentes/patente';
			return $http.post(url, adapterObject);
		}

		updateRate(adapterObject){
			var url = APP_CONFIG.SERVER_URL + '/patentes/patente/update/' + this.ID;
			return $http.put(url, adapterObject);
		}

		unsetData(){
			this.BACKUP = '';
			this.ID_TARIFA = '';
			this.CODIGO_TARIFA = '';
			this.DESCRI_TARIFA = '';
			this.SIMBOLO = '';
			this.CODIGO_AFIP = '';
			this.VALOR = '';
			this.ID = undefined;
		}

		set data(tarifaData){
			this.ID_TARIFA = tarifaData.ID_TARIFA;
			this.CODIGO_TARIFA = tarifaData.CODIGO_TARIFA;
			this.DESCRI_TARIFA = tarifaData.DESCRI_TARIFA;
			this.SIMBOLO = tarifaData.SIMBOLO;
			this.CODIGO_AFIP = tarifaData.CODIGO_AFIP;
			this.getValor();
		}

		get fullDescription(){
			return this.CODIGO_TARIFA + ' - ' + this.DESCRI_TARIFA;
		}
	}

	return Tarifa;

}]);