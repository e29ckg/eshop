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
      Ord:'',
      Ord_lists:'',
      product_detail:'',
      c_order0:''
    }
  },
  mounted(){
    this.get_products()
    this.get_fullname()
    this.get_catalogs()
    this.count_order0()
  },
  methods: {
    count_order0(){
      axios.post(url_base + '/estock/api/orders/orders_shop_by_user0.php',{user_own:this.user.fullname})
        .then(response => {
            if(response.data.status) { 
              this.c_order0 = response.data.respJSON;
            }else {
              this.c_order0 = 0;
            }
        })
    },
    get_fullname() {
      this.user = JSON.parse(localStorage.getItem("user_data"));
      // this.user = localStorage.getItem("user_data");
    },
    get_products(){
      axios.post(url_base + '/estock/api/products/get_products_shop.php')
          .then(response => {
              if (response.data.status) {
                  this.datas = response.data.respJSON;          
              }
          })
          .catch(function (error) {
              console.log(error);
          });
    },
    get_product(index){
      this.product_detail = this.datas[index]
      this.product_detail.qua = 1
      if(this.product_detail.qua < this.product_detail.min){ this.product_detail.qua = Number(this.product_detail.min)}
      if(this.product_detail.qua > this.product_detail.instock){ this.product_detail.qua = Number(this.product_detail.instock)}
    },
    ck_qua_input_detail(){
      if(Number(this.product_detail.qua) < Number(this.product_detail.min)){ this.product_detail.qua = Number(this.product_detail.min)}
      if(Number(this.product_detail.qua) > Number(this.product_detail.instock)){ this.product_detail.qua = Number(this.product_detail.instock)}
    },
    click_qua_down_detail(){
      val = this.product_detail.min
      this.product_detail.qua = Number(this.product_detail.qua) - Number(val)
      this.ck_qua_input_detail()
    },    
    click_qua_up_detail(){
      val = Number(this.product_detail.min)
      this.product_detail.qua = Number(this.product_detail.qua) + val
      this.ck_qua_input_detail()
    },
    add_to_cart_detail(pro_id, pro_name, img, unit_name, instock, qua, min){
      this.carts.push({pro_id:pro_id, pro_name:pro_name, img:img, unit_name:unit_name, instock:instock, qua:qua, min:min})
      Swal.fire({
        title:  pro_name,
        text: "ใส่ในตะกร้าแล้ว",
        icon: 'success',
        timer: 1000,
      })
      this.$refs['cart_show'].click();
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
      if(Number(min) > Number(instock)){qua = instock}
      else if(Number(min) < 1){qua = 1}
      else{qua = Number(min)}
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
      if(Number(this.carts[index].qua) < Number(this.carts[index].min)){ this.carts[index].qua = Number(this.carts[index].min)}
      if(Number(this.carts[index].qua) > Number(this.carts[index].instock)){ this.carts[index].qua = Number(this.carts[index].instock)}
    },
    click_qua_down(index,min){
      val = Number(this.carts[index].min)
      this.carts[index].qua = Number(this.carts[index].qua) - val
      this.ck_qua_input(index)
    },    
    click_qua_up(index){
      val = Number(this.carts[index].min)
      this.carts[index].qua = Number(this.carts[index].qua) + val
      this.ck_qua_input(index)
    },
    del_cart_list(index){
      this.carts.pop()
    },
    send_order(){
      if(this.carts[0].pro_id != '' && this.carts[0].qua != 0){
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
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
                      this.count_order0()
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
        });
      }
    },
    view_record(){
      var jwt = localStorage.getItem("jwt");
      axios.post(url_base + '/estock/api/orders/get_orders_by_user.php',{},{ headers: {"Authorization" : `Bearer ${jwt}`}})
      .then(response => {
          if (response.data.status == 'success') {
            // Swal.fire({
            //   icon: response.data.status,
            //   title: response.data.massege,
            //   showConfirmButton: false,
            //   timer: 1000
            // });
            this.Ord = response.data.respJSON;
          }else{
            Swal.fire({
              icon: response.data.status,
              title: response.data.massege,
              showConfirmButton: false,
              timer: 1000
            })
          }
      })
      .catch(function (error) {
          console.log(error);
      });
    },
    view_record_list(ord_id){
      var jwt = localStorage.getItem("jwt");
      axios.post(url_base + '/estock/api/orders/get_orderlists_by_user.php',{ord_id:ord_id},{ headers: {"Authorization" : `Bearer ${jwt}`}})
      .then(response => {
          if (response.data.status == 'success') {
            // Swal.fire({
            //   icon: response.data.status,
            //   title: response.data.massege,
            //   showConfirmButton: false,
            //   timer: 1000
            // });
            this.Ord_lists = response.data.respJSON;
          }else{
            Swal.fire({
              icon: response.data.status,
              title: response.data.massege,
              showConfirmButton: false,
              timer: 1000
            })
          }
      })
      .catch(function (error) {
          console.log(error);
      });
    },
    destroy_Order(ord_id){
      Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            var jwt = localStorage.getItem("jwt");
            this.Ord[0].action = 'delete';  
            this.Ord[0].ord_id = ord_id;  
            axios.post(url_base + '/estock/api/orders/orders_action.php',{Ord:this.Ord},{ headers: {"Authorization" : `Bearer ${jwt}`}})
              .then(response => {
                  if (response.data.status == 'success') {
                    Swal.fire({
                      icon: response.data.status,
                      title: response.data.massege,
                      showConfirmButton: false,
                      timer: 1500
                    })
                    this.view_record();  
                    this.count_order0()                   
                    this.$refs['ord_lists_close'].click();
                       
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
              
          }
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
          var jwt = localStorage.getItem("jwt");
          axios.post(url_base + '/estock/api/auth/logout.php',{},{ headers: {"Authorization" : `Bearer ${jwt}`}})
            .then(response => {
                if (response.data.status == 'success') {
                  Swal.fire({
                    icon: response.data.status,
                    title: response.data.massege,
                    showConfirmButton: false,
                    timer: 1000
                  })
                  localStorage.removeItem("jwt");      
                  localStorage.removeItem("user_data");
                  setTimeout(function() {
                    window.location.href = './login.html';
                  }, 1001);                     
                     
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
          
        }
      })    
    },
    formatCurrency(number) {
      number = parseFloat(number);
      return number.toFixed(2).replace(/./g, function(c, i, a) {
          return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
      });
    },
    formatCurrency0(number) {
      number = parseFloat(number);
      return number.toFixed(0).replace(/./g, function(c, i, a) {
          return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
      });
    },
    test(){
      console.log('test')
    }
  }
}).mount('#shop')

