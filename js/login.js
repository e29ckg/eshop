var url_base = window.location.protocol + '//' + window.location.host;

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", url_base + "/estock/api/auth/login.php");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
      "username": username,
      "password": password
    }));
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        const objects = JSON.parse(this.responseText);
        console.log(objects);
        if (objects['status'] == 'success') {
            swal.fire({
              icon: objects['status'],
              title: objects['message'],
              showConfirmButton: true,
              timer: 1000
            });
            localStorage.setItem("jwt", objects['jwt']);
            localStorage.setItem("user_data", objects['user_data']);
            console.log(objects['user_data']);
            setTimeout(function() {
              window.location.href = './index.html';
            }, 1001);
            
        } else {
          Swal.fire({
            text: objects['message'],
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    };
    return false;
}