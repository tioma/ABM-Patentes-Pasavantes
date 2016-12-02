/**
 * Created by kolesnikov-a on 13/10/2016.
 */
/**
 * Created by Artiom on 4/10/16.
 */
administradorPatentes.controller('patentesCtrl', ['$scope', 'Patente', 'Tarifa', 'patentesFactory', 'localStorageService', 'dialogsService', function($scope, Patente, Tarifa, patentesFactory, localStorageService, dialogsService){

    $scope.fecha = new Date();

    $scope.nuevaPatente = new Patente();

    $scope.tarifas = [];
    $scope.patentes = [];
    $scope.embarcaciones = [];

    $scope.searchText = '';

    $scope.patenteGuardado = false;
    
    localStorageService.get('embarcaciones').forEach(function(dataEmbarcacion){
        $scope.embarcaciones[dataEmbarcacion.ID] = dataEmbarcacion;
    });
    localStorageService.get('tarifas').forEach(function(tarifaData){
        $scope.tarifas[tarifaData.ID_TARIFA] = new Tarifa(tarifaData);
    });

    function cargarPatentes (){
        patentesFactory.getPatentes().then(function(patentes){
            $scope.patentes = patentes;
            $scope.patentes.forEach(function(patente){
                patente.ARBOLADURA = $scope.embarcaciones[patente.ID_TIPO_EMBARCACION].ARBOLADURA;
                patente.TARIFAS.forEach(function(tarifa){
                    tarifa.CODIGO_TARIFA = $scope.tarifas[tarifa.ID_TARIFA].CODIGO_TARIFA
                })
            })
        }, function(error){
            //console.log(error)
            dialogsService.error('Error', error.message);
        });
    }
    
    $scope.setArboladura = function(item, model, label, event){
        $scope.nuevaPatente.arboladura = item.ID;
    };

    $scope.unsetArboladura = function(){
        $scope.nuevaPatente.ARBOLADURA = '';
        $scope.nuevaPatente.arboladura = 0
    };

    $scope.setMinimo = function(index){
        for (var i = 0; i < $scope.nuevaPatente.TARIFAS.length; i++){
            if (index != i) $scope.nuevaPatente.TARIFAS[i].MINIMO = false;
        }
    };

    $scope.setTarifa = function(item, model, label, event, index){
        $scope.nuevaPatente.TARIFAS[index].data = item;
    };

    $scope.unsetTarifa = function(index){
        $scope.nuevaPatente.TARIFAS[index].unsetData();
    };

    $scope.setMinDate = function(tarifa){
        if (tarifa.FECHA_INICIO){
            tarifa.HASTA_OPTIONS = {
                minDate: tarifa.FECHA_INICIO
            }
        } else {
            tarifa.HASTA_OPTIONS = {
                minDate: new Date()
            };
        }
    };

    $scope.setMaxDate = function(tarifa){
        if (tarifa.FECHA_FIN){
            tarifa.DESDE_OPTIONS = {
                maxDate: tarifa.FECHA_FIN
            }
        } else {
            tarifa.DESDE_OPTIONS = {};
        }
    };

    $scope.disableRate = function(tarifa){
        var confirm = dialogsService.confirm('Dar de baja tarifa', 'Se dará de baja la tarifa seleccionada. ¿Confirma la operación?');
        confirm.result.then(function(){
            tarifa.disable().then(function(data){
                //console.log(data);
                $scope.fecha = new Date();
            }, function(error){
                //console.log(error);
                dialogsService.error('Error', error.message);
            });
        })
    };

    $scope.enableRate = function(embarcacion, tarifa){
        tarifa.enable(embarcacion).then(function(data){
            //console.log(data);
        }, function(error){
            dialogsService.error('Error', error.message);
        })
    };

    function searchPatenteRates (){
        $scope.patentes.forEach(function(patente){
            if (patente.ID_TIPO_EMBARCACION == $scope.nuevaPatente.ID_TIPO_EMBARCACION){
                patente.TARIFAS.forEach(function(tarifa){
                    for (var i = 0; i < $scope.nuevaPatente.TARIFAS.length; i++){
                        if ($scope.nuevaPatente.TARIFAS[i].ID_TARIFA == tarifa.ID_TARIFA) {
                            //console.log('la tarifa ' + i + ' si esta');
                            $scope.nuevaPatente.TARIFAS[i].ID = tarifa.ID;
                        }
                    }
                })
            }
        })
    }

    $scope.guardarPatente = function(){
        $scope.patenteGuardado = true;
        searchPatenteRates();
        $scope.nuevaPatente.saveChanges().then(function(result){
            if (result.status == 'OK'){
                dialogsService.notify('Patentes', 'Todas las tarifas se guardaron correctamente');
                //$scope.limpiarFormulario();
            } else {
                dialogsService.notify('Patentes', 'Se produjeron errores en ' + result.data + 'tarifas.');
            }
            cargarPatentes();
        }, function(error){
            if (error.status == 'NORATES'){
                dialogsService.notify('Patentes', error.message);
            } else {
                dialogsService.error('Patentes', error.message);
            }
        })
    };

    $scope.editarPatente = function(patente, event){
        event.stopPropagation();
        var adapterObject = angular.copy(patente);
        adapterObject.ARBOLADURA = $scope.embarcaciones[patente.ID_TIPO_EMBARCACION];

        for (var i = 0; i < adapterObject.TARIFAS.length; i++){
            adapterObject.TARIFAS[i].BACKUP = $scope.tarifas[adapterObject.TARIFAS[i].ID_TARIFA]
        }

        $scope.nuevaPatente = new Patente(adapterObject);
    };

    $scope.limpiarFormulario = function(){
        $scope.nuevaPatente = new Patente();
    };

    cargarPatentes();

}]);