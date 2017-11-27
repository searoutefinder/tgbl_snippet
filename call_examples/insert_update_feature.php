<?php

$curl = curl_init();

$user = "";
$dataset = "";
$accessToken = "";
$featureID = "your-magento-record-ID";

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://api.mapbox.com/datasets/v1/" . $user . "/" . $dataset . "/features/" . $featureID . "?access_token=" . $accessToken,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "PUT",
  CURLOPT_SSL_VERIFYPEER => false,  
  CURLOPT_POSTFIELDS => "{\r\n  \"type\": \"Feature\",\r\n  \"geometry\": {\r\n    \"type\": \"Point\",\r\n    \"coordinates\": [20,50]\r\n  },\r\n  \"properties\": {\r\n    \"seller\": \"Tamas\"\r\n  }\r\n}",
  CURLOPT_HTTPHEADER => array(
    "cache-control: no-cache",
    "content-type: application/json"
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
