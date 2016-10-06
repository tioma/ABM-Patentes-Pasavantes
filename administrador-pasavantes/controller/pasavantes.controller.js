/**
 * Created by Artiom on 4/10/16.
 */
administradorPasavantes.controller('pasavantesCtrl', ['$scope', 'Pasavante', 'Tarifa', 'pasavantesFactory', 'localStorageService', 'dialogsService', function($scope, Pasavante, Tarifa, pasavantesFactory, localStorageService, dialogsService){

    $scope.fecha = new Date();

    $scope.nuevoPasavante = new Pasavante();
    $scope.tarifaMinima = new Tarifa();

    $scope.tarifas = [];
    $scope.pasavantes = [];
    $scope.muelles = [];
    $scope.traficos = [];

    localStorageService.get('muelles').forEach(function(dataMuelle){
        $scope.muelles[dataMuelle.CODIGO_MUELLE] = dataMuelle;
    });
    localStorageService.get('trafico').forEach(function(dataTrafico){
        $scope.traficos[dataTrafico.ID_TRAFICO] = dataTrafico;
    });
    localStorageService.get('tarifas').forEach(function(tarifaData){
       $scope.tarifas[tarifaData.ID_TARIFA] = new Tarifa(tarifaData);
    });

    console.log($scope.muelles);
    console.log($scope.tarifas);
    console.log($scope.traficos);

    pasavantesFactory.getPasavantes().then(function(pasavantes){
        $scope.pasavantes = pasavantes;
        $scope.pasavantes.forEach(function(pasavante){
            pasavante.NAVEGACION = $scope.traficos[pasavante.ID_TIPO_NAVEGACION].DESC_TRAFICO;
            pasavante.TERMINALES.forEach(function(muelle){
                muelle.MUELLE = $scope.muelles[muelle.ID_TERMINAL].DESCRIPCION_MUELLE;
                muelle.TARIFAS.forEach(function(tarifa){
                    tarifa.CODIGO_TARIFA = $scope.tarifas[tarifa.ID_TARIFA].CODIGO_TARIFA
                })
            })
        })
    }, function(error){
        console.log(error)
    });

    $scope.disableRate = function(pasavante, idRate){
        dialogsService.confirm('Dar de baja tarifa', 'Se dará de baja la tarifa seleccionada. ¿Confirma la operación?').then(function(){
            pasavante.disableRate(idRate).then(function(data){
                console.log(data)
            }, function(error){
                console.log(error)
            })
        })
    }

}]);