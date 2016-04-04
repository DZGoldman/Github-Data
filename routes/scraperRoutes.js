
var  skillHelpers = require ('../Helpers/skills-helpers.js'),
sheetHelpers = require ('../Helpers/sheet-helpers.js'),
  appHelpers = require ('../Helpers/app-helpers.js'),
  requestOptions = appHelpers.requestOptions,
  request = require('request');

//needs serious refactoring (with request promise, using new api-calls helpers, etc.)
  module.exports.controller =  function (app, User) {


    // GET 5000 USER'S SKILLS
    function getSkillsByUrl(req, res) {
      var limit = 5000;
      requestOptions.url = 'https://api.github.com/rate_limit'
      request(requestOptions, function(err, resp, body) {
          if (JSON.parse(body).resources.core.remaining < limit) {
            console.log('api limit is too low');
            // res.send(body)
          } else {
            console.log("getting", limit, "users skills");

              var errorCounter = 0;
              User.findAll({where: {skills_found: false },limit: limit})
                .then(function(users) {
                var len = users.length;
                function getSkills(userIndex) {
                  var user = users[userIndex];
                  var username = user.giturl.split('https://github.com/')[1];
                  var url = 'https://api.github.com/users/' + username + '/repos';
                  requestOptions.url = url;
                  //get repos
                  request(requestOptions, function(error, response, data) {
                    skillHelpers.getUsersSkills(error,response,data,
                      user,userIndex,len,getSkills,errorCounter)
                    }) // end request
                } // end getSkills
                getSkills(0)
              })

          } //end else (after limit check)
        }) //end request limit
    }
app.get('/getSkillsByUrl', getSkillsByUrl)

    app.get('/nodecron', function (req, res) {
        new CronJob('0 0 0/1 1/1 * * *', function() {
          console.log('You will see this message every second');
        }, null, true, 'America/New_York');
    })


    app.get('/intervalcron', function(req, res) {
      skillHelpers.logTime()
      var time =1000*60*62
      getSkillsByUrl()
      console.log('^first');
      setInterval(function () {
        console.log('scrape');
        skillHelpers.logTime()
        getSkillsByUrl()
      }, time)
    });



    app.get('/getdistancefromlt', function (req,res) {
      if (reqCount==0) {



        User.findAll({where: {distance_from_lt: null }, limit:10000 }).then(function (users) {
          console.log(users.length);
        function saveAllDistaneces(users, index) {
          console.log('yo?');
          var user = users[index];

          var lat = user.latitude, lon = user.longitude;
          if (lat && lon) {
            var distance_from_lt = skillHelpers.distanceFromLt(user.latitude, user.longitude)
            user.update({distance_from_lt: distance_from_lt}).then(function () {
              if (index<users.length-1) {
                console.log(index);
              saveAllDistaneces(users, index+1)
            }
            })
          }else{
            if (index<users.length-1) {
              saveAllDistaneces(users, index+1)
            }
          }
        };

        saveAllDistaneces(users, 0)
        console.log('done');
        })

      }else{
      reqCount++
      console.log('NO',reqCount);
      }
    })




reqCount = 0;
function getSkillsByUrl(req, res) {
  var limit = 5000;
  requestOptions.url = 'https://api.github.com/rate_limit'
  request(requestOptions, function(err, resp, body) {
      if (JSON.parse(body).resources.core.remaining < limit) {
        console.log('api limit is too low');
        // res.send(body)
      } else {
        console.log("getting", limit, "users skills");

          var errorCounter = 0;
          User.findAll({where: {skills_found: false },limit: limit})
            .then(function(users) {
            var len = users.length;
            function getSkills(userIndex) {
              var user = users[userIndex];
              var username = user.giturl.split('https://github.com/')[1];
              var url = 'https://api.github.com/users/' + username + '/repos';
              requestOptions.url = url;
              //get repos
              request(requestOptions, function(error, response, data) {
                skillHelpers.getUsersSkills(error,response,data,
                  user,userIndex,len,getSkills,errorCounter)
                }) // end request
            } // end getSkills
            getSkills(0)
          })

      } //end else (after limit check)
    }) //end request limit
};
app.get('/getSkillsByUrl', getSkillsByUrl)

reqCount = 0;
app.get('/sheet/:count', function(req, res) {
  if (reqCount == 0) {
    reqCount++

    var count = +req.params.count
      // retrieve JSON from google docs file (20000 at a time:)
    var urls = sheetHelpers.urls
    request({url: urls[count],json: true},
      function(error, response, data) {
        if (error) {
          throw error
        }
        // get array of all users (all rows in google docs)
        var usersArray = data.feed.entry, len = usersArray.length, failCounter = 0;
        // recursive: for each row, create new User, give appropriate attributes (need case statement b/c JSON.parse isn't working!) and then save into DB. Upon successful save, move on to next row.
        function saveUser(index) {
          var infoArray = usersArray[index].content['$t'].split(', ');
          var user = User.build();
          sheetHelpers.buildUser(infoArray, user)
          User.count().then(function(c) {
            if (index < len - 1) {
              user.save()
                .then(function() {
                  return saveUser(index + 1)
                })
                .catch(function(error) {
                  console.log('Failed!', error);
                  failCounter++
                  if (index < len - 1) {
                    return saveUser(index + 1)
                  };
                })
            } else {
              console.log('# of times you failed:', failCounter);
            }
          })
        } //end save user
        (saveUser(0))
      }); // end of request
  } //end if

})

}
