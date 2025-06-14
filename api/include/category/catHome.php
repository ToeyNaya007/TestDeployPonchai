<?php
$sort = $_POST['sort'] ?? 'lastSold';
//lastSold = ขายไปล่าสุด
//nameDESC = เรียงตาม name มากไปน้อย
//nameASC = เรียงตาม name น้อยไปมาก
$results['category'] = array();
$results['showBranner'] = array();
if ((($_SERVER['REQUEST_METHOD'] == 'POST')) || 1 == 1) {
    $status = 200;
    //สร้าง subcategories แต่ละ 
    $dataSubCatMain = array();
    $dataSubCat = array();

    $dataSubCatProduct = array();
    $sql = "WITH RankedProducts AS ( SELECT mainImage, p.title, p.slug AS pSlug, p.ID AS pID, c.name AS category_name, c.ID AS categoryID, 
        ROW_NUMBER() OVER (PARTITION BY c.ID ORDER BY p.ID) AS row_num FROM tb_product p JOIN tb_categories_relationship cr ON p.ID = cr.pID JOIN tb_product_categories c ON cr.pcID = c.ID ) 
        SELECT title, category_name, categoryID, pSlug, pID, mainImage FROM RankedProducts WHERE row_num <= 15;";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $dataSubCatProduct[$row['categoryID']][] = array(
                'title' => $row['title'],
                'slug' => $sOptions['home'] . 'p/' . $row['pSlug'] . '/' . $row['pID'],
                'pImage' => $sOptions['siteurl'] . 'images/product/' . $row['mainImage'],
            );
        }
        //print_r($dataSubCatProduct);
    }
    $sql = "SELECT `ID`, `date`, `name`, `slug`, `description`, `adminID`, `parentID`, img FROM `tb_product_categories` WHERE name<>'ไม่มีหมวดหมู่' ";
    if ($sort) {
        $sql .= " ORDER BY ";
        switch ($sort) {
            case 'lastSold':
                $sql .= " name ASC ";
                break; //กลับมาแก้ไขตอนระบบเสร็จ
            case 'nameDESC':
                $sql .= " name DESC ";
                break;
            case 'nameASC':
                $sql .= " name ASC ";
                break;
            default:
                $sql .= " name ASC ";
                break;
        }
    }
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $subcategories = array();
            if (!empty($dataSubCatProduct[$row['ID']])) {
                $subcategories = $dataSubCatProduct[$row['ID']];
            }
            if (!$row['img']) {
                $row['img'] = $sOptions['basePathAdmin'] . 'assets/images/category/default.svg';
            } else {
                $row['img'] = $sOptions['basePathAdmin'] . 'assets/images/category/' . $row['img'];
            }
            if (!empty($subcategories)) {
                $category = array(
                    'id' => $row['ID'] * 1,
                    'parentID' => $row['parentID'],
                    'name' => $row['name'],
                    'slug' => $sOptions['home'] . 'c/' . $row['slug'],
                    'date' => $row['date'],
                    'description' => $row['description'],
                    'images' => $row['img'],
                    "subcategories" => $subcategories
                );
                array_push($results['category'], $category);
            }
        }
    }

    $sql = "SELECT optionValue FROM tb_options WHERE optionName = 'showBranner'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $showBranner = (int)$row['optionValue'];
            array_push($results['showBranner'], $showBranner);
        }
    }
    
}
?>