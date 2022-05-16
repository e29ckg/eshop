var url_base = window.location.protocol + '//' + window.location.host + '/estock/'

var jwt = localStorage.getItem("jwt");
var user_data = localStorage.getItem("user_data");
if (jwt == null || user_data == null) {
  window.location.href = './login.html'
}  

Vue.createApp({
  data() {
    return {
      name:'ssss',
      user:'',
      url_img:'./node_modules/admin-lte/dist/img/user2-160x160.jpg',
    }
  },
  mounted(){
    this.get_fullname()
    // this.ck_protect()
    var jwt = localStorage.getItem("jwt")
    this.protected(jwt)
  },
  methods: {
    get_fullname() {
      this.user = JSON.parse(localStorage.getItem("user_data"));
      // this.user = localStorage.getItem("user_data");
    },

    ck_protect(){
      var t = 6 * 60 * 1000
      // var t = 3000
      setInterval(()=> {
        var jwt = localStorage.getItem("jwt");
        this.protected(jwt);
        console.log(t++)
      }, t);
    },

    protected(jwt) {
      axios.post(url_base + 'api/auth/protected.php',{},{ 
        headers: {
            "Access-Control-Allow-Origin" : "*",
            "Content-type": "Application/json",
            "Authorization" : 'Bearer '+ jwt 
          }})
            .then(response => {              
                // console.log(response.data);
                if (response.data.status == 'ok' ) {
                  user_data = JSON.stringify(response.data.user_data)
                }else{
                  localStorage.removeItem("jwt");
                  localStorage.removeItem("user_data");    
                  swal.fire({
                    icon: 'success',
                    title: 'ออกจากระบบ',
                    showConfirmButton: true,
                    timer: 1000
                  });
                  setTimeout(function() {
                    window.location.href = './login.html';
                  }, 1001); 
                }
            })
            .catch(function (error) {
                console.log(error);
                localStorage.removeItem("jwt");
                localStorage.removeItem("user_data"); 
                swal.fire({
                  icon: 'error',
                  title: 'ออกจากระบบ',
                  showConfirmButton: true,
                  timer: 1000
                });
                setTimeout(function() {
                  window.location.href = './login.html';
                }, 1001); 
            });


    },
    logout() {      
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't Logout!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes !'
      }).then((result) => {
        if (result.isConfirmed) {
          axios.post(url_base + 'api/auth/logout.php',{},{ 
            headers: {
                "Access-Control-Allow-Origin" : "*",
                "Content-type": "Application/json",
                // "Authorization": `Bearer ${jwt}`
                "Authorization" : 'Bearer '+ jwt 
              }})
                .then(response => {                            
                    if (response.data.status == 'success' ) {  
                      localStorage.removeItem("jwt");
                      localStorage.removeItem("user_data");    
                      swal.fire({
                        icon: 'error',
                        title: 'ออกจากระบบ',
                        showConfirmButton: true,
                        timer: 1000
                      });
                      setTimeout(function() {
                        window.location.href = './login';
                      }, 3000); 
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    localStorage.removeItem("jwt");
                    localStorage.removeItem("user_data"); 
                    window.location.href = './login';
                });

        }
      })    
    },
    test(){
      console.log('test')
    }
  }
}).mount('#app')

