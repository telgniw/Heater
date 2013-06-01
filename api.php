<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: ' . gmdate('D, d M Y H:i:s', time()) . ' GMT');
header('Content-type: application/json; charset=utf-8');

$COL_PLACE  = 'place';
$COL_UV     = 'uv';
$COL_HUM    = 'hum';
$COL_TEMP   = 'temp';
$COL_TIME   = 'timestamp';

$db = new SQLite3('weather.sqlite3');

if(array_key_exists($COL_PLACE, $_GET)) {
    $place = $_GET[$COL_PLACE];

    $stmt = $db->prepare('SELECT * FROM Data WHERE place = :place ORDER BY timestamp ASC');
    $stmt->bindValue(':place', $place);

    $logs = [];
    $result = $stmt->execute();
    while($row = $result->fetchArray()) {
        $logs[] = [
            $COL_UV     => $row[$COL_UV],
            $COL_HUM    => $row[$COL_HUM],
            $COL_TEMP   => $row[$COL_TEMP],
            $COL_TIME   => $row[$COL_TIME],
        ];
    }

    echo json_encode($logs);
}
else {
    $places = [];
    $result = $db->query('SELECT DISTINCT * FROM Data');
    while($row = $result->fetchArray()) {
        $places[] = $row[$COL_PLACE];
    }

    echo json_encode($places);
}

$db->close();
?>
