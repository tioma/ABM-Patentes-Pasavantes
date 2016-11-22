/**
 * Created by Artiom on 4/10/16.
 */
var administradorPatentes = angular.module('administradorPatentes', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'LocalStorageModule']);

administradorPatentes.config(['$stateProvider', '$urlRouterProvider', 'localStorageFactoryProvider', function($stateProvider, $urlRouterProvider, localStorageFactoryProvider){

	var localStorageFactory = localStorageFactoryProvider.$get();

	$urlRouterProvider.otherwise(function($injector){
		var $state = $injector.get("$state");
		$state.go('patentes');
	});

	$stateProvider.state('patentes', {
		url: '/patentes',
		templateUrl: 'view/patentes.html',
		controller: 'patentesCtrl',
		resolve: {
			embarcaciones: localStorageFactory.getShipTypes,
			tarifas: localStorageFactory.getRates
		}
	}).state('error', {
		url: '/error',
		templateUrl: 'view/error.html'
	})

}]);

administradorPatentes.run(['$rootScope', '$state', '$window', function($rootScope, $state, $window){

	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
		$state.go('error')
	});

	$rootScope.goBack = function(){
		$window.history.back();
	}

}]);