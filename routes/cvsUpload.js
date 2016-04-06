  module.exports.controller =  function (app, User) {

    app.post('/upload2', function(req, res) {
          res.send(req.body)
          console.log('File size is ' + req.files.groupfile.size);
          console.log('File size is ' + req.files.groupfile.path);
          // var reader = csv.createCsvFileReader(req.files.groupfile.path, {
          //                                         'separator': ',',
          //                                         'quote': '"',
          //                                         'escape': '"',
          //                                         'comment': ''
          //                                      });
          // reader.addListener('data', function(data) {
          //         console.log(data);
          // });
    });

    app.post('/upload', function (req, res) {

      var usersArray = req.body.data;
      var len = usersArray.length;
      var index =0;

      function saveUser(usersArray, index) {

        var dbUser = User.build();
        var csvUser = usersArray[index];
        for(key in csvUser){
          console.log(key, csvUser[key]);
          if (csvUser[key]) {
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
