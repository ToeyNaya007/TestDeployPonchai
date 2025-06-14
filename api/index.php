<?php 
    $start_time = microtime(true); 
    require_once __DIR__ . '/../system-admin/config/config.php';
    require_once('functions.php');
    $request = $_SERVER['REQUEST_URI'];
    $request = adjustRequestPath($request);

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json; charset=UTF-8");
    $status = 401;
    $error = array();
    $data = array();
    $results = array();
    $datetime_now = date("Y-m-d H:i:s");
    //print_r($request);
    switch ($request[1]) {
        case '/options':
            require_once('include/options/index.php');
        break;
        case '/categoryHome':
            require_once('include/category/catHome.php');
        break;
        case '/product':          
            if(!empty($request[2])){
                switch ($request[2]) {
                    case '/catGet':
                        require_once('include/product/catGet.php');
                    break;
                    case '/search':
                    
                    break;
                    case '/stock':
                        
                    break;
                    default:
                        $error = array("error" => "error_not_found");
                    break;
                }
            }else{
                $error = array("error" => "error_not_found");
            }
        break;
        default:
            $error = array("error" => "error_not_found");
        break;
    }
    $end_time = microtime(true);
    $execution_time=number_format(($end_time-$start_time),8,'.','');
    $arrayData = array(
        'status' => $status,
        'error' => $error,
        'execution_time' => $execution_time.' seconds',
        'client_ip' => $_SERVER['REMOTE_ADDR'],
        'server_time' => 'Asia/Bangkok',
        'data' => $data,
        'results' => $results,
    );
    echo json_encode($arrayData);
?>