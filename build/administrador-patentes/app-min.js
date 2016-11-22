var administradorPatentes=angular.module("administradorPatentes",["ui.router","ui.bootstrap","ngAnimate","LocalStorageModule"]);administradorPatentes.config(["$stateProvider","$urlRouterProvider","localStorageFactoryProvider",function(t,e,a){var n=a.$get();e.otherwise(function(t){var e=t.get("$state");e.go("patentes")}),t.state("patentes",{url:"/patentes",templateUrl:"view/patentes.html",controller:"patentesCtrl",resolve:{embarcaciones:n.getShipTypes,tarifas:n.getRates}}).state("error",{url:"/error",templateUrl:"view/error.html"})}]),administradorPatentes.run(["$rootScope","$state","$window",function(t,e,a){t.$on("$stateChangeError",function(t,a,n,r,i,o){e.go("error")}),t.goBack=function(){a.history.back()}}]),administradorPatentes.constant("APP_CONFIG",{SERVER_URL:"http://terminales.puertobuenosaires.gob.ar:8099",API_ENDPOINT:"http://www.e-puertobue.com.ar/ws"}),administradorPatentes.factory("Patente",["$http","APP_CONFIG","$q","Tarifa",function(t,e,a,n){function r(t){t?this.setData(t):this.TARIFAS=[]}return r.prototype={setData:function(t){angular.extend(this,t),this.VALOR_TOTAL=0,this.DETALLE=!1;for(var e=0;e<this.TARIFAS.length;e++)this.TARIFAS[e]=new n(this.TARIFAS[e]),this.VALOR_TOTAL+=this.TARIFAS[e].VALOR},setArboladura:function(t){this.ID_TIPO_EMBARCACION=t;for(var e=0;e<this.TARIFAS.length;e++)this.TARIFAS[e].ID=void 0},addRate:function(){this.TARIFAS.push(new n)},removeRate:function(t){this.TARIFAS.splice(t,1)},saveChanges:function(){var t=a.defer(),e=this;if(this.TARIFAS.length>0){for(var n=[],r=0;r<this.TARIFAS.length;r++)n.push(this.TARIFAS[r].savePatente(this.ID_TIPO_EMBARCACION));a.all(n).then(function(a){var n=0,r={};a.forEach(function(t){t&&n++}),0==n&&(r={status:"ERROR",message:"Se produjo un error al intentar guardar las tarifas."},t.reject(r)),n==e.TARIFAS.length?(r={status:"OK"},t.resolve(r)):(r={status:"ERROR",data:e.TARIFAS.length-n},t.resolve(r))})}else{var i={status:"NORATES",message:"Debe seleccionar una tarifa para guardar."};t.reject(i)}return t.promise}},r}]),administradorPatentes.factory("Tarifa",["$http","APP_CONFIG","$q",function(t,e,a){function n(t){this.MINIMO=!1,this.DESDE_OPENED=!1,this.HASTA_OPENED=!1,this.DESDE_OPTIONS={},this.HASTA_OPTIONS={minDate:new Date},this.STATUS="",t&&this.setData(t)}return n.prototype={setData:function(t){angular.extend(this,t),this.MINIMO=1==this.MINIMO,null!=this.FECHA_FIN&&(this.FECHA_FIN=new Date(this.FECHA_FIN)),null!=this.FECHA_INICIO&&(this.FECHA_INICIO=new Date(this.FECHA_INICIO))},getValor:function(){var n=a.defer(),r=e.SERVER_URL+"/rates/"+this.ID_TARIFA,i=this;return t.get(r).then(function(t){0==t.data.data[0].VALORES.length?i.VALOR=0:i.VALOR=t.data.data[0].VALORES[0].VALOR_TARIFA,n.resolve()},function(t){n.reject(t.data)}),n.promise},formatData:function(){return this.CODIGO_TARIFA+" - "+this.DESCRI_TARIFA},disable:function(){var n=a.defer(),r=e.SERVER_URL+"/patentes/patente/disable/"+this.ID,i=this;return t.put(r).then(function(t){"OK"==t.data.status?(i.FECHA_FIN=new Date,n.resolve(t.data)):n.reject(t.data)},function(t){n.reject(t.data)}),n.promise},buildAdapterObject:function(t){var e={};return e.id_tipo_embarcacion=parseInt(t),e.id_tarifa=this.ID_TARIFA,this.FECHA_INICIO&&(e.fecha_inicio=this.FECHA_INICIO),this.FECHA_FIN&&(e.fecha_fin=this.FECHA_FIN),this.MINIMO&&(e.minimo=1),e},enable:function(n){var r=a.defer(),i=e.SERVER_URL+"/patentes/patente/update/"+this.ID,o={};o.id_tipo_embarcacion=parseInt(n),this.FECHA_INICIO&&(o.fecha_inicio=this.FECHA_INICIO),this.MINIMO&&(o.minimo=1);var s=this;return t.put(i,o).then(function(t){"OK"==t.data.status?(s.FECHA_FIN=null,r.resolve(t.data)):r.reject(t.data)},function(t){r.reject(t.data)}),r.promise},savePatente:function(t){var e=a.defer(),n=this,r=this.buildAdapterObject(t);return this.ID?this.updateRate(r).then(function(t){"OK"==t.data.status?(n.STATUS="OK",e.resolve(!0)):(n.STATUS="ERROR",e.resolve(!1))},function(t){n.STATUS="ERROR",n.ERROR=t.data.message,e.resolve(!1)}):this.addRate(r).then(function(t){"OK"==t.data.status?(n.STATUS="OK",n.ID=t.data.data.ID,e.resolve(!0)):(n.STATUS="ERROR",e.resolve(!1))},function(t){n.STATUS="ERROR",n.ERROR=t.data.message,e.resolve(!1)}),e.promise},addRate:function(a){var n=e.SERVER_URL+"/patentes/patente";return t.post(n,a)},updateRate:function(a){var n=e.SERVER_URL+"/patentes/patente/update/"+this.ID;return t.put(n,a)}},n}]),administradorPatentes.controller("patentesCtrl",["$scope","Patente","Tarifa","patentesFactory","localStorageService","dialogsService",function(t,e,a,n,r,i){function o(){n.getPatentes().then(function(e){t.patentes=e,t.patentes.forEach(function(e){e.ARBOLADURA=t.embarcaciones[e.ID_TIPO_EMBARCACION].ARBOLADURA,e.TARIFAS.forEach(function(e){e.CODIGO_TARIFA=t.tarifas[e.ID_TARIFA].CODIGO_TARIFA})})},function(t){i.error("Error",t.message)})}function s(){t.patentes.forEach(function(e){e.ID_TIPO_EMBARCACION==t.nuevaPatente.ID_TIPO_EMBARCACION&&e.TARIFAS.forEach(function(e){for(var a=0;a<t.nuevaPatente.TARIFAS.length;a++)t.nuevaPatente.TARIFAS[a].ID_TARIFA==e.ID_TARIFA&&(t.nuevaPatente.TARIFAS[a].ID=e.ID)})})}t.fecha=new Date,t.nuevaPatente=new e,t.tarifas=[],t.patentes=[],t.embarcaciones=[],t.searchText="",t.patenteGuardado=!1,r.get("embarcaciones").forEach(function(e){t.embarcaciones[e.ID]=e}),r.get("tarifas").forEach(function(e){t.tarifas[e.ID_TARIFA]=new a(e)}),t.setArboladura=function(e,a,n,r){t.nuevaPatente.setArboladura(e.ID)},t.setMinimo=function(e){for(var a=0;a<t.nuevaPatente.TARIFAS.length;a++)e!=a&&(t.nuevaPatente.TARIFAS[a].MINIMO=!1)},t.setTarifa=function(e,a,n,r,i){t.nuevaPatente.TARIFAS[i].ID_TARIFA=e.ID_TARIFA,t.nuevaPatente.TARIFAS[i].CODIGO_TARIFA=e.CODIGO_TARIFA,t.nuevaPatente.TARIFAS[i].DESCRI_TARIFA=e.DESCRI_TARIFA,t.nuevaPatente.TARIFAS[i].SIMBOLO=e.SIMBOLO,t.nuevaPatente.TARIFAS[i].CODIGO_AFIP=e.CODIGO_AFIP,t.nuevaPatente.TARIFAS[i].getValor()},t.unsetTarifa=function(e){t.nuevaPatente.TARIFAS[e].BACKUP="",t.nuevaPatente.TARIFAS[e].ID_TARIFA="",t.nuevaPatente.TARIFAS[e].CODIGO_TARIFA="",t.nuevaPatente.TARIFAS[e].DESCRI_TARIFA="",t.nuevaPatente.TARIFAS[e].SIMBOLO="",t.nuevaPatente.TARIFAS[e].CODIGO_AFIP="",t.nuevaPatente.TARIFAS[e].VALOR=""},t.setMinDate=function(t){t.FECHA_INICIO?t.HASTA_OPTIONS={minDate:t.FECHA_INICIO}:t.HASTA_OPTIONS={minDate:new Date}},t.setMaxDate=function(t){t.FECHA_FIN?t.DESDE_OPTIONS={maxDate:t.FECHA_FIN}:t.DESDE_OPTIONS={}},t.disableRate=function(e){var a=i.confirm("Dar de baja tarifa","Se dará de baja la tarifa seleccionada. ¿Confirma la operación?");a.result.then(function(){e.disable().then(function(e){t.fecha=new Date},function(t){i.error("Error",t.message)})})},t.enableRate=function(t,e){e.enable(t).then(function(t){},function(t){i.error("Error",t.message)})},t.guardarPatente=function(){t.patenteGuardado=!0,s(),t.nuevaPatente.saveChanges().then(function(t){"OK"==t.status?i.notify("Patentes","Todas las tarifas se guardaron correctamente"):i.notify("Patentes","Se produjeron errores en "+t.data+"tarifas."),o()},function(t){"NORATES"==t.status?i.notify("Patentes",t.message):i.error("Patentes",t.message)})},t.editarPatente=function(a,n){n.stopPropagation();var r=angular.copy(a);r.ARBOLADURA=t.embarcaciones[a.ID_TIPO_EMBARCACION];for(var i=0;i<r.TARIFAS.length;i++)r.TARIFAS[i].BACKUP=t.tarifas[r.TARIFAS[i].ID_TARIFA];t.nuevaPatente=new e(r)},t.limpiarFormulario=function(){t.nuevaPatente=new e},o()}]),administradorPatentes.factory("localStorageFactory",["$http","$q","APP_CONFIG","localStorageService",function(t,e,a,n){var r={getRates:function(){var r=e.defer(),i=a.SERVER_URL+"/rates/document/12";return t.get(i).then(function(t){n.set("tarifas",t.data.data),r.resolve()},function(t){r.reject()}),r.promise},getShipTypes:function(){var r=e.defer(),i=a.API_ENDPOINT+"/ws-embarcaciones.php";return t.get(i).then(function(t){n.set("embarcaciones",t.data),r.resolve()},function(t){r.reject()}),r.promise}};return r}]),administradorPatentes.factory("patentesFactory",["$http","$q","APP_CONFIG","Patente","Tarifa",function(t,e,a,n,r){var i={getPatentes:function(){var r=e.defer(),i=a.SERVER_URL+"/patentes";return t.get(i).then(function(t){if("OK"==t.data.status){var e=[];t.data.data.forEach(function(t){var a=new n(t);e.push(a)}),r.resolve(e)}else r.reject(t.data)},function(t){r.reject(t.data)}),r.promise}};return i}]),administradorPatentes.service("dialogsService",["$uibModal",function(t){return{confirm:function(e,a){return t.open({controller:"dialogsCtrl",templateUrl:"./service/dialogs/confirm.html",resolve:{title:function(){return e},message:function(){return a}}})},error:function(e,a){return t.open({controller:"dialogsCtrl",templateUrl:"./service/dialogs/error.html",resolve:{title:function(){return e},message:function(){return a}}})},notify:function(e,a){return t.open({controller:"dialogsCtrl",templateUrl:"./service/dialogs/notify.html",resolve:{title:function(){return e},message:function(){return a}}})},login:function(){return t.open({controller:"loginDialogCtrl",templateUrl:"./service/dialogs/login.html",backdrop:"static"})}}}]),administradorPatentes.controller("dialogsCtrl",["$scope","$uibModalInstance","title","message",function(t,e,a,n){t.modalData={title:a,message:n},console.log(t.modalData),t.ok=function(){e.close()},t.cancel=function(){e.dismiss("cancel")}}]),administradorPatentes.controller("loginDialogCtrl",["$scope","$uibModalInstance","loginFactory",function(t,e,a){t.user={name:"",password:"",session:!1,role:"admin"},t.login=function(){a.login(t.user,function(t){e.close(t)})},t.cancel=function(){e.dismiss("cancel")}}]);