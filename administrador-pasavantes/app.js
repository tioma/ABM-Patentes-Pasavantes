/**
 * Created by Artiom on 4/10/16.
 */
var administradorPasavantes = angular.module('administradorPasavantes', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'LocalStorageModule']);

administradorPasavantes.config(['$stateProvider', '$urlRouterProvider', 'localStorageFactoryProvider', function($stateProvider, $urlRouterProvider, localStorageFactoryProvider){

	var localStorageFactory = localStorageFactoryProvider.$get();

	$urlRouterProvider.otherwise(function($injector){
		var $state = $injector.get("$state");
		$state.go('pasavantes');
	});

	$stateProvider.state('pasavantes', {
		url: '/pasavantes',
		templateUrl: 'view/pasavantes.html',
		controller: 'pasavantesCtrl',
		resolve: {
			tipoNavegacion: localStorageFactory.getTraffic(),
			muelles: localStorageFactory.getHarbors(),
			tarifas: localStorageFactory.getRates()
		}
	})

}]);