<?php

$url = 'https://pg-app-m8z2b4l7sm6v21liysy9fe27j8bf3f.scalabl.cloud/1/classes/Activitylog';
$appId = 'qIZJSomGlIEJLGzBLIZQQDHCTPSSNMLgMUd4VlRA';  
$restKey = 'v7nVylPk8VeGBph6994YZMY6ONNVd4VTAMGTRmMH';  

$headers = array(  
	   "Content-Type: application/json",  
	   "X-Parse-Application-Id: " . $appId,
	   "X-Parse-REST-API-Key:" . $restKey  
	   
	 );  

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER,$headers);  
$data = curl_exec($ch);
curl_close($ch);
echo $data;

?>
