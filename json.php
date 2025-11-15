<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Json generate</title>
</head>
<body>

<?php
function getFolderData($folder, $baseUrl) {
    if (!is_dir($folder)) return [];

    $items = scandir($folder);
    $files = [];
    $dirs = [];

    $allowedExt = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $path = $folder . '/' . $item;

        if (is_dir($path)) {
            $dirs[] = $path;
        } elseif (is_file($path)) {
            $ext = strtolower(pathinfo($item, PATHINFO_EXTENSION));
            if (in_array($ext, $allowedExt)) {
                $url = $baseUrl . '/' . str_replace('\\', '/', $path);
                $files[] = $url;
            }
        }
    }

    $data = [];
    if (!empty($files)) {
        $data[] = [
            'title' => basename($folder),
            'files' => $files
        ];
    }

    foreach ($dirs as $dir) {
        $data = array_merge($data, getFolderData($dir, $baseUrl));
    }

    return $data;
}

$folder = 'photos';
$baseUrl = $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'];

if (isset($_GET['generate'])) {
    $data = getFolderData($folder, $baseUrl);
    file_put_contents('o-gallery.json', json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    echo "<p style='color:green;'>✅ The o-gallery.json file has been created/updated!</p>";
    echo '<p><a href="/">Check Page</a></p>';
}

//$data = getFolderData($folder, $baseUrl);
//foreach ($data as $section) {
//    echo '<h3>' . htmlspecialchars($section['title']) . '</h3>';
//    echo '<ol>';
//    foreach ($section['files'] as $fileUrl) {
//        echo '<li><a href="' . $fileUrl . '" target="_blank">' . basename($fileUrl) . '</a></li>';
//    }
//    echo '</ol>';
//}
?>

<hr>
<form method="get">
    <button type="submit" name="generate" value="1">Generuj JSON</button>
</form>

</body>
</html>
