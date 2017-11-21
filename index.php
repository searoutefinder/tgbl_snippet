<!DOCTYPE html>
<html>
<head>
	<title>TGBL MAP SAMPLE</title>
	<link href='https://api.mapbox.com/mapbox.js/v3.1.1/mapbox.css' rel='stylesheet' />
	<link rel="stylesheet" type="text/css" href="css/style.css" />
</head>
<body>
	<div id="wrapper" style="position:absolute;top:0px;left:0px;right:0px;bottom:0px;">
		<header style="display:block;width:100%;height:50px;background:#000;text-align:center">
			<input type="text" id="location" placeholder="Enter your location here" autocomplete="off" style="width:300px;margin-top:5px;padding:10px;"/>			
			<select id="mileslist" style="padding:10px;">
				<option selected disabled>Select a distance</option>
				<option value="5">5 miles</option>
				<option value="10">10 miles</option>
				<option value="20">20 miles</option>
				<option value="40">40 miles</option>
			</select>
			<button id="radiusgo" style="padding:10px;">SHOW</button>
			<button id="radiusreset" style="padding:10px;">RESET</button>
		</header>
		<div id="sidebar" style="overflow-y:auto;overflow-x:hidden;position:absolute;width:350px;left:0px;bottom:0px;top:50px;"></div>
		<div id="map" style="position:absolute;bottom:0px;left:350px;right:0px;top:50px;"></div>
	</div>	

	<?php
		$tgbl_datasetID = 'cj9ebj0o4114d32o78msvxynv';
		$mapbox_user = 'rperry';
		$mapboxAccessToken = 'sk.eyJ1IjoicnBlcnJ5IiwiYSI6ImNqOWZrYmttcDJucHczMm9ydnB4cWxqdWEifQ.R769ZBUZFWZTbHLi5gs0ag';

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, "https://api.mapbox.com/datasets/v1/" . $mapbox_user . "/" . $tgbl_datasetID . "/features?access_token=" . $mapboxAccessToken);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
		$response = curl_exec($ch);
		curl_close($ch);		
	?>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
	<script src='https://api.mapbox.com/mapbox.js/v3.1.1/mapbox.js'></script>
	<script src='https://npmcdn.com/@turf/turf/turf.min.js'></script>
	<script type="text/javascript" src="js/ezmapdesign-mapbox-autocomplete.js"></script>
	<script type="text/javascript">
		<?php
			echo 'var vendors = ' . $response . ';';
		?>			
	</script>
	<script type="text/javascript" src="js/tgblmap.js"></script>
</body>
</html>