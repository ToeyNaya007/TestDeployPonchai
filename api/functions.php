<?php 
    function adjustRequestPath($request) {
        $requestRe = array();
        $is_localhost = ($_SERVER['REMOTE_ADDR'] === '127.0.0.1' || $_SERVER['REMOTE_ADDR'] === '::1');
        $uri_parts = explode('/', $request);    
        if ($is_localhost) {
                                    $requestRe[1] = '/' . $uri_parts[3];
            if(!empty($uri_parts[4])){ $requestRe[2] = '/' . $uri_parts[4];}
            if(!empty($uri_parts[5])){ $requestRe[3] = '/' . $uri_parts[5];}
            if(!empty($uri_parts[6])){ $requestRe[4] = '/' . $uri_parts[6];}
            
        } else {
                                    $requestRe[1] = '/' . $uri_parts[2];
            if(!empty($uri_parts[3])){ $requestRe[2] = '/' . $uri_parts[3];}
            if(!empty($uri_parts[4])){ $requestRe[3] = '/' . $uri_parts[4];}
            if(!empty($uri_parts[5])){ $requestRe[4] = '/' . $uri_parts[5];}
        }
        return $requestRe;
    }

?>