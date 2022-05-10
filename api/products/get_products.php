<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST,PUT");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
// header("'Access-Control-Allow-Credentials', 'true'");
// header('Content-Type: application/javascript');
header("Content-Type: application/json; charset=utf-8");

include "../dbconfig.php";

try{
    /*ดึงข้อมูลทั้งหมด*/
    $sql = "SELECT * FROM products ORDER BY pro_name ASC";
    // $sql = "SELECT products.pro_name, products.pro_id, products.instock, products.min, products.img, catalogs.cat_name, units.unit_name FROM products JOIN units ON products.unit_id = units.unit_id JOIN catalogs ON products.cat_id = catalogs.cat_id;";
    $query = $dbcon->prepare($sql);
    $query->execute();
    $result = $query->fetchAll(PDO::FETCH_OBJ);
    $data = array();

    foreach($result as $res){
        array_push($data,array(
            "pro_id" => $res->pro_id,
            "pro_name" => $res->pro_name,
            // "unit_id" => $res->unit_id,
            "unit_name" => $res->unit_name,
            // "cat_id" => $res->cat_id,
            "cat_name" => $res->cat_name,
            "min" => $res->min,
            "instock" => $res->instock,
            "img" => $res->img
        ));
    }
    http_response_code(200);
    echo json_encode(array(
        'status' => true, 
        'massege' =>  'Ok', 
        // 'massege' =>  $result, 
        'respJSON' => $data
    ));

}catch(PDOException $e){
    echo "Faild to connect to database" . $e->getMessage();
    http_response_code(400);
    echo json_encode(array('status' => false, 'massege' => 'เกิดข้อผิดพลาด..' . $e->getMessage()));
}


