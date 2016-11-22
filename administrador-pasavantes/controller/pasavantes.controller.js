/**
 * Created by kolesnikov-a on 13/10/2016.
 */
/**
 * Created by Artiom on 4/10/16.
 */
administradorPasavantes.controller('pasavantesCtrl', ['$scope', 'Pasavante', 'Tarifa', 'pasavantesFactory', 'localStorageService', 'dialogsService', function($scope, Pasavante, Tarifa, pasavantesFactory, localStorageService, dialogsService){

    $scope.fecha = new Date();

    $scope.nuevoPasavante = new Pasavante();

    $scope.tarifas = [];
    $scope.pasavantes = [];
    $scope.muelles = [];
    $scope.traficos = [];

    $scope.searchText = '';

    $scope.pasavanteGuardado = false;

    localStorageService.get('muelles').forEach(function(dataMuelle){
        $scope.muelles[dataMuelle.CODIGO_MUELLE] = dataMuelle;
    });
    localStorageService.get('trafico').forEach(function(dataTrafico){
        $scope.traficos[dataTrafico.ID_TRAFICO] = dataTrafico;
    });
    localStorageService.get('tarifas').forEach(function(tarifaData){
        $scope.tarifas[tarifaData.ID_TARIFA] = new Tarifa(tarifaData);
    });

    function cargarPasavantes (){
        pasavantesFactory.getPasavantes().then(function(pasavantes){
            //console.log(pasavantes);
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
            //console.log(error)
            dialogsService.error('Error', error.message);
        });
    }

    $scope.setNavegacion = function(item, model, label, event){
        $scope.nuevoPasavante.setTipoNavegacion(item.ID_TRAFICO);
    };

    $scope.setMuelle = function(item, model, label, event){
        $scope.nuevoPasavante.setMuelle(item.CODIGO_MUELLE);
    };

    $scope.setMinimo = function(index){
        for (var i = 0; i < $scope.nuevoPasavante.TERMINALES[0].TARIFAS.length; i++){
            if (index != i) $scope.nuevoPasavante.TERMINALES[0].TARIFAS[i].MINIMO = false;
        }
    };

    $scope.setTarifa = function(item, model, label, event, index){
        $scope.nuevoPasavante.TERMINALES[0].TARIFAS[index].ID_TARIFA = item.ID_TARIFA;
        $scope.nuevoPasavante.TERMINALES[0].TARIFAS[index].CODIGO_TARIFA = item.CODIGO_TARIFA;
        $scope.nuevoPasavante.TERMINALES[0].TARIFAS[index].DESCRI_TARIFA = item.DESCRI_TARIFA;
        $scope.nuevoPasavante.TERMINALES[0].TARIFAS[index].SIMBOLO = item.SIMBOLO;
        $scope.nuevoPasavante.TERMINALES[0].TARIFAS[index].CODIGO_AFIP = item.CODIGO_AFIP;
        $scope.nuevoPasavante.TERMINALES[0].TARIFAS[index].getValor();
    };

    $scope.unsetTarifa = function(index){
        $scope.nuevoPasavante.TERMINALES[0].TARIFAS[index].BACKUP = '';
        $scope.nuevoPasavante.TERMINALES[0].TARIFAS[index].ID_TARIFA = '';
        $scope.nuevoPasavante.TERMINALES[0].TARIFAS[index].CODIGO_TARIFA = '';
        $scope.nuevoPasavante.TERMINALES[0].TARIFAS[index].DESCRI_TARIFA = '';
        $scope.nuevoPasavante.TERMINALES[0].TARIFAS[index].SIMBOLO = '';
        $scope.nuevoPasavante.TERMINALES[0].TARIFAS[index].CODIGO_AFIP = '';
        $scope.nuevoPasavante.TERMINALES[0].TARIFAS[index].VALOR = '';
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

    $scope.enableRate = function(navegacion, muelle, tarifa){
        tarifa.enable(navegacion, muelle).then(function(data){
            //console.log(data);
        }, function(error){
            dialogsService.error('Error', error.message);
        })
    };

    function searchPasavanteRates (){
        $scope.pasavantes.forEach(function(pasavante){
            if (pasavante.ID_TIPO_NAVEGACION == $scope.nuevoPasavante.ID_TIPO_NAVEGACION){
                pasavante.TERMINALES.forEach(function(muelle){
                    if (muelle.ID_TERMINAL == $scope.nuevoPasavante.TERMINALES[0].ID_TERMINAL){
                        muelle.TARIFAS.forEach(function(tarifa){
                            for (var i = 0; i < $scope.nuevoPasavante.TERMINALES[0].TARIFAS.length; i++){
                                if ($scope.nuevoPasavante.TERMINALES[0].TARIFAS[i].ID_TARIFA == tarifa.ID_TARIFA) {
                                    //console.log('la tarifa ' + i + ' si esta');
                                    $scope.nuevoPasavante.TERMINALES[0].TARIFAS[i].ID = tarifa.ID;
                                }
                            }
                        })
                    }
                })
            }
        })
    }

    $scope.guardarPasavante = function(){
        $scope.pasavanteGuardado = true;
        searchPasavanteRates();
        $scope.nuevoPasavante.saveChanges().then(function(result){
            if (result.status == 'OK'){
                dialogsService.notify('Pasavantes', 'Todas las tarifas se guardaron correctamente');
                //$scope.limpiarFormulario();
            } else {
                dialogsService.notify('Pasavantes', 'Se produjeron errores en ' + result.data + 'tarifas.');
            }
            cargarPasavantes();
        }, function(error){
            if (error.status == 'NORATES'){
                dialogsService.notify('Pasavantes', error.message);
            } else {
                dialogsService.error('Pasavantes', error.message);
            }
        })
    };

    $scope.editarPasavante = function(pasavante, indexTerminal, event){
        event.stopPropagation();
        var adapterObject = {
            ID_TIPO_NAVEGACION: pasavante.ID_TIPO_NAVEGACION,
            NAVEGACION: $scope.traficos[pasavante.ID_TIPO_NAVEGACION],
            TERMINALES: [
                angular.copy(pasavante.TERMINALES[indexTerminal])
            ]
        };

        adapterObject.TERMINALES[0].MUELLE = $scope.muelles[adapterObject.TERMINALES[0].ID_TERMINAL];
        for (var i = 0; i < adapterObject.TERMINALES[0].TARIFAS.length; i++){
            adapterObject.TERMINALES[0].TARIFAS[i].BACKUP = $scope.tarifas[adapterObject.TERMINALES[0].TARIFAS[i].ID_TARIFA]
        }

        $scope.nuevoPasavante = new Pasavante(adapterObject);
    };

    $scope.limpiarFormulario = function(){
        $scope.nuevoPasavante = new Pasavante();
    };

    cargarPasavantes();

}]);