var express = require('express'),
  app = express(),
  morgan = require('morgan'),
  request = require('request'),
  pg = require('pg'),
  secrets = require('./secrets.js'),
  Sequelize = require('sequelize'),
  sequelize = new Sequelize('postgres://localhost/githubdata-prod', {
    dialect: 'postgres'
  }),
  User = sequelize.import(__dirname + "/User"),
  sheetHelpers = require('./Helpers/sheet-helpers.js'),
  skillHelpers = require('./Helpers/skills-helpers.js')

var requestOptions = {
  url: '', //URL to hit
  method: 'GET', //Specify the method
  headers: {
    'user-agent': secrets.username
  },
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

app.use(morgan('combined'));

//GET RATE LIMIT
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

// GET GOOGLE SHEET
reqCount = 0;
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

})

// GET 5000 USER'S SKILLS
app.get('/getSkillsByUrl', function(req, res) {
  var limit = 4900;
  requestOptions.url = 'https://api.github.com/rate_limit'
  request(requestOptions, function(err, resp, body) {
      if (JSON.parse(body).resources.core.remaining <= limit) {
        console.log('api limit is too low');
        res.send(body)
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
})



app.get('/', function(req, res) {
  res.send('landing page')
});

app.listen(3000, function() {
  console.info('Listening on  port 3000...')
})
