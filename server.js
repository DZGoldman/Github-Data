var express  = require('express');
var app      = express();
var morgan   = require ('morgan');
var request = require('request');
var pg = require('pg');
var secrets = require('./secrets.js');
var Sequelize = require ('sequelize');
var cheerio = require ('cheerio')


var requestOptions = {
  url: '', //URL to hit
  method: 'GET', //Specify the method
  headers: {'user-agent': secrets.username},
  auth: {
  user: secrets.username,
  password: secrets.password
  }
}


pg.connect('postgres://localhost/githubdata-dev', (err) => {
   if (err) {
      console.log(err);
   } else {
      console.log('connection successfull');
   }
});
// var email = 'ckearns1210@gmail.com'
//ray@raymasaki.com

//TODO: configure sequelize
var sequelize


var sequelize = new Sequelize('postgres://localhost/githubdata-dev', {
  dialect: 'postgres'
});

// sequelize.authenticate().done(function(err) {
  //     if (err) {
  //       console.log('Unable to connect to the database:', err);
  //     } else {
  //       console.log('Connection has been established successfully.');
  //     }
  // });

//model
var Persontest = sequelize.define('persontest', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

var User = sequelize.define('user', {
  username: Sequelize.STRING,
  email: Sequelize.STRING,
  giturl: Sequelize.STRING,
  location: Sequelize.STRING,
  latitude: Sequelize.FLOAT,
  longitude:Sequelize.FLOAT,
  distance_from_lt: Sequelize.INTEGER,
  sent_boolean: Sequelize.BOOLEAN,
  skills: Sequelize.ARRAY(Sequelize.TEXT)

});




app.use(morgan('combined'));
app.use(  express.static(__dirname+'/public'));

app.get('/datatest', function (req, res) {

 // var user = User.build({username: 'testman'});
 // user.email = 'dzgoldman@wes';
 // user.save()
 //  .then(function () {
 //  console.log('you saved a guy!');
 // })

  // var person = Persontest.build({username: 'bob'});
  // person.birthday = Date.now()
  // person.save()
    // .error(function (err) {
    //   console.log(err);
    // })
    // .success(function () {
    //   console.log('yay');
    // })


    sequelize.sync().then(function() {
      return User.create({
        username: 'testDan',
        email: 'dannyg@gmai'
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

app.get('/sheet', function (req, res) {
  // retrieve JSON from google docs file (20000 at a time:)
  var url1 = 'https://spreadsheets.google.com/feeds/list/1-607M0KUFw3YlechaSVOUxCqX3Z44l5OPHQYqMr2mpw/od6/public/basic?alt=json'
  request(
    {url: url1,
     json: true
    },
     function (error, response, data) {
       if (error) {
         throw error
       }
        // get array of all users (all rows in google docs)
        var usersArray =  data.feed.entry;
        var len =usersArray.length;

        // len = 20;

        var failCounter = 0;


        // recursive: for each row, create new User, give appropriate attributes (need case statement b/c JSON.parse isn't working!) and then save into DB. Upon successful save, move on to next row.
        function saveUser(index) {
          var infoArray = usersArray[index].content['$t'].split(', ');

          var user = User.build()
          infoArray.forEach(function (dataPoint, index) {

          switch (dataPoint.slice(0,3)) {

            case 'ema':
              user.email = infoArray[index].slice(7, infoArray[index].length)
              break;
            case 'use':
              user.username = infoArray[index].slice(9, infoArray[index].length)
              break;
            case 'git':
              user.giturl = infoArray[index].slice(8, infoArray[index].length)
              break;
            // case 'loc':
            //   user.location = infoArray[index].slice(10, infoArray[index].length)
            //   break;
            case 'lat':
              user.latitude = infoArray[index].slice(10, infoArray[index].length)
              break;
            case 'lon':
              user.longitude = infoArray[index].slice(11, infoArray[index].length)
              break;
            case 'dist':
              user.distance_from_lt = infoArray[index].slice(16, infoArray[index].length)
              break;
            case 'sen':
              user.sent_boolean = infoArray[index].slice(13, infoArray[index].length)
              break;

            default:

          }
        }) // end info loop

        user.save()
          .then(function () {
          if (index<len-1) {

            return saveUser(index+1)
          };

          if (index==len-1) {
            res.send(failCounter)
          };

        }).catch(function(error) {
          console.log('');
          console.log('FFFailed!');
          console.log('');
          console.log(error);
          console.log('');

          failCounter++
          if (index<len-1) {
            return saveUser(index+1)
          };

          if (index==len-1) {
            res.send(failCounter)
          }

        })
    }//end save user
    console.log('letsgo');
    sequelize.sync().then(saveUser(0))


    console.log('');
    console.log('');
    console.log('');
    console.log('# of times you failed:', failCounter);
    console.log('');
    console.log('');
    console.log('');




  }); // end of request
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
