/**
 * Created by Artiom on 4/10/16.
 */
administradorPasavantes.factory('Pasavante', ['$http', 'APP_CONFIG', '$q', function($http, APP_CONFIG, $q){

	function Pasavante(pasavanteData){
		if (pasavanteData) this.setData(pasavanteData);
	}

	Pasavante.prototype = {
		setData: function(pasavanteData){
			angular.extend(this, pasavanteData);
		}
	}

	return Pasavante;
}]);