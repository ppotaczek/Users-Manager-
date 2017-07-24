var vueApp = new Vue({
  el: '#vueApp',
  components: {
    "ch-up": {
      template: "<span class='glyphicon glyphicon-chevron-up'></span>"
    },
    "ch-down": {
      template: "<span class='glyphicon glyphicon-chevron-down'></span>"
    }
  },
  data: {
    users: [],
    newU : {},
    validate: true,
    headlines: ["Id", "Name", "Username", "Email", "City", "Website", "Company"],
    sorted: {
      by: "Id",
      rev: false
    },
    search: ""
  },
  computed: {
    orderedUsers: function () {
      var orderedU = _.orderBy(this.users, (this.sorted.by).toLowerCase());
      var _search = this.search;
      if (this.sorted.rev){
        orderedU.reverse();
      }
      return _.filter(orderedU, function(o) {
        var uTab = _.map(o);
        for (var i = 1; i < 7; i++){
          if (uTab[i].toLowerCase().indexOf(_search.toLowerCase()) >= 0){
            return o;
          }
        }
      });
    }
  },
  methods: {
    edit: function(user) {
      var index = this.users.indexOf(user);
      Vue.set(this.users[index], 'editing', true);
    },
    save: function(user) {
      var index = this.users.indexOf(user);
      this.users[index].editing = false;
      this.send();
    },
    add: function(){
      var nName = this.newU.name;
      var nUname = this.newU.username;
      var nEmail = this.newU.email;
      var nCity = this.newU.city;
      var nWeb = this.newU.website;
      var nComp = this.newU.company;
      var nPhone = this.newU.phone;
      var c1 = (/\S+@\S+\.\S+/).test(nEmail);
      var c2 = (/\D/).test(nPhone);
      var c3 = (/\S+\.\S+/).test(nWeb);

      if (nName && nUname && nEmail && nCity && nWeb && nComp && nPhone && c1 && !c2 && c3){
        var id = this.users.length + 1;
        for (var i = 0; i < this.users.length; i++){
          if (i+1 != this.users[i].id){
            id = i+1;
            i = this.users.lenght;
          }
        }
        this.users.push({
          id: id,
          name: nName,
          username: nUname,
          email: nEmail,
          city: nCity,
          website: nWeb,
          company: nComp,
          phone: nPhone
        });
        this.validate = true;
        this.newU = {};
        this.send();
      } else {
        this.validate = false;
      }
    },
    send: function(){
      this.$http.post('/users', this.users).then(function(response){
        console.log(response.body)
      }, function(response) {
        console.log("errors!")
      });
    },
    remove: function(user){
      var index = this.users.indexOf(user);
      this.users.splice(index, 1);
      this.send();
    },
    sort: function(by){
      if (this.sorted.by === by){
        if (!this.sorted.rev){
          this.sorted.rev = true;
        }
        else {
          this.sorted.rev = false;
        }
      }
      this.sorted.by = by;
    }
  },
  created: function(){
    this.$http.get('/users').then(function(response) {
      var data = JSON.parse(response.body);
      this.users = data;
    }, function(response) {
      console.log("errors!")
    });
  }
})
