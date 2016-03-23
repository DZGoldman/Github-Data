var express  = require('express');
var app      = express();
var morgan   = require ('morgan');
var mongoose = require('mongoose');
var request = require('request');


app.use(morgan('combined'));
app.use(  express.static(__dirname+'/public'));



app.get('/test', function (req, res) {
  getSkills('jc2johnny@gmail.com')

})

app.get('/', function(req,res){
  res.sendFile(__dirname+'/public/index.html')
})

mongoose.connect('mongodb://localhost/groceries-app', (err) => {
   if (err) {
      console.log(err);
   } else {
      console.log('connection successfull');
   }
});

app.listen(3000, function(){
  console.info('Listening on  port 3000...')
})







function getSkills(email) {
var LanguagesObject = {};
var repo;
var repos_url;
//get user info by email:
request('https://api.github.com/search/users?q='+ email +'+in%3Aemail&type=Users', function (data) {
  user = data;
  console.log(user);
  repos_url = user.items[0].repos_url;

  //get urls to all of users repos
  request(repos_url, function (data) {
    var allLanguages = []
    data.forEach(function (repo) {
      if (repo.languages_url) {
        allLanguages.push(repo.languages_url);
      }
    });

    //gather data for each language, reccursively
    var languageCount = allLanguages.length;


    function addLanguages(index) {
      request(allLanguages[index], function (data) {

        languageList = data;
        if (typeof languageList=='object') {
        for(var language in languageList){
          // console.log(language);
          if (LanguagesObject[language]) {
            LanguagesObject[language]+= languageList[language];

          }else{
            LanguagesObject[language]=languageList[language]
          }
        }
      };
      if (index==languageCount-1) {
        console.log(LanguagesObject)
        res.send(LanguagesObjectnoder)

      }
      })

      if (index<languageCount) {
        addLanguages(index+1)
      }
    }

     addLanguages(0);



  }) // end get repos
}) // end get user

}
