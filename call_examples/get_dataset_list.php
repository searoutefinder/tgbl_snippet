<?php

$curl = curl_init();

$user = "rperry";
$dataset = "cj9ebj0o4114d32o78msvxynv";
$accessToken = "sk.eyJ1IjoicnBlcnJ5IiwiYSI6ImNqYWUyN3U5aTFyYnAzM3IxdnIyaWE2eTEifQ.f9MMdw138ZVqirYZDJBVwQ";

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://api.mapbox.com/datasets/v1/" . $user . "?access_token=" . $accessToken,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_SSL_VERIFYPEER => false,
  CURLOPT_HTTPHEADER => array(
    "cache-control: no-cache",
    "postman-token: e1ade556-ecde-59a4-8acd-d451c8a8f3d6"
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