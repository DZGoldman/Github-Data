var express  = require('express');
var app      = express();
var morgan   = require ('morgan');
var request = require('request');
var pg = require('pg');
var secrets = require('./secrets.js');
var Sequelize = require ('sequelize');


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


var sequelize = new Sequelize('postgres://localhost/githubdata-dev', {
  dialect: 'postgres'
});

var User = sequelize.define('user', {
  username: Sequelize.STRING,
  email: {
          type:Sequelize.STRING,
          validate:{
          isEmail: true
          }
        },
  giturl: {
          type:Sequelize.STRING,
          validate:{
          isUrl: true
          }
        },
  location: Sequelize.STRING,
  latitude: Sequelize.FLOAT,
  longitude:Sequelize.FLOAT,
  distance_from_lt: Sequelize.INTEGER,
  sent_boolean: {
                type:Sequelize.BOOLEAN,
                defaultValue: false},
  skills: Sequelize.ARRAY(Sequelize.TEXT),
  skills_found:{
                type:Sequelize.BOOLEAN,
                defaultValue: false}

});




app.use(morgan('combined'));
app.use(  express.static(__dirname+'/public'));


//GET RATE LIMIT
function rateLimit(req, res) {
  User.count().then(function (c) {
      console.log(c);
    })
    requestOptions.url='https://api.github.com/rate_limit'
    request(requestOptions,function (err, resp, body) {
      res.send(body)
    })
  }
app.get('/ratelimit', rateLimit)




// GET GOOGLE SHEET
var reqCount = 0;
app.get('/sheet/:count', function (req, res) {
  if (reqCount==0) {
    reqCount++
    console.log('START');
  sequelize.sync().then(function () {
    console.log('tables synced up');
  })
  var count = +req.params.count
  console.log(count);
  // retrieve JSON from google docs file (20000 at a time:)
  var url1 = 'https://spreadsheets.google.com/feeds/list/1-607M0KUFw3YlechaSVOUxCqX3Z44l5OPHQYqMr2mpw/od6/public/basic?alt=json',
  url2 = 'https://spreadsheets.google.com/feeds/list/1uwbaWOQl54RphdZVpHogQNxvnYuXq2_zjBOnr1lJDu4/od6/public/basic?alt=json',
  url3 = 'https://spreadsheets.google.com/feeds/list/1tuSK3jDjmzhI0YHs2NAb-zAQTb2JJWc4kT3gcBXHA6o/od6/public/basic?alt=json',
  url4 = 'https://spreadsheets.google.com/feeds/list/1DudUIDsoG_0_2zi-lTceBJC9NilTyea5pWwKFA7v8cA/od6/public/basic?alt=json',
  url5 = 'https://spreadsheets.google.com/feeds/list/1Q5KZDWJkidgCy80jPhTbX2TSy83LE6MoY8s9W73VofE/od6/public/basic?alt=json',
  url6 = 'https://spreadsheets.google.com/feeds/list/1dX6jz7TlvpD_JbHkgYQ_78AiZpowj5GVNiIKgO04zno/od6/public/basic?alt=json',
  url7 = 'https://spreadsheets.google.com/feeds/list/1Pc75q7CNilhUt-gwfyssuKB6sG-Hkhh_zHgYX54rGtA/od6/public/basic?alt=json';
  var urls = [url1,url2,url3,url4,url5,url6,url7]
  request(
    {url: urls[count],
     json: true
    },
     function (error, response, data) {
       if (error) {
         throw error
       }
        // get array of all users (all rows in google docs)
        var usersArray =  data.feed.entry;
        var len =usersArray.length;
        console.log(len);
        var failCounter = 0;
        // recursive: for each row, create new User, give appropriate attributes (need case statement b/c JSON.parse isn't working!) and then save into DB. Upon successful save, move on to next row.
        function saveUser(index) {
          var infoArray = usersArray[index].content['$t'].split(', ');

          var user = User.build()
          infoArray.forEach(function (dataPoint, index) {
          switch (dataPoint.slice(0,3)) {
            case 'ema':
              user.email = infoArray[index].slice(7, infoArray[index].length).trim()
              break;
            case 'use':
              user.username = infoArray[index].slice(9, infoArray[index].length).trim()
              break;
            case 'git':
              user.giturl = infoArray[index].slice(8, infoArray[index].length).trim()
              break;
            case 'loc':
              user.location = infoArray[index].slice(10, infoArray[index].length).trim()
              break;
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
        User.count().then(function (c) {
            if (index< len-1) {

        user.save()
          .then(function () {
            return saveUser(index+1)
        })

        .catch(function(error) {
          console.log('Failyed!',error);

          failCounter++
          if (index<len-1) {
            return saveUser(index+1)
          };
        })
      }else{
        console.log('youre done tho!');
        console.log('# of times you failed:', failCounter);
      }
    }
  )}//end save user
  sequelize.sync().then(saveUser(0))
  console.log('done and done');
  }); // end of request
}//end if

})



// GET 5000 USER'S SKILLS
app.get('/getSkillsByUrl', function (req, res) {
  console.log('START');
  sequelize.sync().then(function () {

  var errorCounter=0;
  User.findAll({
    where:{skills_found:false},
    limit: 4900
  }).then(function (users) {
    if (reqCount==0){
      reqCount++
    var len = users.length
    function getSkills(userIndex) {
      var user = users[userIndex];
      var username = user.giturl.split('https://github.com/')[1];
      var url = 'https://api.github.com/users/'+username+'/repos'
      console.log(url);
      requestOptions.url = url;
      //get repos
      request(requestOptions, function (error, response, data) {
        if (error) {
          throw error
        };
       var repos= JSON.parse(data);
       var languagesHash ={};
       var status=response.statusCode;
       console.log(status);
       if (status>=200 && status <=299 ) {
        repos.forEach(function (repo) {
          var language = repo.language;
          if (language && !languagesHash[language] ) {
            languagesHash[language]=true
          }
        }) //end for each repo
        var skills = [];
        for (language in languagesHash){
          skills.push(language)
        }
         console.log(skills)
         user.update({
           skills:skills,
           skills_found: true
         }).then(function () {
           console.log('user updated', userIndex);
           if (userIndex<len-1) {
             getSkills(userIndex+1)
           }
         })
       }else{
         errorCounter++
         console.log('nope...', errorCounter);
        getSkills(userIndex+1)
       }
      }) // end request
    } // end getSkills


      getSkills(0)
    }
    })
  })
})






app.get('/test', function (req, res) {
  var requestOptions = {
    method: 'GET', //Specify the method
    headers: {'user-agent': secrets.username},
    auth: {
    user: secrets.username,
    password: secrets.password
    }
  }
  request.get('https://api.github.com/users/Alejandro-P-2011-2243/repos', requestOptions)
  // request('/ratelimit', function (err, res, data) {
  //   console.log(err, res,data);
  // })

})

function testing(cb) {
  requestOptions.url='https://api.github.com/users/dzgoldman'
   request(requestOptions, function (error, response, data) {
    cb(data)
  })
}

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

var getShmails =function (req, res) {

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
};
app.get('/getSkillsByEmail/:email', getShmails)

app.get('/', function(req,res){
  res.send('landing page')
});

app.get('/public', function(req,res){
    res.sendFile(__dirname+'/public/index.html')
})



app.listen(3000, function(){
  console.info('Listening on  port 3000...')
})
