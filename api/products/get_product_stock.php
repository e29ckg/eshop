<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST,PUT");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=utf-8");

include "../dbconfig.php";

$data = json_decode(file_get_contents("php://input"));
// $product = $data;

// http_response_code(200);
//     echo json_encode(array(
//         'status' => true, 
//         'massege' =>  'Ok', 
//         'respJSON' => $data->pro_id
//     ));
//     exit;
try{
    /*ดึงข้อมูลทั้งหมด*/
    $sql = "SELECT * FROM `stock` LEFT JOIN products ON products.pro_id = stock.pro_id  WHERE stock.pro_id = $data->pro_id ORDER BY stock.created_at ASC LIMIT 0,100;";
    $query = $dbcon->prepare($sql);
    $query->execute();
    $result = $query->fetchAll(PDO::FETCH_OBJ);
    $datas = array();

    http_response_code(200);
    echo json_encode(array(
        'status' => 'success', 
        'massege' =>  'Ok', 
        'respJSON' =>  $result, 
        // 'respJSON' => $datas
    ));

}catch(PDOException $e){
    echo "Faild to connect to database" . $e->getMessage();
    http_response_code(400);
    echo json_encode(array('status' => false, 'massege' => 'เกิดข้อผิดพลาด..' . $e->getMessage()));
}