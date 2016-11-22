<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

/* includes */
/*include 'model/functions/funciones.php';
include 'model/clases/my_sqli.php';
include 'model/functions/funciones_comunes.php';*/


/* vars */

/*$dbMYSQL = new my_sqli();
$mail_to = "ob2@puertobuenosaires.gob.ar";*/

/*function getAM_name($codigo_agencia) {
    global $dbMYSQL;
    $QUERY = "SELECT * FROM `V_EMPRESAS` where LOWER(CODIGO_AGENCIA) like '%" . strtolower($codigo_agencia) . "%'";
    $res = $dbMYSQL->consulta($QUERY);
$row = $res->fetch_assoc();
return utf8_encode($row['NOMBRE']);
}*/

/*$ch = curl_init('www.e-puertobue.com.ar/ws/ws-trafico.php');

curl_setopt($ch, CURLOPT_TIMEOUT_MS, 2000);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

$data = curl_exec($ch);

echo (array_encode($data));
/*foreach($data as $trafico) {
echo $trafico;
}*/
/*$data = json_encode($data);

foreach($data as $trafico){
echo $trafico;
}

curl_close($ch);*/

$fecha = date('Y-m-j');
$nuevafecha = strtotime('-1 day', strtotime($fecha));
$nuevafecha = date('Y-m-d', $nuevafecha);
?>

<!DOCTYPE html>
<html ng-app="administradorPasavantes">
<head>

	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">

	<meta name="description" content="">
	<meta name="author" content="">

	<title>Administrador Tarifas Pasavantes</title>
	<link rel="stylesheet" href="../css/bootstrap.min.css">
	<link rel="stylesheet" href="../css/app.min.css">
	<link rel="stylesheet" href="../css/animate.min.css">

	<script src="../lib/angular/angular.min.js"></script>
	<script src="../lib/angular-animate/angular-animate.min.js"></script>
	<script src="../lib/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
	<script src="../lib/angular-local-storage/angular-local-storage.min.js"></script>
	<script src="../lib/angular-ui-router/angular-ui-router.min.js"></script>

	<script src="app-min.js"></script>

</head>
<body class="container-fluid col-lg-12">

<nav class="navbar navbar-default">
	<div class="container-fluid">
		<!-- Brand and toggle get grouped for better mobile display -->
		<div class="navbar-header" uib-dropdown>
			<button class="navbar-toggle collapsed" type="button" data-target=".navbar-responsive-collapse" ng-click="isCollapsed = !isCollapsed" aria-expanded="false">
				<span class="sr-only">Toggle navigation</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="#">Administrador Tarifas Pasavantes</a>
		</div>

		<!-- Collect the nav links, forms, and other content for toggling -->
		<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
			<ul class="nav navbar-nav navbar-right">
				<li><a ng-click="goBack()" class="nav navbar-btn"><i class="glyphicon glyphicon-arrow-left" aria-hidden="true"></i> Atrás</a></li>
			</ul>
		</div><!-- /.navbar-collapse -->
	</div><!-- /.container-fluid -->
</nav>
<ol class="breadcrumb" style="padding: 8px 15px; margin-bottom: 4px; list-style: none; margin-top: -16px;">
	<li><a href="#">ePuertoBue</a></li>
	<li><a href="#">Liquidaciones</a></li>
	<li class="active">Pasavantes</li>
</ol>

<div ui-view></div>
</body>
</html>