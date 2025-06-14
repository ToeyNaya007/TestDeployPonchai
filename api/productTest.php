<?php
$start_time = microtime(true);
require_once __DIR__ . '/../system-admin/config/config.php';
require_once __DIR__ . '/../system-admin/include/functions.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST,GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

$status = 401;
$error = array();
$data = array();
$results = array();
$results['product'] = array();
$imagePath = siteurl . '/images/product/';
$imageSize = "_1024x1024";
$datetime_now = date("Y-m-d H:i:s");

if ((($_SERVER['REQUEST_METHOD'] == 'POST')) || 1 == 1) {
    $status = 200;
    $sql = "SELECT ID, title, price, mainImage FROM tb_product LIMIT 30;";
    $stmt = $conn->prepare($sql);
    $stmt->execute(); 
    $result = $stmt->get_result();
    
    $products = array(); 
    
    while ($row = $result->fetch_assoc()) {
        $row['id'] = $row['ID'];
        unset($row['ID']);
        $row['name'] = $row['title'];
        unset($row['title']);
        $row['link'] = "/product-detail/";
        $row['status'] = "";
        $row['saleStatus'] = 0;
        $row['reviewCount'] = 50;
        $row['score'] = 4;
        $row['description'] = "";
        $row['allOfSizes'] = ["S","M","L","XL","2XL","3XL"];
        $row['size'] = ["S","M"];
        $imageWithoutExtension = pathinfo($row['mainImage'], PATHINFO_FILENAME);
        $imageExtension = pathinfo($row['mainImage'], PATHINFO_EXTENSION);
        $fullImageUrl = $imagePath . $imageWithoutExtension . $imageSize . '.' . $imageExtension;
        $row['image'] = $fullImageUrl;
        $row['detail'] = "รายละเอียดสินค้า";
        $products[] = $row; 
    }

    $query = '';
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $query = isset($_POST['query']) ? trim($_POST['query']) : '';
    } elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
        $query = isset($_GET['query']) ? trim($_GET['query']) : '';
    }

    // Decode URL-encoded query
    $query = urldecode($query);

    if (!empty($query)) {
        // กรองข้อมูลสินค้าจากอาเรย์ $products
        $filteredProducts = array_filter($products, function($prod) use ($query) {
            return mb_stripos($prod['name'], $query, 0, 'UTF-8') !== false;
        });
        $results['product'] = array_values($filteredProducts);
    } else {
        $results['product'] = $products;  // ใช้อาเรย์ $products แทน $product
    }
}

$end_time = microtime(true);
$execution_time = number_format(($end_time - $start_time), 8, '.', '');
$arrayData = array(
    'status' => $status,
    'error' => $error,
    'execution_time' => $execution_time . ' seconds',
    'client_ip' => $_SERVER['REMOTE_ADDR'],
    'server_time' => 'Asia/Bangkok',
    'data' => $data,
    'results' => $results,
);

echo json_encode($arrayData, JSON_UNESCAPED_UNICODE);


?>