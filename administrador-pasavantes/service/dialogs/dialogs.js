/**
 * Created by kolesnikov-a on 26/04/2016.
 */
administradorPasavantes.service('dialogsService', ['$uibModal', function($uibModal){

    return {
        confirm: function(title, message){
            return $uibModal.open({
                controller: 'dialogsCtrl',
                templateUrl: './services/dialogs/confirm.html',
                resolve: {
                    title: function(){
                        return title;
                    },
                    message: function(){
                        return message;
                    }
                }
            })
        },
        error: function(title, message){
            return $uibModal.open({
                controller: 'dialogsCtrl',
                templateUrl: './services/dialogs/error.html',
                resolve: {
                    title: function(){
                        return title;
                    },
                    message: function(){
                        return message;
                    }
                }
            })
        },
        notify: function(title, message){
            return $uibModal.open({
                controller: 'dialogsCtrl',
                templateUrl: './services/dialogs/notify.html',
                resolve: {
                    title: function(){
                        return title
                    },
                    message: function(){
                        return message
                    }
                }
            })
        },
        login: function(){
            return $uibModal.open({
                controller: 'loginDialogCtrl',
                templateUrl: './services/dialogs/login.html',
                backdrop: 'static'
            })
        }
    }

}]);

administradorPasavantes.controller('dialogsCtrl', ['$scope', '$uibModalInstance', 'title', 'message', function($scope, $uibModalInstance, title, message){

    $scope.modalData = {
        title: title,
        message: message
    };

    console.log($scope.modalData);

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);

administradorPasavantes.controller('loginDialogCtrl', ['$scope', '$uibModalInstance', 'loginFactory',  function($scope, $uibModalInstance, loginFactory){

    $scope.user = {
        name: '',
        password: '',
        session: false,
        role: 'admin'
    };

    $scope.login = function(){
        loginFactory.login($scope.user, function(result){
            $uibModalInstance.close(result);
        })
    };

    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }


}]);