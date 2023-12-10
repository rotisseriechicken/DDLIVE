<?php header('Access-Control-Allow-Origin: *');

$userid = $_GET['userid'];
$url = 'http://dd.hasmodai.com/dd3/get_replay.php';
$data = array('replay' => $userid);

$options = array(
    'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($data)
    )
);
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
if ($result === FALSE) { /* ERROR */ }

print_r($result);
?>