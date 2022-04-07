<?php header('Access-Control-Allow-Origin: *');

$url = $_GET['url'];
$data = file_get_contents($url);
print_r($data);
?>