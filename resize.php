<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// ============================================================================
// 1. REKURENCYJNE SKANOWANIE KATALOGÓW
// ============================================================================
function getFolderData($folder) {
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
                $files[] = [
                    'path' => $path,  // lokalna ścieżka pliku źródłowego
                    'name' => $item   // np. image-123.jpg
                ];
            }
        }
    }

    $data = [];

    if (!empty($files)) {
        $data[] = [
            'folder' => $folder, // np. photos/1942-1963
            'files'  => $files
        ];
    }

    // rekurencja
    foreach ($dirs as $dir) {
        $data = array_merge($data, getFolderData($dir));
    }

    return $data;
}



// ============================================================================
// 2. FUNKCJA SKALUJĄCA (object-fit: cover)
// ============================================================================
function resize_cover($src, $dest, $targetWidth = 300, $targetHeight = 300) {
    $info = getimagesize($src);
    if (!$info) return false;

    $mime = $info['mime'];

    switch ($mime) {
        case 'image/jpeg':
            $img = imagecreatefromjpeg($src);
            break;
        case 'image/png':
            $img = imagecreatefrompng($src);
            break;
        case 'image/webp':
            $img = imagecreatefromwebp($src);
            break;
        case 'image/gif':
            $img = imagecreatefromgif($src);
            break;
        default:
            return false;
    }

    $width = imagesx($img);
    $height = imagesy($img);

    // oblicz proporcje
    $srcRatio = $width / $height;
    $targetRatio = $targetWidth / $targetHeight;

    if ($srcRatio > $targetRatio) {
        $newHeight = $targetHeight;
        $newWidth = intval($targetHeight * $srcRatio);
    } else {
        $newWidth = $targetWidth;
        $newHeight = intval($targetWidth / $srcRatio);
    }

    $tmp = imagecreatetruecolor($newWidth, $newHeight);

    if ($mime !== 'image/jpeg') {
        imagealphablending($tmp, false);
        imagesavealpha($tmp, true);
    }

    imagecopyresampled($tmp, $img, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

    $output = imagecreatetruecolor($targetWidth, $targetHeight);

    if ($mime !== 'image/jpeg') {
        imagealphablending($output, false);
        imagesavealpha($output, true);
    }

    $x = intval(($newWidth - $targetWidth) / 2);
    $y = intval(($newHeight - $targetHeight) / 2);

    imagecopy($output, $tmp, 0, 0, $x, $y, $targetWidth, $targetHeight);

    // zapis
    switch ($mime) {
        case 'image/jpeg': imagejpeg($output, $dest, 90); break;
        case 'image/png':  imagepng($output, $dest, 6); break;
        case 'image/webp': imagewebp($output, $dest, 90); break;
        case 'image/gif':  imagegif($output, $dest); break;
    }

    imagedestroy($img);
    imagedestroy($tmp);
    imagedestroy($output);

    return true;
}



// ============================================================================
// 3. GENEROWANIE MINIATUR W IDENTYCZNYCH PODFOLDERACH
// ============================================================================
$sourceRoot = 'photos';
$targetRoot = 'photos-small';

// pobierz wszystkie foldery i pliki
$data = getFolderData($sourceRoot);
var_dump($data);

foreach ($data as $section) {

    // przykład:
    // $section['folder'] = photos/1942-1963
    // więc w docelowym miejscu musi powstać: photos-small/1942-1963

    $subfolder = str_replace($sourceRoot, '', $section['folder']); // /1942-1963
    $targetDir = $targetRoot . $subfolder;

    // utwórz katalog docelowy (rekurencyjnie)
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    foreach ($section['files'] as $file) {

        $srcPath  = $file['path'];      // photos/1942-1963/image-x.jpg
        $destPath = $targetDir . '/' . $file['name']; // photos-small/1942-1963/image-x.jpg

        resize_cover($srcPath, $destPath);
    }
}

echo "Gotowe";
