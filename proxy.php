<?php header('Access-Control-Allow-Origin: *');

$protocol = 'https://';
$url = $_GET['url'];
$requestURL = $protocol . $url;
$data = file_get_contents($requestURL);
print_r($data);
?>