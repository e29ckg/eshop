<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST,PUT");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
// header("'Access-Control-Allow-Credentials', 'true'");
// header('Content-Type: application/javascript');
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
    // $sql = "SELECT * FROM products ORDER BY created_at DESC";
    $sql = "SELECT * FROM `products` WHERE pro_name LIKE '%$data->q%'";
    $query = $dbcon->prepare($sql);
    $query->execute();
    $result = $query->fetchAll(PDO::FETCH_OBJ);
    $datas = array();

    // foreach($result as $res){
    //     array_push($datas,array(
    //         "cat_id" => $res->cat_id,
    //         "cat_name" => $res->cat_name
    //     ));
    // }
    http_response_code(200);
    echo json_encode(array(
        'status' => true, 
        'massege' =>  'Ok', 
        'respJSON' =>  $result, 
        'data' => $data->q
    ));

}catch(PDOException $e){
    echo "Faild to connect to database" . $e->getMessage();
    http_response_code(400);
    echo json_encode(array('status' => false, 'massege' => 'เกิดข้อผิดพลาด..' . $e->getMessage()));
}