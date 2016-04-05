  module.exports.controller =  function (app, User) {

    app.post('/upload', function (req, res) {

      var usersArray = req.body.data;
      var len = usersArray.length;
      var index =0;

      function saveUser(usersArray, index) {
        var user = usersArray[index];
        for(key in user){
          console.log(key, user[key]);
          if (user[key]) {
            console.log('he has a ', key);
          }else{
            console.log('got no', key);
          }


        }
      }
      saveUser(usersArray, 50)

      //outline steps:

      //recurseive iteration:

      // promise:create user:

      // iterate, give appropriate parametsr

      // get skills

      // save

      // next


      // res.send(req.body.data)

    })
  }
