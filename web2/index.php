<!DOCTYPE html>
<html lang="ro-RO"></html>
<head>
  <meta charset="utf-8">
  <meta name="format-detection" content="telephone=no">
  <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <link href="http://fonts.googleapis.com/css?family=Lora:400,700&amp;subset=latin,latin-ext" rel="stylesheet" type="text/css">
  <link href="assets/css/style.css" rel="stylesheet" type="text/css">

<?php include('./assets/js/httpful.phar');?>

  <title>hotQ</title>
</head>
<body>
<?php
	echo '<h1>header</h1>';

	$url = "https://api.parse.com/1/functions/GetListQuestions";

	$data = '{"username":"test"}';

	$headers = array (
			"X-Parse-Application-Id: oYvsd9hx0NoIlgEadXJsqCtU1PgjcPshRqy18kmP",
			"X-Parse-REST-API-Key: gX3SUxGPeSnAefjtFmF9MeWpbTIa9YhC8q1n7hLk",
            "Content-Type: application/json"
	);

	$handle = curl_init(); 
	curl_setopt($handle, CURLOPT_URL, $url);
	curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
	curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($handle, CURLOPT_POST, true);
	curl_setopt($handle, CURLOPT_POSTFIELDS, $data);

	$result=curl_exec($handle);
	// curl_close($handle);
		$result2=json_decode($result);
		var_dump($result2->result);
?>



</body>