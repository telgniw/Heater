<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: ' . gmdate('D, d M Y H:i:s', time()) . ' GMT');
header('Content-type: application/json; charset=utf-8');

$TABLE_NAME = 'Data';
$COL_PLACE  = 'place';
$COL_UV     = 'uv';
$COL_HUM    = 'hum';
$COL_TEMP   = 'temp';
$COL_TIME   = 'timestamp';
$COL_TIMEH  = 'time_by_hour';

$db = new SQLite3('data/weather.sqlite3');

if(array_key_exists($COL_PLACE, $_GET)) {
    $place = $_GET[$COL_PLACE];

    $hour_format = '%Y-%m-%dT%H:00:00.000';
    $stmt = $db->prepare("
        SELECT $COL_PLACE, MAX($COL_UV) AS $COL_UV, MAX($COL_HUM) AS $COL_HUM,
            MAX($COL_TEMP) AS $COL_TEMP, strftime('$hour_format', $COL_TIME) AS $COL_TIMEH
        FROM $TABLE_NAME
        JOIN (
            SELECT d.$COL_PLACE AS p, strftime('$hour_format', d.$COL_TIME) AS t
            FROM $TABLE_NAME d
            WHERE $COL_PLACE = :place
            GROUP BY p, t
        ) di
        ON $COL_PLACE = di.p AND $COL_TIMEH = di.t
        WHERE $COL_PLACE = :place
        GROUP BY $COL_PLACE, $COL_TIMEH;
    ");
    $stmt->bindValue(':place', $place);

    $logs = [];
    $result = $stmt->execute();
    while($row = $result->fetchArray()) {
        $logs[] = [
            $COL_UV     => $row[$COL_UV],
            $COL_HUM    => $row[$COL_HUM],
            $COL_TEMP   => $row[$COL_TEMP],
            $COL_TIMEH   => $row[$COL_TIMEH],
        ];
    }

    echo json_encode($logs);
}
else {
    $places = [];
    $result = $db->query("SELECT DISTINCT $COL_PLACE FROM $TABLE_NAME;");
    while($row = $result->fetchArray()) {
        $places[] = $row[$COL_PLACE];
    }

    echo json_encode($places);
}

$db->close();
?>
