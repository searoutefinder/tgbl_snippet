<?php

$curl = curl_init();

$user = "";
$dataset = "";
$accessToken = "";


curl_setopt_array($curl, array(
  CURLOPT_URL => "https://api.mapbox.com/datasets/v1/" . $user . "/" . $dataset . "/features?access_token=" . $accessToken,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_SSL_VERIFYPEER => false,
  CURLOPT_HTTPHEADER => array(
    "cache-control: no-cache"
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}
?>
