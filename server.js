var express  = require('express');
var app      = express();
var morgan   = require ('morgan');
var request = require('request');
var pg = require('pg');
var secrets = require('./secrets.js')



var requestOptions = {
  url: '', //URL to hit
  method: 'GET', //Specify the method
  headers: {'user-agent': 'dzgoldman'},
  auth: {
  user: 'dzgoldman',
  password: secrets.password
  }
}

app.use(morgan('combined'));
app.use(  express.static(__dirname+'/public'));



app.get('/skillstest', function (req, res) {
  // res.send('hi')
  getSkills('jc2johnny@gmail.com')

})

app.get('/ratelimit', function (req, res) {

  requestOptions.url='https://api.github.com/rate_limit'
  request(requestOptions,function (err, resp, body) {
    res.send(body)
  })


})

app.get('/', function(req,res){
  res.sendFile(__dirname+'/public/index.html')
})

//TODO: configure sequalize
pg.connect('postgres://localhost/postgres', (err) => {
   if (err) {
      console.log(err);
   } else {
      console.log('connection successfull');
   }
});

app.listen(3000, function(){
  console.info('Listening on  port 3000...')
})






//TODO: make seperate module

function getSkills(email) {
    var LanguagesObject = {};


  // var repo;
  var repos_url;
  //get user info by email:
  requestOptions.url= 'https://api.github.com/search/users?q='+ email +'+in%3Aemail&type=Users';

  request(requestOptions, function (err, response, data) {
    if (err) {
      console.log(err);
    }
    var user = JSON.parse(data);

    repos_url = user.items[0].repos_url;

    //get urls to all of users repos:
    requestOptions.url= repos_url

    request(requestOptions, function (err, response, data) {
      if (err) {
        console.log(err);
      }
      var allLanguages = []
      //for each repo, push url to the repo's language object:
      var urls = JSON.parse(data);
      urls.forEach(function (repo) {
        // console.log(repo.languages_url);
        if (repo.languages_url) {
          allLanguages.push(repo.languages_url);
        }
      });

      //gather data for each language, reccursively
      var languageCount = allLanguages.length;
      function addLanguages(index) {
        requestOptions.url= allLanguages[index];
        request(requestOptions, function (err, response, data) {
          if (err) {
            console.log(err);
          }
          //make sure it is indeed a languageList object
          if (typeof languageList=='object') {
            languageList = JSON.parse(data);
            //track characters for each language
            for(var language in languageList){
              if (LanguagesObject[language]) {
                LanguagesObject[language]+= languageList[language];
                // console.log(LanguagesObject);
              }else{
                LanguagesObject[language]=languageList[language]
              }
            }
          };
          if (index==languageCount-1) {
            console.log('output:');
            console.log(LanguagesObject)
            // res.send(LanguagesObject)
            console.log('done');
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
