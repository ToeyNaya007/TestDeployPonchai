<?php
$channelAccessToken = "sgzHJqGEsVlrY6dj3tmzFX3rKKUbfUvuSMwFjvQ1MtkJRKaKQhX/DQVErBFSkFWql82qIF8sbzBnQZMvGt2BSj+vwU6kepPahPpvW6eh9TMQRu6PSjS0DEBY/NiZwFFajTI2L+If/VGJpWI22La+XQdB04t89/1O/w1cDnyilFU=";
$content = file_get_contents('php://input');
$events = json_decode($content, true);

if (!empty($events['events'])) {
    foreach ($events['events'] as $event) {
        
        if ($event['type'] === 'message' && $event['message']['type'] === 'text') {
            $userId = $event['source']['userId'];
            $replyToken = $event['replyToken'];
            $text = $event['message']['text'];
            //set basePath
            if($_SERVER['REMOTE_ADDR'] === '127.0.0.1' || $_SERVER['REMOTE_ADDR'] === '::1'){
                $basePath = 'https://localhost/3000/';
            }else{
                $basePath = 'https://ponchaishop.com/';
            }
            $type = $event['source']['type'];
            $chatroom = '';
            if ($type === 'group') {
                $groupId = $event['source']['groupId'];
                $userId = $event['source']['userId']; // ผู้ส่งในกลุ่ม
                $userIdConnect = $groupId; // ใช้ groupId เป็น userId สำหรับการเชื่อมต่อ
                $chatroom = $groupId; // ใช้ groupId เป็น chatroom
            } elseif ($type === 'room') {
                $roomId = $event['source']['roomId'];
                $userId = $event['source']['userId']; // ผู้ส่งในห้อง
                $userIdConnect = $roomId; // ใช้ groupId เป็น userId สำหรับการเชื่อมต่อ
                $chatroom = $roomId; // ใช้ roomId เป็น chatroom
            } else {
                $userId = $event['source']['userId']; // แชทเดี่ยว
                $userIdConnect = $userId; // ใช้ userId เป็น userId สำหรับการเชื่อมต่อ
                $chatroom = '1-1'; // ใช้ userId เป็น chatroom
            }
            //บันทึกข้อมูลที่มีการส่งมา
            if(!empty($text)) {                    
                    // insert database connection here
                    date_default_timezone_set('Asia/Bangkok');
                    putenv("TZ=Asia/Bangkok");
                    $db_host = 'localhost';
                    $db_user = 'ponchnxq_main';
                    $db_pass = 'ECf^kXA2aB5.';
                    $db_name  = 'ponchnxq_main';
                    // Create connection
                    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
                    mysqli_set_charset($conn, "utf8");
                    $conn->query("SET time_zone = '+07:00'");
                    // Check connection
                    if ($conn->connect_error) {
                        die("Connection failed: " . $conn->connect_error);
                    }
                    // insert INSERT INTO `tb_lineoa_main`
                    $stmt = $conn->prepare("INSERT INTO tb_lineoa_main (message, userId, chatroom, date) VALUES (?, ?, ?, NOW())");
                    $stmt->bind_param("sss", $text, $userId, $chatroom);
                    $stmt->execute();
                    $stmt->close();
                    $conn->close();
            }            
            if ($text === "เชื่อมต่อระบบแจ้งเตือน") { // ถ้าข้อความคือ "เชื่อมต่อระบบแจ้งเตือน"
                $message = [
                    'type' => 'flex',
                    'size' => 'giga',
                    'altText' => 'เชื่อมต่อระบบแจ้งเตือน',
                    'contents' => [
                        'type' => 'bubble',
                        'size' => 'giga',
                        'hero' => [
                            'type' => 'image',
                            'url' => 'https://lineoa.ponchaishop.com/coverconnectline.jpg',
                            'size' => 'full',
                            'aspectRatio' => '1.5:1',
                            'aspectMode' => 'cover',
                            'action' => [
                                'type' => 'uri',
                                'uri' => $basePath.'TurnOnNotify/' . $userIdConnect
                            ]
                        ]
                    ]
                ];
                $replyMessage = [
                    "replyToken" => $replyToken,
                    "messages" => [$message]
                ];
                $ch = curl_init("https://api.line.me/v2/bot/message/reply");
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_HTTPHEADER, [
                    "Content-Type: application/json",
                    "Authorization: Bearer " . $channelAccessToken
                ]);
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($replyMessage));
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_exec($ch);
                curl_close($ch); 
            }                    
        }

        if (
            isset($event['type'], $event['message']['type']) &&
            $event['type'] === 'message' &&
            $event['message']['type'] === 'image'
        ) {
            //curl ลิงก์ Webhook https://api.slipok.com/api/line/webhook/8512
            $lineSignature = $_SERVER['HTTP_X_LINE_SIGNATURE'] ?? '';
            $ch = curl_init("https://api.slipok.com/api/line/webhook/8512");
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                "Content-Type: application/json",
                "X-Line-Signature: $lineSignature"
            ]);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $content);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            if (curl_errno($ch)) {
                $error_msg = curl_error($ch);
                error_log("CURL ERROR: $error_msg");
                echo "CURL ERROR: $error_msg";
            } else {
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                $logMessage = "HTTP CODE: $httpCode\nSlipok RESPONSE: $response\n";
                file_put_contents('success_log.txt', $logMessage, FILE_APPEND);
                echo "HTTP CODE: $httpCode\n";
                echo "Slipok RESPONSE: $response";
            }
            curl_close($ch);    
        }
    }
}

?>
