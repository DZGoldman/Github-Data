
  var pg = require('pg'),
  skillHelpers = require ('../Helpers/skills-helpers.js'),
  appHelpers = require ('../Helpers/app-helpers.js'),
  requestOptions = appHelpers.requestOptions,
  request = require('request'),
  Sequelize = require('sequelize'),
  sequelize = new Sequelize('postgres://localhost/githubdata1', {
    dialect: 'postgres'
  }),
    User = sequelize.import(__dirname + "./User")


  module.exports.controller =  function (app) {



app.get('/ratelimit', function (req, res) {
  sequelize.sync().then(function() {
    User.count().then(function(c) {
      console.log(c);
    })
    requestOptions.url = 'https://api.github.com/rate_limit'
    request(requestOptions, function(err, resp, body) {

      res.send(body)
    })
  })
});

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
        sequelize.sync().then(function() {
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
        }) //end sequelize sync
      } //end else (after limit check)
    }) //end request limit
};
app.get('/getSkillsByUrl', getSkillsByUrl)

app.get('/sheet/:count', function(req, res) {
  if (reqCount == 0) {
    reqCount++
    sequelize.sync().then(function() {
      console.log('tables synced up');
    })
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
        sequelize.sync().then(saveUser(0))
      }); // end of request
  } //end if

});
var time =1000*60*62
getSkillsByUrl()
console.log('^first');
setInterval(function () {
  console.log('scrape');
  skillHelpers.logTime()
  getSkillsByUrl()

}, time);

  }
