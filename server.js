var express  = require('express');
var app      = express();
var morgan   = require ('morgan');
var request = require('request');
var pg = require('pg');
var secrets = require('./secrets.js');
var Sequelize = require ('sequelize')


var requestOptions = {
  url: '', //URL to hit
  method: 'GET', //Specify the method
  headers: {'user-agent': secrets.username},
  auth: {
  user: secrets.username,
  password: secrets.password
  }
}
// var email = 'ckearns1210@gmail.com'
//ray@raymasaki.com

//TODO: configure sequelize
var sequelize


var sequelize = new Sequelize('postgres://localhost/github-data', {
  dialect: 'postgres'
});

// sequelize.authenticate().done(function(err) {
  //     if (err) {
  //       console.log('Unable to connect to the database:', err);
  //     } else {
  //       console.log('Connection has been established successfully.');
  //     }
  // });
var Person = sequelize.define('user', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});




app.use(morgan('combined'));
app.use(  express.static(__dirname+'/public'));

app.get('/datatest', function (req, res) {


  sequelize.sync().then(function() {
  return Person.create({
    username: 'janedoe',
    birthday: new Date(1980, 6, 20)
  })
  })
})

app.get('/ratelimit', function (req, res) {

  requestOptions.url='https://api.github.com/rate_limit'
  request(requestOptions,function (err, resp, body) {
//     var unixTime =body.resources.rate.reset;
//
//     time = new Date(unixTime * 1000),datevalues =
//
//    String(date.getHours() )+':'+
//    String(date.getMinutes())+':'+
//    String(date.getSeconds())
// ;
//     output = body;
//     output.humantime = time;
    res.send(body)
  })


})

app.get('/public', function(req,res){
    res.sendFile(__dirname+'/public/index.html')
})

app.get('/', function(req,res){
  res.send('landing page')
})



app.listen(3000, function(){
  console.info('Listening on  port 3000...')
})


app.get('/getSkillsByEmail/:email', function (req, res) {

  var email = req.params.email

  var LanguagesObject = {};

  // var repo;
  var repos_url;
  //get user info by email:
  requestOptions.url= 'https://api.github.com/search/users?q='+ email +'+in%3Aemail&type=Users';

  request(requestOptions, function (err, response, data) {
    if (err) {
      throw err;
    };

    //handle error of nothing found?
    // if (!data.items) {
    //
    //   res.send(false)
    //   return false
    // }
    var user = JSON.parse(data);

    repos_url = user.items[0].repos_url;

    //get urls to all of users repos:
    requestOptions.url= repos_url

    request(requestOptions, function (err, response, data) {
      if (err) {
        throw err;
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
            throw err
          };

          var languageList = data

          // check to make sure it is a JSON string, not undefined
          if (typeof languageList=='string') {
            languageList = JSON.parse(languageList);

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
          if (index<languageCount-1) {
            addLanguages(index+1)
          };
          if (index==languageCount-1) {
            res.send(LanguagesObject)
          }
        })

      } // end addLanguages

       addLanguages(0);



    }) // end get repos
  }) // end get user

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
            res.send(LanguagesObject)
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
