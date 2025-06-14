<?php 
    $results['options'] = array();
    if( (($_SERVER['REQUEST_METHOD'] == 'POST')) || 1==1 ){
        $sql = "SELECT * FROM `tb_options`;";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $status = 200;
            while ($row = $result->fetch_assoc()){
                $options = array(
                    'opName' => $row['optionName'],
                    'opValue' => $row['optionValue'],
                );
                array_push($results['options'], $options);
            }
        }
    }
   
?>