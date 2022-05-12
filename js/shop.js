var url_base = window.location.protocol + '//' + window.location.host

Vue.createApp({
  data() {
    return {
      user:'',
      datas:'',
      q:'',
      catalogs:'',      
      carts:[],
      user:'',
      url_img:'./node_modules/admin-lte/dist/img/user2-160x160.jpg',
    }
  },
  mounted(){
    this.get_products()
    this.get_fullname()
    this.get_catalogs()
  },
  methods: {
    get_fullname() {
      this.user = JSON.parse(localStorage.getItem("user_data"));
      // this.user = localStorage.getItem("user_data");
    },
    get_products(){
      axios.post(url_base + '/estock/api/products/get_products.php')
          .then(response => {
              // console.log(response.data);
              if (response.data.status) {
                  this.datas = response.data.respJSON;
                  // console.log(this.datas);                   
              }
          })
          .catch(function (error) {
              console.log(error);
          });
    },
    get_catalogs(){
      axios.post(url_base + '/estock/api/catalogs/read_catalogs_all.php')
          .then(response => {
              // console.log(response.data);
              if (response.data.status) {
                  this.catalogs = response.data.respJSON;
                  // console.log(this.datas);                   
              }
          })
          .catch(function (error) {
              console.log(error);
          });
    },
    ch_search_pro(){
      console.log(this.q)
      if(this.q.length > 0){
        axios.post(url_base + '/estock/api/products/product_search.php',{q:this.q})
          .then(response => {
              if (response.data.status){
                this.datas = response.data.respJSON;                    
              }
          })
          .catch(function (error) {
              console.log(error);
          });
      }else{
        this.get_products()
      }
    },
    reset_search(){
      this.q = ''
    },
    search_pro_cat(cat_name){
      axios.post(url_base + '/estock/api/products/product_search_cat.php',{q:cat_name})
        .then(response => {
            if (response.data.status){
              this.datas = response.data.respJSON;                    
            }
        })
        .catch(function (error) {
            console.log(error);
        });
      this.$refs['cat_menu'].click();

    },  
    add_to_cart(pro_id,pro_name, img, unit_name,instock,min){
      if(min > instock){qua = instock}
      else if(min < 1){qua = 1}
      else{qua = min}
      this.carts.push({pro_id:pro_id, pro_name:pro_name, img:img, unit_name:unit_name, instock:instock, qua:qua, min:min})
      Swal.fire({
        title:  pro_name,
        text: "ใส่ในตะกร้าแล้ว",
        icon: 'success',
        timer: 1000,
      })
      this.$refs['cart_show'].click();
    },
    ck_qua_input(index){
      if(this.carts[index].qua < this.carts[index].min){ this.carts[index].qua = this.carts[index].min}
      if(this.carts[index].qua > this.carts[index].instock){ this.carts[index].qua = this.carts[index].instock}
    },
    click_qua_down(index,min){
      val = this.carts[index].min
      this.carts[index].qua = this.carts[index].qua - val
      this.ck_qua_input(index)
    },    
    click_qua_up(index){
      val = this.carts[index].min
      this.carts[index].qua = this.carts[index].qua + val
      this.ck_qua_input(index)
    },
    del_cart_list(index){
      this.carts.pop()
    },
    send_order(){
      if(this.carts[0].pro_id != '' && this.carts[0].qua != 0){
        var jwt = localStorage.getItem("jwt");
        axios.post(url_base + '/estock/api/orders/orders_by_user.php',{carts:this.carts, action:'insert'},{ headers: {"Authorization" : `Bearer ${jwt}`}})
            .then(response => {
                if (response.data.status == 'success') {
                  Swal.fire({
                    icon: response.data.status,
                    title: response.data.massege,
                    showConfirmButton: false,
                    timer: 1500
                  });
                  this.$refs['cart_modal_close'].click();
                    this.carts = []
                }else{
                  Swal.fire({
                    icon: response.data.status,
                    title: response.data.massege,
                    showConfirmButton: false,
                    timer: 1500
                  })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
      }else{
        Swal.fire({
                    icon: 'error',
                    title: 'กรุณาตรวจสอบการป้อนข้อมูล',
                    showConfirmButton: false,
                    timer: 1500
                  });
      }
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
          localStorage.removeItem("jwt");      
          localStorage.removeItem("user_data"); 
          window.location.href = './login.html';
        }
      })    
    },  
    click_cart(){
      console.log('click_cart_test')
    },
    test(){
      console.log('test')
    }
  }
}).mount('#shop')

