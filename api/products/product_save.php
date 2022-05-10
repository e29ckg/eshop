<?php
include_once "../dbconfig.php";
require "../auth/vendor/autoload.php";
use \Firebase\JWT\JWT;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

date_default_timezone_set("Asia/Bangkok");

$jwt = null;

$data = json_decode(file_get_contents("php://input"));
$product = $data->product[0];

$authHeader = $_SERVER['HTTP_AUTHORIZATION'];

$arr = explode(" ", $authHeader);
          
try{
    $jwt = $arr[1];
    $decoded = JWT::decode($jwt, base64_decode(strtr($key, '-_', '+/')), ['HS256']); 
    $data = $decoded->data;

    if($product->action == 'insert'){
        $sql = "SELECT pro_name FROM `products` WHERE pro_name = :pro_name";
        $query = $dbcon->prepare($sql);
        $query->bindParam(':pro_name',$product->pro_name, PDO::PARAM_STR);
        $query->execute();
        if($query->rowCount() > 0){
            // echo "เพิ่มข้อมูลเรียบร้อย ok";
            http_response_code(200);
            echo json_encode(array('status' => false, 'massege' => 'ชื่อสินค้านี้มีในระบบแล้ว', 'responseJSON' => $query->fetchAll(PDO::FETCH_OBJ)));
            exit;
        }

        $sql = "INSERT INTO products(pro_name, pro_detail, cat_name, unit_name, locat, lower, min, st, own) 
                              VALUE(:pro_name, :pro_detail, :cat_name, :unit_name, :locat, :lower, :min, :st, :own);";        
        $query = $dbcon->prepare($sql);
        $query->bindParam(':pro_name',$product->pro_name, PDO::PARAM_STR);
        $query->bindParam(':pro_detail',$product->pro_detail, PDO::PARAM_STR);
        $query->bindParam(':cat_name',$product->cat_name, PDO::PARAM_STR);
        $query->bindParam(':unit_name',$product->unit_name, PDO::PARAM_STR);
        $query->bindParam(':locat',$product->locat, PDO::PARAM_STR);
        $query->bindParam(':lower',$product->lower, PDO::PARAM_INT);
        $query->bindParam(':min',$product->min, PDO::PARAM_INT);
        $query->bindParam(':st',$product->st, PDO::PARAM_INT);
        $query->bindParam(':own',$data->fullname, PDO::PARAM_STR);
        $query->execute();
        if($query->rowCount() > 0){
            // echo "เพิ่มข้อมูลเรียบร้อย ok";
            http_response_code(200);
            echo json_encode(array('status' => true, 'massege' => 'เพิ่มข้อมูลเรียบร้อย ok', 'responseJSON' => $data));
        }else{
            // echo "มีบางอย่างผิดพลาด";
            http_response_code(200);
            echo json_encode(array('status' => false, 'massege' => 'มีบางอย่างผิดพลาด', 'responseJSON' => $data));
        }
        exit;
    }
    if($product->action == 'update'){
        $sql = "UPDATE products SET pro_name =:pro_name, pro_detail =:pro_detail, cat_name =:cat_name, unit_name =:unit_name, locat =:locat, lower =:lower,
        min=:min, st =:st, own =:own WHERE pro_id = :pro_id ";        
        $query = $dbcon->prepare($sql);
        $query->bindParam(':pro_name',$product->pro_name, PDO::PARAM_STR);
        $query->bindParam(':pro_detail',$product->pro_detail, PDO::PARAM_STR);
        $query->bindParam(':cat_name',$product->cat_name, PDO::PARAM_STR);
        $query->bindParam(':unit_name',$product->unit_name, PDO::PARAM_STR);
        $query->bindParam(':locat',$product->locat, PDO::PARAM_STR);
        $query->bindParam(':lower',$product->lower, PDO::PARAM_INT);
        $query->bindParam(':min',$product->min, PDO::PARAM_INT);
        $query->bindParam(':st',$product->st, PDO::PARAM_INT);
        $query->bindParam(':own',$data->fullname, PDO::PARAM_STR);
        $query->bindParam(':pro_id',$product->pro_id, PDO::PARAM_INT);
        $query->execute();
        if($query->rowCount() > 0){
            // echo "เพิ่มข้อมูลเรียบร้อย ok";
            http_response_code(200);
            echo json_encode(array('status' => true, 'massege' => 'บันทึกข้อมูลเรียบร้อย ok', 'responseJSON' => $product));
        }else{
            // echo "มีบางอย่างผิดพลาด";
            http_response_code(200);
            echo json_encode(array('status' => false, 'massege' => 'ไม่มีการปรับปรุง', 'responseJSON' => $product));
        }
        exit;
    }
    if($product->action == 'delete'){
        $upload_path = '../../uploads/'; // set upload folder path 
        
        $sql = "SELECT img FROM products WHERE pro_id=$product->pro_id";
        $query = $dbcon->prepare($sql);
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_OBJ);
        if($result){
            $pro_img = $result[0]->img;
            if($pro_img != '' && file_exists($upload_path .  $pro_img)){
                unlink($upload_path . $pro_img);
            }
        }
    
        $sql = "DELETE FROM products WHERE pro_id = $product->pro_id";
        $dbcon->exec($sql);
        http_response_code(200);
        echo json_encode(array('status' => true, 'massege' => 'Record deleted successfully'));  
        exit;
    }    

}catch(PDOException $e){
    echo "Faild to connect to database" . $e->getMessage();
    http_response_code(400);
    echo json_encode(array('status' => false, 'massege' => 'เกิดข้อผิดพลาด..' . $e->getMessage()));
}


