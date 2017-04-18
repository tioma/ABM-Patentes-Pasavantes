/**
 * Created by kolesnikov-a on 13/10/2016.
 */
/**
 * Created by Artiom on 4/10/16.
 */
administradorPasavantes.controller('pasavantesCtrl', ['$scope', 'Pasavante', 'Tarifa', 'pasavantesFactory', 'localStorageService', 'dialogsService', '$timeout', function($scope, Pasavante, Tarifa, pasavantesFactory, localStorageService, dialogsService, $timeout){

    $scope.fecha = new Date();
    $scope.fecha.setHours(23, 59, 59);

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
        pasavantesFactory.getPasavantes().then((pasavantes) => {
            //console.log(pasavantes);
            $scope.pasavantes = pasavantes;
            $scope.pasavantes.forEach(function(pasavante){
                if ($scope.traficos[pasavante.ID_TIPO_NAVEGACION]){
                    pasavante.NAVEGACION = $scope.traficos[pasavante.ID_TIPO_NAVEGACION].DESC_TRAFICO;
                } else {
                    pasavante.NAVEGACION = 'Error - No se ha encontrado el tipo de navegación';
                }

                pasavante.TERMINALES.forEach(function(muelle){
                    if ($scope.muelles[muelle.ID_TERMINAL]){
                        muelle.MUELLE = $scope.muelles[muelle.ID_TERMINAL].DESCRIPCION_MUELLE;
                    } else {
                        muelle.MUELLE = 'ERROR - MUELLE NO ENCONTRADO.'
                    }

                    muelle.TARIFAS.forEach(function(tarifa){
                        tarifa.CODIGO_TARIFA = $scope.tarifas[tarifa.ID_TARIFA].CODIGO_TARIFA
                    })
                })
            })
        }).catch((error) => {
			//console.log(error)
			dialogsService.error('Error', error.message);
		});
    }

    $scope.setNavegacion = function(item, model, label, event){
        $scope.nuevoPasavante.tipoNavegacion = item.ID_TRAFICO;
    };

    $scope.unsetNavegacion = function(){
        $scope.nuevoPasavante.NAVEGACION = '';
        $scope.nuevoPasavante.tipoNavegacion = 0;
    };

    $scope.setMuelle = function(item, model, label, event){
        $scope.nuevoPasavante.muelle = item.CODIGO_MUELLE;
    };

    $scope.unsetMuelle = function(){
        $scope.nuevoPasavante.TERMINALES[0].MUELLE = '';
        $scope.nuevoPasavante.muelle = 0;
    };

    $scope.checkMuelle = function(){
        $timeout(() => {
            if ($scope.nuevoPasavante.TERMINALES[0].MUELLE == undefined){
                $scope.unsetMuelle();
            }
        }, 1);

    };

    $scope.preventSubmit = function(event){
        if (event.keyCode == 13){
            event.preventDefault();
        }
    };

    $scope.setMinimo = function(index){
        for (let i = 0; i < $scope.nuevoPasavante.TERMINALES[0].TARIFAS.length; i++){
            if (index != i) $scope.nuevoPasavante.TERMINALES[0].TARIFAS[i].MINIMO = false;
        }
    };

    $scope.setTarifa = function(item, model, label, event, index){
        $scope.nuevoPasavante.TERMINALES[0].TARIFAS[index].data = item;
    };

    $scope.unsetTarifa = function(index){
        $scope.nuevoPasavante.TERMINALES[0].TARIFAS[index].unsetData();
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

    $scope.disableRate = function(pasavante, terminal, tarifa){
        pasavante.removeRate(terminal, tarifa).then((data) => {
            cargarPasavantes();
        }).catch((error) => {
            //console.log(error);
			dialogsService.error('Error', error.message);
        });
    };

    $scope.enableRate = function(navegacion, muelle, tarifa){
        tarifa.enable(navegacion, muelle).then((data) => {
            //console.log(data);
        }).catch((error) => {
			dialogsService.error('Error', error.message);
		})
    };

    function searchPasavanteRates (){
        $scope.pasavantes.forEach(function(pasavante){
            if (pasavante.ID_TIPO_NAVEGACION == $scope.nuevoPasavante.ID_TIPO_NAVEGACION){
                pasavante.TERMINALES.forEach(function(muelle){
                    if (muelle.ID_TERMINAL == $scope.nuevoPasavante.TERMINALES[0].ID_TERMINAL){
                        muelle.TARIFAS.forEach(function(tarifa){
                            for (let i = 0; i < $scope.nuevoPasavante.TERMINALES[0].TARIFAS.length; i++){
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
        $scope.nuevoPasavante.saveChanges().then((result) => {
            if (result.status == 'OK'){
                dialogsService.notify('Pasavantes', 'Todas las tarifas se guardaron correctamente');
                //$scope.limpiarFormulario();
            } else {
                dialogsService.notify('Pasavantes', 'Se produjeron errores en ' + result.data + 'tarifas.');
            }
            cargarPasavantes();
        }).catch((error) => {
			if (error.status == 'NORATES'){
				dialogsService.notify('Pasavantes', error.message);
			} else {
				dialogsService.error('Pasavantes', error.message);
			}
		})
    };

    $scope.editarPasavante = function(pasavante, indexTerminal, event){
        event.stopPropagation();
        let adapterObject = {
            ID_TIPO_NAVEGACION: pasavante.ID_TIPO_NAVEGACION,
            NAVEGACION: $scope.traficos[pasavante.ID_TIPO_NAVEGACION],
            TERMINALES: [
                angular.copy(pasavante.TERMINALES[indexTerminal])
            ]
        };

        adapterObject.TERMINALES[0].MUELLE = $scope.muelles[adapterObject.TERMINALES[0].ID_TERMINAL];
        for (let i = 0; i < adapterObject.TERMINALES[0].TARIFAS.length; i++){
            adapterObject.TERMINALES[0].TARIFAS[i].BACKUP = $scope.tarifas[adapterObject.TERMINALES[0].TARIFAS[i].ID_TARIFA]
        }

        $scope.nuevoPasavante = new Pasavante(adapterObject);
    };

    $scope.limpiarFormulario = function(){
        $scope.nuevoPasavante = new Pasavante();
    };

    cargarPasavantes();

}]);