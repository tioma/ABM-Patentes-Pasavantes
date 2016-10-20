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
	<!-- build:css -->
	<link rel="stylesheet" href="../css/bootstrap.css">
	<link rel="stylesheet" href="../css/app.css">
	<!-- endbuild -->
	<!-- build:bower -->
	<script src="../bower_components/angular/angular.js"></script>
	<script src="../bower_components/angular-animate/angular-animate.js"></script>
	<script src="../bower_components/angular-ui-router/release/angular-ui-router.js"></script>
	<script src="../bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
	<script src="../bower_components/angular-local-storage/dist/angular-local-storage.js"></script>
	<!-- endbuild -->
	<!-- build:app -->
	<script src="app.js"></script>
	<script src="config.app.js"></script>

	<script src="class/pasavantes.class.js"></script>
	<script src="class/tarifas.class.js"></script>

	<script src="factory/localStorage.factory.js"></script>
	<script src="factory/pasavantes.factory.js"></script>

	<script src="controller/pasavantes.controller.js"></script>

	<script src="service/dialogs/dialogs.js"></script>
	<!-- endbuild -->
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
				<li><a href="liquidaciones.php?fecha=<?php echo $nuevafecha; ?>"><i class="glyphicon glyphicon-calendar" aria-hidden="true"></i> Hoy</a></li>
				<li><a href="liquidaciones.php?todo"><i class="glyphicon glyphicon-list" aria-hidden="true"></i> Todo</a></li>
				<li class="dropdown" uib-dropdown>
					<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" uib-dropdown-toggle>Menu <span class="caret"></span></a>
					<ul class="dropdown-menu">
						<li><a href="#">Realizadas</a></li>
						<li><a href="#">Pendientes del día</a></li>
						<li><a href="#">Pendientes Total</a></li>
						<li role="separator" class="divider"></li>
						<li><a href="logout.php">Cerrar Sesión</a></li>
					</ul>
				</li>
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